import passport from 'passport';
import Attendance from '../model/attendance.model.js';
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

export const attendanceEntry = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            offset: Joi.number().required(),
            user: Joi.string().required(),
            stylist: Joi.string().required(),
            salon: Joi.string().required(),

        });
        const { error, value } = schema.validate({ offset: req.query.offset, user: req.body.user, stylist: req.body.stylist, salon: req.payload._id }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        const createResult = await Attendance.create({
            stylist: req.body.stylist,
            salon: req.payload._id,
            user: req.body.user,
            checkInDate: new Date(),
            checkInDateString: moment(moment().utcOffset(-Number((req.query.offset)))).format('MM/DD/YYYY'),
            checkInTimeString: moment(moment().utcOffset(-Number((req.query.offset)))).format('hh:mm a'),
            offset: req.query.offset,
            isCheckedIn: true,

        });

        return res.status(200).json({
            status: true,
            message: `User has been checked-in`
        });  
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getTodaysAttendanceBySalon = catchAsync(async (req, res, next) => {
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
            salon: ObjectId(req.payload._id),
            checkInDate: {
                $gte: new Date(fromDate),
                $lt: new Date(toDate)
            },
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Attendance.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
            .lookup({
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            })
            .unwind('$user')
            .sort({ createdAt: -1 })
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
export const getAttendanceByUser = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        andList.push({
            salon: ObjectId(req.payload.salon),
            user: ObjectId(req.payload._id),

        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Attendance.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
            .sort({ createdAt: -1 })
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
export const updateNote = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            note: Joi.string().required(),
        });
        const { error, value } = schema.validate({ note: req.body.note }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        await Attendance.updateOne({ _id: req.query.attendanceID }, {
            $set: {
                note: req.body.note
            }
        });

        return res.status(200).json({
            status: true,
            message: 'Note has been added.',
        })

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAttendanceHistoryBySalon = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        andList.push({
            salon: ObjectId(req.payload._id),
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Attendance.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
            .lookup({
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            })
            .unwind('$user')
            .sort({ createdAt: -1 })
            .group({
                _id: '$checkInDateString',
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
export const deleteCheckInByID = catchAsync(async (req, res, next) => {
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
            await Attendance.deleteOne({ _id: req.query.id });

            return res.status(200).json({
                status: true,
                message: 'Checkin has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});