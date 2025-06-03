import Session from '../model/session.model.js';
import ProductOrder from '../model/product-order.model.js';
import { CHART_COLORS, transparentize } from '../config/color.js';

import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';
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

export const getTotalSessionByStylistMonthWise = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let andList = []
        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id),
                month: Number(req.query.month)
            })
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                month: Number(req.query.month)
            })
        }

        const userList = await Session.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')

            .group({
                "_id": "$stylist._id",
                "session": { "$sum": "$session" },
                "stylist": { $first: "$stylist" },
            })
            .project({
                _id: 0,
                session: '$session',
                stylist: '$stylist',
                earning: { $multiply: ['$session', 10] },

            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalSessionByMonth = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total": "$session",
                "month": "$_id",
                _id: 0
            })


        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalEarningByMonth = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        let salonId = null;
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon

            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total_session": "$session",
                "month": "$_id",
                "earning": { $multiply: ["$session", 10] },
                "utilities": { $multiply: [{ $multiply: ["$session", 10] }, 0.05] },
                "total": { '$add': [{ $multiply: ["$session", 10] }, { $multiply: [{ $multiply: ["$session", 10] }, 0.05] }] }
            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalEarningByDayByStylist = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []

        let salonId = null;

        const todayDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));

        const entryDate = moment(Math.round(new Date(req.query.sessionDate).getTime())).utcOffset(-Number((req.query.offset)));
        const utcDate = moment();

        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        let todaysDateWithFormat = moment(todayDate).format('MM/DD/YYYY');



        const differenceInDays = moment(entryDateWithFormat, "MM/DD/YYYY").diff(moment(utcDateWithFormat, "MM/DD/YYYY"), 'days')

        if (differenceInDays == -1) {
            entryDate.subtract(1, 'days')
        }
        let fromDate = new Date(entryDate);
        fromDate.setHours(0, 0, 0, 0)
        let toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);


        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            andList.push({
                salon: ObjectId(req.payload._id),
                sessionDate: {
                    $gte: new Date(fromDate),
                    $lt: new Date(toDate)
                }
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon

            andList.push({
                salon: ObjectId(req.payload.salon),
                sessionDate: {
                    $gte: new Date(fromDate),
                    $lt: new Date(toDate)
                }
            })

        }
        if (andList.length)
            query.$and = andList;

        const userList = await Session.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
            .group({
                "_id": "$stylist._id",
                "session": { "$sum": "$session" },
                "stylist": { $first: "$stylist" },
            })
            .project({
                _id: 0,
                session: '$session',
                stylist: '$stylist',
                earning: { $multiply: ["$session", 10] },
            })


        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalSalesByMonth = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        let salonId = null;
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year,
                orderStatus: "Completed",
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon

            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year,
                orderStatus: "Completed",

            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await ProductOrder.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "totalAmount": { "$sum": "$totalAmount" },
            })
            .sort({ '_id': 1 })
            .project({
                "totalAmount": "$totalAmount",
                "month": "$_id",
            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getTotalSessionByStylistMonthWiseForChart = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let andList = []
        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id),
                month: Number(req.query.month)
            })
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                month: Number(req.query.month)
            })
        }

        const userList = await Session.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')

            .group({
                "_id": "$stylist._id",
                "session": { "$sum": "$session" },
                "stylist": { $first: "$stylist" },
            })
            .project({
                _id: 0,
                session: '$session',
                stylist: '$stylist',
                earning: { $multiply: ['$session', 10] },

            })

        if (userList.length) {
            const labels = [];
            const dataset = [];
            const finalData = {}

            const sessionData = {};
            sessionData.label = 'Session';
            sessionData.type = 'line';
            sessionData.data = [];
            sessionData.fill = false;
            sessionData.tension = 0.5
            sessionData.backgroundColor = CHART_COLORS(3)
            sessionData.borderColor = transparentize(sessionData.backgroundColor, 0.5)

            const earningData = {};
            earningData.label = 'Earning';
            earningData.type = 'line';
            earningData.fill = false;
            earningData.tension = 0.5
            earningData.data = [];
            earningData.backgroundColor = CHART_COLORS(5)
            earningData.borderColor = transparentize(earningData.backgroundColor, 0.5)
            for (let iterator of userList) {
                let label = iterator.stylist.name
                labels.push(label)
                sessionData.data.push(iterator.session)
                earningData.data.push(iterator.earning)

            }
            dataset.push(sessionData)
            dataset.push(earningData)

            finalData.labels = labels;
            finalData.datasets = dataset
            return res.status(200).json({
                status: true, data: finalData,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalEarningByMonthForChart = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        let salonId = null;
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon

            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total_session": "$session",
                "month": "$_id",
                "earning": { $multiply: ["$session", 10] },
                "utilities": { $multiply: [{ $multiply: ["$session", 10] }, 0.05] },
                "total": { '$add': [{ $multiply: ["$session", 10] }, { $multiply: [{ $multiply: ["$session", 10] }, 0.05] }] }
            })

        if (userList.length) {
            const labels = [];
            const dataset = [];
            const finalData = {}

            const sessionData = {};
            sessionData.label = 'Session';
            sessionData.type = 'line';
            sessionData.data = [];
            sessionData.backgroundColor = '#007c6e'
            sessionData.fill = false;
            sessionData.tension = 0.5


            const earningData = {};
            earningData.label = 'Stylist Earnings (in $)';
            earningData.type = 'bar';
            earningData.data = [];
            earningData.borderColor = 'rgb(255, 99, 132)'
            earningData.backgroundColor = 'rgba(255, 51, 102, .6)'


            const utilitiesData = {};
            utilitiesData.label = 'Utilities  (in $)';
            utilitiesData.type = 'bar';
            utilitiesData.data = [];
            utilitiesData.borderColor = 'rgb(255, 99, 132)'
            utilitiesData.backgroundColor = 'rgba(255, 144, 0, .6)'

            const totalData = {};
            totalData.label = 'Earning (in $)';
            totalData.type = 'line';
            totalData.data = [];
            totalData.fill = false;
            totalData.backgroundColor = 'rgb(54, 162, 235)';
            totalData.tension = 0.5;


            for (let iterator of userList) {
                let label = await getMonth(iterator.month)
                labels.push(label)
                sessionData.data.push(iterator.total_session)
                earningData.data.push(iterator.earning)
                utilitiesData.data.push(iterator.utilities)
                totalData.data.push(iterator.total)
            }
            dataset.push(sessionData)
            dataset.push(earningData)
            dataset.push(utilitiesData)
            dataset.push(totalData)

            finalData.labels = labels;
            finalData.datasets = dataset

            return res.status(200).json({
                status: true, data: finalData,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalSalesByMonthForChart = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        let salonId = null;
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year,
                orderStatus: "Completed",
            })

        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon

            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year,
                orderStatus: "Completed",

            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await ProductOrder.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "totalAmount": { "$sum": "$totalAmount" },
            })
            .sort({ '_id': 1 })
            .project({
                "totalAmount": "$totalAmount",
                "month": "$_id",
            })

        if (userList.length) {
            const labels = [];
            const dataset = [];
            const finalData = {}

            const sessionData = {};
            sessionData.label = 'Amount';
            sessionData.data = [];
            sessionData.backgroundColor = CHART_COLORS(3)
            sessionData.borderColor = transparentize(sessionData.backgroundColor, 0.5)


            for (let iterator of userList) {
                let label = await getMonth(iterator.month)
                labels.push(label)
                sessionData.data.push(iterator.totalAmount)
            }
            dataset.push(sessionData)

            finalData.labels = labels;
            finalData.datasets = dataset

            return res.status(200).json({
                status: true, data: finalData,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getGeneralCount = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []

        let queryOldData = {}
        let andListOldData = []

        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        const salon = req.payload._id;
        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id),
                year: year
            })
            andListOldData.push({
                salon: ObjectId(req.payload._id),
                year: year - 1
            })
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {

            andList.push({
                salon: ObjectId(req.payload.salon),
                year: year
            })
            andListOldData.push({
                salon: ObjectId(req.payload.salon),
                year: year - 1
            })
        }
        if (andList.length)
            query.$and = andList;

        if (andListOldData.length)
            queryOldData.$and = andListOldData;

        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$salon",
                "session": { "$sum": "$session" },
            })
            .project({
                "total_session": "$session",
                "earning": { $multiply: ["$session", 10] },
                "utilities": { $multiply: [{ $multiply: ["$session", 10] }, 0.05] },
                "total": { '$add': [{ $multiply: ["$session", 10] }, { $multiply: [{ $multiply: ["$session", 10] }, 0.05] }] }
            })
            .project({
                "total_session": 1,
                "total_earning": '$total',
            })

        if (userList.length) {

            const userListOld = await Session.aggregate()
                .match(queryOldData)
                .group({
                    "_id": "$salon",
                    "session": { "$sum": "$session" },
                })
                .project({
                    "total_session": "$session",
                    "earning": { $multiply: ["$session", 10] },
                    "utilities": { $multiply: [{ $multiply: ["$session", 10] }, 0.05] },
                    "total": { '$add': [{ $multiply: ["$session", 10] }, { $multiply: [{ $multiply: ["$session", 10] }, 0.05] }] }
                })
                .project({
                    "total_session": 1,
                    "total_earning": '$total',
                })
            if (userListOld.length) {
                const stylistCount = await User.find({ role: 'stylist', salon: salon, active: true }).countDocuments();

                return res.status(200).json({
                    status: true, data: {
                        total_session: userList[0].total_session,
                        total_earning: userList[0].total_earning,
                        stylistCount: stylistCount,
                        growth_percentage: userListOld[0].total_session != 0 ? (((userList[0].total_session - userListOld[0].total_session) / userListOld[0].total_session) * 100) : 100
                    },
                    message: 'Data sent successfully'
                })
            } else {
                const stylistCount = await User.find({ role: 'stylist', salon: salon, active: true }).countDocuments();

                return res.status(200).json({
                    status: true, data: {
                        total_session: userList[0].total_session,
                        total_earning: userList[0].total_earning,
                        growth_percentage: 100,
                        stylistCount: stylistCount,


                    },
                    message: 'Data sent successfully'
                })
            }


        } else {
            return res.status(200).json({ status: false, data: {}, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getGeneralCountStylist = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []

        let queryOldData = {}
        let andListOldData = []

        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])
        const stylist = req.payload._id;
        if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year
            })
            andListOldData.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year - 1
            })
        }

        if (andList.length)
            query.$and = andList;

        if (andListOldData.length)
            queryOldData.$and = andListOldData;

        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$stylist",
                "session": { "$sum": "$session" },
            })
            .project({
                "total_session": "$session",
                "earning": { $multiply: ["$session", 10] },
            })
            .project({
                "total_session": 1,
                "total_earning": '$earning',
            })

        if (userList.length) {

            const userListOld = await Session.aggregate()
                .match(queryOldData)
                .group({
                    "_id": "$stylist",
                    "session": { "$sum": "$session" },
                })
                .project({
                    "total_session": "$session",
                    "earning": { $multiply: ["$session", 10] },
                })
                .project({
                    "total_session": 1,
                    "total_earning": '$earning',
                })
            if (userListOld.length) {
                const userCount = await User.find({ role: 'user', stylist: stylist, active: true }).countDocuments();
                return res.status(200).json({
                    status: true, data: {
                        total_session: userList[0].total_session,
                        total_earning: userList[0].total_earning,
                        userCount: userCount,
                        growth_percentage: userListOld[0].total_session != 0 ? (((userList[0].total_session - userListOld[0].total_session) / userListOld[0].total_session) * 100) : 100
                    },
                    message: 'Data sent successfully'
                })
            } else {
                const userCount = await User.find({ role: 'user', stylist: stylist, active: true }).countDocuments();

                return res.status(200).json({
                    status: true, data: {
                        total_session: userList[0].total_session,
                        total_earning: userList[0].total_earning,
                        growth_percentage: 100,
                        userCount: userCount,

                    },
                    message: 'Data sent successfully'
                })
            }


        } else {
            return res.status(200).json({ status: false, data: {}, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalSessionByMonthStylist = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])

        if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total": "$session",
                "month": "$_id",
                _id: 0
            })


        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getTotalSessionByMonthStylistForChart = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])

        if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total": "$session",
                "month": "$_id",
                _id: 0
            })


        if (userList.length) {
            const labels = [];
            const dataset = [];
            const finalData = {}

            const sessionData = {};
            sessionData.label = 'Session';
            sessionData.data = [];
            sessionData.backgroundColor = CHART_COLORS(3)
            sessionData.borderColor = transparentize(sessionData.backgroundColor, 0.5)


            for (let iterator of userList) {
                let label = await getMonth(iterator.month)
                labels.push(label)
                sessionData.data.push(iterator.total)
            }
            dataset.push(sessionData)

            finalData.labels = labels;
            finalData.datasets = dataset
            return res.status(200).json({
                status: true, data: finalData,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getTotalEarningByMonthStylist = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])

        if (req.payload.role === 'stylist') {

            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total_session": "$session",
                "month": "$_id",
                "earning": { $multiply: ["$session", 10] },
            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: userList,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getTotalEarningByMonthStylistForChart = catchAsync(async (req, res, next) => {
    try {

        let query = {}
        let andList = []
        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')
        const year = Number(currentWeek.split(' ')[1])

        if (req.payload.role === 'stylist') {

            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                year: year
            })

        }


        if (andList.length)
            query.$and = andList;
        const userList = await Session.aggregate()
            .match(query)
            .group({
                "_id": "$month",
                "session": { "$sum": "$session" },
            })
            .sort({ '_id': 1 })
            .project({
                "total_session": "$session",
                "month": "$_id",
                "earning": { $multiply: ["$session", 10] },
            })

        if (userList.length) {
            const labels = [];
            const dataset = [];
            const finalData = {}

            const sessionData = {};
            sessionData.label = 'Session';
            sessionData.type = 'line';
            sessionData.data = [];
            sessionData.backgroundColor = '#007c6e'
            sessionData.fill = false;
            sessionData.tension = 0.5


            const earningData = {};
            earningData.label = 'Earnings (in $)';
            earningData.type = 'bar';
            earningData.data = [];
            earningData.borderColor = 'rgb(255, 99, 132)'
            earningData.backgroundColor = 'rgba(255, 51, 102, .6)'


            for (let iterator of userList) {
                let label = await getMonth(iterator.month)
                labels.push(label)
                sessionData.data.push(iterator.total_session)
                earningData.data.push(iterator.earning)
            }
            dataset.push(sessionData)
            dataset.push(earningData)

            finalData.labels = labels;
            finalData.datasets = dataset

            return res.status(200).json({
                status: true, data: finalData,
                message: 'Data sent successfully'
            })

        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});


async function getMonth(month) {
    switch (month) {
        case 1: return 'Jan';
        case 2: return 'Feb';
        case 3: return 'Mar';
        case 4: return 'Apr';
        case 5: return 'May';
        case 6: return 'Jun';
        case 7: return 'Jul';
        case 8: return 'Aug';
        case 9: return 'Sep';
        case 10: return 'Oct';
        case 11: return 'Nov';
        case 12: return 'Dec';
        default: break;
    }
} 