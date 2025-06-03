import { EventEmitter } from 'events';
import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Appointment from '../model/appointment.model.js';
const em = new EventEmitter();

import moment from 'moment';
moment.suppressDeprecationWarnings = true;
//LOCAL FUNCTION
async function timeConvertTo12Hr(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('');
}
async function numberConvertTo24Hr(time) {
    const timeInString = time.toString();
    const timeLength = timeInString.length;
    if (timeLength === 3) {
        let oneDigitHrToTwoDigitHr = `0${timeInString}`;
        const timeStringArray = oneDigitHrToTwoDigitHr.split('');
        return `${timeStringArray[0]}${timeStringArray[1]}:${timeStringArray[2]}${timeStringArray[3]}`
    } else {
        const timeStringArray = timeInString.split('');
        return `${timeStringArray[0]}${timeStringArray[1]}:${timeStringArray[2]}${timeStringArray[3]}`
    }
}

async function getAppointmentByDateAndTime(time, date, salon, stylist) {
    const appointment = await Appointment.findOne({ dateAsAString: date, timeAsADate: time, stylist: stylist, salon: salon })
    return appointment;
}
async function getUpdatedTime(time, duration) {
    return Number(moment(time, 'HH:mm').add(duration, 'minutes').format('HH:mm').split(':').join(''))
}

