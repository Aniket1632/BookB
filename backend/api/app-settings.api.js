import WebsiteSetting from '../model/website-setting.model.js';
import User from '../model/user.model.js'
import catchAsync from '../config/catchAsync.js';
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
import constantData from '../config/index.js'
import emailEvent from '../event/email-service.event.js';
import Joi from 'joi';


export const addAppSetting = catchAsync(async (req, res, next) => {
    try {
        let salonID = '';
        if (req.payload.role == 'salon') {
            salonID = req.payload._id
        } else {
            salonID = req.payload.salon
        }
        const salonSettingResult = await WebsiteSetting.findOne({ salon: salonID });

        if (!salonSettingResult) {
            const salonSettingObject = {};
            salonSettingObject.salon = salonID;
            if (req.query.type === 'logo') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.appLogoImageURL != undefined && req.files.appLogoImageURL.length) {
                        const appLogoImageURL = await imageUploadService(constant.salonSetting, req.files.appLogoImageURL[0]);
                        if (appLogoImageURL.status) {
                            salonSettingObject.appLogoImageURL = await cloudFrontUrl(appLogoImageURL.data.Key)
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'logo file is required field',
                        });
                    }
                }
            }
            if (req.query.type === 'login') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.loginBackgroundImageURL != undefined && req.files.loginBackgroundImageURL.length) {
                        const loginBackgroundImageURL = await imageUploadService(constant.salonSetting, req.files.loginBackgroundImageURL[0]);
                        if (loginBackgroundImageURL.status) {
                            salonSettingObject.loginBackgroundImageURL = await cloudFrontUrl(loginBackgroundImageURL.data.Key)
                            salonSettingObject.loginTitle = req.body.loginTitle.trim();
                            salonSettingObject.loginSubTitle = req.body.loginSubTitle.trim();
                            salonSettingObject.loginButton = req.body.loginButton.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.loginTitle = req.body.loginTitle.trim();
                    salonSettingObject.loginSubTitle = req.body.loginSubTitle.trim();
                    salonSettingObject.loginButton = req.body.loginButton.trim();
                }
            }
            if (req.query.type === 'register') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.registerBackgroundImageURL != undefined && req.files.registerBackgroundImageURL.length) {
                        const registerBackgroundImageURL = await imageUploadService(constant.salonSetting, req.files.registerBackgroundImageURL[0]);
                        if (registerBackgroundImageURL.status) {
                            salonSettingObject.registerBackgroundImageURL = await cloudFrontUrl(registerBackgroundImageURL.data.Key)
                            salonSettingObject.registerTitle = req.body.registerTitle.trim();
                            salonSettingObject.registerSubTitle = req.body.registerSubTitle.trim();
                            salonSettingObject.registerButton = req.body.registerButton.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.registerTitle = req.body.registerTitle.trim();
                    salonSettingObject.registerSubTitle = req.body.registerSubTitle.trim();
                    salonSettingObject.registerButton = req.body.registerButton.trim();
                }
            }
            if (req.query.type === 'home') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.headerImageURL != undefined && req.files.headerImageURL.length) {
                        const headerImageURL = await imageUploadService(constant.salonSetting, req.files.headerImageURL[0]);
                        if (headerImageURL.status) {
                            salonSettingObject.headerImageURL = await cloudFrontUrl(headerImageURL.data.Key)
                            salonSettingObject.trainerHeaderTitle = req.body.trainerHeaderTitle.trim();
                            salonSettingObject.productHeaderTitle = req.body.productHeaderTitle.trim();
                            salonSettingObject.videoHeaderTitle = req.body.videoHeaderTitle.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.trainerHeaderTitle = req.body.trainerHeaderTitle.trim();
                    salonSettingObject.productHeaderTitle = req.body.productHeaderTitle.trim();
                    salonSettingObject.videoHeaderTitle = req.body.videoHeaderTitle.trim();
                }
            }
            if (req.query.type === 'video') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.videoHeaderImageURL != undefined && req.files.videoHeaderImageURL.length) {
                        const videoHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.videoHeaderImageURL[0]);
                        if (videoHeaderImageURL.status) {
                            salonSettingObject.videoHeaderImageURL = await cloudFrontUrl(videoHeaderImageURL.data.Key)
                            salonSettingObject.videoCategoriesHeadingText = req.body.videoCategoriesHeadingText.trim();
                            salonSettingObject.videoScreenHeadingText = req.body.videoScreenHeadingText.trim();
                            salonSettingObject.videoTrainerVideoHeadingText = req.body.videoTrainerVideoHeadingText.trim();
                            salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                            salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                            salonSettingObject.videoMyGymVideoHeadingText = req.body.videoMyGymVideoHeadingText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.videoCategoriesHeadingText = req.body.videoCategoriesHeadingText.trim();
                    salonSettingObject.videoScreenHeadingText = req.body.videoScreenHeadingText.trim();
                    salonSettingObject.videoTrainerVideoHeadingText = req.body.videoTrainerVideoHeadingText.trim();
                    salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                    salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                    salonSettingObject.videoMyGymVideoHeadingText = req.body.videoMyGymVideoHeadingText.trim();
                }
            }
            if (req.query.type === 'shop') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.shopHeaderImageURL != undefined && req.files.shopHeaderImageURL.length) {
                        const shopHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.shopHeaderImageURL[0]);
                        if (shopHeaderImageURL.status) {
                            salonSettingObject.shopHeaderImageURL = await cloudFrontUrl(shopHeaderImageURL.data.Key)
                            salonSettingObject.shopScreenHeadingText = req.body.shopScreenHeadingText.trim();
                            salonSettingObject.shopSearchBoxText = req.body.shopSearchBoxText.trim();
                            salonSettingObject.shopMyCartText = req.body.shopMyCartText.trim();
                            salonSettingObject.shopMyOrdersText = req.body.shopMyOrdersText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.shopScreenHeadingText = req.body.shopScreenHeadingText.trim();
                    salonSettingObject.shopSearchBoxText = req.body.shopSearchBoxText.trim();
                    salonSettingObject.shopMyCartText = req.body.shopMyCartText.trim();
                    salonSettingObject.shopMyOrdersText = req.body.shopMyOrdersText.trim();
                }
            }
            if (req.query.type === 'profile') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.profileHeaderImageURL != undefined && req.files.profileHeaderImageURL.length) {
                        const profileHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.profileHeaderImageURL[0]);
                        if (profileHeaderImageURL.status) {
                            salonSettingObject.profileHeaderImageURL = await cloudFrontUrl(profileHeaderImageURL.data.Key)
                            salonSettingObject.profileScreenHeadingText = req.body.profileScreenHeadingText.trim();
                            salonSettingObject.profileTrainerDetailText = req.body.profileTrainerDetailText.trim();
                            salonSettingObject.profileGymDetailText = req.body.profileGymDetailText.trim();
                            salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                            salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.profileScreenHeadingText = req.body.profileScreenHeadingText.trim();
                    salonSettingObject.profileTrainerDetailText = req.body.profileTrainerDetailText.trim();
                    salonSettingObject.profileGymDetailText = req.body.profileGymDetailText.trim();
                    salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                    salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                }
            }
            await WebsiteSetting.create(salonSettingObject)
            return res.status(200).json({ status: true, message: 'Gym setting has updated.' })

        } else {
            const salonSettingObject = {};
            if (req.query.type === 'logo') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.appLogoImageURL != undefined && req.files.appLogoImageURL.length) {
                        const appLogoImageURL = await imageUploadService(constant.salonSetting, req.files.appLogoImageURL[0]);
                        if (appLogoImageURL.status) {
                            salonSettingObject.appLogoImageURL = await cloudFrontUrl(appLogoImageURL.data.Key)
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'logo file is required field',
                        });
                    }
                }
            }
            if (req.query.type === 'login') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.loginBackgroundImageURL != undefined && req.files.loginBackgroundImageURL.length) {
                        const loginBackgroundImageURL = await imageUploadService(constant.salonSetting, req.files.loginBackgroundImageURL[0]);
                        if (loginBackgroundImageURL.status) {
                            salonSettingObject.loginBackgroundImageURL = await cloudFrontUrl(loginBackgroundImageURL.data.Key)
                            salonSettingObject.loginTitle = req.body.loginTitle.trim();
                            salonSettingObject.loginSubTitle = req.body.loginSubTitle.trim();
                            salonSettingObject.loginButton = req.body.loginButton.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.loginTitle = req.body.loginTitle.trim();
                    salonSettingObject.loginSubTitle = req.body.loginSubTitle.trim();
                    salonSettingObject.loginButton = req.body.loginButton.trim();
                }
            }
            if (req.query.type === 'register') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.registerBackgroundImageURL != undefined && req.files.registerBackgroundImageURL.length) {
                        const registerBackgroundImageURL = await imageUploadService(constant.salonSetting, req.files.registerBackgroundImageURL[0]);
                        if (registerBackgroundImageURL.status) {
                            salonSettingObject.registerBackgroundImageURL = await cloudFrontUrl(registerBackgroundImageURL.data.Key)
                            salonSettingObject.registerTitle = req.body.registerTitle.trim();
                            salonSettingObject.registerSubTitle = req.body.registerSubTitle.trim();
                            salonSettingObject.registerButton = req.body.registerButton.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.registerTitle = req.body.registerTitle.trim();
                    salonSettingObject.registerSubTitle = req.body.registerSubTitle.trim();
                    salonSettingObject.registerButton = req.body.registerButton.trim();
                }
            }
            if (req.query.type === 'home') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.headerImageURL != undefined && req.files.headerImageURL.length) {
                        const headerImageURL = await imageUploadService(constant.salonSetting, req.files.headerImageURL[0]);
                        if (headerImageURL.status) {
                            salonSettingObject.headerImageURL = await cloudFrontUrl(headerImageURL.data.Key)
                            salonSettingObject.trainerHeaderTitle = req.body.trainerHeaderTitle.trim();
                            salonSettingObject.productHeaderTitle = req.body.productHeaderTitle.trim();
                            salonSettingObject.videoHeaderTitle = req.body.videoHeaderTitle.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.trainerHeaderTitle = req.body.trainerHeaderTitle.trim();
                    salonSettingObject.productHeaderTitle = req.body.productHeaderTitle.trim();
                    salonSettingObject.videoHeaderTitle = req.body.videoHeaderTitle.trim();
                }
            }
            if (req.query.type === 'video') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.videoHeaderImageURL != undefined && req.files.videoHeaderImageURL.length) {
                        const videoHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.videoHeaderImageURL[0]);
                        if (videoHeaderImageURL.status) {
                            salonSettingObject.videoHeaderImageURL = await cloudFrontUrl(videoHeaderImageURL.data.Key)
                            salonSettingObject.videoCategoriesHeadingText = req.body.videoCategoriesHeadingText.trim();
                            salonSettingObject.videoScreenHeadingText = req.body.videoScreenHeadingText.trim();
                            salonSettingObject.videoTrainerVideoHeadingText = req.body.videoTrainerVideoHeadingText.trim();
                            salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                            salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                            salonSettingObject.videoMyGymVideoHeadingText = req.body.videoMyGymVideoHeadingText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.videoCategoriesHeadingText = req.body.videoCategoriesHeadingText.trim();
                    salonSettingObject.videoScreenHeadingText = req.body.videoScreenHeadingText.trim();
                    salonSettingObject.videoTrainerVideoHeadingText = req.body.videoTrainerVideoHeadingText.trim();
                    salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                    salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                    salonSettingObject.videoMyGymVideoHeadingText = req.body.videoMyGymVideoHeadingText.trim();
                }
            }
            if (req.query.type === 'shop') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.shopHeaderImageURL != undefined && req.files.shopHeaderImageURL.length) {
                        const shopHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.shopHeaderImageURL[0]);
                        if (shopHeaderImageURL.status) {
                            salonSettingObject.shopHeaderImageURL = await cloudFrontUrl(shopHeaderImageURL.data.Key)
                            salonSettingObject.shopScreenHeadingText = req.body.shopScreenHeadingText.trim();
                            salonSettingObject.shopSearchBoxText = req.body.shopSearchBoxText.trim();
                            salonSettingObject.shopMyCartText = req.body.shopMyCartText.trim();
                            salonSettingObject.shopMyOrdersText = req.body.shopMyOrdersText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.shopScreenHeadingText = req.body.shopScreenHeadingText.trim();
                    salonSettingObject.shopSearchBoxText = req.body.shopSearchBoxText.trim();
                    salonSettingObject.shopMyCartText = req.body.shopMyCartText.trim();
                    salonSettingObject.shopMyOrdersText = req.body.shopMyOrdersText.trim();
                }
            }
            if (req.query.type === 'profile') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.profileHeaderImageURL != undefined && req.files.profileHeaderImageURL.length) {
                        const profileHeaderImageURL = await imageUploadService(constant.salonSetting, req.files.profileHeaderImageURL[0]);
                        if (profileHeaderImageURL.status) {
                            salonSettingObject.profileHeaderImageURL = await cloudFrontUrl(profileHeaderImageURL.data.Key)
                            salonSettingObject.profileScreenHeadingText = req.body.profileScreenHeadingText.trim();
                            salonSettingObject.profileTrainerDetailText = req.body.profileTrainerDetailText.trim();
                            salonSettingObject.profileGymDetailText = req.body.profileGymDetailText.trim();
                            salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                            salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Image is required field',
                        });
                    }
                } else {
                    salonSettingObject.profileScreenHeadingText = req.body.profileScreenHeadingText.trim();
                    salonSettingObject.profileTrainerDetailText = req.body.profileTrainerDetailText.trim();
                    salonSettingObject.profileGymDetailText = req.body.profileGymDetailText.trim();
                    salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                    salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                }
            }
            await WebsiteSetting.updateOne({ _id: salonSettingResult._id }, { $set: salonSettingObject })
            return res.status(200).json({ status: true, message: 'Gym setting has updated.' })
        }
    } catch (exception) {

    }
});

