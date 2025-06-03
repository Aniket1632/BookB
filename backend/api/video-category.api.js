import VideoCategory from '../model/video-category.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;


export const createCategory = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            categoryName: Joi.string().required(),

        });
        const { error, value } = schema.validate({ categoryName: req.body.categoryName }, options);

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
        sliderObject.categoryName = field.categoryName;
        let id = field.categoryName
        id = id.replace(/[^\w\s]/gi, '').toLowerCase().trim().split(' ').join('_');
        sliderObject.categoryId = id;
        sliderObject.salon = salonId;

        if (req.body.categoryID) {
            await VideoCategory.updateOne({ _id: req.body.categoryID }, {
                $set: {
                    categoryId: sliderObject.categoryId,
                    categoryName: sliderObject.categoryName
                }
            })
            return res.json({
                status: true,
                message: 'Category has been updated.',
            });
        } else {
            await VideoCategory.create(sliderObject)
            return res.json({
                status: true,
                message: 'Category has been created.',
            });
        }



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllCategory = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            // if (req.query.filterValue.includes('*')) {
            //     req.query.filterValue = `/${req.query.filterValue}`
            // }
            orList = [
                { 'categoryName': { $regex: req.query.filterValue, $options: "i" } },
                { 'categoryName': req.query.filterValue },
            ]
        }
        let salonId = '';

        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        andList.push({
            salon: ObjectId(salonId)
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await VideoCategory.aggregate()
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

export const getAllEnableCategory = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
        } else {
            salonId = req.payload.salon
        }
        result = await VideoCategory.find({ salon: salonId, enable: true });

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
                message: 'Data not found.',
            });
        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const deleteCategory = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            categoryId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ categoryId: req.query.categoryId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.categoryId) {
            await VideoCategory.deleteOne({ _id: req.query.categoryId });

            return res.status(200).json({
                status: true,
                message: 'Video category has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Video category Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfCategory = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            categoryId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ categoryId: req.query.categoryId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await VideoCategory.updateOne({
            _id: req.query.categoryId
        }, {
            $set: {
                'enable': !field.enable
            }
        })
        return res.json({
            status: true,
            message: 'Record has been updated as ' + (!field.enable === true ? 'enabled' : 'disabled'),
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
        // case 'company':
        //     return 'Company'
        default:
            return role
    }
}