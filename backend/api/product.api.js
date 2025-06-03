
import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { constant } from '../config/constants.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';
import User from '../model/user.model.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;

import Product from '../model/product.model.js';


export const addUpdateProduct = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            productDescription: Joi.string().required(),
            productPrice: Joi.number().required(),
            productName: Joi.string().required(),
            category: Joi.string().required(),

        });
        const { error, value } = schema.validate({
            productDescription: req.body.productDescription,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            category: req.body.category
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;
        if (field._id) {
            const updateObject = {};
            if (req.file) {
                const imageUploadResult = await imageUploadService(constant.productImage, req.file);
                if (imageUploadResult.status) {
                    updateObject.productImageURL = await cloudFrontUrl(imageUploadResult.data.Key);
                    updateObject.productImageKey = imageUploadResult.data.Key;
                } else {
                    return res.json({
                        status: false,
                        message: 'Product image file is required field',
                    });
                }

                updateObject.productDescription = req.body.productDescription
                updateObject.productName = req.body.productName
                updateObject.category = req.body.category
                updateObject.productPrice = req.body.productPrice
                updateObject.actualPrice = req.body.actualPrice
                updateObject.rating = req.body.rating

            } else {
                updateObject.productDescription = req.body.productDescription
                updateObject.productName = req.body.productName
                updateObject.category = req.body.category
                updateObject.productPrice = req.body.productPrice
                updateObject.actualPrice = req.body.actualPrice
                updateObject.rating = req.body.rating
            }
            await Product.updateOne({
                _id: req.body._id
            }, {
                $set: updateObject
            })

            return res.json({
                status: true,
                message: `${req.body.productName} has been updated.`,
            });
        } else {
            const updateObject = {};
            let salonId = '';
            if (req.payload.role === 'salon') {
                salonId = req.payload._id
            } else {
                salonId = req.payload.salon

            }
            if (req.file) {
                const imageUploadResult = await imageUploadService(constant.productImage, req.file);
                if (imageUploadResult.status) {
                    updateObject.productImageURL = await cloudFrontUrl(imageUploadResult.data.Key);
                    updateObject.productImageKey = imageUploadResult.data.Key;

                } else {
                    return res.json({
                        status: false,
                        message: 'Product image file is required field',
                    });
                }

            }
            else {
                return res.json({
                    status: false,
                    message: 'Product image file is required field',
                });
            }

            updateObject.productDescription = req.body.productDescription
            updateObject.productName = req.body.productName
            updateObject.productPrice = req.body.productPrice
            updateObject.category = req.body.category
            updateObject.salon = salonId
            updateObject.actualPrice = req.body.actualPrice
            updateObject.rating = req.body.rating

            await Product.create(updateObject)
            return res.json({
                status: true,
                message: `${req.body.productName} has been added.`,
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getProductBySalon = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'productName': { $regex: req.query.filterValue, $options: "i" } },
                { 'productName': req.query.filterValue },
                { 'productDescription': { $regex: req.query.filterValue, $options: "i" } },
                { 'productDescription': req.query.filterValue },
            ]
        }

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
        if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id)
            })
        }



        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
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
export const getProductByCategory = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'productName': { $regex: req.query.filterValue, $options: "i" } },
                { 'productName': req.query.filterValue },
            ]
        }
        if (req.query.category === 'all') {
            andList.push({
                salon: ObjectId(req.payload.salon),
                enable: true
            })

        } else {
            andList.push({
                salon: ObjectId(req.payload.salon),
                category: ObjectId(req.query.category),
                enable: true
            })
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
            .sort({ createdAt: -1 })
            .project({
                "_id": 1,
                "productName": 1,
                "productDescription": 1,
                "enable": 1,
                "productOriginalPrice": '$productPrice',
                "productPrice": { $round: ["$productPrice", 2] },
                "quantity": 1,
                "productCash": 1,
                "stock": 1,
                "productImageURL": 1,
                "productImageKey": 1,
                "category": 1,
                "salon": 1,
                "actualPrice": 1,
                "rating": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "__v": 1
            })
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
export const deleteProduct = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            productID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ productID: req.query.productID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.productID) {
            await Product.deleteOne({ _id: req.query.productID });

            return res.status(200).json({
                status: true,
                message: 'Product has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Product Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfProduct = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            productID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ productID: req.query.productID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await Product.updateOne({
            _id: req.query.productID
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
export const getProductById = catchAsync(async (req, res, next) => {
    try {
        // const userList = await Product.findOne({
        //     _id: req.query.productID,
        //     enable: true
        // }).populate('salon').populate('category');
        const userList = await Product.aggregate()
            .match({
                _id: ObjectId(req.query.productID),
                enable: true
            })
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
            .sort({ createdAt: -1 })
            .project({
                "_id": 1,
                "productName": 1,
                "productDescription": 1,
                "enable": 1,
                "productOriginalPrice": '$productPrice',
                "productPrice": { $round: ["$productPrice", 2] },
                "quantity": 1,
                "productCash": 1,
                "stock": 1,
                "productImageURL": 1,
                "productImageKey": 1,
                "category": 1,
                "salon": 1,
                "actualPrice": 1,
                "rating": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "__v": 1
            })
        if (userList.length) {
            return res.status(200).json({
                status: true, data: {
                    result: userList[0],
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

export const getProductBySalonForMobile = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            // }
            orList = [
                { 'productName': { $regex: req.query.filterValue, $options: "i" } },
                { 'productName': req.query.filterValue },
            ]
        }
        andList.push({
            salon: ObjectId(req.payload.salon),
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
            .sort({ createdAt: -1 })
            .project({
                "_id": 1,
                "productName": 1,
                "productDescription": 1,
                "enable": 1,
                "productOriginalPrice": '$productPrice',
                "productPrice": { $round: ["$productPrice", 2] },
                "quantity": 1,
                "productCash": 1,
                "stock": 1,
                "productImageURL": 1,
                "productImageKey": 1,
                "category": 1,
                "salon": 1,
                "actualPrice": 1,
                "rating": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "__v": 1
            })
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

export const getProductBySalonForWebsite = catchAsync(async (req, res, next) => {
    try {
        let query = {}, filter = null;
        let orList = [];
        let andList = [];
        let salon;
        let field = req.body;

        const pageNumber = Number(field.pageNumber)
        const pageSize = Number(field.pageSize)
        if (field.name) {
            const userdata = await User.findOne({ name: field.name, active: true })
            if (userdata) {
                salon = userdata._id;
            }
        }

        if (field.filter && field.filter.length > 0) {
            filter = [{ "$match": { "categoryName": { "$in": field.filter } } }]
        } else {
            filter = [{ "$match": { "categoryName": { "$ne": field.filter } } }]
            // filter = [{ "$match": { "categoryName": { $regex:'', $options: "i" } } }]
        }

        andList.push({
            salon: ObjectId(salon),
            enable: true,
            productPrice: { $gte: field.minPrice, $lte: field.maxPrice }
        })

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;

        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                pipeline: filter,
                as: 'category'
            })
            .unwind('$category')
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
export const getProductBySalonForWebsiteUsingId = catchAsync(async (req, res, next) => {
    try {
        let query = {}, filter = null;
        let orList = [];
        let andList = [];
        let salon;
        let field = req.body;

        const pageNumber = Number(field.pageNumber)
        const pageSize = Number(field.pageSize)
        salon = req.query.salon
        if (field.filter && field.filter.length > 0) {
            filter = [{ "$match": { "categoryName": { "$in": field.filter } } }]
        } else {
            filter = [{ "$match": { "categoryName": { "$ne": field.filter } } }]
            // filter = [{ "$match": { "categoryName": { $regex:'', $options: "i" } } }]
        }

        andList.push({
            salon: ObjectId(salon),
            enable: true,
            productPrice: { $gte: field.minPrice, $lte: field.maxPrice }
        })

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;

        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                pipeline: filter,
                as: 'category'
            })
            .unwind('$category')
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

export const getSimilarProduct = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {

            orList = [
                { 'productName': { $regex: req.query.filterValue, $options: "i" } },
                { 'productName': req.query.filterValue },
            ]
        }
        andList.push({
            enable: true,
            salon: ObjectId(req.payload.salon),
            _id: { $ne: ObjectId(req.query.productID) }
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
            .sort({ createdAt: -1 })
            .project({
                "_id": 1,
                "productName": 1,
                "productDescription": 1,
                "enable": 1,
                "productOriginalPrice": '$productPrice',
                "productPrice": { $round: ["$productPrice", 2] },
                "quantity": 1,
                "productCash": 1,
                "stock": 1,
                "productImageURL": 1,
                "productImageKey": 1,
                "category": 1,
                "salon": 1,
                "actualPrice": 1,
                "rating": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "__v": 1
            })
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

export const getWebsiteSimilarProduct = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = [], salon;

        if (req.query.name) {
            const userdata = await User.findOne({ name: req.query.name, active: true })
            if (userdata) {
                salon = userdata._id;
            }
        }
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {

            orList = [
                { 'productName': { $regex: req.query.filterValue, $options: "i" } },
                { 'productName': req.query.filterValue },
            ]
        }
        andList.push({
            enable: true,
            salon: ObjectId(salon),
            _id: { $ne: ObjectId(req.query.productID) }
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Product.aggregate()
            .match(query)
            .lookup({
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            })
            .unwind('$category')
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind('$salon')
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