import ProductCategory from '../model/product-category.model.js';

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

        const result = await ProductCategory.create({
            categoryName: req.body.categoryName,
            salon: req.payload._id
        })

        return res.json({
            status: true,
            message: 'Category has been created.',
        });

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
            orList = [
                { 'categoryName': { $regex: req.query.filterValue, $options: "i" } },
                { 'categoryName': req.query.filterValue },
            ]
        }
        andList.push({
            salon: ObjectId(req.payload._id)
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await ProductCategory.aggregate()
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
        result = await ProductCategory.find({ salon: salonId, enable: true });

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
            await ProductCategory.deleteOne({ _id: req.query.categoryId });

            return res.status(200).json({
                status: true,
                message: 'Product category has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Product category Id is required field',
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

        const result = await ProductCategory.updateOne({
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

export const getAllEnableWebsiteCategory = catchAsync(async (req, res, next) => {
    try {
        let result = null, salon;
        if (req.query.name) {
            const userdata = await User.findOne({ name: req.query.name, active: true })
            if (userdata) {
                salon = userdata._id;
            }
        }

        result = await ProductCategory.find({ salon: salon, enable: true });

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