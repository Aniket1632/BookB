import passport from 'passport';
import Session from '../model/session.model.js';
import jwtDecode from 'jwt-decode';

import catchAsync from '../config/catchAsync.js';
import twilio from 'twilio';
import constant from '../config/index.js'
import Joi from 'joi';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
import moment from 'moment';
moment.suppressDeprecationWarnings = true;
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const addSession = catchAsync(async (req, res, next) => {
    try {

        if (req.body.id) {
            await Session.updateOne({ _id: req.body.id }, {
                $set: {
                    session: req.body.session
                }
            })
            return res.status(200).json({
                status: true,
                message: `Session has been modified`
            });
        } else {
            const todayDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));

            const entryDate = moment(Math.round(new Date(req.body.sessionDate).getTime())).utcOffset(-Number((req.query.offset)));
            const utcDate = moment();

            let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
            let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
            let todaysDateWithFormat = moment(todayDate).format('MM/DD/YYYY');

            const differenceBetweenTodayAndSearchDate = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(todaysDateWithFormat, "MM/DD/YYYY"), 'days')

            if (differenceBetweenTodayAndSearchDate > 1) {
                return res.status(200).json({
                    status: false,
                    message: 'You cannot submit a session for a date greater than today.'
                })
            }

            const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

            if (differenceInDays == -1) {
                entryDate.subtract(1, 'days')
            }
            let fromDate = new Date(entryDate);
            fromDate.setHours(0, 0, 0, 0)
            let toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + 1);

            const currentDate = moment(Math.round(new Date(req.body.sessionDate).getTime())).utcOffset(-Number((req.query.offset)))
            const currentWeek = moment(currentDate).format('WW GGGG')
            const weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
            const month = moment(currentDate).format('MM')
            const date = moment(currentDate).format('DD')

            let salon = null;
            let stylist = null;

            if (req.payload.role === 'salon') {
                salon = req.payload._id
                stylist = req.body.stylist

            }
            if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
                salon = req.payload.salon
                stylist = req.body.stylist
            }
            if (req.payload.role === 'stylist') {
                salon = req.payload.salon
                stylist = req.payload._id
            }

            const appointmentResult = await Session.findOne({
                stylist: stylist,
                salon: salon,
                sessionDate: {
                    $gte: new Date(fromDate),
                    $lt: new Date(toDate)
                },
            })
            if (!appointmentResult) {
                const createResult = await Session.create({
                    stylist: stylist,
                    salon: salon,
                    sessionDate: new Date(),
                    sessionDateString: entryDateWithFormat,
                    offset: req.query.offset,
                    sessionAddedBy: req.payload._id,
                    sessionAddedByRole: req.payload.role,
                    week: currentWeek.split(' ')[0],
                    year: currentWeek.split(' ')[1],
                    weekDay: weekDay,
                    date: date,
                    month: month,
                    session: req.body.session,

                });

                return res.status(200).json({
                    status: true,
                    message: `Session has been added for ${entryDateWithFormat}`
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: `You have already added session for the selected date`
                });
            }
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getSessionByStylist = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        if (req.payload.role === 'stylist') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                stylist: ObjectId(req.payload._id),
                month: Number(req.query.month)
            })
        }
        if (req.payload.role === 'salon') {
            if (req.query.id) {
                andList.push({
                    salon: ObjectId(req.payload._id),
                    stylist: ObjectId(req.query.id),
                    month: Number(req.query.month)
                })
            } else {
                return res.status(200).json({ status: false, message: 'Stylist id is required field' })
            }
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            if (req.query.id) {
                andList.push({
                    salon: ObjectId(req.payload.salon),
                    stylist: ObjectId(req.query.id),
                    month: Number(req.query.month)
                })
            } else {
                return res.status(200).json({ status: false, message: 'Stylist id is required field' })
            }
        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })
        const sessionCount = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .project({
                "total": "$session",
            })
        if (userList.length) {
            if (userList[0].records.length) {
                if (req.payload.role === 'stylist') {
                    return res.status(200).json({
                        status: true, data: {
                            result: userList[0].records,
                            totalSessionHr: sessionCount.length ? sessionCount[0].total : 0,
                            totalSessionHrOwed: sessionCount.length ? (req.payload.sessionCharges ? sessionCount[0].total * req.payload.sessionCharges : sessionCount[0].total * 10) : 0,
                        },
                        message: 'Data sent successfully'
                    })
                } else {
                    return res.status(200).json({
                        status: true, data: {
                            result: userList[0].records,
                            totalSessionHr: sessionCount.length ? sessionCount[0].total : 0,
                            totalSessionHrOwed: sessionCount.length ? (req.payload.sessionCharges ? sessionCount[0].total * req.payload.sessionCharges : sessionCount[0].total * 10) : 0,
                            utilitiesOwed: sessionCount.length ? (sessionCount.length ? (req.payload.sessionCharges ? sessionCount[0].total * req.payload.sessionCharges : sessionCount[0].total * 10) : 0) * 0.05 : 0,
                            totalOwed: sessionCount.length ? ((sessionCount.length ? (req.payload.sessionCharges ? sessionCount[0].total * req.payload.sessionCharges : sessionCount[0].total * 10) : 0) * 0.05) + (sessionCount.length ? (req.payload.sessionCharges ? sessionCount[0].total * req.payload.sessionCharges : sessionCount[0].total * 10) : 0) : 0,

                        },
                        message: 'Data sent successfully'
                    })
                }
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
export const getTotalSessionByStylist = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let andList = []
        if (req.payload.role === 'stylist') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                stylist: ObjectId(req.payload._id),
                month: Number(req.query.month)
            })
        }
        if (req.payload.role === 'salon') {
            if (req.query.id) {
                andList.push({
                    salon: ObjectId(req.payload._id),
                    stylist: ObjectId(req.query.id),
                    month: Number(req.query.month)
                })
            } else {
                return res.status(200).json({ status: false, message: 'Stylist id is required field' })
            }
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            if (req.query.id) {
                andList.push({
                    salon: ObjectId(req.payload.salon),
                    stylist: ObjectId(req.query.id),
                    month: Number(req.query.month)
                })
            } else {
                return res.status(200).json({ status: false, message: 'Stylist id is required field' })
            }
        }

        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .project({
                "total": "$session",
            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: {
                    total: userList[0].total,
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