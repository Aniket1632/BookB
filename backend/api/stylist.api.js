import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import emailEvent from '../event/email-service.event.js';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { constant } from '../config/constants.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;

import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';


export const createStylist = catchAsync(async (req, res, next) => {
    try {
        let salon = '';

        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),

        });
        const { error, value } = schema.validate({ name: req.body.name, email: req.body.email, phone: req.body.phone }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        if (req.payload.role === 'salon') {
            salon = req.payload._id
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            salon = req.payload.salon
        }

        if (!req.body.id) {
            const salonRecord = await User.find({ role: 'stylist', salon: salon }, {
                _id: 1,
                name: 1,
                salon: 1,
                email: 1,
                phone: 1,
                role: 1,
            }).populate('salon _id name email phone role subscription');
            if (salonRecord.length > 0) {
                let subscriptionRecord = salonRecord[0].salon;

                if (salonRecord.length >= subscriptionRecord.maxCalendar) {
                    return res.status(200).json({
                        status: false,
                        message: 'RangeError: Maximum stylist calendar stack size exceeded. Current size is ' + subscriptionRecord.maxCalendar,
                    });
                } else if (!subscriptionRecord.active) {
                    return res.status(200).json({
                        status: false,
                        message: 'You don\'t have permission to access this salon service. Please contact your administrator.',
                    });
                }
            }
            if (req.body.email && req.body.name && req.body.phone) {
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, null, 'register')
                if (!isMobilePresent) {
                    const isEmail = await isEmailPresentFn(req.body.email, '', 'register')
                    if (!isEmail) {
                        const userData = new User();
                        if (req.file) {
                            const imageUploadResult = await imageUploadService(constant.userImage, req.file);
                            if (imageUploadResult.status) {
                                userData.photo = await cloudFrontUrl(imageUploadResult.data.Key);
                                userData.photoKey = imageUploadResult.data.Key;
                            } else {
                                return res.json({
                                    status: false,
                                    message: 'Exception throws while uploading image',
                                });
                            }
                        }
                        userData.email = req.body.email.trim();
                        userData.userName = req.body.email.trim();
                        userData.phone = req.body.phone;
                        userData.name = req.body.name;
                        userData.address = req.body.address;
                        userData.role = 'stylist';
                        userData.salon = salon;
                        if (req.body.services) { userData.services = req.body.services.split(',') }
                        userData.startTime = req.body.startTime;
                        userData.endTime = req.body.endTime;
                        userData.setPassword(req.body.password)
                        const signUpResult = await User.create(userData);
                        await emailEvent.emit('email-service', {
                            toAddress: req.body.email.trim(),
                            content: 'Your system generated password is ' + req.body.password + '. Please login with same password on dashboard and change password.',
                            subject: 'System generated password',
                            file: null
                        })
                        return res.status(200).json({
                            status: true,
                            message: 'Stylist created successfully',
                        })
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Email already present in the system',
                        })
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Record already present with same mobile number.'
                    });
                }

            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Data not found',
                })

            }
        } else {
            if (req.file) {
                const data = await User.findOne({
                    _id: req.body.id,
                })
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, data, 'update')
                if (!isMobilePresent) {
                    const isEmail = await isEmailPresentFn(req.body.email, data, 'update')
                    if (!isEmail) {
                        let userObject = {}
                        userObject.name = req.body.name;
                        userObject.address = req.body.address;
                        userObject.startTime = req.body.startTime;
                        userObject.endTime = req.body.endTime;
                        if (req.body.services) { userObject.services = req.body.services.split(',') }
                        if (req.body.email) userObject.email = req.body.email
                        if (req.body.phone) userObject.phone = req.body.phone
                        const imageUploadResult = await imageUploadService(constant.userImage, req.file);
                        if (imageUploadResult.status) {
                            userObject.photo = await cloudFrontUrl(imageUploadResult.data.Key);
                            userObject.photoKey = imageUploadResult.data.Key;
                        }
                        const result = await User.updateOne({
                            _id: req.body.id,
                        }, {
                            $set: userObject
                        })

                        return res.status(200).json({
                            status: true,
                            message: 'Data updated successfully',
                        })
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Email already present in the system',
                        })
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Record already present with same mobile number.'
                    });
                }
            } else {
                const data = await User.findOne({
                    _id: req.body.id,
                })
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, data, 'update')
                if (!isMobilePresent) {
                    const isEmail = await isEmailPresentFn(req.body.email, data, 'update')
                    if (!isEmail) {
                        let userObject = {}
                        userObject.name = req.body.name;
                        userObject.address = req.body.address;
                        userObject.startTime = req.body.startTime;
                        userObject.endTime = req.body.endTime;
                        // userObject.salon = salon;
                        if (req.body.email) userObject.email = req.body.email
                        if (req.body.phone) userObject.phone = req.body.phone
                        if (req.body.services) { userObject.services = req.body.services.split(',') }
                        const result = await User.updateOne({
                            _id: req.body.id,
                        }, {
                            $set: userObject
                        })

                        return res.status(200).json({
                            status: true,
                            message: 'Data updated successfully',
                        })
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Email already present in the system',
                        })
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Record already present with same mobile number.'
                    });
                }
            }

        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllStylistBySalon = catchAsync(async (req, res, next) => {
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
                role: {
                    $in: ['stylist']
                },
                salon: ObjectId(req.payload._id)
            })
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            andList.push({
                role: {
                    $in: ['stylist']
                },
                salon: ObjectId(req.payload.salon)
            })
        }



        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await User.aggregate()
            .match(query)
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
export const getStylistBySalon = catchAsync(async (req, res, next) => {
    try {
        let salon = null;
        if (req.payload.role === 'salon') {
            salon = req.payload._id

        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            salon = req.payload.salon
        }

        const userList = await User.find({ role: 'stylist', salon })


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
export const getStylistBySalonV2 = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = []
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
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin' || req.payload.role === 'user') {
            andList.push({
                role:'stylist',
                salon: ObjectId(req.payload.salon)
            })
        }
        if (req.payload.role === 'salon') {
            andList.push({
                role:'stylist',
                salon: ObjectId(req.payload._id)
            })
        }
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;

        const userList = await User.aggregate()
            .match(query)
            .sort({ createdAt: -1 })
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
export const deleteStylist = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            stylistId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ stylistId: req.query.stylistId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.stylistId) {
            await User.deleteOne({ _id: req.query.stylistId });

            return res.status(200).json({
                status: true,
                message: 'Stylist has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Stylist Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfUser = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            userID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ userID: req.query.userID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await User.updateOne({
            _id: req.query.userID
        }, {
            $set: {
                'active': !field.enable
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
export const getAllEnabledStylist = catchAsync(async (req, res, next) => {
    try {
        let salon = null;
        if (req.payload.role === 'salon') {
            salon = req.payload._id
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin' || req.payload.role === 'user') {
            salon = req.payload.salon
        }
        const userList = await User.find({ active: true, role: 'stylist', salon: salon })
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

export const updateServices = catchAsync(async (req, res, next) => {
    try {

        let field = req.body;

        const result = await User.updateOne({
            _id: req.payload_id
        }, {
            $set: {
                'services': field.services
            }
        })
        return res.json({
            status: true,
            message: 'Services updated',
        });



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const getAllEnabledStylistForWebsite = catchAsync(async (req, res, next) => {
    try {
        const salon = await User.findOne({ name: req.query.name, active: true });
        if (salon) {
            const userList = await User.find({ active: true, role: 'stylist', salon: salon._id }, {
                _id: 1,
                name: 1,
                salon: 1,
                email: 1,
                phone: 1,
                address: 1,
                photo: 1,
                photoDark: 1,
                role: 1,
            }).populate('salon', '_id name email phone address photo photoDark role subscription');

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
        } else {
            return res.status(200).json({ status: false, data: null, message: 'Salon Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getAllEnabledStylistBySalon = catchAsync(async (req, res, next) => {
    try {
        const userList = await User.find({ active: true, role: 'stylist', salon: req.query.salon }, {
            _id: 1,
            name: 1,
            salon: 1,
            email: 1,
            phone: 1,
            address: 1,
            photo: 1,
            photoDark: 1,
            role: 1,
        }).populate('_id name email phone address photo photoDark role subscription salon');

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

export const addStylistSettings = catchAsync(async (req, res, next) => {
    try {
        let fields = req.body;
        const userObject = {
            intervalTime: fields.intervalTime,
            recurringType: fields.recurringType,
            startTime: fields.startTime,
            endTime: fields.endTime,
            services: fields.services.split(','),
            isBreakTimeCompulsory: fields.isBreakTimeCompulsory
        }

        // makePublic: fields.makePublic,
        const result = await User.updateOne({
            _id: ObjectId(req.body.id),
        }, {
            $set: userObject
        })
        return res.status(200).json({
            status: true,
            message: 'Stylist settings updated successfully',
        })
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const getStylistSettings = catchAsync(async (req, res, next) => {
    try {
        const setings = await User.findOne(
            { _id: req.query.stylistId, active: true, role: 'stylist' },
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

        if (setings) {
            return res.status(200).json({
                status: true, data: {
                    result: setings,
                },
                message: 'Setings Data sent successfully'
            })
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});


// local function
async function getToken(user, days) {
    user.token = user.generateJWT(days, false);
    const result = user.toAuthJSON(user.token)
    return result;
}
async function isEmailPresentFn(email, user, type) {
    try {
        if (email) {
            const userRecord = await User.findOne({ email: email })
            if (userRecord) {
                if (type == 'update') {
                    if (user.email === email) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (exception) {
        return true;
    }
}
async function isMobilePresentForUserFn(mobile, user, type) {
    try {
        const userRecord = await User.findOne({ phone: mobile })
        if (userRecord) {
            if (type == 'update') {
                if (user.phone === mobile) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    } catch (exception) {
        return true;
    }
}

