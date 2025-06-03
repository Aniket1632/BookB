import ProductOrder from '../model/product-order.model.js';
import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import productEvent from '../event/product.event.js';
import moment from 'moment';
import Stripe from 'stripe';
import emailTemplateEvent from '../views/email-template-service.event.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
moment.suppressDeprecationWarnings = true;
const stripe = new Stripe(process.env.stripeSecretKey)


export const addOrder = catchAsync(async (req, res, next) => {
    try {

        const schema = Joi.object({
            totalAmount: Joi.number().min(0).required(),
            amount: Joi.number().min(0).required(),
            otherAmount: Joi.number().min(0).required(),
            items: Joi.array().required(),
            // orderType: Joi.string().valid('by cash', 'by RazorPay').required(),
        });
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            return res.json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        let field = req.body;
        if (field._id) {
            let obj = {};
            obj.orderStatus = field.orderStatus;
            const result = await ProductOrder.updateOne({
                _id: field._id
            }, {
                $set: obj
            })

            return res.json({
                status: true,
                message: 'Record has been updated.',
            });
        }
        // else if (field.orderID) {
        //     if (field.transactionId) {
        //         if (field.transactionId) {
        //             obj.transactionId = field.transactionId;
        //         }
        //     }

        //     const result = await ProductOrder.updateOne({ orderId: '#' + field.orderID }, {
        //         $set: obj
        //     })

        //     return res.json({
        //         status: true,
        //         message: 'Payment Is Has Been Received.Order Placed Successfully',
        //     });
        // } 
        else {
            if (req.payload) {

                const client = await User.findById(ObjectId(req.payload.salon)).select('+name +address');

                const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
                const currentWeek = moment(currentDate).format('WW GGGG')
                const weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                const month = moment(currentDate).format('MM')
                const date = moment(currentDate).format('DD')
                const record = await User.findOne({ _id: req.payload._id, userIsActiveByAdmin: true });
                if (record) {
                    // if (field.payment) {
                    //     // const { transactionId, amount } = req.body.payment;
                    //     try {
                    //         // const paymentSuccessfull = await stripe.paymentIntents.create({
                    //         //     amount,
                    //         //     currency: 'USD',
                    //         //     payment_method: id,
                    //         //     confirm: true,
                    //         // })

                    //         if (transactionId) {
                    //             let obj = {};
                    //             obj.totalAmount = field.totalAmount;
                    //             obj.amount = field.amount;
                    //             obj.otherAmount = field.otherAmount;
                    //             obj.items = field.items;
                    //             obj.orderBy = req.payload._id;
                    //             obj.orderType = field.orderType;
                    //             obj.salon = req.payload.salon;
                    //             obj.orderId = await getOrderId();
                    //             obj.week = currentWeek.split(' ')[0];
                    //             obj.year = currentWeek.split(' ')[1];
                    //             obj.weekDay = weekDay;
                    //             obj.date = date;
                    //             obj.month = month;
                    //             obj.shippingAddress = field.shippingAddress;
                    //             obj.billingAddress = field.billingAddress;
                    //             obj.transactionId = transactionId;
                    //             const result = await ProductOrder.create(obj)
                    //             await productEvent.emit('update-stock-by-product-list', {
                    //                 productArray: field.items
                    //             })

                    //             const userUpdate = await User.updateOne({
                    //                 _id: req.payload._id,
                    //             }, {
                    //                 $set: {
                    //                     'shippingAddress': field.shippingAddress,
                    //                     'billingAddress': field.billingAddress
                    //                 }
                    //             });

                    //             if (userUpdate) {
                    //                 let emailobject = await emailTemplateEvent.emit('email-template-service', {
                    //                     toAddress: record.email,
                    //                     subject: 'Your Order ' + obj.orderId + ' has been successfully placed',
                    //                     items: field.items,
                    //                     billingAddress: field.billingAddress,
                    //                     shippingAddress: field.shippingAddress,
                    //                     transactionId: transactionId,
                    //                     orderId: obj.orderId,
                    //                     otherAmount: obj.otherAmount,
                    //                     totalAmount: obj.totalAmount
                    //                 });
                    //             }
                    //             return res.json({
                    //                 status: true,
                    //                 data: transactionId,
                    //                 orderDetails: result,
                    //                 message: 'Payment Is Has Been Received.Order Placed Successfully',
                    //             });
                    //         }
                    //     } catch (err) {
                    //       return  res.status(400).json({
                    //             status: false,
                    //             message: err.message
                    //         });
                    //     }
                    // } else {
                    let obj = {};
                    obj.totalAmount = field.totalAmount;
                    obj.amount = field.amount;
                    obj.otherAmount = field.otherAmount;
                    obj.items = field.items;
                    obj.orderBy = req.payload._id;
                    obj.orderType = 'by cash';
                    obj.salon = req.payload.salon;
                    obj.orderId = await getOrderId();
                    obj.week = currentWeek.split(' ')[0];
                    obj.year = currentWeek.split(' ')[1];
                    obj.weekDay = weekDay;
                    obj.date = date;
                    obj.month = month;
                    // obj.shippingAddress = field.shippingAddress;
                    // obj.billingAddress = field.billingAddress;
                    const result = await ProductOrder.create(obj)
                    await productEvent.emit('update-stock-by-product-list', {
                        productArray: field.items
                    })

                    // const userUpdate = await User.updateOne({
                    //     _id: req.payload._id,
                    // }, {
                    //     $set: {
                    //         'shippingAddress': field.shippingAddress,
                    //         'billingAddress': field.billingAddress
                    //     }
                    // });

                    // if (userUpdate) {
                    let emailobject = await emailTemplateEvent.emit('email-template-service', {
                        toAddress: record.email,
                        subject: 'Your Order ' + obj.orderId + ' .',
                        items: field.items,
                        billingAddress: client,
                        // shippingAddress: field.shippingAddress,
                        // transactionId: transactionId,
                        orderId: obj.orderId,
                        otherAmount: obj.otherAmount,
                        totalAmount: obj.totalAmount
                    });
                    // } 

                    return res.json({
                        status: true,
                        orderDetails: result,
                        message: 'Thank you for showing interest in our product. You can buy it at our store.',
                    });
                }
                // } else {
                //     return res.json({
                //         status: false,
                //         message: 'User has been disabled by admin.Please contact admin.',
                //     });
                // }
            } else {
                return res.json({
                    status: false,
                    message: 'Please login',
                });

            }

        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});


export const addPayment = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        let obj = {};

        const schema = Joi.object({
            transactionId: Joi.string().required(),
            orderID: Joi.string().required(),
        });

        const { error, value } = schema.validate({
            transactionId: field.transactionId,
            orderID: field.orderID
        }, options);


        if (error) {
            return res.json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        obj.transactionId = field.transactionId;

        const result = await ProductOrder.updateOne({ orderId: '#' + field.orderID }, {
            $set: obj
        })

        return res.json({
            status: true,
            message: 'Payment Is Has Been Received. Order Placed Successfully',
        });

    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});

export const getOrderDetails = catchAsync(async (req, res, next) => {
    try {
        const result = await ProductOrder.findOne({ orderId: req.query.orderId })
            .populate('orderBy', '_id name email phone address photo photoDark role');
        if (result) {
            return res.status(200).json({
                status: true,
                data: result,
                message: 'Data sent successfully'
            })
        } else {
            return res.json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});


export const getOrderByUser = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        if (req.query.filterValue) {
            orList = [
                { 'orderId': { $regex: req.query.filterValue, $options: "i" } },
                { 'orderId': req.query.filterValue },
            ]
        }

        andList.push({
            enable: true,
            orderBy: ObjectId(req.payload._id),
            // salon: ObjectId(req.payload.salon)
        })

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await ProductOrder.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'orderBy',
                foreignField: '_id',
                as: 'orderBy'
            })
            .unwind('$orderBy')
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

    // try {
    //     let result = null;
    //     result = await ProductOrder.find({ enable: true, orderBy: req.payload._id }).sort({ createdAt: -1 });
    //     if (result.length) {
    //         return res.json({
    //             status: true,
    //             data: result,
    //             message: 'Data send successfully.',
    //         });
    //     } else {
    //         return res.json({
    //             status: true,
    //             data: null,
    //             message: 'Data not present.',
    //         });
    //     }
    // } catch (exception) {
    //     return res.json({
    //         status: false,
    //         message: exception.message,
    //     });
    // }
});
export const getOrderBySaloon = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        if (req.query.filterValue) {
            orList = [
                { 'orderId': { $regex: req.query.filterValue, $options: "i" } },
                { 'orderId': req.query.filterValue },
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
        const userList = await ProductOrder.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'orderBy',
                foreignField: '_id',
                as: 'orderBy'
            })
            .unwind('$orderBy')
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
export const changeOrderStatus = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            orderID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ orderID: req.query.orderID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await ProductOrder.updateOne({
            _id: req.query.orderID
        }, {
            $set: {
                'orderStatus': field.orderStatus
            }
        })
        return res.json({
            status: true,
            message: 'Order status has been updated as ' + field.orderStatus,
        });



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


async function getOrderId() {
    const initial = '#100'
    const count = await ProductOrder.find({}).countDocuments() + 1;
    return `${initial}${count}`
}
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