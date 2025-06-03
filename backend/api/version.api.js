import VersionModel from '../model/version.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


export const addVersion = catchAsync(async (req, res, next) => {
    try {
        let field = req.body; 

        if (field._id) {
            let versionObject = {};
            versionObject.versionTitleIOS = field.versionTitleIOS;
            versionObject.versionTitleAndroid = field.versionTitleAndroid;
            versionObject.versionDescription = field.versionDescription;
            versionObject.isCompulsory = field.isCompulsory;
            versionObject.packageName = field.packageName;
            versionObject.bundleID = field.bundleID;
            versionObject.salon = field.salon;
            await VersionModel.updateOne({
                _id: field._id
            }, {
                $set: versionObject
            })
            return res.json({
                status: true,
                message: 'Version has been updated.',
            });
        } else {
            let versionObject = {};
            versionObject.versionTitleIOS = field.versionTitleIOS;
            versionObject.versionTitleAndroid = field.versionTitleAndroid;
            versionObject.versionDescription = field.versionDescription;
            versionObject.isCompulsory = field.isCompulsory;
            versionObject.packageName = field.packageName;
            versionObject.bundleID = field.bundleID;
            versionObject.salon = field.salon;
            let rs = await VersionModel.create(versionObject)
            await VersionModel.updateMany({
                _id: { $ne: rs._id }
            }, {
                $set: {
                    'enable': false
                }
            })
            return res.json({
                status: true,
                message: 'Version has been created.',
            });

        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});

export const getAllVersion = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salon = req.query.salon;
        result = await VersionModel.find({
            salon: ObjectId(salon)
        }).sort({ enable: -1 });
        if (result.length) {
            return res.json({
                status: true,
                data: result,
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
                data: [],
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


export const getAllEnableVersion = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        let salon = req.query.salon;
        result = await VersionModel.findOne({ salon: salon, enable: true });
        if (result) {
            return res.json({
                status: true,
                data: result,
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
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

export const deleteVersion = catchAsync(async (req, res, next) => {
    try {
        let field = req.query.id;
        let salonId = req.query.salonId;
        await VersionModel.deleteOne({
            _id: field,
            salon: ObjectId(salonId)
        })
        return res.json({
            status: true,
            message: 'Record has been deleted',
        });

    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }

});

export const changeStatusOfVersion = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        if (!field.enable) {
            await VersionModel.updateMany({
                _id: { $ne: req.query.id },
                salon: ObjectId(field.salon)
            }, {
                $set: {
                    'enable': false
                }
            })
        }
        const result = await VersionModel.updateOne({
            _id: req.query.id,
            salon: ObjectId(field.salon)
        }, {
            $set: {
                'enable': !field.enable
            }
        })
        return res.json({
            status: true,
            message: 'Record has been updated as ' + (!field.enable === true ? 'enabled' : 'disabled'),
        });

    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});

