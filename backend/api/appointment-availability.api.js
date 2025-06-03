import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Users from '../model/user.model.js';
import Services from '../model/service.model.js';
import BusinessHour from '../model/businessHour.model.js';
import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import Appointment from '../model/appointment.model.js';
import AppointmentEvent from '../event/appointment.event.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
moment.suppressDeprecationWarnings = true;
export const createAvailability = catchAsync(async (req, res, next) => {
    try {

        let salon = null;

        if (req.payload.role === 'stylist') {
            salon = req.payload.salon

            if (!req.body.id) {

                const timeArray = [];
                for (const iteratorTime of req.body.timeArray) {
                    let entTimeWithFormat = await timeConvertTo12Hr(iteratorTime);

                    let timeObject = {};
                    timeObject.timeAsADate = iteratorTime
                    timeObject.timeAsAString = entTimeWithFormat
                    timeArray.push(timeObject)
                }
                for (const iterator of req.body.dateArray) {
                    const appointmentData = await AppointmentAvailability.findOne({ stylist: req.payload._id, salon: salon, dateAsAString: iterator })
                    if (!appointmentData) {
                        let appointment = {};
                        appointment.salon = salon;
                        appointment.stylist = req.payload._id;
                        appointment.dateAsADate = iterator;
                        let entryDate = moment(Math.round(new Date(iterator).getTime())).utcOffset(-Number((req.query.offset)));
                        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
                        appointment.dateAsAString = entryDateWithFormat;
                        appointment.isAvailable = true;
                        let currentDate = moment(Math.round(new Date(iterator).getTime())).utcOffset(-Number((req.query.offset)))
                        let currentWeek = moment(currentDate).format('WW GGGG')
                        let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                        let month = moment(currentDate).format('MM')
                        let date = moment(currentDate).format('DD')

                        appointment.week = currentWeek.split(' ')[0];
                        appointment.year = currentWeek.split(' ')[1]
                        appointment.weekDay = weekDay
                        appointment.date = date
                        appointment.month = month
                        appointment.timeData = timeArray
                        appointment.offset = req.query.offset

                        await AppointmentAvailability.create(appointment)
                    }
                }
                return res.status(200).json({
                    status: true,
                    message: 'Dates slot has been unblocked'
                })

            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Update functionality is missing'
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'This functionality only available to the stylist'
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllAvailabilityBySalon = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'name': { $regex: req.query.filterValue, $options: "i" } },
                { 'address': { $regex: req.query.filterValue, $options: "i" } },
                { 'phone': { $regex: req.query.filterValue, $options: "i" } },
                { 'email': { $regex: req.query.filterValue, $options: "i" } },
                { 'name': req.query.filterValue },
                { 'address': req.query.filterValue },
                { 'phone': req.query.filterValue },
                { 'email': req.query.filterValue }
            ]
        }
        let salon = null;
        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id)
            })
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            andList.push({
                salon: ObjectId(req.payload.salon)
            })
        }
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await AppointmentAvailability.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
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
export const getAllAvailabilityByStylist = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'name': { $regex: req.query.filterValue, $options: "i" } },
                { 'address': { $regex: req.query.filterValue, $options: "i" } },
                { 'phone': { $regex: req.query.filterValue, $options: "i" } },
                { 'email': { $regex: req.query.filterValue, $options: "i" } },
                { 'name': req.query.filterValue },
                { 'address': req.query.filterValue },
                { 'phone': req.query.filterValue },
                { 'email': req.query.filterValue }

            ]
        }
        let stylist = null;
        if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id)
            })
        }



        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await AppointmentAvailability.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
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
export const deleteAvailability = catchAsync(async (req, res, next) => {
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
            await AppointmentAvailability.deleteOne({ _id: req.query.id });

            return res.status(200).json({
                status: true,
                message: 'Appointment slot has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Appointment slot Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllAvailabilityByStylistForMobile = catchAsync(async (req, res, next) => {
    try {
        let query = {}

        let stylist = null;

        const timeData = await AppointmentAvailability.findOne({
            stylist: req.payload.stylist,
            dateAsAString: req.query.date
        })


        if (timeData) {
            if (timeData.timeData.length) {
                const userObject = await Users.findOne({ _id: req.payload.stylist, active: true })

                if (userObject) {
                    if (userObject.services.length) {
                        const services = await Services.aggregate()
                            .match({
                                "_id": { "$in": userObject.services },
                            })
                            .lookup({
                                from: 'services',
                                localField: 'service',
                                foreignField: '_id',
                                as: 'service'
                            })
                            .unwind('$service')
                            .group({
                                _id: '$service._id',
                                service: { $first: "$service" },
                                subService: { $push: "$$ROOT" },
                            })
                        return res.status(200).json({
                            status: true, data: {
                                services: services,
                                timeData: timeData.timeData,
                            },
                            message: 'Data sent successfully'
                        })
                    } else {
                        return res.status(200).json({ status: false, data: null, message: 'Please update your stylist' })

                    }

                } else {
                    return res.status(200).json({ status: false, data: null, message: 'User not present' })

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
export const createAvailabilityDaily = catchAsync(async (req, res, next) => {
    try {
        let salon = '', stylist = '';
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id
        } else {
            salon = req.payload.salon
            stylist = req.payload._id
        }

        let entTimeWithFormat = await timeConvertTo12Hr(req.body.time);
        let entryDate = moment(Math.round(new Date(req.body.date).getTime())).utcOffset(-Number((req.query.offset)));
        let entryDateWithFormat = moment(entryDate).format('MM/DD/YYYY');
        let currentDate = moment(Math.round(new Date(req.body.date).getTime())).utcOffset(-Number((req.query.offset)))
        let currentWeek = moment(currentDate).format('WW GGGG')
        let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
        let month = moment(currentDate).format('MM');
        let date = moment(currentDate).format('DD');
        // const appointmentData = await AppointmentAvailability.findOne({ stylist: ObjectId(stylist), salon: ObjectId(salon), dateAsAString: entryDateWithFormat })

        if (req.body.slotId) {
            const updateAppointmentAvailability = await AppointmentAvailability.updateOne({
                _id: ObjectId(req.body.slotId),
                timeData: { $exists: true }
            }, {
                $set: {
                    dateAsADate: new Date(entryDateWithFormat),
                    dateAsAString: entryDateWithFormat,
                    week: currentWeek.split(' ')[0],
                    year: currentWeek.split(' ')[1],
                    weekDay: weekDay,
                    date: date,
                    month: month,
                    offset: req.query.offset,
                    timeData: {
                        _id: req.body.timeData.id,
                        timeAsADate: req.body.time,
                        timeAsAString: entTimeWithFormat
                    }
                }
            })

            if (req.body.appointmentList && req.body.appointmentList.length > 0) {
                for (const item of req.body.appointmentList) {
                    const updateAppointment = await Appointment.updateMany({
                        _id: ObjectId(item)
                    }, {
                        $set: {
                            dateAsADate: new Date(entryDateWithFormat),
                            dateAsAString: entryDateWithFormat,
                            week: currentWeek.split(' ')[0],
                            year: currentWeek.split(' ')[1],
                            weekDay: weekDay,
                            date: date,
                            month: month,
                            offset: req.query.offset,
                            timeAsADate: req.body.time,
                            timeAsAString: entTimeWithFormat
                        }
                    })
                }
            }

            return res.status(200).json({
                status: true,
                message: entryDateWithFormat + ' ' + entTimeWithFormat + ' has been unblocked'
            })
        } else {
            const timeArray = [];
            let timeObject = {};
            timeObject.timeAsADate = req.body.time
            timeObject.timeAsAString = entTimeWithFormat
            timeArray.push(timeObject)
            let appointment = {};
            appointment.salon = salon;
            appointment.stylist = stylist;
            appointment.dateAsADate = req.body.date;
            appointment.dateAsAString = entryDateWithFormat;
            appointment.isAvailable = true;
            appointment.week = currentWeek.split(' ')[0];
            appointment.year = currentWeek.split(' ')[1]
            appointment.weekDay = weekDay
            appointment.date = date
            appointment.month = month
            appointment.timeData = timeArray
            appointment.offset = req.query.offset
            await AppointmentAvailability.create(appointment);
            return res.status(200).json({
                status: true,
                message: entryDateWithFormat + ' ' + entTimeWithFormat + ' has been unblocked'

            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const getBusinessHours = catchAsync(async (req, res, next) => {
    try {

        let salon = '', stylist = '';
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id
        } else {
            salon = req.payload.salon
            stylist = req.payload._id
        }

        let businessHourData = await BusinessHour.findOne({
            salon: salon,
            stylist: stylist
        }).populate('stylist', '_id name email phone role recurringType');

        return res.status(200).json({
            status: true,
            data: businessHourData
        });

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

// export const createAvailabilityBulk = catchAsync(async (req, res, next) => {
//     try {
//         // console.log(moment().tz("America/Denver").utcOffset());
//         // req.query.offset = moment().tz("America/Denver").utcOffset();
//         let salon = '', stylist = '', recurringType = 'month';
//         if (req.payload.role === 'salon') {
//             stylist = req.query.stylistId
//             salon = req.payload._id
//         } else {
//             salon = req.payload.salon
//             stylist = req.payload._id
//         }
//         const settings = await Users.findOne(
//             { _id: stylist, active: true, role: 'stylist' },
//             {
//                 '_id': 1,
//                 'recurringType': 1,
//                 'intervalTime': 1,
//                 'makePublic': 1,
//                 'startTime': 1,
//                 'endTime': 1,
//                 'services': 1,
//                 'salon': 1,
//                 'isBreakTimeCompulsory': 1
//             }).populate('services')

//         const startBreakTime = new Date();
//         startBreakTime.setHours(settings.startTime.split(':')[0])
//         startBreakTime.setMinutes(settings.startTime.split(':')[1])
//         const endBreakTime = new Date();
//         endBreakTime.setHours(settings.endTime.split(':')[0])
//         endBreakTime.setMinutes(settings.endTime.split(':')[1])
//         if (!req.body.recurringType) {
//             if (settings.recurringType) { recurringType = settings.recurringType } else recurringType = req.body.recurringType;;
//         } else {
//             recurringType = req.body.recurringType;
//         }

//         const start = moment(Math.round(new Date().getTime())).utcOffset(Number((req.query.offset)));
//         const entryDate = moment(Math.round(new Date().getTime())).subtract(1, 'days').utcOffset(Number((req.query.offset)));
//         const end = moment(Math.round(new Date().getTime())).endOf(recurringType)
//         var dates = [];
//         while (start.isSameOrBefore(end)) {
//             const currentDate = start.format('MM/DD/YYYY');
//             dates.push({ date: currentDate, day: moment(currentDate).format('ddd') });
//             start.add(1, 'days');
//         }
//         const slots = req.body.slots.filter(item => item.slot.length);
//         const appointmetsToAdd = [];

//         if (!req.body.id) {
//             const creatHours = await BusinessHour.create({
//                 slots: req.body.slots,
//                 salon: salon,
//                 stylist: stylist
//             })
//         } else {
//             const deleteData = await AppointmentAvailability.deleteMany({
//                 isBusinessHour: true,
//                 appointmentList: {
//                     $eq: []
//                 },
//                 dateAsADate: {
//                     $gte: new Date(entryDate)
//                 },
//                 salon: ObjectId(salon),
//                 stylist: ObjectId(stylist)
//             });
//             if (deleteData.deletedCount>0) {
//                 const updateObj = await BusinessHour.updateOne({
//                     _id: ObjectId(req.body.id)
//                 },
//                     {
//                         $set: {
//                             slots: req.body.slots
//                         }
//                     });
//             }
//         }
//         AppointmentEvent.emit('create-availability-bulk', {
//             slots, dates, offset: req.query.offset, startBreakTime, endBreakTime, settings, salon, stylist
//         })

//         // const result = await AppointmentAvailability.insertMany(appointmetsToAdd)
//         return res.status(200).json({
//             status: true,
//             message: 'Date has been unblocked for the current ' + recurringType
//         });

//     } catch (ed) {
//         return res.status(200).json({
//             status: false,
//             message: ed.message
//         });
//     }
// });


export const createAvailabilityBulk = catchAsync(async (req, res, next) => {
    try {
        // console.log(moment().tz("America/Denver").utcOffset());
        // req.query.offset = moment().tz("America/Denver").utcOffset();
        let salon = '', stylist = '', recurringType = 'month', start, end, entryDate
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id
        } else {
            salon = req.payload.salon
            stylist = req.payload._id
        }


        const settings = await Users.findOne(
            { _id: stylist, active: true, role: 'stylist' },
            {
                '_id': 1,
                'recurringType': 1,
                'intervalTime': 1,
                'makePublic': 1,
                'startTime': 1,
                'endTime': 1,
                'services': 1,
                'salon': 1,
                'isBreakTimeCompulsory': 1
            }).populate('services')

        const startBreakTime = new Date();
        startBreakTime.setHours(settings.startTime.split(':')[0])
        startBreakTime.setMinutes(settings.startTime.split(':')[1])
        const endBreakTime = new Date();
        endBreakTime.setHours(settings.endTime.split(':')[0])
        endBreakTime.setMinutes(settings.endTime.split(':')[1])
        if (!req.body.recurringType) {
            if (settings.recurringType) { recurringType = settings.recurringType } else recurringType = req.body.recurringType;;
        } else {
            recurringType = req.body.recurringType;
        }
        

        if (recurringType != 'custom') {

            start = moment(Math.round(new Date().getTime())).utcOffset(Number((req.query.offset)));
            entryDate = moment(Math.round(new Date().getTime())).subtract(1, 'days').utcOffset(Number((req.query.offset)));
            end = moment(Math.round(new Date().getTime())).endOf(recurringType)

        }
        else {
            if (!req.body.customStartDate || !req.body.customEndDate) {
                return res.status(400).json({ message: 'Please provide both start and end date.', status: false });
            }
        
            const customStartDate = req.body.customStartDate;
            const customEndDate = req.body.customEndDate;
        
            if (!moment(customStartDate, 'YYYY-MM-DD', true).isValid() || !moment(customEndDate, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Invalid date format. Please provide dates in YYYY-MM-DD format.', status: false });
            }
        
            // start = moment(customStartDate).utcOffset(Number(req.query.offset));
            // end = moment(customEndDate).utcOffset(Number(req.query.offset));
            // entryDate = moment(customStartDate).subtract(1, 'days').utcOffset(Number(req.query.offset));
            start = moment(customStartDate).set({ hour: 12, minute: 0 }).utcOffset(Number(req.query.offset));
end = moment(customEndDate).set({ hour: 12, minute: 0 }).utcOffset(Number(req.query.offset));
entryDate = moment(customStartDate).set({ hour: 12, minute: 0 }).subtract(1, 'days').utcOffset(Number(req.query.offset));
        
            const duration = moment.duration(end.diff(start)).asDays();
        
            if (duration > 365) {
                return res.status(400).json({ message: 'The date range should not be more than 365 days.', status: false });
            }
        
            if (duration < 0) {
                return res.status(400).json({ message: 'End date must be after the start date.', status: false });
            }
        
        }
        
        var dates = [];
        while (start.isSameOrBefore(end)) {
            const currentDate = start.format('MM/DD/YYYY');
            dates.push({ date: currentDate, day: moment(currentDate).format('ddd') });
            start.add(1, 'days');
        }
        const slots = req.body.slots.filter(item => item.slot.length);
        const appointmetsToAdd = [];

        if (!req.body.id) {
            const creatHours = await BusinessHour.create({
                slots: req.body.slots,
                salon: salon,
                stylist: stylist
            })
        } else {
            const deleteData = await AppointmentAvailability.deleteMany({
                isBusinessHour: true,
                appointmentList: {
                    $eq: []
                },
                dateAsADate: {
                    $gte: new Date(entryDate)
                },
                salon: ObjectId(salon),
                stylist: ObjectId(stylist)
            });
            if (deleteData.deletedCount > 0) {
                const updateObj = await BusinessHour.updateOne({
                    _id: ObjectId(req.body.id)
                },
                    {
                        $set: {
                            slots: req.body.slots
                        }
                    });
            }
        }
        AppointmentEvent.emit('create-availability-bulk', {
            slots, dates, offset: req.query.offset, startBreakTime, endBreakTime, settings, salon, stylist
        })
        let msg=recurringType=='custom'?`Date has been unblocked for the ${recurringType} dates.`:`Date has been unblocked for the current ${recurringType}.`
        // const result = await AppointmentAvailability.insertMany(appointmetsToAdd)
        return res.status(200).json({
            status: true,
            message: msg
        });

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const createAvailabilityForDay = catchAsync(async (req, res, next) => {
    try {

        let salon = '', stylist = '';
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id
        } else {
            salon = req.payload.salon
            stylist = req.payload._id
        }

        const dataPresentForTheDate = await AppointmentAvailability.findOne({
            salon: salon,
            stylist: stylist,
            dateAsADate: req.body.date
        })
        if (!dataPresentForTheDate) {
            let appointment = {};
            appointment.salon = salon;
            appointment.stylist = stylist;
            appointment.dateAsADate = new Date(req.body.date);
            appointment.dateAsAString = req.body.date;
            appointment.isAvailable = true;
            let currentDate = moment(Math.round(new Date(req.body.date).getTime())).utcOffset(-Number((req.query.offset)))
            let currentWeek = moment(currentDate).format('WW GGGG')
            let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
            let month = moment(currentDate).format('MM')
            let date = moment(currentDate).format('DD')

            appointment.week = currentWeek.split(' ')[0];
            appointment.year = currentWeek.split(' ')[1]
            appointment.weekDay = weekDay
            appointment.date = date
            appointment.month = month
            appointment.offset = req.query.offset

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
                const appointmentData = await getAppointmentByDateAndTime(iteratorTime.timeAsADate, req.body.date, salon, stylist)
                if (appointmentData) {
                    iteratorTime.isAvailable = false
                }

            }
            await AppointmentAvailability.create(appointment)

            return res.status(200).json({
                status: false,
                message: 'Date has been unblocked'
            });
        } else {
            return res.status(200).json({
                status: false,
                message: `${req.body.date} is already unlocked`
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const getAvailableListByDateRange = catchAsync(async (req, res, next) => {
    try {
        const { stylistId, fromDate, toDate, salon } = req.body
        const utcDate = moment();
        let utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        const entryDate = moment(Math.round(new Date(req.body.fromDate).getTime())).utcOffset(-Number((req.query.offset)));
        const endDate = moment(Math.round(new Date(req.body.toDate).getTime())).utcOffset(-Number((req.query.offset)));

        const dataPresentForTheDate = await AppointmentAvailability.aggregate()
            .match(
                {
                    // dateAsADate: { $gte: entryDate, $lte: endDate },
                    isAvailable: true,
                    stylist: ObjectId(stylistId)
                })
            .lookup({
                from: 'appointments',
                localField: 'appointmentId',
                foreignField: '_id',
                as: 'appointmentDetail'
            })
            .unwind('$appointmentDetail')
            // .lookup({
            //     from: 'appointments',
            //     localField: 'appointmentList',
            //     foreignField: '_id',
            //     as: 'appointmentList'
            // })
            // .unwind('$appointmentList')
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.stylist',
                foreignField: '_id',
                as: 'stylistDetail'
            })
            .unwind('$stylistDetail')
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.user',
                foreignField: '_id',
                as: 'userDetail'
            })
            .unwind('$userDetail')
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.mainService',
                foreignField: '_id',
                as: 'mainServiceDetail'
            })
            .unwind('$mainServiceDetail')
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.subService',
                foreignField: '_id',
                as: 'subServiceDetail'
            })
            .unwind('$subServiceDetail')
            .group({
                _id: '$appointmentDetail.availability',
                records: { $push: "$$ROOT" }
            })
            .project({
                availability: { $first: "$records._id" },
                slots: { $first: "$records.timeData" },
                slot: { $first: "$records.appointmentDetail.timeAsADate" },
                slotString: { $first: "$records.appointmentDetail.timeAsAString" },
                stylistConfirmationStatus: { $first: "$records.appointmentDetail.stylistConfirmationStatus" },
                start: { $first: "$records.appointmentDetail.dateAsADate" },
                start_date: { $first: "$records.appointmentDetail.dateAsAString" },
                appointmentDetail: { $first: "$records.appointmentDetail" },
                // mainService: { $first: "$records.mainServiceDetail" },
                // subService: { $first: "$records.subServiceDetail" },
                userList: '$records',
                appointmentList: { $first: '$records.appointmentList' },
            });



        const emptyAppoinmentIdList = await AppointmentAvailability.find({
            stylist: stylistId,
            dateAsADate: { $gte: entryDate, $lte: endDate },
            isAvailable: true,
            appointmentId: { //availability
                "$exists": false,
            }
        });

        for (let item of emptyAppoinmentIdList) {
            dataPresentForTheDate.push({
                availability: item._id,
                slots: item.timeData,
                slotString: item.timeAsAString,
                stylistConfirmationStatus: item.stylistConfirmationStatus ? true : false,
                start: item.dateAsADate,
                start_date: item.dateAsAString,
                appointmentDetail: item,
                isAvailable: item.isAvailable
            })
        }



        return res.status(200).json({
            status: true,
            result: dataPresentForTheDate
        });

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAvailableListByDateRangeV2 = catchAsync(async (req, res, next) => {
    try {
        const { stylistId, fromDate, toDate, salon } = req.body
        // const entryDate = moment(Math.round(new Date(fromDate).getTime()));
        // const endDate = moment(Math.round(new Date(toDate).getTime()));
        const entryDate = new Date(fromDate)
        const endDate = new Date(toDate)

        const dataPresentForTheDate = await AppointmentAvailability.aggregate()
            .match(
                {
                    isAvailable: true,
                    dateAsADate: { $gte: entryDate, $lte: endDate },
                    stylist: ObjectId(stylistId)
                })
            .lookup({
                from: 'appointments',
                localField: 'appointmentId',
                foreignField: '_id',
                as: 'appointmentDetail'
            })
            .unwind({ path: "$appointmentDetail", preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.stylist',
                foreignField: '_id',
                as: 'stylistDetail'
            })
            .unwind({ path: "$stylistDetail", preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.user',
                foreignField: '_id',
                as: 'userDetail'
            })
            .unwind({ path: "$userDetail", preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.mainService',
                foreignField: '_id',
                as: 'mainServiceDetail'
            })
            .unwind({ path: "$mainServiceDetail", preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.subService',
                foreignField: '_id',
                as: 'subServiceDetail'
            })
            .unwind({ path: "$subServiceDetail", preserveNullAndEmptyArrays: true })
            .group({
                _id: '$appointmentDetail.availability',
                records: { $push: "$$ROOT" }
            })
            .project({
                availability: { $first: "$records._id" },
                slots: { $first: "$records.timeData" },
                slot: { $first: "$records.appointmentDetail.timeAsADate" },
                slotString: { $first: "$records.appointmentDetail.timeAsAString" },
                stylistConfirmationStatus: { $first: "$records.appointmentDetail.stylistConfirmationStatus" },
                start: { $first: "$records.appointmentDetail.dateAsADate" },
                start_date: { $first: "$records.appointmentDetail.dateAsAString" },
                appointmentDetail: { $first: "$records.appointmentDetail" },
                userList: '$records',
                appointmentList: { $first: '$records.appointmentList' },
            });

        const emptyAppointmentIdList = await AppointmentAvailability.find({
            stylist: stylistId,
            dateAsADate: { $gte: entryDate, $lte: endDate },
            isAvailable: true,
            appointmentId: { //availability
                "$exists": false,
            }
        });

        for (let item of emptyAppointmentIdList) {
            dataPresentForTheDate.push({
                availability: item._id,
                slots: item.timeData,
                slotString: item.timeAsAString,
                stylistConfirmationStatus: item.stylistConfirmationStatus ? true : false,
                start: item.dateAsADate,
                start_date: item.dateAsAString,
                appointmentDetail: item,
                isAvailable: item.isAvailable
            })
        }
        return res.status(200).json({
            status: true,
            result: dataPresentForTheDate
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getActivityListByDate = catchAsync(async (req, res, next) => {
    try {
        const { stylistId, fromDate } = req.body
        // const utcDate = moment();
        // const utcDateWithFormat = moment(utcDate).format('MM/DD/YYYY');
        const entryDate = moment(Math.round(new Date(fromDate).getTime())).utcOffset(-Number((req.query.offset)));
        const endDate = moment(Math.round(new Date(fromDate).getTime())).add(1, 'days').utcOffset(-Number((req.query.offset)));
        const stylistData = await Users.findOne({ _id: ObjectId(stylistId), role: 'stylist' },
            {
                '_id': 1,
                'photo': 1,
                'name': 1,
                'email': 1,
                'phone': 1,
                'services': 1,
                'intervalTime': 1,
                'startTime': 1,
                'endTime': 1
            }).populate('services');

        const query = {
            'appointmentDetail.dateAsADate': {
                $gte: new Date(entryDate),
                $lte: new Date(endDate)
            },
            // isAvailable: true,
            stylist: ObjectId(stylistId)
        };
        const dataPresentForTheDate = await AppointmentAvailability.aggregate()
            .lookup({
                from: 'appointments',
                localField: 'appointmentId',
                foreignField: '_id',
                pipeline: [{ "$match": { "dateAsADate": { $gte: new Date(entryDate), $lte: new Date(endDate) } } }],
                as: 'appointmentDetail'
            })
            .unwind('$appointmentDetail')
            .match(query)
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.stylist',
                foreignField: '_id',
                as: 'stylistDetail'
            })
            .unwind('$stylistDetail')
            .lookup({
                from: 'users',
                localField: 'appointmentDetail.user',
                foreignField: '_id',
                as: 'userDetail'
            })
            .unwind('$userDetail')
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.mainService',
                foreignField: '_id',
                as: 'mainServiceDetail'
            })
            .unwind('$mainServiceDetail')
            .lookup({
                from: 'services',
                localField: 'appointmentDetail.subService',
                foreignField: '_id',
                as: 'subServiceDetail'
            })
            .unwind('$subServiceDetail')
            .group({
                _id: '$appointmentDetail.availability',
                records: { $push: "$$ROOT" }
            })
            .project({
                availability: { $first: "$records._id" },
                slots: { $first: "$records.timeData" },
                slot: { $first: "$records.appointmentDetail.timeAsADate" },
                slotString: { $first: "$records.appointmentDetail.timeAsAString" },
                stylistConfirmationStatus: { $first: "$records.appointmentDetail.stylistConfirmationStatus" },
                start: { $first: "$records.appointmentDetail.dateAsADate" },
                start_date: { $first: "$records.appointmentDetail.dateAsAString" },
                appointmentDetail: { $first: "$records.appointmentDetail" },
                userList: '$records',
                appointmentList: { $first: '$records.appointmentList' },
            });

        return res.status(200).json({
            status: true,
            result: {
                appointments: dataPresentForTheDate,
                stylistData: stylistData
            }
        });

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const getAppointmentsWithBlockUnblockStatusByDate = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []


        const entryDate = moment(Math.round(new Date(req.query.date).getTime())).utcOffset(-Number((req.query.offset)));
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
        toDate.setHours(23, 59, 59, 0);
        let salon = '', stylist = '';
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id

        } else {
            salon = req.payload.salon
            stylist = req.payload._id

        }
        andList.push({
            stylist: ObjectId(stylist),
            dateAsADate: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            },
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await AppointmentAvailability.aggregate()
            .match(query)
            .sort({ createdAt: -1 })
        if (userList.length) {
            if (userList[0].timeData.length) {
                for (const iterator of userList[0].timeData) {
                    const appointmentData = await getAppointmentByDateAndTime(iterator.timeAsADate, req.query.date, salon, stylist)
                    if (appointmentData) {
                        iterator.appointment = appointmentData
                    }

                }
                return res.status(200).json({
                    status: true, data: userList[0],
                    message: 'Data sent successfully'
                })
            } else {
                return res.status(200).json({ status: false, message: `${req.query.date} is blocked.` })

            }
        } else {
            return res.status(200).json({ status: false, message: `${req.query.date} is blocked.` })

        }

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const blockAvailability = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            date: Joi.string().required(),
        });
        const { error, value } = schema.validate({ date: req.query.date }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let salon = '', stylist = '';
        if (req.payload.role === 'salon') {
            stylist = req.query.stylistId
            salon = req.payload._id

        } else {
            salon = req.payload.salon
            stylist = req.payload._id

        }
        if (req.query.date) {
            const result = await AppointmentAvailability.deleteOne({ dateAsAString: req.query.date, stylist: stylist, salon: salon });

            return res.status(200).json({
                status: true,
                message: `${req.query.date} has been blocked`,
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Slot Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const getAllActivityByUser = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'name': { $regex: req.query.filterValue, $options: "i" } },
                { 'address': { $regex: req.query.filterValue, $options: "i" } },
                { 'phone': { $regex: req.query.filterValue, $options: "i" } },
                { 'email': { $regex: req.query.filterValue, $options: "i" } },
                { 'name': req.query.filterValue },
                { 'address': req.query.filterValue },
                { 'phone': req.query.filterValue },
                { 'email': req.query.filterValue }
            ]
        }

        andList.push({
            user: ObjectId(req.payload._id),
            salon: ObjectId(req.payload.salon)
        });

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Appointment.aggregate()
            .match(query)
            .sort({ dateAsADate: -1 })
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
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
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
                    status: true,
                    data: {
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

//LOCAL FUNCTION
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

async function getTimeStops(start, end, gap) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
    }

    var timeStops = [];

    while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format('HH:mm'));
        startTime.add(gap, 'minutes');
    }
    return timeStops;
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
    let checkDate = [date]
    if (date.includes('-')) {
        checkDate.push(date.replace(/\-/g, '/'))
    } else {
        checkDate.push(date.replace(/\//g, '-'))
    }
    const appointment = await Appointment.findOne({ dateAsAString: { $in: checkDate }, timeAsADate: time, stylist: stylist, salon: salon })
    return appointment;
}

async function getUpdatedTime(time, duration) {
    return Number(moment(time, 'HH:mm').add(duration, 'minutes').format('HH:mm').split(':').join(''))
}