export const getAppSetting = catchAsync(async (req, res, next) => {
    try {
        let salonID = '';
        if (req.payload.role == 'salon') {
            salonID = req.payload._id
        } else {
            salonID = req.payload.salon
        }
        if (req.query.type === 'logo') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                appLogoImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'login') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                loginBackgroundImageURL: 1,
                loginButton: 1,
                loginSubTitle: 1,
                loginTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'register') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                registerTitle: 1,
                registerSubTitle: 1,
                registerButton: 1,
                registerBackgroundImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'home') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                headerImageURL: 1,
                trainerHeaderTitle: 1,
                productHeaderTitle: 1,
                videoHeaderTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'video') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                videoHeaderImageURL: 1,
                videoScreenHeadingText: 1,
                videoCategoriesHeadingText: 1,
                videoMostWatchedVideoHeadingText: 1,
                videoMyFavoriteVideoHeadingText: 1,
                videoMyGymVideoHeadingText: 1,
                videoTrainerVideoHeadingText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'shop') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                shopHeaderImageURL: 1,
                shopScreenHeadingText: 1,
                shopSearchBoxText: 1,
                shopMyCartText: 1,
                shopMyOrdersText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'profile') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                profileHeaderImageURL: 1,
                profileScreenHeadingText: 1,
                profileTrainerDetailText: 1,
                profileGymDetailText: 1,
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

