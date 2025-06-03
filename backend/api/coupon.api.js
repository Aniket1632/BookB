import Coupon from '../model/coupon.model.js';
import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import User from '../model/user.model.js';
import Stripe from 'stripe';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
export const stripe = new Stripe(process.env.stripeSecretKey);


export const addCoupon = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        let sliderObject = {};
        const schema = Joi.object({
            title: Joi.string().required(),
            code: Joi.string().required(),
        });

        const { error, value } = schema.validate({ title: req.body.title, code: req.body.code }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        let salonId = '';
        if (req.payload.role === 'salon') {
            salonId = req.payload._id;
            sliderObject.salon = salonId;
            sliderObject.isAdmin = false;
        } else if (req.payload.role === "admin") {
            sliderObject.isAdmin = true;
        }

        sliderObject.title = field.title;
        sliderObject.description = field.description;
        sliderObject.code = field.code;
        sliderObject.isExpired = field.isExpired;
        sliderObject.startDate = field.startDate;
        sliderObject.expireDate = field.expireDate;
        sliderObject.discount = field.discount;

        if (req.body.id) {
            await Coupon.updateOne({ _id: req.body.id }, {
                $set: sliderObject
            })
            return res.json({
                status: true,
                message: 'Coupon has been updated.',
            });
        } else {
            await Coupon.create(sliderObject)
            return res.json({
                status: true,
                message: 'Coupon has been created.',
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});



export const getAllEnableCoupons = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salonId = '';

        if (req.payload.role === 'salon') {
            salonId = req.payload._id;
        } else {
            salonId = req.payload.salon;
        }

        result = await Coupon.find({ salon: salonId, enable: true });

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

export const deleteCoupon = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            couponId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ couponId: req.query.couponId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        if (req.query.couponId) {
            await Coupon.deleteOne({ _id: req.query.couponId });

            return res.status(200).json({
                status: true,
                message: 'Coupon has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Coupon Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const changeStatusOfCoupon = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;

        const schema = Joi.object({
            couponId: Joi.string().required(),
        });

        const { error, value } = schema.validate({ couponId: req.query.couponId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const result = await Coupon.updateOne({
            _id: req.query.couponId
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


export const getAllCoupons = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = [];

        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize);

        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
                { 'code': { $regex: req.query.filterValue, $options: "i" } },
                { 'code': req.query.filterValue },
            ]
        }

        if (req.payload.role === 'salon') {
            andList.push({
                salon: ObjectId(req.payload._id),
                isAdmin: false,
            })
        } else if (req.payload.role === "admin") {
            andList.push({
                isAdmin: true,
            })
        } else if (req.payload.role === 'stylist') {
            andList.push({
                stylist: ObjectId(req.payload._id),
                salon: ObjectId(req.payload.salon),
                isAdmin: false,
            })
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;

        const couponList = await Coupon.aggregate()
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

        if (couponList.length) {
            if (couponList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: couponList[0].records,
                        totalPageSize: couponList[0].count
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


export const getCouponsForWebsite = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        let salon;

        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.name) {
            const userdata = await User.findOne({ name: req.query.name, active: true, isAdmin: false })
            if (userdata) {
                salon = userdata._id;
            }
        }

        if (req.query.filterValue) {
            orList = [
                { 'title': { $regex: req.query.filterValue, $options: "i" } },
                { 'title': req.query.filterValue },
                { 'code': { $regex: req.query.filterValue, $options: "i" } },
                { 'code': req.query.filterValue },
            ]
        }

        andList.push({
            salon: ObjectId(salon),
            enable: true
        })

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Coupon.aggregate()
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


export const getVerifyCoupon = catchAsync(async (req, res, next) => {
    try {

        const schema = Joi.object({
            code: Joi.string().required(),
        });
        const { error, value } = schema.validate({ code: req.query.code }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.code) {
            const verfiyObject = await Coupon.findOne({ code: req.query.code.trim(), enable: true, isExpires: false });
            if (verfiyObject) {
                return res.status(200).json({
                    status: true,
                    data: verfiyObject,
                    message: 'Coupon has been verfied.',
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Coupon code is invalid.',
                })
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'Coupon Id is required field',
            })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});



export const getAllEnableCouponsForOnBoarding = catchAsync(async (req, res, next) => {
    try {
        let result = await Coupon.find({ isAdmin: true, enable: true });
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


export const createCouponBookB = catchAsync(async (req, res, next) => {
    const coupon = await stripe.coupons.create(req.body);
    return res.status(200).json({
        status: true,
        message: 'Coupon created successfully.',
        data: {
            coupon
        }
    });
});

export const getCouponBookB = catchAsync(async (req, res, next) => {
    const coupon = await stripe.coupons.retrieve(req.params.id);

    return res.status(200).json({
        status: true,
        data: {
            coupon
        }
    });
});

export const getAllCouponsBookB = catchAsync(async (req, res, next) => {
    const coupons = await stripe.coupons.list();

    return res.status(200).json({
        status: true,
        data: coupons.data
    });
});


export const getAllCouponsEnableBookB = catchAsync(async (req, res, next) => {
    const coupons = await stripe.coupons
        .list({
            active: true
        });
    return res.status(200).json({
        status: true,
        coupons: coupons.data
    });
});


export const updateCouponBookB = catchAsync(async (req, res, next) => {
    const coupon = await stripe.coupons.update(req.params.id, req.body);

    return res.status(200).json({
        status: true,
        message: 'Coupon updated successfully.'
    });
});

export const deleteCouponBookB = catchAsync(async (req, res, next) => {
    await stripe.coupons.del(req.params.id);

    return res.status(200).json({
        status: true,
        message: 'Coupon deleted successfully.'
    });
});

export const createPromoCode = catchAsync(async (req, res, next) => {
    const { coupon } = req.body;
    const schema = Joi.object({
        coupon: Joi.string().required(),
    });
    const { error, value } = schema.validate({ coupon: coupon }, options);

    if (error) {
        return res.status(200).json({
            status: false,
            message: `${error.details.map(x => x.message).join(', ')}`,
        });
    }

    const promotionCode = await stripe.promotionCodes.create(req.body);

    return res.status(200).json({
        status: true,
        message: 'Promo code created successfully.',
        data: {
            promotionCode
        }
    });
});

export const getPromoCodeByCode = catchAsync(async (req, res, next) => {
    const promotionCode = await stripe.promotionCodes.list({
        code: req.params.code,
        active: true
    });

    if (promotionCode.data.length === 0) {
        return res.status(200).json({
            status: false,
            message: 'Invalid promo code.',
        });
    } else {
        return res.status(200).json({
            status: true,
            data: {
                promotionCode: promotionCode.data
            }
        });
    }
});

export const getPromoCode = catchAsync(async (req, res, next) => {
    const promotionCode = await stripe.promotionCodes.retrieve(req.params.id);

    return res.status(200).json({
        status: true,
        data: {
            promotionCode
        }
    });
});

export const getAllActivePromoCodes = catchAsync(async (req, res, next) => {
    const promotionCodes = await stripe.promotionCodes.list({
        active: true
    });

    return res.status(200).json({
        status: true,
        data: promotionCodes.data
    });
});

export const updatePromoCode = catchAsync(async (req, res, next) => {
    const promotionCode = await stripe.promotionCodes.update(req.params.id, req.body);

    return res.status(200).json({
        status: true,
        data: promotionCode,
        message: 'Promo code updated successfully.'
    });
});


export const getAllPromoCodes = catchAsync(async (req, res, next) => {
    const promotionCodes = await stripe.promotionCodes.list();

    return res.status(200).json({
        status: true,
        data: {
            promotionCodes: promotionCodes.data
        }
    });
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