import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import emailEvent from '../event/email-service.event.js';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { constant } from '../config/constants.js';
import SalonSetting from '../model/website-setting.model.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;

import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';


export const createSalon = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
        });
        const { error, value } = schema.validate({ name: req.body.name, email: req.body.email }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (!req.body.id) {
            if (req.body.email && req.body.name) {
                const isEmail = await isEmailPresentFn(req.body.email, '', 'register')
                if (!isEmail) {

                    const userData = new User();
                    if (req.file) {
                        const imageUploadResult = await imageUploadService(constant.userImage, req.file);
                        if (imageUploadResult.status) {
                            userData.photo = await cloudFrontUrl(imageUploadResult.data.Key);
                            userData.photoKey = imageUploadResult.data.Key;
                            userData.email = req.body.email.trim();
                            userData.userName = req.body.email.trim();
                            userData.phone = req.body.phone;
                            userData.name = req.body.name;
                            userData.address = req.body.address;
                            userData.role = 'salon';
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
                                message: 'Salon created successfully',
                            })
                        }
                        else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Profile  image file is required field',
                        });
                    }


                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Email already present in the system',
                    })
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Data not found',
                })

            }
        } else {
            const userObject = {};
            const isPhone = await await User.findOne({ phone: req.body.phone, role: 'salon', enable: true });
            if (!isPhone) {
                userObject.phone = req.body.phone
            }

            userObject.name = req.body.name;
            userObject.address = req.body.address;

            if (req.file) {
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
                const result = await User.updateOne({
                    _id: req.body.id,
                }, {
                    $set: userObject
                })

                return res.status(200).json({
                    status: true,
                    message: 'Data updated successfully',
                })
            }

        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllSalon = catchAsync(async (req, res, next) => {
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
        andList.push({
            role: {
                $in: ['salon']
            },
        })
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

export const getAllEnabledSalon = catchAsync(async (req, res, next) => {
    try {

        const userList = await User.find({ active: true, role: 'salon' })
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
export const deleteSalon = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            salonID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ salonID: req.query.salonID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.salonID) {
            await User.deleteOne({ _id: req.query.salonID });

            return res.status(200).json({
                status: true,
                message: 'Salon has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Salon Id is required field',
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
export const changeMenuSetting = catchAsync(async (req, res, next) => {
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
                'appMenu': field.appMenu
            }
        })
        return res.json({
            status: true,
            message: 'Record has been updated',
        });



    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getMenuSettingByToken = catchAsync(async (req, res, next) => {
    try {
        let salonId = null;

        if (req.query.id) {
            salonId = req.query.id
        } else {
            salonId = req.payload.salon
        }
        const user = await User.findOne({ _id: salonId, active: true }, { appMenu: 1 })
        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user.appMenu
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Failed',
            })
        }
    } catch (exception) {
        return res.status(200).json({
            status: false,
            message: exception.message,
        })
    }
});


export const getSalonByPackageName = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findOne({ packageName: req.query.packageName, role: 'salon', active: true })
        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Salon not found',
            })
        }
    } catch (exception) {
        return res.status(200).json({
            status: false,
            message: exception.message,
        })
    }
});
export const getSalonByWebUrl = catchAsync(async (req, res, next) => {
    try {


        const user = await User.findOne({ webUrl: req.query.webUrl, role: 'salon', active: true })
        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Salon not found',
            })
        }
    } catch (exception) {
        return res.status(200).json({
            status: false,
            message: exception.message,
        })
    }
});

export const getSalonSettingByType = catchAsync(async (req, res, next) => {
    try {
        let SalonID = req.query.SalonID;

        if (req.query.type === 'logo') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                appLogoImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'login') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                loginBackgroundImageURL: 1,
                loginButton: 1,
                loginSubTitle: 1,
                loginTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'register') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                registerTitle: 1,
                registerSubTitle: 1,
                registerButton: 1,
                registerBackgroundImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'home') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                headerImageURL: 1,
                trainerHeaderTitle: 1,
                productHeaderTitle: 1,
                videoHeaderTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'video') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                videoHeaderImageURL: 1,
                videoScreenHeadingText: 1,
                videoCategoriesHeadingText: 1,
                videoMostWatchedVideoHeadingText: 1,
                videoMyFavoriteVideoHeadingText: 1,
                videoMySalonVideoHeadingText: 1,
                videoTrainerVideoHeadingText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'shop') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                shopHeaderImageURL: 1,
                shopScreenHeadingText: 1,
                shopSearchBoxText: 1,
                shopMyCartText: 1,
                shopMyOrdersText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'profile') {
            const data = await SalonSetting.findOne({ Salon: SalonID }, {
                profileHeaderImageURL: 1,
                profileScreenHeadingText: 1,
                profileTrainerDetailText: 1,
                profileSalonDetailText: 1,
                profilePreviousOrderText: 1,
                profileLogoutText: 1,
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        return res.status(200).json({ status: false, message: 'Type mismatch' })

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

