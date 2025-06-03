import ProductStock from '../model/product-stock.model.js';
import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import productEvent from '../event/product.event.js';


export const addStock = catchAsync(async (req, res, next) => {
    try {
        let data = {
            debit: 0,
            credit: 0,
            salon: '',
            product: '',
            remark: ''
        }
        if (req.body.type === 'credit') {
            data.credit = req.body.quantity;
            data.debit = 0;
            data.remark = 'credited from dashboard by ' + req.payload.name;
            data.salon = req.payload._id;
        } else {
            data.debit = req.body.quantity;
            data.credit = 0;
            data.remark = 'debited from dashboard by ' + req.payload.name;
            data.salon = req.payload._id;
        }
        data.product = req.body.productID;
        await ProductStock.create(data)
        await productEvent.emit('update-stock-by-product', {
            productID: req.body.productID,
        })
        return res.json({
            status: true,
            message: 'Stock has been updated.',
        });
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const getStockByProduct = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        result = await ProductStock.find({ product: req.query.productID, salon: req.payload._id }).sort({ createdAt: -1 });
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