em.on('update-appointment-time-availability', async (obj) => {
    const { availability, time } = obj;
    try {
        await AppointmentAvailability.updateOne({ _id: availability, 'timeData.timeAsADate': time }, {
            $set: {
                'timeData.$.isAvailable': false
            }
        });

    } catch (exception) {
        console.log(exception);

    }

});
em.on('update-post-schedule-time', async (obj) => {
    const { time, date, salon, stylist, duration } = obj;
    const appointmentData = await AppointmentAvailability.findOne({ stylist: stylist, salon: salon, dateAsAString: date })
    const arrayOfTime = await appointmentData.timeData.toObject();
    const isTimeAvailable = arrayOfTime.find(item => item.timeAsADate === time && item.isAvailable)
    if (isTimeAvailable) {
        const currentTime = Number(time.split(':').join(''))
        let currentTimeAfterDurationAddition = Number(moment(time, 'HH:mm').add(duration, 'minutes').format('HH:mm').split(':').join(''))

        const timeArrayWithoutFilter = appointmentData.timeData.map(timeItem => {
            return Number(timeItem.timeAsADate.split(':').join(''))
        }).sort()
        const preTime = timeArrayWithoutFilter.filter(timeData => {
            return timeData < currentTime
        })
        // console.log(preTime);
        const modifiedTimeArray = [];
        if (preTime.length) {
            for (const iterator of preTime) {
                let timeObject = {};
                timeObject.timeAsADate = await numberConvertTo24Hr(iterator);
                timeObject.timeAsAString = await timeConvertTo12Hr(timeObject.timeAsADate);
                const isData = appointmentData.timeData.find(item => Number(item.timeAsADate.split(':').join('')) === iterator)
                timeObject.isAvailable = isData ? isData.isAvailable : false
                modifiedTimeArray.push(timeObject)
            }

        }

        modifiedTimeArray.push({
            'timeAsADate': time,
            'timeAsAString': await timeConvertTo12Hr(time),
            isAvailable: false
        })
        const timeArrayWithFilter = appointmentData.timeData.filter(subItem => {
            return (!subItem.isAvailable && Number(subItem.timeAsADate.split(':').join('')) > currentTime)
        }).map(timeItem => {
            return Number(timeItem.timeAsADate.split(':').join(''))
        }).sort()
        const isAppointmentPresentForLastTimeSlot = await getAppointmentByDateAndTime(await numberConvertTo24Hr(timeArrayWithoutFilter[timeArrayWithoutFilter.length - 1]), date, salon, stylist)
        let modifiedLateWorkingTime = 0;
        if (isAppointmentPresentForLastTimeSlot) {
            modifiedLateWorkingTime = Number(moment(isAppointmentPresentForLastTimeSlot.timeAsADate, 'HH:mm').add(isAppointmentPresentForLastTimeSlot.requiredDuration, 'minutes').format('HH:mm').split(':').join(''))
        } else {
            modifiedLateWorkingTime = Number(moment(await numberConvertTo24Hr(timeArrayWithoutFilter[timeArrayWithoutFilter.length - 1]), 'HH:mm').add(30, 'minutes').format('HH:mm').split(':').join(''))

        }
        while (modifiedLateWorkingTime >= currentTimeAfterDurationAddition) {
            if (timeArrayWithFilter[0] <= currentTimeAfterDurationAddition) {
                const appointmentData = await getAppointmentByDateAndTime(await numberConvertTo24Hr(timeArrayWithFilter[0]), date, salon, stylist)
                let currentTimeAfterDurationAdditionSecond = Number(moment(appointmentData.timeAsADate, 'HH:mm').add(appointmentData.duration, 'minutes').format('HH:mm').split(':').join(''))

                if (currentTimeAfterDurationAdditionSecond === currentTimeAfterDurationAddition) {
                    let timeObject = {};
                    timeObject.timeAsADate = await numberConvertTo24Hr(currentTimeAfterDurationAdditionSecond);
                    timeObject.timeAsAString = await timeConvertTo12Hr(timeObject.timeAsADate);
                    timeObject.isAvailable = false
                    modifiedTimeArray.push(timeObject)
                    currentTimeAfterDurationAddition = await getUpdatedTime(timeObject.timeAsADate, 30)

                } else {
                    let timeObject = {};
                    timeObject.timeAsADate = appointmentData.timeAsADate;
                    timeObject.timeAsAString = appointmentData.timeAsAString;
                    timeObject.isAvailable = false
                    modifiedTimeArray.push(timeObject)
                    currentTimeAfterDurationAddition = await getUpdatedTime(timeObject.timeAsADate, appointmentData.requiredDuration)
                }
                timeArrayWithFilter.splice(0, 1);
            } else {
                let timeObject = {};
                timeObject.timeAsADate = await numberConvertTo24Hr(currentTimeAfterDurationAddition);
                timeObject.timeAsAString = await timeConvertTo12Hr(timeObject.timeAsADate);
                timeObject.isAvailable = true
                modifiedTimeArray.push(timeObject)
                currentTimeAfterDurationAddition = await getUpdatedTime(timeObject.timeAsADate, 30)
            }
        }

        console.log(modifiedTimeArray);
        await AppointmentAvailability.updateOne({ _id: appointmentData._id }, {
            $set: {
                timeData: modifiedTimeArray
            }
        })
    } else {
        return {
            status: false,
            message: `${await timeConvertTo12Hr(time)} is not available for the appointment.`
        }
    }

});
em.on('create-availability-bulk', async (obj) => {
    const { slots, dates, offset, startBreakTime, endBreakTime, settings, salon, stylist } = obj;
    try {
        for (const slotItem of slots) {
            const requredDates = dates.filter(item => item.day === slotItem.day);
            for (const singleDate of requredDates) {
                let currentDate = moment(Math.round(new Date(singleDate.date).getTime()))
                let currentWeek = moment(currentDate).format('WW GGGG')
                let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                let month = moment(currentDate).format('MM')
                let date = moment(currentDate).format('DD')

                for (const slotTime of slotItem.slot) {
                    let timeStops = await getTimeStops(slotTime.startTime, slotTime.endTime, 30);
                    // let startTime = Number(slotTime.startTime.split(':').join(''));
                    // let timeAsADate = await numberConvertTo24Hr(slotbreak) 
                    for (const slotbreak of timeStops) {
                        const slotbreakDateTime = new Date();
                        slotbreakDateTime.setHours(slotbreak.split(':')[0])
                        slotbreakDateTime.setMinutes(slotbreak.split(':')[1])
                        let isNot = (slotbreakDateTime >= startBreakTime && slotbreakDateTime <= endBreakTime);
                        if (settings.isBreakTimeCompulsory && isNot) {
                            console.log('return');
                        } else {
                            const appointmentData = await getAppointmentByDateAndTime(slotbreak, singleDate.date, salon, stylist)
                            if (!appointmentData) {
                                let timeObject = {};
                                timeObject.timeAsADate = slotbreak
                                timeObject.timeAsAString = await timeConvertTo12Hr(slotbreak)
                                timeObject.isAvailable = true;

                                let appointment = {
                                    salon,
                                    stylist,
                                    dateAsADate: new Date(`${singleDate.date}`),
                                    dateAsAString: singleDate.date,
                                    isAvailable: true,
                                    week: currentWeek.split(' ')[0],
                                    year: currentWeek.split(' ')[1],
                                    weekDay, date, month,
                                    offset: offset,
                                    timeData: [timeObject],
                                    isBusinessHour: true,
                                };
                                const result = await AppointmentAvailability.create(appointment)
                                //  appointmetsToAdd.push(appointment)
                            }
                        }

                    }
                }

            }
        }
    } catch (exception) {
        console.log(exception);

    }

});
async function getWeekDay(dayNumber) {
    switch (dayNumber) {
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
        case 7:
            return 'Sunday'
    }
}

async function getTimeStops(start, end, gap) {
    var startTime = moment(start, 'hh:mm a');
    var endTime = moment(end, 'hh:mm a');

    if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
    }

    var timeStops = [];

    while (startTime <= endTime) {
        timeStops.push(moment(startTime, 'hh:mm a').format('HH:mm'));
        startTime.add(gap, 'minutes');
    }
    return timeStops;
}
export default em;