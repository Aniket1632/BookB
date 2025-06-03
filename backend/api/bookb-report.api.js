import AppointmentModel from '../model/appointment.model.js';
import UserModel from '../model/user.model.js';
import ServiceModel from '../model/service.model.js';
import catchAsync from '../config/catchAsync.js';
import moment from 'moment';
import mongoose from 'mongoose';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
moment.suppressDeprecationWarnings = true;
const ObjectId = mongoose.Types.ObjectId;

export const getDashboardCountByDateRange = catchAsync(async (req, res, next) => {
    try {

        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {}, userQuery = {}, servicesQuery = {}, survayQuery = {}, userCountQuery = {}
        let andList = []
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                userCountQuery = { ...userCountQuery, salon: new ObjectId(req.payload._id), role: 'user' }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.payload._id), isMainService: true }
                survayQuery = { ...survayQuery, salon: new ObjectId(req.payload._id), role: 'user' }
                break;
            case 'stylist':
                userCountQuery = { ...userCountQuery, salon: new ObjectId(req.payload.salon), role: 'user' }
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.payload.salon), isMainService: true }
                survayQuery = { ...survayQuery, salon: new ObjectId(req.payload.salon), role: 'user' }
                break;
            case 'admin':
                userCountQuery = { ...userCountQuery, salon: new ObjectId(req.body.salon), role: 'user' }
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.body.salon), isMainService: true }
                survayQuery = { ...survayQuery, salon: new ObjectId(req.body.salon), role: 'user' }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(toDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        userQuery = { ...userCountQuery, createdAt: { $gte: startDate, $lte: endDate } }
        survayQuery = { ...survayQuery, createdAt: { $gte: startDate, $lte: endDate } }
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate }, status: "completed" }
        // QUERY EXECUTIONS
        const userCount = await UserModel.countDocuments(userQuery);
        const appointmentCount = await AppointmentModel.countDocuments(appointmentQuery);
        const serviceCount = await ServiceModel.countDocuments(servicesQuery);

        const userChart = await UserModel.aggregate()
            .match(survayQuery)
            .group({
                _id: "$gender",
                count: { $sum: 1 }
            })
        const appointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .group({
                _id: "$dateAsAString",
                date: { $first: "$dateAsAString" },
                dateAsADate: { $first: "$dateAsADate" },
                count: { $sum: 1 }
            }).sort({ dateAsADate: 1 })
        const sales = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .group({
                _id: null,
                totalSales: { $sum: '$subService.charges' }
            })

        return res.status(200).json({
            status: true, data: {
                appointment: appointmentCount,
                users: userCount,
                services: serviceCount,
                userChart,
                appointmentChart,
                sales
            },
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getDashboardCountByDateRangeV2 = catchAsync(async (req, res, next) => {
    try {


        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {}, userQuery = {}, servicesQuery = {}, survayQuery = {}
        let andList = []
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.payload._id) }
                survayQuery = { ...survayQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.payload.salon) }
                survayQuery = { ...survayQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                servicesQuery = { ...servicesQuery, salon: new ObjectId(req.body.salon) }
                survayQuery = { ...survayQuery, salon: new ObjectId(req.body.salon) }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(toDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        userQuery = { ...appointmentQuery, createdAt: { $gte: startDate, $lte: endDate } }
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS
        const userCount = await UserModel.countDocuments(userQuery);
        const appointmentCount = await AppointmentModel.countDocuments(appointmentQuery);
        const serviceCount = await ServiceModel.countDocuments(servicesQuery);

        const sales = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subService'
            })
            .unwind('$subService')
            .group({
                _id: null,
                totalSales: { $sum: '$subService.charges' }
            })

        return res.status(200).json({
            status: true, data: {
                appointment: appointmentCount,
                users: userCount,
                services: serviceCount,
                sales
            },
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getUserChart = catchAsync(async (req, res, next) => {
    try {
        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {}, survayQuery = {}
        switch (req.payload.role) {
            case 'salon':
                survayQuery = { ...survayQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                survayQuery = { ...survayQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                survayQuery = { ...survayQuery, salon: new ObjectId(req.body.salon) }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        const userChart = await UserModel.aggregate()
            .match(survayQuery)
            .group({
                _id: "$gender",
                count: { $sum: 1 }
            })


        return res.status(200).json({
            status: true, data: {
                userChart,
            },
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAppointmentChart = catchAsync(async (req, res, next) => {
    try {

        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {}, userQuery = {}, servicesQuery = {}, survayQuery = {}
        let andList = []
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(toDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }

        const appointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .group({
                _id: "$dateAsAString",
                date: { $first: "$dateAsAString" },
                dateAsADate: { $first: "$dateAsADate" },
                count: { $sum: 1 }
            }).sort({ dateAsADate: 1 })


        return res.status(200).json({
            status: true, data: {
                appointmentChart,
            },
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getStylistAndHisAppointmentsByDateRange = catchAsync(async (req, res, next) => {
    try {


        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(toDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS

        const stylistAppointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylistData'
            })
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salonData'
            })
            .unwind({ path: '$salonData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$stylistData', preserveNullAndEmptyArrays: true })
            .group({
                _id: "$stylist",
                stylistData: { $first: "$stylistData" },
                salonData: { $first: "$salonData" },
                stylist: { $first: "$stylist" },
                salon: { $first: "$salon" },
                count: { $sum: 1 }
            })
        return res.status(200).json({
            status: true, data: stylistAppointmentChart.map(item => {
                let stylist = null, salon = null;
                if (item.stylistData) {

                    stylist = { _id: item.stylistData._id, name: item.stylistData.name, photo: item.stylistData.photo }
                }
                if (item.salonData) {
                    salon = { _id: item.salonData._id, name: item.salonData.name, photo: item.salonData.photo }
                }

                return {
                    stylist: item.stylist,
                    salon: item.salon,
                    count: item.count,
                    stylistData: stylist,
                    salonData: salon
                }
            }),
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getStylistAndHisAppointmentsByDateRangeV2 = catchAsync(async (req, res, next) => {
    try {


        const { fromDate, toDate } = req.body;
        if (!fromDate || !toDate) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide date range!' })
        }
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(toDate).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS

        const stylistAppointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylistData'
            })
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salonData'
            })
            .unwind({ path: '$salonData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$stylistData', preserveNullAndEmptyArrays: true })
            .group({
                _id: "$stylist",
                stylistData: { $first: "$stylistData" },
                salonData: { $first: "$salonData" },
                stylist: { $first: "$stylist" },
                salon: { $first: "$salon" },
                count: { $sum: 1 }
            })
            .project({
                stylist: 1,
                salon: 1,
                count: 1,
                "stylistData._id": 1,
                "stylistData.name": 1,
                "stylistData.photo": 1,
                "salonData._id": 1,
                "salonData.name": 1,
                "salonData.photo": 1,
                _id: 0
            })
        return res.status(200).json({
            status: true, data: stylistAppointmentChart,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAppointmentsByCurrentMonth = catchAsync(async (req, res, next) => {
    try {
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(new Date().getFullYear(), 0, 1).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(new Date().getFullYear(), 12, 0).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS

        const monthAppointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .group({
                _id: { $month: "$dateAsADate" },
                count: { $sum: 1 }
            })
        return res.status(200).json({
            status: true, data: monthAppointmentChart.map(item => {
                return { ...item, _id: getMonth(item._id) }
            }),
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAppointmentsByCurrentMonthV2 = catchAsync(async (req, res, next) => {
    try {
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date(new Date().getFullYear(), 0, 1).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        const endDate = moment(Math.round(new Date(new Date().getFullYear(), 12, 0).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS

        const monthAppointmentChart = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .group({
                _id: { $month: "$dateAsADate" },
                count: { $sum: 1 }
            })
            .addFields({
                addFields: {
                    _id: {
                        $let: {
                            vars: {
                                monthsInString: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id']
                            }
                        }
                    }
                }
            })
            .project({
                _id: '$addFields._id',
                count: 1
            })
        return res.status(200).json({
            status: true, data: monthAppointmentChart,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getUpcomingAppointments = catchAsync(async (req, res, next) => {
    try {
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset))).toDate();
        // const endDate = moment(Math.round(new Date(new Date().getFullYear(), 12, 0).getTime())).utcOffset(-Number((req.query.offset))).toDate();
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate } }
        // QUERY EXECUTIONS

        const upcomingAppointment = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salonData'
            })
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylistData'
            })
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subServiceData'
            }).lookup({
                from: 'services',
                localField: 'mainService',
                foreignField: '_id',
                as: 'mainServiceData'
            })
            .lookup({
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userData'
            })
            .unwind({ path: '$salonData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$stylistData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$subServiceData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$mainServiceData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$userData', preserveNullAndEmptyArrays: true })
            .project({
                "userData.accessToken": 0,
                "userData.appID": 0,
                "userData.deviceId": 0,
                "userData.deviceInfo": 0,
                "userData.cancel_at_period_end": 0,
                "userData.endTime": 0,
                "userData.intervalTime": 0,
                "userData.isBreakTimeCompulsory": 0,
                "userData.isSpecialApp": 0,
                "userData.lunchEndTime": 0,
                "userData.lunchStartTime": 0,
                "userData.packageName": 0,
                "userData.maxCalendar": 0,
                "userData.passwordChangedAt": 0,
                "userData.platform": 0,
                "userData.recurringType": 0,
                "userData.startTime": 0,
                "userData.stripeCustomerID": 0,
                "userData.stripeSubscriptionID": 0,
                "userData.subscription": 0,
                "userData.userDeviceID": 0,
                "userData.webUrl": 0,
            })
            .sort({ dateAsADate: 1 })

        return res.status(200).json({
            status: true, data: upcomingAppointment,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getCurrentAppointments = catchAsync(async (req, res, next) => {
    try {
        if (req.payload.role == 'admin' && !req.body.salon) {
            return res.status(200).json({ status: false, data: null, message: 'Please provide salon!' })
        }
        let appointmentQuery = {};
        // ADD ROLE FILTER
        switch (req.payload.role) {
            case 'salon':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.payload._id) }
                break;
            case 'stylist':
                appointmentQuery = { ...appointmentQuery, stylist: new ObjectId(req.payload._id) }
                break;
            case 'admin':
                appointmentQuery = { ...appointmentQuery, salon: new ObjectId(req.body.salon), [req.body.stylist ? 'stylist' : undefined]: req.body.stylist ? new ObjectId(req.body.stylist) : undefined }
                break;
            default:
                appointmentQuery = { ...appointmentQuery }
        }
        // ADD DATE RANGE FILTER
        const startDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset))).toDate();
        startDate.setMinutes(0)
        const endDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset))).toDate();
        endDate.setMinutes(0)
        endDate.setHours(endDate.getHours() + 1)
        appointmentQuery = { ...appointmentQuery, dateAsADate: { $gte: startDate, $lte: endDate } }
        // QUERY EXECUTIONS

        const upcomingAppointment = await AppointmentModel.aggregate()
            .match(appointmentQuery)
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salonData'
            })
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylistData'
            })
            .lookup({
                from: 'services',
                localField: 'subService',
                foreignField: '_id',
                as: 'subServiceData'
            })
            .lookup({
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userData'
            })
            .unwind({ path: '$salonData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$stylistData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$subServiceData', preserveNullAndEmptyArrays: true })
            .unwind({ path: '$userData', preserveNullAndEmptyArrays: true })
            .project({
                "userData.accessToken": 0,
                "userData.appID": 0,
                "userData.deviceId": 0,
                "userData.deviceInfo": 0,
                "userData.cancel_at_period_end": 0,
                "userData.endTime": 0,
                "userData.intervalTime": 0,
                "userData.isBreakTimeCompulsory": 0,
                "userData.isSpecialApp": 0,
                "userData.lunchEndTime": 0,
                "userData.lunchStartTime": 0,
                "userData.packageName": 0,
                "userData.maxCalendar": 0,
                "userData.passwordChangedAt": 0,
                "userData.platform": 0,
                "userData.recurringType": 0,
                "userData.startTime": 0,
                "userData.stripeCustomerID": 0,
                "userData.stripeSubscriptionID": 0,
                "userData.subscription": 0,
                "userData.userDeviceID": 0,
                "userData.webUrl": 0,
            })
            .sort({ dateAsADate: 1 })

        return res.status(200).json({
            status: true, data: upcomingAppointment,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getNumberOfSalons = catchAsync(async (req, res, next) => {
    try {

        const salons = await UserModel.countDocuments({ role: 'salon' });
        const stylists = await UserModel.countDocuments({ role: 'stylist' });
        const users = await UserModel.countDocuments({ role: 'user' });
        const appointments = await AppointmentModel.countDocuments({});


        return res.status(200).json({
            status: true, data: {
                salons, stylists, users, appointments
            },
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getNumberOfSalonsChart = catchAsync(async (req, res, next) => {
    try {

        const appointments = await AppointmentModel.aggregate()
            .match({})
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salonData'
            })
            .unwind("$salonData")
            .group({
                _id: "$salon",
                salonData: { $first: "$salonData" },
                appointmentCount: { $sum: 1 }
            })


        return res.status(200).json({
            status: true, data: appointments,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getSubscriptionOfSalons = catchAsync(async (req, res, next) => {
    try {

        const salons = await UserModel.find({ role: 'salon' }, {
            name: 1,
            email: 1,
            phone: 1,
            photo: 1,
            photoDark: 1,
            role: 1,
            subscription: 1
        })


        return res.status(200).json({
            status: true, data: salons,
            message: 'Data fetched successfully'
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
function getMonth(month) {
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