import { AppointmentAvailability } from '../../model/appointment-availability.model.js';
import Appointment from '../../model/appointment.model.js';

import moment from 'moment';
moment.suppressDeprecationWarnings = true;
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


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

export const checkAvailabilityOfTime = async (time, date, salon, stylist) => {
    const appointmentData = await AppointmentAvailability.findOne({ stylist: ObjectId(stylist), salon: ObjectId(salon), dateAsAString: date, 'timeData.timeAsADate': time })
    if (appointmentData) {
        if (appointmentData.timeData.length) {
            const arrayOfTime = await appointmentData.timeData.toObject();
            const isTimeAvailable = arrayOfTime.find(item => item.timeAsADate === time && item.isAvailable)
            if (isTimeAvailable) {
                return {
                    status: true,
                    message: `${await timeConvertTo12Hr(time)} is available for the appointment.`,
                    data:isTimeAvailable
                }
            } else {
                return {
                    status: false,
                    message: `${await timeConvertTo12Hr(time)} is not available for the appointment.`,
                    data:isTimeAvailable
                }
            }

        } else {
            return {
                status: false,
                message: `${date} is not available for the appointment.`
            }
        }
    } else {
        return {
            status: false,
            message: `${date} is not available for the appointment.`
        }
    }

}
export const checkAvailabilityOfTimeFromDashboard = async (time, date, salon, stylist) => {
    const appointmentData = await AppointmentAvailability.findOne({ stylist: stylist, salon: salon, dateAsAString: date })
    if (appointmentData) {
        if (appointmentData.timeData.length) {
            const arrayOfTime = await appointmentData.timeData.toObject();
            const isTimeAvailable = arrayOfTime.find(item => item.timeAsADate === time && item.isAvailable)
            if (isTimeAvailable) {

                return {
                    status: true,
                    message: `${await timeConvertTo12Hr(time)} is available for the appointment.`
                }
            } else {
                return {
                    status: false,
                    message: `${await timeConvertTo12Hr(time)} is not available for the appointment.`
                }
            }

        } else {
            return {
                status: false,
                message: `${date} is not available for the appointment.`
            }
        }
    } else {
        return {
            status: false,
            message: `${date} is not available for the appointment.`
        }
    }

}
export const checkCurrentTimeImpact = async (time, date, salon, stylist, duration) => {
    const appointmentData = await AppointmentAvailability.findOne({ stylist: stylist, salon: salon, dateAsAString: date, 'timeData.timeAsADate': time })
    if (appointmentData) {
        if (appointmentData.timeData.length) {
            const arrayOfTime = await appointmentData.timeData.toObject();
            const isTimeAvailable = arrayOfTime.find(item => item.timeAsADate === time && item.isAvailable)
            if (isTimeAvailable) {
                const currentTime = Number(time.split(':').join(''))
                const currentTimeAfterDurationAddition = Number(moment(time, 'HH:mm').add(duration, 'minutes').format('HH:mm').split(':').join(''))

                const timeArrayWithoutFilter = appointmentData.timeData.map(timeItem => {
                    return Number(timeItem.timeAsADate.split(':').join(''))
                }).sort()
                const timeArrayWithFilter = appointmentData.timeData.filter(subItem => {
                    return !subItem.isAvailable
                }).map(timeItem => {
                    return Number(timeItem.timeAsADate.split(':').join(''))
                }).sort()

                const CurrentTimeImpactOnPostAppointment = await timeArrayWithFilter.find(timeItem => (timeItem > currentTime) && (timeItem < currentTimeAfterDurationAddition))
                if (CurrentTimeImpactOnPostAppointment) {
                    return {
                        status: false,
                        message: `${await timeConvertTo12Hr(time)} is impact on other appointment which was scheduled already.Please choose another appointment.`
                    }
                } else {
                    return {
                        status: true,
                        message: `${await timeConvertTo12Hr(time)} is available for the appointment.`
                    }
                }

            } else {
                return {
                    status: false,
                    message: `${await timeConvertTo12Hr(time)} is not available for the appointment.`
                }
            }
        } else {
            return {
                status: false,
                message: `${date} is not available for the appointment.`
            }
        }
    } else {
        return {
            status: false,
            message: `${date} is not available for the appointment.`
        }
    }

}
export const updatePostSchedulingTime = async (time, date, salon, stylist, duration) => {
    appointmentEvent.emit('update-post-schedule-time', {
        time, date, salon, stylist, duration
    })
}
