import { EventEmitter } from 'events';
import mongoose from 'mongoose';
import User from '../model/user.model.js';
import Webhook from '../model/webhook.model.js';

const em = new EventEmitter();
const ObjectId = mongoose.Types.ObjectId;

import moment from 'moment';
import { checkAvailabilityOfTime, checkCurrentTimeImpact } from '../services/appointment/check-availability-of-time.js';
import Appointment from '../model/appointment.model.js';
import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Service from '../model/service.model.js';
moment.suppressDeprecationWarnings = true;

em.on('upload-bulk-data', async ({ rows, salon }) => {
    try {
        const userArray = [], userAppointmentArray = [];
        for (let index = 1; index < rows.length; index++) {
            const element = rows[index];
            let user = {
                name: element[2],
                phone: element[3],
                userNote: element[4],
                stylist: element[5],
                appointmentDate: element[6],
                appointmentTime: await convertTime12to24(element[7]),
                appointmentTime12Hr: element[7],
                requiredDuration: parseInt(element[8]),
                gender: element[9],
                salon,
                role: 'user',
                addedFrom: 'bulk'
            }
            // console.log(user);
            if (!await isUserPresent({ name: user.name, role: 'user' })) {
                // console.log(`${user.name} already present`);
            } else {
                userAppointmentArray.push(user)
                delete user.appointmentDate
                delete user.appointmentTime
                delete user.stylist
                delete user.requiredDuration
                userArray.push(user)
                // console.log(`${(rows.length - userArray.length)} remains`);
            }
        }
        await User.insertMany(userArray)
        let mainService = await Service.findOne({ salon, "isMainService": true })
        let subService = await Service.findOne({ service: mainService._id })
        if (userAppointmentArray.length) {
            for (let index = 1; index < userAppointmentArray.length; index++) {
                const element = userAppointmentArray[index];
                const stylistData = await isUserPresent({ name: element.stylist, role: 'stylist' })
                if (stylistData) {
                    const userData = await isUserPresent({ name: element.name, role: 'user' })
                    const entryDate = moment(Math.round(new Date(element.appointmentDate).getTime()));
                    let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
                    const requestSalon = element.salon, stylistId = stylistData._id;
                    const isTImeAvailable = await checkAvailabilityOfTime(element.appointmentTime, entryDateWithFormat, requestSalon, stylistId);
                    if (isTImeAvailable.status) {
                        const isTImeAvailableImpact = await checkCurrentTimeImpact(element.appointmentTime, entryDateWithFormat, requestSalon, stylistId, element.requiredDuration)
                        if (isTImeAvailableImpact.status) {
                            const dataPresentForTheDate = await AppointmentAvailability.findOne({
                                salon: salon,
                                stylist: stylistId,
                                dateAsADate: entryDateWithFormat
                            })
                            let currentAvailability = ''
                            if (dataPresentForTheDate) {
                                const timeData = dataPresentForTheDate.timeData.filter(t => t.timeAsADate === element.appointmentTime && t.slotStatus === 'available')
                                if (timeData.length > 0) {
                                    currentAvailability = dataPresentForTheDate._id
                                } else {
                                    break
                                }
                            } else {
                                let appointment = {};
                                appointment.salon = salon;
                                appointment.stylist = stylistId;
                                appointment.dateAsADate = new Date(element.appointmentDate);
                                appointment.dateAsAString = element.appointmentDate;
                                appointment.isAvailable = true;
                                let currentDate = moment(Math.round(new Date(element.appointmentDate).getTime()))
                                let currentWeek = moment(currentDate).format('WW GGGG')
                                let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                                let month = moment(currentDate).format('MM')
                                let date = moment(currentDate).format('DD')

                                appointment.week = currentWeek.split(' ')[0];
                                appointment.year = currentWeek.split(' ')[1]
                                appointment.weekDay = weekDay
                                appointment.date = date
                                appointment.month = month

                                let startTime = Number('0900')
                                let endTime = Number('1700')
                                const timeArray = [];
                                while (startTime <= endTime) {
                                    let timeObject = {};
                                    timeObject.timeAsADate = await numberConvertTo24Hr(startTime)
                                    timeObject.timeAsAString = await timeConvertTo12Hr(timeObject.timeAsADate)
                                    timeObject.isAvailable = true;
                                    timeArray.push(timeObject)
                                    startTime = Number(moment(timeObject.timeAsADate, 'HH:mm').add(30, 'minutes').format('HH:mm').split(':').join(''));
                                }
                                appointment.timeData = timeArray
                                for (let [timeIndex, iteratorTime] of appointment.timeData.entries()) {
                                    const appointmentData = await getAppointmentByDateAndTime(iteratorTime.timeAsADate, element.appointmentDate, salon, stylistId)
                                    if (appointmentData) {
                                        iteratorTime.isAvailable = false
                                    }

                                }
                                const newlySlot = await AppointmentAvailability.create(appointment)
                                currentAvailability = newlySlot._id
                            }
                            const appointmentResult = await Appointment.findOne({
                                stylist: stylistId,
                                salon: requestSalon,
                                dateAsAString: entryDateWithFormat,
                                timeAsADate: element.appointmentTime, // 24 hr
                            })
                            let userId = userData._id, userName = userData.name, userEmail = '', userMobile = userData.phone, userGender = userData.gender;
                            const checkExists = await Appointment.findOne({
                                stylist: stylistId,
                                salon: requestSalon,
                                user: userId,
                                dateAsAString: entryDateWithFormat,
                                timeAsADate: element.appointmentTime, // 24 hr
                            })
                            if (checkExists) {
                                break;
                            } else {

                                let appointmentStatus = !appointmentResult ? 'requested' : 'waiting'
                                let currentWeek = moment(entryDate).format('WW GGGG')
                                let weekDay = await getWeekDay(moment(entryDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                                let month = moment(entryDate).format('MM')
                                let date = moment(entryDate).format('DD')
                                const createResult = await Appointment.create({
                                    stylist: stylistId,
                                    salon: requestSalon,
                                    user: userId,
                                    dateAsADate: entryDate,
                                    dateAsAString: entryDateWithFormat,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    timeAsADate: element.appointmentTime,
                                    offset: req.query.offset,
                                    isUser: true,
                                    availability: currentAvailability,
                                    mainService: mainService._id,
                                    subService: subService._id,
                                    userName: userName,
                                    userEmail: userEmail,
                                    userMobile: userMobile,
                                    gender: userGender,
                                    comment: '',
                                    week: currentWeek.split(' ')[0],
                                    year: currentWeek.split(' ')[1],
                                    weekDay: weekDay,
                                    date: date,
                                    month: month,
                                    servicePhoto: '',
                                    requiredDuration: element.requiredDuration,
                                    status: appointmentStatus,
                                    appointmentId: await getAppointmentId()
                                });
                                if (createResult && currentAvailability) {
                                    await AppointmentAvailability.updateOne({
                                        _id: currentAvailability,
                                        timeData: { $exists: true }//, $elemMatch: { _id: req.body.timeData.id } }
                                    }, {
                                        $set: {
                                            appointmentId: createResult._id,
                                            timeData: {
                                                _id: req.body.timeData.id,
                                                timeAsADate: req.body.timeData.timeAsADate,
                                                timeAsAString: req.body.timeData.timeAsAString,
                                                slotStatus: appointmentStatus
                                            }
                                        },
                                        $push: {
                                            appointmentList: createResult._id
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});
em.on('webhook', async ({ request, response }) => {
    await Webhook.create({
        request, response
    })
    return true
})
async function getWebhookResult() {
    return await Webhook.find({}).sort({ createdAt: -1 })
}
async function getAppointmentByDateAndTime(time, date, salon, stylist) {
    let checkDate = [date]
    if (date.includes('-')) {
        checkDate.push(date.replace(/\-/g, '/'))
    } else {
        checkDate.push(date.replace(/\//g, '-'))
    }
    const appointment = await Appointment.findOne({ dateAsAString: { $in: checkDate }, timeAsADate: time, stylist: stylist, salon: salon })
    return appointment;
}
async function getAppointmentId() {
    const initial = '#100'
    const count = await Appointment.find({}).countDocuments() + 1;
    return `${initial}${count}`
}
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
async function convertTime12to24(time12h) {
    let [hours, minutes, modifier] = time12h.match(/(\d+|pm|am)/gi);

    if (hours === '12') {
        hours = '00';
    }

    if (modifier.toLowerCase() === 'pm') {
        hours = (parseInt(hours, 10) + 12) < 10 ? '0' + (parseInt(hours, 10) + 12) : (parseInt(hours, 10) + 12);
    }
    else {
        hours = parseInt(hours) < 10 ? '0' + parseInt(hours,) : parseInt(hours);
    }
    minutes = parseInt(minutes) < 10 ? '0' + parseInt(minutes) : minutes
    return `${hours}:${minutes}`;
}
const isUserPresent = async ({ name, role }) => {
    try {
        const user = await User.findOne({ name, role })
        return user
    } catch (error) {
        return null
    }
}
export default em;