export const getAppSettingBySalonID = catchAsync(async (req, res, next) => {
    try {


        const user = await WebsiteSetting.findOne({ salon: req.query.salonID, enable: true })
        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Gym not found',
            })
        }
    } catch (exception) {
        return res.status(200).json({
            status: false,
            message: exception.message,
        })
    }
});

export const getAppSettingByType = catchAsync(async (req, res, next) => {
    try {
        let salonID = req.query.salonID;

        if (req.query.type === 'logo') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                appLogoImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'login') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                loginBackgroundImageURL: 1,
                loginButton: 1,
                loginSubTitle: 1,
                loginTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'register') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                registerTitle: 1,
                registerSubTitle: 1,
                registerButton: 1,
                registerBackgroundImageURL: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'home') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                headerImageURL: 1,
                trainerHeaderTitle: 1,
                productHeaderTitle: 1,
                videoHeaderTitle: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'video') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                videoHeaderImageURL: 1,
                videoScreenHeadingText: 1,
                videoCategoriesHeadingText: 1,
                videoMostWatchedVideoHeadingText: 1,
                videoMyFavoriteVideoHeadingText: 1,
                videoMyGymVideoHeadingText: 1,
                videoTrainerVideoHeadingText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'shop') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                shopHeaderImageURL: 1,
                shopScreenHeadingText: 1,
                shopSearchBoxText: 1,
                shopMyCartText: 1,
                shopMyOrdersText: 1
            })
            return res.status(200).json({ status: true, data: data, message: 'Data sent' })
        }
        if (req.query.type === 'profile') {
            const data = await WebsiteSetting.findOne({ salon: salonID }, {
                profileHeaderImageURL: 1,
                profileScreenHeadingText: 1,
                profileTrainerDetailText: 1,
                profileGymDetailText: 1,
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

