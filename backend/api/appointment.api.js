import User from '../model/user.model.js';
import Appointment from '../model/appointment.model.js';
import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Service from '../model/service.model.js';
import { checkCurrentTimeImpact, checkAvailabilityOfTime, updatePostSchedulingTime } from '../services/appointment/check-availability-of-time.js';
import { sendNotificationTokens } from '../services/firebase/send-notification-function.js';
import {firstAppointment } from '../socket/socketReward.js' 

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import emailTemplateEvent from '../views/email-template-service.event.js';
import { onlineUsers } from '../server.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
moment.suppressDeprecationWarnings = true;

// ADD APPOINTMENTS
export const addAppointment = catchAsync(async (req, res, next) => {
    try {
        const entryDate = moment(Math.round(new Date(req.body.appointmentDate).getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();
        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);
        let requestSalon, stylistId;

        if (req.payload && req.payload.salon) {
            requestSalon = req.payload.salon
        } else {
            requestSalon = req.body.salon
        }

        if (req.payload && req.payload.stylist) {
            stylistId = req.payload.stylist
        } else {
            stylistId = req.body.stylistId
        }

        if (!requestSalon) {
            return res.status(200).json({
                status: false,
                message: `Salon data not found.`
            });
        }
        const isTImeAvailable = await checkAvailabilityOfTime(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId);
        const isTimeData = isTImeAvailable.data;
        if (isTImeAvailable.status) {
            const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
            if (isTImeAvailableImpact.status) {
                const appointmentResult = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                }).sort({ createdAt: -1 })

                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};
                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }
                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    userId = usr._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                } else {
                    userId = checkUser._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                }

                const checkExists = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    user: userId,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                }).sort({ createdAt: -1 })

                if (checkExists) {
                    return res.status(200).json({
                        status: false,
                        message: `Your appointment is already scheduled for the day.`
                    });
                }

                if (!appointmentResult) {
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
                        timeAsADate: req.body.timeData.timeAsADate,
                        offset: req.query.offset,
                        isUser: true,
                        availability: req.body.availability,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        gender: userGender,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: 'requested',
                        appointmentId: await getAppointmentId()
                    });

                    if (createResult && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true }//, $elemMatch: { _id: req.body.timeData.id } }
                        }, {
                            $set: {
                                appointmentId: createResult._id,
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: 'requested'
                                }
                            },
                            $push: {
                                appointmentList: createResult._id
                            }
                        })
                    }

                    let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                    let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                    let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                    if (checkUser && checkUser.userDeviceID.trim() && checkUser.userDeviceID !== '') {
                        let notfiyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                    }

                    return res.status(200).json({
                        status: true,
                        message: `Your appointment has been scheduled.`
                    });
                } else if (appointmentResult) {
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
                        timeAsADate: req.body.timeData.timeAsADate,
                        offset: req.query.offset,
                        isUser: true,
                        availability: req.body.availability,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        gender: userGender,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: 'waiting',
                        appointmentId: await getAppointmentId()
                    });

                    if (createResult && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true }//, $elemMatch: { _id: req.body.timeData.id } }
                        }, {
                            $set: {
                                appointmentId: createResult._id,
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: 'waiting'
                                }
                            },
                            $push: {
                                appointmentList: createResult._id
                            }
                        })
                    }
                    let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                    let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                    let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                    if (checkUser && checkUser.userDeviceID.trim() && checkUser.userDeviceID !== '') {
                        let notfiyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                    }

                    return res.status(200).json({
                        status: true,
                        message: `Your appointment has been scheduled.`
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: isTImeAvailableImpact.message
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: isTImeAvailable.message
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const addAppointmentV2 = catchAsync(async (req, res, next) => {
    try {
        const entryDate = moment(Math.round(new Date(req.body.appointmentDate).getTime())).utcOffset(-Number((req.query.offset)));
        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');

        let requestSalon, stylistId;

        if (req.payload && req.payload.salon) {
            requestSalon = req.payload.salon
        } else {
            requestSalon = req.body.salon
        }

        if (req.payload && req.payload.stylist) {
            stylistId = req.payload.stylist
        } else {
            stylistId = req.body.stylistId
        }

        if (!requestSalon) {
            return res.status(200).json({
                status: false,
                message: `Salon data not found.`
            });
        }
        const isTImeAvailable = await checkAvailabilityOfTime(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId);
        const isTimeData = isTImeAvailable.data;
        if (isTImeAvailable.status) {
            const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
            if (isTImeAvailableImpact.status) {
                const appointmentResult = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                })

                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};
                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }
                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    userId = usr._id
                } else {
                    userId = checkUser._id
                }
                userName = req.body.name ? req.body.name : checkUser.name
                userEmail = req.body.email ? req.body.email : checkUser.email
                userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                userGender = req.body.gender ? req.body.gender : checkUser.gender

                const checkExists = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    user: userId,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                })

                if (checkExists) {
                    return res.status(200).json({
                        status: false,
                        message: `Your appointment is already scheduled for the day.`
                    });
                }
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
                    timeAsADate: req.body.timeData.timeAsADate,
                    offset: req.query.offset,
                    isUser: true,
                    availability: req.body.availability,
                    mainService: req.body.mainService,
                    subService: req.body.subService,
                    userName: userName,
                    userEmail: userEmail,
                    userMobile: userMobile,
                    gender: userGender,
                    comment: req.body.comment,
                    week: currentWeek.split(' ')[0],
                    year: currentWeek.split(' ')[1],
                    weekDay: weekDay,
                    date: date,
                    month: month,
                    servicePhoto: req.body.servicePhoto,
                    requiredDuration: req.body.requiredDuration,
                    status: appointmentStatus,
                    appointmentId: await getAppointmentId()
                });

                if (createResult && req.body.availability) {
                    await AppointmentAvailability.updateOne({
                        _id: req.body.availability,
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

                let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                if (checkUser && checkUser.userDeviceID.trim() && checkUser.userDeviceID !== '') {
                    let notifyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                }
                const io = req.app.get('server-socket');

                if (io) {
                    const onlineUser = await onlineUsers.find(item => item.stylist === stylistId)
                    if (onlineUser) {
                        io.to(onlineUser.socketId).emit('appointment-request', {
                            message: `You have a new appointment request for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                            data: createResult,
                            eventType: req.query.eventType
                        });
                    }
                    const onlineAdmin = await onlineUsers.find(item => item.salon === requestSalon)
                    if (onlineAdmin) {
                        io.to(onlineAdmin.socketId).emit('appointment-request', {
                            message: `You have a new appointment request for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                            data: createResult,
                            eventType: req.query.eventType

                        });
                    }
                    if (req.query.eventType === 'appointment-update') {
                        const onlineAdmin = await onlineUsers.find(item => item.user === userId)
                        if (onlineAdmin) {
                            io.to(onlineAdmin.socketId).emit('appointment-request', {
                                message: `You have a new appointment request for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                                data: createResult,
                                eventType: req.query.eventType

                            });
                        }
                    }
                }
                return res.status(200).json({
                    status: true,
                    message: `Your appointment request has been sent to stylist.`
                });

            } else {
                return res.status(200).json({
                    status: false,
                    message: isTImeAvailableImpact.message
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: isTImeAvailable.message
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const addAppointmentFormDashboard = catchAsync(async (req, res, next) => {
    try {
        const entryDate = moment(Math.round(new Date(req.body.appointmentDate).getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();

        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        let requestSalon, stylistId;
        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

        // if (differenceInDays == -1) {
        //     entryDate.subtract(1, 'days')
        // }
        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);

        if (req.payload && req.payload.salon) {
            requestSalon = req.payload.salon
        } else {
            requestSalon = req.body.salon
        }

        if (req.payload && req.payload.stylist) {
            stylistId = req.payload.stylist
        } else {
            stylistId = req.body.stylistId
        }

        if (!requestSalon) {
            return res.status(200).json({
                status: false,
                message: `Salon data not found`
            });
        }


        const isTImeAvailable = await checkAvailabilityOfTime(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId)
        const isTimeData = isTImeAvailable.data;
        if (!req.body.id && isTImeAvailable.status) {
            const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
            if (isTImeAvailableImpact.status) {
                const appointmentResult = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                }).sort({ createdAt: -1 })
                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};

                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }

                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    userId = usr._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                } else {
                    userId = checkUser._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                }

                const checkExists = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    user: userId,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                }).sort({ createdAt: -1 })

                if (checkExists) {
                    return res.status(200).json({
                        status: false,
                        message: `Your appointment is already scheduled for the day.  `
                    });
                }


                if (!appointmentResult) {
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
                        timeAsADate: req.body.timeData.timeAsADate,
                        timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                        offset: req.query.offset,
                        isUser: true,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        availability: req.body.availability,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: 'requested',
                        appointmentId: await getAppointmentId()
                    });

                    if (createResult && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true }
                        }, {
                            $set: {
                                appointmentId: createResult._id,
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: 'requested'
                                }
                            },
                            $push: {
                                appointmentList: createResult._id
                            }
                        })
                    }

                    let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                    let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                    let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                    if (checkUser.userDeviceID && checkUser.userDeviceID !== '') {
                        let notfiyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                    }

                    return res.status(200).json({
                        status: true,
                        message: `Your appointment request has been sent to stylist.`
                    });

                } else if (appointmentResult) {
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
                        timeAsADate: req.body.timeData.timeAsADate,
                        timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                        offset: req.query.offset,
                        isUser: true,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        gender: userGender,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        availability: req.body.availability,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: 'waiting',
                        appointmentId: await getAppointmentId()
                    });

                    if (createResult && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true } //, $elemMatch: { _id: req.body.timeData.id } 
                        }, {
                            $set: {
                                appointmentId: createResult._id,
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: 'waiting'
                                }
                            },
                            $push: {
                                appointmentList: createResult._id
                            }
                        })
                    }
                    let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                    let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                    let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                    if (checkUser.userDeviceID && checkUser.userDeviceID !== '') {
                        let notfiyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                    }

                    return res.status(200).json({
                        status: true,
                        message: `Your appointment request has been sent to stylist.`
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: isTImeAvailableImpact.message
                });
            }
        } else if (req.body.id) {
            if (isTImeAvailable.status && isTimeData._id !== req.body.availability) {
                const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
                if (isTImeAvailableImpact.status) {
                    const appointmentResult = await Appointment.findOne({ _id: ObjectId(req.body.id) }).sort({ createdAt: -1 })
                    let userId, userName, userEmail, userMobile, userGender;
                    let qry = {};
                    if (req.body.email) {
                        qry.email = req.body.email;
                    } else if (req.payload.role === "user" && req.payload.email) {
                        qry.email = req.payload.email;
                    } else if (req.payload.role === "user" && req.payload.phone) {
                        qry.phone = req.payload.phone;
                    } else {
                        qry.phone = req.body.mobile;
                    }

                    let checkUser = await User.findOne(qry);
                    if (!checkUser) {
                        const userData = new User();
                        userData.name = req.body.name;
                        userData.email = req.body.email;
                        userData.userName = req.body.email;
                        userData.phone = req.body.mobile;
                        userData.gender = req.body.gender;
                        userData.salon = requestSalon;
                        userData.stylist = stylistId;
                        userData.clientNote = req.body.comment;
                        const userPassword = await (generatePassword())
                        userData.setPassword(userPassword);
                        let usr = await User.create(userData);
                        userId = usr._id
                        userName = req.body.name ? req.body.name : checkUser.name
                        userEmail = req.body.email ? req.body.email : checkUser.email
                        userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                        userGender = req.body.gender ? req.body.gender : checkUser.gender
                    } else {
                        userId = checkUser._id
                        userName = req.body.name ? req.body.name : checkUser.name
                        userEmail = req.body.email ? req.body.email : checkUser.email
                        userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                        userGender = req.body.gender ? req.body.gender : checkUser.gender
                    }

                    if (appointmentResult) {
                        let currentWeek = moment(entryDate).format('WW GGGG')
                        let weekDay = await getWeekDay(moment(entryDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                        let month = moment(entryDate).format('MM')
                        let date = moment(entryDate).format('DD')
                        const updateObject = {
                            stylist: stylistId,
                            salon: requestSalon,
                            user: userId,
                            dateAsADate: entryDate,
                            dateAsAString: entryDateWithFormat,
                            timeAsADate: req.body.timeData.timeAsADate,
                            timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                            offset: req.query.offset,
                            isUser: true,
                            mainService: req.body.mainService,
                            subService: req.body.subService,
                            userName: userName,
                            userEmail: userEmail,
                            userMobile: userMobile,
                            gender: userGender,
                            comment: req.body.comment,
                            week: currentWeek.split(' ')[0],
                            year: currentWeek.split(' ')[1],
                            weekDay: weekDay,
                            date: date,
                            month: month,
                            offset: req.query.offset,
                            availability: req.body.availability,
                            servicePhoto: req.body.servicePhoto,
                            requiredDuration: req.body.requiredDuration,
                            status: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                            appointmentId: await getAppointmentId()
                        }

                        const result = await Appointment.updateOne({
                            _id: req.body.id,
                        }, {
                            $set: updateObject
                        })

                        await AppointmentAvailability.updateOne({
                            _id: appointmentResult.availability,
                            appointmentList: { $exists: true, $ne: [] }
                        }, {
                            $pull: { appointmentList: req.body.id },
                            // $set: {
                            //     timeData: {
                            //         'slotStatus': 'available'
                            //     }
                            // }
                        })

                        if (result) {
                            await AppointmentAvailability.updateOne({
                                _id: appointmentResult.availability,
                                timeData: { $exists: true } //, $elemMatch: { _id: isTimeData._id } 
                            }, {
                                $set: {
                                    appointmentId: req.body.id,
                                    timeData: {
                                        _id: isTimeData._id,
                                        timeAsADate: req.body.timeData.timeAsADate,
                                        timeAsAString: req.body.timeData.timeAsAString,
                                        slotStatus: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting'
                                    }
                                },
                                $push: {
                                    appointmentList: req.body.id
                                }
                            })
                        }

                        return res.status(200).json({
                            status: true,
                            message: `Your appointment request has been sent to stylist.`
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: isTImeAvailableImpact.message
                    });
                }
            } else {
                const appointmentResult = await Appointment.findOne({ _id: ObjectId(req.body.id) }).sort({ createdAt: -1 })
                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};
                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }

                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    // if (usr) {
                    //     let emailobject = await emailEvent.emit('email-service', {
                    //         toAddress: userData.email.trim(),
                    //         content: 'Your system generated password is ' + userPassword + ' . Please login with same password on dashboard and change password.',
                    //         subject: 'System generated password',
                    //         file: null
                    //     });
                    // }
                    userId = usr._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                } else {
                    userId = checkUser._id
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                }

                if (appointmentResult) {
                    let currentWeek = moment(entryDate).format('WW GGGG')
                    let weekDay = await getWeekDay(moment(entryDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                    let month = moment(entryDate).format('MM')
                    let date = moment(entryDate).format('DD')
                    const updateObject = {
                        stylist: stylistId,
                        salon: requestSalon,
                        user: userId,
                        dateAsADate: entryDate,
                        dateAsAString: entryDateWithFormat,
                        timeAsADate: req.body.timeData.timeAsADate,
                        timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                        offset: req.query.offset,
                        isUser: true,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        gender: userGender,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        availability: req.body.availability,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                        appointmentId: await getAppointmentId()
                    }

                    const result = await Appointment.updateOne({
                        _id: req.body.id,
                    }, {
                        $set: updateObject
                    })

                    if (result && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true } //, $elemMatch: { _id: req.body.timeData.id } 
                        }, {
                            $set: {
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                                }
                            }
                        })
                    }

                    return res.status(200).json({
                        status: true,
                        message: `Your appointment request has been sent to stylist.`
                    });
                } else {
                    return res.status(200).json({
                        status: false,
                        message: "Appointment data is not found."
                    });
                }
            }
        } else {
            return res.status(200).json({
                status: false,
                message: isTImeAvailable.message
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const addAppointmentFormDashboardV2 = catchAsync(async (req, res, next) => {
    try {

        const entryDate = moment(Math.round(new Date(req.body.appointmentDate).getTime())).utcOffset(Number((req.query.offset)));
        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let requestSalon, stylistId;
        const timeAsSting = `${entryDateWithFormat} ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`
        const appointmentTimestamp = moment(timeAsSting, 'MM/DD/YYYY hh:mm a').utcOffset(-Number((req.query.offset))).unix();
        if (req.payload && req.payload.salon) {
            requestSalon = req.payload.salon
        } else {
            requestSalon = req.body.salon
        }

        if (req.payload && req.payload.stylist) {
            stylistId = req.payload.stylist
        } else {
            stylistId = req.body.stylistId
        }

        if (!requestSalon) {
            return res.status(200).json({
                status: false,
                message: `Salon data not found`
            });
        }


        const isTImeAvailable = await checkAvailabilityOfTime(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId)
        const isTimeData = isTImeAvailable.data;
        if (!req.body.id && isTImeAvailable.status) {
            const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
            if (isTImeAvailableImpact.status) {
                const appointmentResult = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                })
                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};
                req.body.eventType = 'change-status'
                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }

                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    userId = usr._id
                } else {
                    userId = checkUser._id
                }
                userName = req.body.name ? req.body.name : checkUser.name
                userEmail = req.body.email ? req.body.email : checkUser.email
                userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                userGender = req.body.gender ? req.body.gender : checkUser.gender

                const checkExists = await Appointment.findOne({
                    stylist: stylistId,
                    salon: requestSalon,
                    user: userId,
                    dateAsAString: entryDateWithFormat,
                    timeAsADate: req.body.timeData.timeAsADate, // 24 hr
                }).sort({ createdAt: -1 })

                if (checkExists) {
                    return res.status(200).json({
                        status: false,
                        message: `Your appointment is already scheduled for the day.  `
                    });
                }
                let bookingStatus = !appointmentResult ? 'requested' : 'waiting'
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
                    timeAsADate: req.body.timeData.timeAsADate,
                    timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                    appointmentTimestamp,
                    offset: req.query.offset,
                    isUser: true,
                    mainService: req.body.mainService,
                    subService: req.body.subService,
                    userName: userName,
                    userEmail: userEmail,
                    userMobile: userMobile,
                    comment: req.body.comment,
                    week: currentWeek.split(' ')[0],
                    year: currentWeek.split(' ')[1],
                    weekDay: weekDay,
                    date: date,
                    month: month,
                    availability: req.body.availability,
                    servicePhoto: req.body.servicePhoto,
                    requiredDuration: req.body.requiredDuration,
                    status: bookingStatus,
                    appointmentId: await getAppointmentId()
                });

                if (createResult && req.body.availability) {
                    await AppointmentAvailability.updateOne({
                        _id: req.body.availability,
                        timeData: { $exists: true }
                    }, {
                        $set: {
                            appointmentId: createResult._id,
                            timeData: {
                                _id: req.body.timeData.id,
                                timeAsADate: req.body.timeData.timeAsADate,
                                timeAsAString: req.body.timeData.timeAsAString,
                                slotStatus: bookingStatus
                            }
                        },
                        $push: {
                            appointmentList: createResult._id
                        }
                    })
                }

                let serviceDetail = await Service.findOne({ _id: ObjectId(req.body.subService) }).populate('service');
                let stylistDetail = await User.findOne({ _id: ObjectId(stylistId) }).populate('salon');
                let emailObject = await sendConfirmationMail(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId);

                if (checkUser.userDeviceID && checkUser.userDeviceID !== '') {
                    let notifyObject = await sendConfirmationNotification(createResult._id, userEmail, userName, req.body.requiredDuration, stylistDetail, req.body.timeData.timeAsAString, serviceDetail, entryDate, createResult.status, createResult.appointmentId, checkUser.userDeviceID);
                }
                const io = req.app.get('server-socket');

                if (io) {
                    const onlineUser = await onlineUsers.find(item => item.stylist === stylistId)
                    if (onlineUser) {
                        io.to(onlineUser.socketId).emit('appointment-request', {
                            message: `New appointment created for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                            data: createResult,
                            eventType: req.query.eventType

                        });
                    }
                    // const onlineAdmin = await onlineUsers.find(item => item.salon === requestSalon )
                    // if (onlineAdmin) {
                    //     io.to(onlineAdmin.socketId).emit('appointment-request', {
                    //         message: `salon You have a new appointment request for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                    //         data: createResult,
                    //         eventType: req.query.eventType

                    //     });
                    // }
                    if (req.query.eventType === 'appointment-update') {
                        const onlineAdmin = await onlineUsers.find(item => item.user === userId)
                        if (onlineAdmin) {
                            io.to(onlineAdmin.socketId).emit('appointment-request', {
                                message: `You have a new appointment request for ${entryDateWithFormat} at ${await timeConvertTo12Hr(req.body.timeData.timeAsADate)}`,
                                data: createResult,
                                eventType: req.query.eventType

                            });
                        }
                    }
                }
                return res.status(200).json({
                    status: true,
                    message: `Your appointment request has been sent to stylist.`
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: isTImeAvailableImpact.message
                });
            }
        } else if (req.body.id) {
            if (isTImeAvailable.status && isTimeData._id !== req.body.availability) {
                const isTImeAvailableImpact = await checkCurrentTimeImpact(req.body.timeData.timeAsADate, entryDateWithFormat, requestSalon, stylistId, req.body.requiredDuration)
                if (isTImeAvailableImpact.status) {
                    const appointmentResult = await Appointment.findOne({ _id: ObjectId(req.body.id) }).sort({ createdAt: -1 })
                    let userId, userName, userEmail, userMobile, userGender;
                    let qry = {};
                    if (req.body.email) {
                        qry.email = req.body.email;
                    } else if (req.payload.role === "user" && req.payload.email) {
                        qry.email = req.payload.email;
                    } else if (req.payload.role === "user" && req.payload.phone) {
                        qry.phone = req.payload.phone;
                    } else {
                        qry.phone = req.body.mobile;
                    }

                    let checkUser = await User.findOne(qry);
                    if (!checkUser) {
                        const userData = new User();
                        userData.name = req.body.name;
                        userData.email = req.body.email;
                        userData.userName = req.body.email;
                        userData.phone = req.body.mobile;
                        userData.gender = req.body.gender;
                        userData.salon = requestSalon;
                        userData.stylist = stylistId;
                        userData.clientNote = req.body.comment;
                        const userPassword = await (generatePassword())
                        userData.setPassword(userPassword);
                        let usr = await User.create(userData);
                        userId = usr._id
                    } else {
                        userId = checkUser._id
                    }
                    userName = req.body.name ? req.body.name : checkUser.name
                    userEmail = req.body.email ? req.body.email : checkUser.email
                    userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                    userGender = req.body.gender ? req.body.gender : checkUser.gender
                    if (appointmentResult) {
                        let currentWeek = moment(entryDate).format('WW GGGG')
                        let weekDay = await getWeekDay(moment(entryDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                        let month = moment(entryDate).format('MM')
                        let date = moment(entryDate).format('DD')
                        const updateObject = {
                            stylist: stylistId,
                            salon: requestSalon,
                            user: userId,
                            dateAsADate: entryDate,
                            dateAsAString: entryDateWithFormat,
                            timeAsADate: req.body.timeData.timeAsADate,
                            timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                            offset: req.query.offset,
                            isUser: true,
                            mainService: req.body.mainService,
                            subService: req.body.subService,
                            userName: userName,
                            userEmail: userEmail,
                            userMobile: userMobile,
                            gender: userGender,
                            comment: req.body.comment,
                            week: currentWeek.split(' ')[0],
                            year: currentWeek.split(' ')[1],
                            weekDay: weekDay,
                            date: date,
                            month: month,
                            offset: req.query.offset,
                            availability: req.body.availability,
                            servicePhoto: req.body.servicePhoto,
                            requiredDuration: req.body.requiredDuration,
                            status: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                            appointmentId: await getAppointmentId()
                        }

                        const result = await Appointment.updateOne({
                            _id: req.body.id,
                        }, {
                            $set: updateObject
                        })

                        await AppointmentAvailability.updateOne({
                            _id: appointmentResult.availability,
                            appointmentList: { $exists: true, $ne: [] }
                        }, {
                            $pull: { appointmentList: req.body.id },
                        })

                        if (result) {
                            await AppointmentAvailability.updateOne({
                                _id: appointmentResult.availability,
                                timeData: { $exists: true } //, $elemMatch: { _id: isTimeData._id } 
                            }, {
                                $set: {
                                    appointmentId: req.body.id,
                                    timeData: {
                                        _id: isTimeData._id,
                                        timeAsADate: req.body.timeData.timeAsADate,
                                        timeAsAString: req.body.timeData.timeAsAString,
                                        slotStatus: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting'
                                    }
                                },
                                $push: {
                                    appointmentList: req.body.id
                                }
                            })
                        }



                        const io = req.app.get('server-socket');

                        if (io) {
                            const onlineUser = await onlineUsers.find(item => item.stylist === stylistId)
                            if (onlineUser) {
                                io.to(onlineUser.socketId).emit('appointment-request', {
                                    message: `Your appointment has updated`,
                                    eventType: req.query.eventType

                                });
                            }
                            // const onlineAdmin = await onlineUsers.find(item => item.salon === requestSalon)
                            // if (onlineAdmin) {
                            //     io.to(onlineAdmin.socketId).emit('appointment-request', {
                            //         message: `Your appointment has updated`,
                            //         eventType: req.query.eventType

                            //     });
                            // }
                            if (req.query.eventType === 'appointment-update') {
                                const onlineAdmin = await onlineUsers.find(item => item.user === userId)
                                if (onlineAdmin) {
                                    io.to(onlineAdmin.socketId).emit('appointment-request', {
                                        message: `Your appointment has updated`,
                                        eventType: req.query.eventType

                                    });
                                }
                            }
                        }
                        return res.status(200).json({
                            status: true,
                            message: `Your appointment request has been sent to stylist.`
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: "Appointment data is not found."
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: isTImeAvailableImpact.message
                    });
                }
            } else {
                const appointmentResult = await Appointment.findOne({ _id: ObjectId(req.body.id) }).sort({ createdAt: -1 })
                let userId, userName, userEmail, userMobile, userGender;
                let qry = {};
                if (req.body.email) {
                    qry.email = req.body.email;
                } else if (req.payload.role === "user" && req.payload.email) {
                    qry.email = req.payload.email;
                } else if (req.payload.role === "user" && req.payload.phone) {
                    qry.phone = req.payload.phone;
                } else {
                    qry.phone = req.body.mobile;
                }

                let checkUser = await User.findOne(qry);
                if (!checkUser) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.mobile;
                    userData.gender = req.body.gender;
                    userData.salon = requestSalon;
                    userData.stylist = stylistId;
                    userData.clientNote = req.body.comment;
                    const userPassword = await (generatePassword())
                    userData.setPassword(userPassword);
                    let usr = await User.create(userData);
                    userId = usr._id
                } else {
                    userId = checkUser._id
                }
                userName = req.body.name ? req.body.name : checkUser.name
                userEmail = req.body.email ? req.body.email : checkUser.email
                userMobile = req.body.mobile ? req.body.mobile : checkUser.mobile
                userGender = req.body.gender ? req.body.gender : checkUser.gender

                if (appointmentResult) {
                    let currentWeek = moment(entryDate).format('WW GGGG')
                    let weekDay = await getWeekDay(moment(entryDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                    let month = moment(entryDate).format('MM')
                    let date = moment(entryDate).format('DD')
                    const updateObject = {
                        stylist: stylistId,
                        salon: requestSalon,
                        user: userId,
                        dateAsADate: entryDate,
                        dateAsAString: entryDateWithFormat,
                        timeAsADate: req.body.timeData.timeAsADate,
                        timeAsAString: await timeConvertTo12Hr(req.body.timeData.timeAsADate),
                        offset: req.query.offset,
                        isUser: true,
                        mainService: req.body.mainService,
                        subService: req.body.subService,
                        userName: userName,
                        userEmail: userEmail,
                        userMobile: userMobile,
                        gender: userGender,
                        comment: req.body.comment,
                        week: currentWeek.split(' ')[0],
                        year: currentWeek.split(' ')[1],
                        weekDay: weekDay,
                        date: date,
                        month: month,
                        availability: req.body.availability,
                        servicePhoto: req.body.servicePhoto,
                        requiredDuration: req.body.requiredDuration,
                        status: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                        appointmentId: await getAppointmentId()
                    }

                    const result = await Appointment.updateOne({
                        _id: req.body.id,
                    }, {
                        $set: updateObject
                    })

                    if (result && req.body.availability) {
                        await AppointmentAvailability.updateOne({
                            _id: req.body.availability,
                            timeData: { $exists: true } //, $elemMatch: { _id: req.body.timeData.id } 
                        }, {
                            $set: {
                                timeData: {
                                    _id: req.body.timeData.id,
                                    timeAsADate: req.body.timeData.timeAsADate,
                                    timeAsAString: req.body.timeData.timeAsAString,
                                    slotStatus: (isTimeData.slotStatus === 'available') ? 'requested' : 'waiting',
                                }
                            }
                        })
                    }
                    const io = req.app.get('server-socket');

                    if (io) {
                        const onlineUser = await onlineUsers.find(item => item.stylist === stylistId)
                        if (onlineUser) {
                            io.to(onlineUser.socketId).emit('appointment-request', {
                                message: `Your appointment has updated`,
                                eventType: req.query.eventType

                            });
                        }
                        // const onlineAdmin = await onlineUsers.find(item => item.salon === requestSalon)
                        // if (onlineAdmin) {
                        //     io.to(onlineAdmin.socketId).emit('appointment-request', {
                        //         message: `Your appointment has updated`,
                        //         eventType: req.query.eventType
                        //     });
                        // }
                        if (req.query.eventType === 'appointment-update') {
                            const onlineAdmin = await onlineUsers.find(item => item.user === userId)
                            if (onlineAdmin) {
                                io.to(onlineAdmin.socketId).emit('appointment-request', {
                                    message: `Your appointment has updated`,
                                    eventType: req.query.eventType
                                });
                            }
                        }
                    }
                    return res.status(200).json({
                        status: true,
                        message: `Your appointment has updated`
                    });
                } else {
                    return res.status(200).json({
                        status: false,
                        message: "Appointment data is not found."
                    });
                }
            }
        } else {
            return res.status(200).json({
                status: false,
                message: isTImeAvailable.message
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAppointmentForDashboard = async (req, res, next) => {
    try {
        const utcDate = moment();
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');

        const entryDate = moment(Math.round(new Date(req.body.fromDate).getTime())).utcOffset(-Number((req.query.offset)));
        const endDate = moment(Math.round(new Date(req.body.toDate).getTime())).utcOffset(-Number((req.query.offset)));

        const userList = await Appointment.aggregate()
            .match(
                {
                    dateAsADate: { $gte: entryDate, $lte: endDate },
                    stylist: ObjectId(req.body.stylistId),
                    // availability: { //availability
                    //     "$exists": true,
                    //     "$ne": null
                    // }
                })
            .lookup({
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetail'
            })
            .unwind('$userDetail')
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylistDetail'
            })
            .unwind('$stylistDetail')
            .lookup({
                from: 'services',
                localField: 'mainService',
                foreignField: '_id',
                as: 'services'
            })
            .unwind('$mainService')
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .group({
                _id: '$availability', //'$availability', 
                records: { $push: "$$ROOT" }
            })
            .project({
                availability: '$_id', //'$availability',
                stylistConfirmationStatus: { $first: "$records.stylistConfirmationStatus" },
                start: { $first: "$records.dateAsADate" },
                start_date: { $first: "$records.dateAsAString" },
                userList: '$records'
            });

        return res.status(200).json({
            status: true,
            result: userList
        });

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
};
export const getAppointmentsByStylist = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        const entryDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();

        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');

        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

        if (differenceInDays == -1) {
            entryDate.subtract(1, 'days')
        }
        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);

        andList.push({
            stylist: ObjectId(req.payload._id),
            appointmentCompletedStatus: false,
            dateAsADate: {
                $gte: new Date(fromDate)
            },
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Appointment.aggregate()
            .match(query)
            .lookup({
                from: 'services',
                localField: 'mainService',
                foreignField: '_id',
                as: 'mainService'
            })
            .unwind('$mainService')
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .sort({ dateAsADate: 1 })
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })
            .project({
                count: '$count',
                records: { $slice: ['$records', ((pageNumber - 1) * pageSize), pageSize] }
            });
        if (userList.length) {
            if (userList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: userList[0].records,
                        totalPageSize: userList[0].count
                    },
                    message: 'Data sent successfully'
                })
            } else {
                return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
            }
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAppointmentHistoryByUser = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        andList.push({
            user: ObjectId(req.payload._id),

        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Appointment.aggregate()
            .match(query)
            .lookup({
                from: 'services',
                localField: 'mainService',
                foreignField: '_id',
                as: 'mainService'
            })
            .unwind('$mainService')
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .sort({ dateAsADate: -1 })
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })
            .project({
                count: '$count',
                records: { $slice: ['$records', ((pageNumber - 1) * pageSize), pageSize] }
            });
        if (userList.length) {
            if (userList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: userList[0].records,
                        totalPageSize: userList[0].count
                    },
                    message: 'Data sent successfully'
                })
            } else {
                return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
            }
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const deleteAppointment = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
        });
        const { error, value } = schema.validate({ id: req.query.id }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.id) {
            await Appointment.deleteOne({ _id: req.query.id });

            return res.status(200).json({
                status: true,
                message: 'Appointment has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Appointment Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const deleteAppointmentDashboard = async (req, res, next) => {
    try {
        console.log(req.params.appointmentId);
        if (req.params.appointmentId) {
            const data = await Appointment.findOne({ _id: req.params.appointmentId });
            await Appointment.deleteOne({ _id: req.params.appointmentId });
            await AppointmentAvailability.updateOne({
                appointmentList: req.params.appointmentId
            }, {
                $set: { "timeData.$[element].slotStatus": "available" }
            }, {
                arrayFilters: [{ "element.timeAsADate": data.timeAsADate }]
            })
            await AppointmentAvailability.updateOne({
                appointmentList: req.params.appointmentId
            }, {
                $unset: { 'appointmentId': 1 }
            }, {
                multi: true
            })
            await AppointmentAvailability.updateOne({
                appointmentList: req.params.appointmentId
            }, {
                $pull: { appointmentList: req.params.appointmentId }
            })

            const io = req.app.get('server-socket');

            if (io) {
                const onlineUser = await onlineUsers.find(item => item.stylist === data.stylist)
                if (onlineUser) {
                    io.to(onlineUser.socketId).emit('appointment-request', {
                        message: `Appointment has been deleted`,
                        eventType: req.query.eventType

                    });
                }
                const onlineAdmin = await onlineUsers.find(item => item.salon === data.salon)
                if (onlineAdmin) {
                    io.to(onlineAdmin.socketId).emit('appointment-request', {
                        message: `Appointment has been deleted`,
                        eventType: req.query.eventType
                    });
                }
                if (req.query.eventType === 'appointment-update') {
                    const onlineAdmin = await onlineUsers.find(item => item.user === data.user)
                    if (onlineAdmin) {
                        io.to(onlineAdmin.socketId).emit('appointment-request', {
                            message: `Appointment has been deleted`,
                            eventType: req.query.eventType
                        });
                    }
                }
            }
            return res.status(200).json({
                status: true,
                message: 'Appointment has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Appointment Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
};
export const changeStatusOfAppointment = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        let data = await AppointmentAvailability.findOne({
            _id: ObjectId(field.slotId),
        })

        for (let item of data.appointmentList) {
            await Appointment.updateOne({
                _id: item
            }, {
                $set: {
                    'status': (req.query.id === ObjectId(item).toString()) ? field.status : 'waiting'
                }
            });
        }

        const updateAppointmentAvailabilityStatus = await AppointmentAvailability.updateOne({
            _id: ObjectId(field.slotId),
            timeData: { $exists: true }
        }, {
            $set: {
                appointmentId: (field.status === 'confirmed') && req.query.id,
                timeData: {
                    _id: field.timeDataId,
                    timeAsAString: data.timeData[0].timeAsAString,
                    timeAsADate: data.timeData[0].timeAsADate,
                    'slotStatus': field.status
                }
            }
        });

        return res.json({
            status: true,
            message: 'Record has been updated as ' + field.status,
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfAppointmentV2 = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        let data = await AppointmentAvailability.findOne({
            _id: field.slotId,
        })

        for (let item of data.appointmentList) {
            if (req.query.id === item.toString()) {
                await Appointment.updateOne({
                    _id: item
                }, {
                    $set: {
                        'status': field.status
                    }
                });
            } else {
                await Appointment.updateOne({
                    _id: item
                }, {
                    $set: {
                        'status': 'waiting'
                    }
                });
            }
        }

        const updateAppointmentAvailabilityStatus = await AppointmentAvailability.updateOne({
            _id: field.slotId,
            timeData: { $exists: true }
        }, {
            $set: {
                appointmentId: req.query.id,
                timeData: {
                    _id: field.timeDataId,
                    timeAsAString: data.timeData[0].timeAsAString,
                    timeAsADate: data.timeData[0].timeAsADate,
                    'slotStatus': field.status
                }
            }
        });
        const io = req.app.get('server-socket');

        if (io) {
            // added for reward socket
            if (field.status === 'completed') {
                let findUserId = await Appointment.findOne({_id:req.query.id});
                let user_id=findUserId.user;
                let appointmentCount = await Appointment.find({ user: user_id, status: 'completed' });
                if (appointmentCount.length <= 1) {
                    let data = await firstAppointment(user_id);
                    if (data) {
                        const userSocketId = await onlineUsers.find(item => item.user === user_id.toString());
                        if (userSocketId) {
                            io.to(userSocketId.socketId).emit('first-appointment', data[0]);
                        }
                        if (JSON.stringify(data[1]) !== '{}') {
                            const referralSocket = await onlineUsers.find(item => item.user === data[1].user_id.toString());
                            if (referralSocket) {
                                io.to(referralSocket.socketId).emit('referal', data[1]);
                            }
                        }
                    }
                }
            }

            const onlineUser = await onlineUsers.find(item => item.stylist === data.stylist)
            if (onlineUser) {
                io.to(onlineUser.socketId).emit('appointment-request', {
                    message: 'Record has been updated as ' + field.status,
                    eventType: req.query.eventType

                });
            }
            const onlineAdmin = await onlineUsers.find(item => item.salon === data.salon)
            if (onlineAdmin) {
                io.to(onlineAdmin.socketId).emit('appointment-request', {
                    message: 'Record has been updated as ' + field.status,
                    eventType: req.query.eventType
                });
            }
            if (req.query.eventType === 'appointment-update') {
                const onlineAdmin = await onlineUsers.find(item => item.user === data.user)
                if (onlineAdmin) {
                    io.to(onlineAdmin.socketId).emit('appointment-request', {
                        message: 'Record has been updated as ' + field.status,
                        eventType: req.query.eventType
                    });
                }
            }
        }
        return res.json({
            status: true,
            message: 'Record has been updated as ' + field.status,
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAppointmentTypeList = catchAsync(async (req, res, next) => {
    try {
        return res.json({
            status: true,
            data: [
                {
                    label: 'Requested',
                    value: 'requested'
                },
                {
                    label: 'Confirmed',
                    value: 'confirmed'
                },
                {
                    label: 'Waiting',
                    value: 'waiting'
                },
                {
                    label: 'Canceled',
                    value: 'canceled'
                },
                {
                    label: 'Completed',
                    value: 'completed'
                }
            ],

            message: 'Data send successfully.',
        });
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const getAvailabilityDetailByAppointment = catchAsync(async (req, res, next) => {
    try {
        let AppointmentAvailabilityDetail = await AppointmentAvailability.findOne({
            _id: ObjectId(req.query.availabilityId)
        })
            // .populate('stylist')
            .populate('appointmentList')
            .populate({
                path: 'appointmentList',
                populate: { path: 'user stylist salon subService mainService' }
            });

        if (AppointmentAvailabilityDetail && AppointmentAvailabilityDetail.appointmentList.length > 1) {
            let itemIndex = AppointmentAvailabilityDetail.appointmentList.findIndex(x => x.status === "confirmed")
            if (itemIndex)
                AppointmentAvailabilityDetail.appointmentList = await moveItem(AppointmentAvailabilityDetail.appointmentList, itemIndex, 0)
        }
        return res.status(200).json({
            status: true,
            result: AppointmentAvailabilityDetail
        });
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getLatestAppointment = catchAsync(async (req, res, next) => {
    try {
        const entryDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();

        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');

        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

        if (differenceInDays == -1) {
            entryDate.subtract(1, 'days')
        }
        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);
        const userList = await Appointment.findOne({
            user: req.payload._id,
            appointmentCompletedStatus: false,
            dateAsADate: {
                $gte: new Date(fromDate)
            },
        }).sort({ dateAsADate: 1 }).populate('mainService').populate('subService')
        if (userList) {
            return res.status(200).json({
                status: true, data: {
                    result: userList,
                },
                message: 'Data sent successfully'
            })
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAppointmentDetails = catchAsync(async (req, res, next) => {
    try {
        const userList = await Appointment.findOne({
            _id: req.query.appointmentId,
            user: req.payload._id
        }).populate('mainService').populate('subService').populate('salon').populate('stylist');

        if (userList) {
            return res.status(200).json({
                status: true, data: {
                    result: userList,
                },
                message: 'Data sent successfully'
            })
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAvailableAppointmentByDate = async (req, res, next) => {
    try {
        const { requestDate, salon, stylistId } = req.body;
        let query = {
            'timeData.slotStatus': { $ne: 'canceled' }
        };

        const entryDate = moment(Math.round(new Date(requestDate).getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();
        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let entryDateWithFormatDash = moment(entryDate).format('MM-DD-YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')
        if (differenceInDays == -1) {
            entryDate.subtract(1, 'days')
        }
        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);

        const user = await User.findOne({ _id: ObjectId(salon) });
        if (user && !user.active) {
            return res.status(200).json({
                status: false,
                message: 'You don\'t have permission to access this salon service. Please contact your administrator.',
            });
        }

        let mainCategoryList = await Service.find({ salon, isMainService: true, enable: true });
        mainCategoryList = JSON.parse(JSON.stringify(mainCategoryList)).map(item => { return { ...item, subService: [] } })
        for (const sub of mainCategoryList) {
            let subCategoryList = await Service.find({ service: sub._id, enable: true });
            sub.subService = JSON.parse(JSON.stringify(subCategoryList))
        }

        query.salon = ObjectId(salon);

        if (stylistId) {
            query.stylist = ObjectId(stylistId);
        }

        query.dateAsAString = { $in: [entryDateWithFormat, entryDateWithFormatDash] };
        query.isAvailable = true;

        const userList = await AppointmentAvailability.aggregate()
            .match(query)
            .lookup({
                from: "users",
                localField: "stylist",
                foreignField: "_id",
                as: "stylistData"
            })
            .unwind("$stylistData")
            .group({
                _id: "$stylist",
                stylistData: { $first: "$stylistData" },
                availableTime: { $push: "$$ROOT" }
            })
            .project(
                {
                    'availableTime.stylistData': 0
                }
            )

        if (userList.length) {
            userList[0].availableTime.sort((a, b) => {
                return Number(a.timeData[0].timeAsADate.toString().replace(':', '')) - Number(b.timeData[0].timeAsADate.toString().replace(':', ''))
            })
        }
        mainCategoryList = mainCategoryList.map(item => {
            item.subService = item.subService.map(item => {
                return { ...item, stylistList: JSON.parse(JSON.stringify(userList)) }
            })
            return item;
        })

        return res.status(200).json({
            status: true, data: {
                result: mainCategoryList,
                start: requestDate
            },
            message: 'Data sent successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
}
export const confirmAppointment = async (req, res, next) => {
    try {

        const { stylist, appointmentId, status, user_id } = req.body;
        const data = await Appointment.findOne({ _id: appointmentId });

        const confirm = await Appointment.updateOne({ _id: ObjectId(appointmentId) }, { $set: { stylistConfirmationStatus: status } })
        const io = req.app.get('server-socket');

        if (io) {
            if (status === 'completed') {
                let appointmentCount = await Appointment.find({ user: user_id, status: 'completed' });
                if (appointmentCount.length <= 1) {
                    let data = await firstAppointment(user_id);
                    if (data) {
                        const userSocketId = await onlineUsers.find(item => item.user === user_id);
                        if (userSocketId) {
                            io.to(userSocketId.socketId).emit('first-appointment', data[0]);
                        }
                        if (JSON.stringify(data[1]) !== '{}') {
                            const referralSocket = await onlineUsers.find(item => item.user === data[1].user_id);
                            if (referralSocket) {
                                io.to(referralSocket.socketId).emit('referal', data[1]);
                            }
                        }
                    }
                }
            }
            const onlineUser = await onlineUsers.find(item => item.stylist === stylist)
            if (onlineUser) {
                io.to(onlineUser.socketId).emit('appointment-request', {
                    message: 'Appointment status has been changed successfully.',
                    eventType: req.query.eventType

                });
            }
            const onlineAdmin = await onlineUsers.find(item => item.salon === data.salon)
            if (onlineAdmin) {
                io.to(onlineAdmin.socketId).emit('appointment-request', {
                    message: 'Appointment status has been changed successfully.',
                    eventType: req.query.eventType
                });
            }
            if (req.query.eventType === 'appointment-update') {
                const onlineAdmin = await onlineUsers.find(item => item.user === data.user)
                if (onlineAdmin) {
                    io.to(onlineAdmin.socketId).emit('appointment-request', {
                        message: 'Appointment status has been changed successfully.',
                        eventType: req.query.eventType
                    });
                }
            }
        }
        return res.status(200).json({
            status: true, data: confirm,
            message: 'Appointment status has been changed successfully.'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
}
export const testAPI = catchAsync(async (req, res, next) => {
    try {

        const resultA = await updatePostSchedulingTime(
            req.body.timeData.timeAsADate,
            req.body.appointmentDate,
            requestSalon,
            stylistId,
            req.body.duration)
        return res.status(200).json(resultA);
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAppointmentConversionRate = catchAsync(async (req, res, next) => {
    try {
        let findQuery = {}
        if (req.payload.role === 'salon')
            findQuery = {
                salon: ObjectId(req.payload._id)
            }
        else if (req.payload.role !== 'admin')
            findQuery = {
                salon: ObjectId(req.payload.salon)
            }
        const result = await Appointment.aggregate()
            .match(findQuery)
            .group({
                '_id': '$salon',
                'withoutConfirmedCount': {
                    '$sum': {
                        '$cond': [
                            { '$ne': ['$status', 'confirmed'] }, 1, 0
                        ]
                    }
                },
                'withConfirmedCount': {
                    '$sum': {
                        '$cond': [
                            { '$eq': ['$status', 'confirmed'] }, 1, 0
                        ]
                    }
                }
            }).project({
                withConfirmedCount: '$withConfirmedCount',
                withoutConfirmedCount: '$withoutConfirmedCount',
                percent: { $multiply: [{ $divide: ["$withConfirmedCount", "$withoutConfirmedCount"] }, 100] }
            })

        return res.status(200).json(result);
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
})
export const getCustomerRetentionRateRate = catchAsync(async (req, res, next) => {
    try {
        let findQuery = {}
        if (req.payload.role === 'salon')
            findQuery = {
                salon: ObjectId(req.payload._id)
            }
        else if (req.payload.role !== 'admin')
            findQuery = {
                salon: ObjectId(req.payload.salon)
            }
        const result = await Appointment.aggregate()
            .match(findQuery)
            .facet({
                total: [{
                    $group: { _id: "$user", sum: { $sum: 1 } }
                },
                {
                    $match: { sum: { $gt: 0 } }
                },
                {
                    $group: { _id: null, sum: { $sum: 1 } }
                }],
                repeatUsers: [
                    {
                        $group: { _id: "$user", sum: { $sum: 1 } }
                    },
                    {
                        $match: { sum: { $gt: 1 } }
                    },
                    {
                        $group: { _id: null, sum: { $sum: 1 } }
                    }
                ]
            })
            .unwind('$total')
            .unwind('$repeatUsers')
            .project({
                totalUsers: '$total.sum',
                repeatUsers: '$repeatUsers.sum',
                percent: { $multiply: [{ $divide: ["$repeatUsers.sum", "$total.sum"] }, 100] }
            })


        return res.status(200).json(result);
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
})
export const getAverageTicketValue = catchAsync(async (req, res, next) => {
    try {
        let findQuery = {}
        if (req.payload.role === 'salon')
            findQuery = {
                salon: ObjectId(req.payload._id)
            }
        else if (req.payload.role !== 'admin')
            findQuery = {
                salon: ObjectId(req.payload.salon)
            }
        const result = await Appointment.aggregate()
            .match(findQuery)
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .facet({
                total: [{
                    $group: { _id: "$user", sum: { $sum: 1 } }
                },
                {
                    $match: { sum: { $gt: 0 } }
                },
                {
                    $group: { _id: null, sum: { $sum: 1 } }
                }],
                totalAmount: [
                    {
                        $group: { _id: null, sum: { $sum: '$subService.charges' } }
                    }
                ]
            })
            .unwind('$total')
            .unwind('$totalAmount')
            .project({
                totalUsers: '$total.sum',
                totalAmount: '$totalAmount.sum',
                amount: { $divide: ["$totalAmount.sum", "$total.sum"] }
            })


        return res.status(200).json(result);
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
})
// LOCAL FUNCTIONS

async function moveItem(arr, itemIndex, targetIndex) {
    let itemRemoved = arr.splice(itemIndex, 1); // splice() returns the remove element as an array
    arr.splice(targetIndex, 0, itemRemoved[0]); // Insert itemRemoved into the target index
    return arr;
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
async function timeConvertTo12Hr(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('');
}
async function isEmailPresentFn(email, user, type) {
    try {
        if (email) {
            const userRecord = await User.findOne({ email: email })
            if (userRecord) {
                if (type == 'update') {
                    if (user.email === email) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (exception) {
        return true;
    }
}
async function isMobilePresentForUserFn(mobile, user, type) {
    try {
        const userRecord = await User.findOne({ phone: mobile })
        if (userRecord) {
            if (type == 'update') {
                if (user.phone === mobile) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    } catch (exception) {
        return true;
    }
}
async function sendConfirmationMail(_id, userEmail, userName, requiredDuration, stylistDetail, timeAsAString, serviceDetail, appointmentDate, status, appointmentId) {
    const payload = { notificationType: 'notification' }
    let body = 'Hi ' + userName + ', Appointment booked with ' + stylistDetail.name + ' on ' + moment(new Date(appointmentDate)).format('dddd, MMMM Do YYYY') + ' at ' + timeAsAString;
    let emailobject = await emailTemplateEvent.emit('appointment-confirm', {
        _id: _id,
        toAddress: userEmail,
        subject: 'We have received your request to schedule appointment.',// Click the below button to confirm the appointment.',
        name: userName,
        requiredDuration: requiredDuration,
        stylistDetail: stylistDetail,
        timeAsAString: timeAsAString,
        serviceDetail: serviceDetail,
        appointmentDate: appointmentDate,
        status: status,
        appointmentId: appointmentId
    });

    return emailobject;
}
async function sendConfirmationNotification(_id, userEmail, userName, requiredDuration, stylistDetail, timeAsAString, serviceDetail, appointmentDate, status, appointmentId, deviceID) {
    const payload = { notificationType: 'notification' }
    let body = 'Hi ' + userName + ', Appointment booked with ' + stylistDetail.name + ' on ' + moment(new Date(appointmentDate)).format('dddd, MMMM Do YYYY') + ' at ' + timeAsAString;
    const fcmResult = await sendNotificationTokens('We have received your request to schedule appointment. ' + appointmentId, body, [deviceID], payload);
    return fcmResult;
}
async function getAppointmentId() {
    const initial = '#100'
    const count = await Appointment.find({}).countDocuments() + 1;
    return `${initial}${count}`
}
async function generatePassword() {
    // tslint:disable-next-line:max-line-length
    return getRandomString(4) + getRandomStringCaps(1) + getRandomNumber(1) + getRandomSymbol(1) + getRandomString(4);
}
function getRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomStringCaps(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomNumber(length) {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomSymbol(length) {
    let result = '';
    const characters = '$@!%*?&';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

