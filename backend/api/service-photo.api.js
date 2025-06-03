
import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import { imageUploadService } from '../services/common/image-upload.service.js';
import { constant } from '../config/constants.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';

import ServicePhoto from '../model/service-photo.model.js';


export const addServicePhoto = catchAsync(async (req, res, next) => {
    try {

        let field = req.body;

        const updateObject = {};


        if (req.file) {
            const imageUploadResult = await imageUploadService(constant.servicePhoto, req.file);
            if (imageUploadResult.status) {
                updateObject.imageUrl = await cloudFrontUrl(imageUploadResult.data.Key);
            }
        }
        else {
            return res.json({
                status: false,
                message: 'image file is required field',
            });
        }

        updateObject.mainService = req.body.mainService
        updateObject.subService = req.body.subService
        if (req.payload.role === 'user') {
            updateObject.user = req.payload._id
            updateObject.salon = req.payload.salon
            updateObject.stylist = req.payload.stylist
        } else {
            if (req.body.user) {
                updateObject.user = req.query.id
                updateObject.salon = req.payload.salon
                updateObject.stylist = req.payload._id
            } else {
                return res.json({
                    status: false,
                    message: `user id is mandatory field.`,
                });
            }
        }

        await ServicePhoto.create(updateObject)
        return res.json({
            status: true,
            message: `Photo has been added.`,
        });


    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getServicePhotoByUser = catchAsync(async (req, res, next) => {
    try {
        const userList = await ServicePhoto.find({ user: req.payload._id })
        if (userList.length) {
            return res.status(200).json({
                status: true, data: {
                    result: userList,
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
