import Service from '../model/service.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import User from '../model/user.model.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;


export const createService = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),

        });
        const { error, value } = schema.validate({ title: req.body.title }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }

        let field = req.body;
        let sliderObject = {};
        sliderObject.title = field.title;
        sliderObject.salon = salonId;
        sliderObject.isMainService = field.isMainService;

        if (!field.isMainService) {
            sliderObject.description = field.description;
            sliderObject.charges = field.charges;
            sliderObject.service = field.service;
            sliderObject.requiredTime = field.requiredTime;
            sliderObject.leadTime = field.leadTime;
            sliderObject.breakTime = field.breakTime;
            const rank = await Service.find({ isMainService: field.isMainService, service: field.service }).countDocuments();
            sliderObject.rank = rank;
        } else {
            const rank = await Service.find({ isMainService: field.isMainService }).countDocuments();
            sliderObject.rank = rank;
        }
        if (req.body.id) {
            await Service.updateOne({ _id: req.body.id }, {
                $set: sliderObject
            })
            return res.json({
                status: true,
                message: 'Service has been updated.',
            });
        } else {
            await Service.create(sliderObject)
            return res.json({
                status: true,
                message: 'Service has been created.',
            });
        }



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllServices = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
                { 'description': { $regex: req.query.filterValue, $options: "i" } },
                { 'description': req.query.filterValue },
            ]
        }
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        andList.push({
            salon: ObjectId(salonId),
            isMainService: true
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Service.aggregate()
            .match(query)
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
export const getAllSubServices = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []

        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
            ]
        }
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        if (req.query.id) {
            andList.push({
                salon: ObjectId(salonId),
                isMainService: false,
                service: ObjectId(req.query.id),

            })
        } else {
            andList.push({
                salon: ObjectId(salonId),
                isMainService: false

            })
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Service.aggregate()
            .match(query)
            .sort({ createdAt: -1 })
            .lookup({
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'service'
            })
            .unwind('$service')
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })

        if (userList.length) {
            if (userList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: userList[0].records,
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
export const getAllEnableServices = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        result = await Service.find({ salon: salonId, enable: true, isMainService: (req.query.isMainService === 'true' ? true : false) });

        if (result.length) {
            return res.json({
                status: true,
                data: result,
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
                data: null,
                message: 'Data not present.',
            });
        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const deleteService = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            serviceId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ serviceId: req.query.serviceId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.serviceId) {
            await Service.deleteOne({ _id: req.query.serviceId });

            return res.status(200).json({
                status: true,
                message: 'Service has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Service Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfService = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            serviceId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ serviceId: req.query.serviceId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await Service.updateOne({
            _id: req.query.serviceId
        }, {
            $set: {
                'enable': field.enable
            }
        })
        return res.json({
            status: true,
            message: 'Record has been updated as ' + (field.enable === true ? 'enabled' : 'disabled'),
        });



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllEnableMainServices = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        result = await Service.find({ salon: salonId, enable: true, isMainService: true });

        if (result.length) {
            return res.json({
                status: true,
                data: result,
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
                data: null,
                message: 'Data not present.',
            });
        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const getAllEnableSubServices = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []

        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
                { 'description': { $regex: req.query.filterValue, $options: "i" } },
                { 'description': req.query.filterValue },
            ]
        }
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        if (req.query.id) {
            andList.push({
                salon: ObjectId(salonId),
                isMainService: false,

            })
        } else {
            andList.push({
                salon: ObjectId(salonId),
                isMainService: false

            })
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Service.aggregate()
            .match(query)
            .sort({ createdAt: -1 })
            .lookup({
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'service'
            })
            .unwind('$service')
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })

        if (userList.length) {
            if (userList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: userList[0].records,
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
export const getAllServicesGroupByCategory = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []

        if (req.query.filterValue) {
            orList = [
                { 'category.title': { $regex: req.query.filterValue, $options: "i" } },
                { 'category.title': req.query.filterValue },
                { 'subService.title': { $regex: req.query.filterValue, $options: "i" } },
                { 'subService.title': req.query.filterValue },
            ]
        }
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        andList.push({
            salon: ObjectId(salonId),
        })
        const filter = {}
        if (orList.length) {
            filter.$or = orList
        }
        if (andList.length)
            query.$and = andList;

        const userList = await Service.aggregate()
            .match(query)
            .lookup({
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'mainService'
            })
            .unwind(
                "$mainService",
            )
            .group({
                _id: '$mainService._id',
                category: { $first: '$mainService' },
                subService: { $push: "$$ROOT" },
            })
            .match(filter)
            .sort({
                "category.rank": 1
            })
        if (userList.length) {
            return res.status(200).json({
                status: true, data: {
                    result: userList
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


export const getAllwebsiteServicesGroupByCategory = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = [];
        let salonId = '';
        const user = await User.findOne({ name: req.query.name, active: true });
        if (user) {
            salonId = user._id

            if (req.query.filterValue) {
                orList = [
                    { 'title': { $regex: req.query.filterValue, $options: "i" } },
                    { 'title': req.query.filterValue },
                ]
            }
            andList.push({
                salon: ObjectId(salonId),
            })
            if (orList.length)
                query.$or = orList;
            if (andList.length)
                query.$and = andList;
            const userList = await Service.aggregate()
                .match(query)
                .lookup({
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'mainService'
                })
                .unwind(
                    "$mainService",
                )
                .group({
                    _id: '$mainService._id',
                    category: { $first: '$mainService' },
                    subService: { $push: "$$ROOT" },
                })
                .sort({
                    "mainService.rank": 1
                })

            if (userList.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: userList
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
export const getAllwebsiteServicesGroupByCategorySalon = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = [];
        const salonId = req.query.salon

        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
            ]
        }
        andList.push({
            salon: ObjectId(salonId),
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Service.aggregate()
            .match(query)
            .lookup({
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'mainService'
            })
            .unwind(
                "$mainService",
            )
            .group({
                _id: '$mainService._id',
                category: { $first: '$mainService' },
                subService: { $push: "$$ROOT" },
            })
            .sort({
                "mainService.rank": 1
            })

        if (userList.length) {
            return res.status(200).json({
                status: true, data: {
                    result: userList
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
export const changeRank = catchAsync(async (req, res, next) => {
    try {

        for (const iterator of req.body.ids) {
            const result = await Service.updateOne({
                _id: iterator._id
            }, {
                $set: {
                    'rank': iterator.rank
                }
            })
        }

        return res.json({
            status: true,
            message: 'Rank has been updated ',
        });



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
function getRoleLabel(role) {
    switch (role) {
        case 'admin':
            return 'Admin'
        case 'salon':
            return 'Salon'
        case 'stylist':
            return 'stylist'
        case 'user':
            return 'User'
        case 'salonadmin':
            return 'Salon Admin'
        case 'superadmin':
            return 'Super Admin'
        case 'company':
            return 'Company'
        default:
            return role
    }
}