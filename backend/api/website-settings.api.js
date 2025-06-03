import WebsiteSetting from '../model/website-setting.model.js';
import BusinessHour from '../model/businessHour.model.js';
import User from '../model/user.model.js';
import catchAsync from '../config/catchAsync.js';
import mongoose from 'mongoose';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { constant } from '../config/constants.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';
import emailEvent from '../event/email-service.event.js';
import Joi from 'joi';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;


export const addWebsiteSetting = catchAsync(async (req, res, next) => {
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

            if (req.query.type === 'website') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.websiteLogoImageURL != undefined && req.files.websiteLogoImageURL.length) {
                        const websiteLogoImageURL = await imageUploadService(constant.salonSetting, req.files.websiteLogoImageURL[0]);
                        if (websiteLogoImageURL.status) {
                            salonSettingObject.websiteLogoImageURL = await cloudFrontUrl(websiteLogoImageURL.data.Key)
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else if (req.files.websiteBannerImageURL != undefined && req.files.websiteBannerImageURL.length) {
                        const websiteBannerImageURL = await imageUploadService(constant.salonSetting, req.files.websiteBannerImageURL[0]);
                        if (websiteBannerImageURL.status) {
                            salonSettingObject.websiteBannerImageURL = await cloudFrontUrl(websiteBannerImageURL.data.Key)
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
                if (req.body.workHour && req.body.workHour.length > 0) {
                    salonSettingObject.workHour = JSON.parse(req.body.workHour);
                }

                if (req.body.websiteTitle) {
                    salonSettingObject.websiteTitle = req.body.websiteTitle;
                }

                if (req.body.bgColor) {
                    salonSettingObject.bgColor = req.body.bgColor;
                }

                if (req.body.websiteSubTitle) {
                    salonSettingObject.websiteSubTitle = req.body.websiteSubTitle;
                }

                if (req.body.websiteButtonText) {
                    salonSettingObject.websiteButtonText = req.body.websiteButtonText;
                }

                if (req.body.websiteButtonTextURL) {
                    salonSettingObject.websiteButtonTextURL = req.body.websiteButtonTextURL;
                }

                if (req.body.productText) {
                    salonSettingObject.productText = req.body.productText;
                }

                if (req.body.serviceText) {
                    salonSettingObject.serviceText = req.body.serviceText;
                }

                if (req.body.hourText) {
                    salonSettingObject.hourText = req.body.hourText;
                }

                if (req.body.hourPara) {
                    salonSettingObject.hourPara = req.body.hourPara;
                }


                if (req.body.contactText) {
                    salonSettingObject.contactText = req.body.contactText;
                }

                if (req.body.contactPara) {
                    salonSettingObject.contactPara = req.body.contactPara;
                }

                if (req.body.appearanceBarText) {
                    salonSettingObject.appearanceBarText = req.body.appearanceBarText;
                }


                if (req.body.appearanceBarPara) {
                    salonSettingObject.appearanceBarPara = req.body.appearanceBarPara;
                }
            }

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
                            salonSettingObject.stylistHeaderTitle = req.body.stylistHeaderTitle.trim();
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
                    salonSettingObject.stylistHeaderTitle = req.body.stylistHeaderTitle.trim();
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
                            salonSettingObject.videoStylistVideoHeadingText = req.body.videoStylistVideoHeadingText.trim();
                            salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                            salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                            salonSettingObject.videoMySalonVideoHeadingText = req.body.videoMySalonVideoHeadingText.trim();
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
                    salonSettingObject.videoStylistVideoHeadingText = req.body.videoStylistVideoHeadingText.trim();
                    salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                    salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                    salonSettingObject.videoMySalonVideoHeadingText = req.body.videoMySalonVideoHeadingText.trim();
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
                            salonSettingObject.profileStylistDetailText = req.body.profileStylistDetailText.trim();
                            salonSettingObject.profileSalonDetailText = req.body.profileSalonDetailText.trim();
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
                    salonSettingObject.profileStylistDetailText = req.body.profileStylistDetailText.trim();
                    salonSettingObject.profileSalonDetailText = req.body.profileSalonDetailText.trim();
                    salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                    salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                }
            }
            await WebsiteSetting.create(salonSettingObject)
            return res.status(200).json({ status: true, message: 'Salon setting has updated.' })

        } else {
            const salonSettingObject = {};


            if (req.query.type === 'website') {
                if (Object.keys(req.files).length != 0) {
                    if (req.files.websiteLogoImageURL != undefined && req.files.websiteLogoImageURL.length) {
                        const websiteLogoImageURL = await imageUploadService(constant.salonSetting, req.files.websiteLogoImageURL[0]);
                        if (websiteLogoImageURL.status) {
                            salonSettingObject.websiteLogoImageURL = await cloudFrontUrl(websiteLogoImageURL.data.Key)
                        } else {
                            return res.json({
                                status: false,
                                message: 'Exception throws while uploading image',
                            });
                        }
                    } else if (req.files.websiteBannerImageURL != undefined && req.files.websiteBannerImageURL.length) {
                        const websiteBannerImageURL = await imageUploadService(constant.salonSetting, req.files.websiteBannerImageURL[0]);
                        if (websiteBannerImageURL.status) {
                            salonSettingObject.websiteBannerImageURL = await cloudFrontUrl(websiteBannerImageURL.data.Key)
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
                if (req.body.workHour && req.body.workHour.length > 0) {
                    salonSettingObject.workHour = JSON.parse(req.body.workHour);
                    // await BusinessHour.updateOne({ salon: salonID }, {
                    //     $set: {
                    //         slots: salonSettingObject.workHour
                    //     }
                    // })
                }


                if (req.body.websiteTitle) {
                    salonSettingObject.websiteTitle = req.body.websiteTitle;
                }

                if (req.body.bgColor) {
                    salonSettingObject.bgColor = req.body.bgColor;
                }

                if (req.body.websiteSubTitle) {
                    salonSettingObject.websiteSubTitle = req.body.websiteSubTitle;
                }

                if (req.body.websiteButtonText) {
                    salonSettingObject.websiteButtonText = req.body.websiteButtonText;
                }

                if (req.body.websiteButtonTextURL) {
                    salonSettingObject.websiteButtonTextURL = req.body.websiteButtonTextURL;
                }



                if (req.body.productText) {
                    salonSettingObject.productText = req.body.productText;
                }

                if (req.body.serviceText) {
                    salonSettingObject.serviceText = req.body.serviceText;
                }

                if (req.body.hourText) {
                    salonSettingObject.hourText = req.body.hourText;
                }

                if (req.body.hourPara) {
                    salonSettingObject.hourPara = req.body.hourPara;
                }


                if (req.body.contactText) {
                    salonSettingObject.contactText = req.body.contactText;
                }

                if (req.body.contactPara) {
                    salonSettingObject.contactPara = req.body.contactPara;
                }

                if (req.body.appearanceBarText) {
                    salonSettingObject.appearanceBarText = req.body.appearanceBarText;
                }


                if (req.body.appearanceBarPara) {
                    salonSettingObject.appearanceBarPara = req.body.appearanceBarPara;
                }

            }


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
                            salonSettingObject.stylistHeaderTitle = req.body.stylistHeaderTitle.trim();
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
                    salonSettingObject.stylistHeaderTitle = req.body.stylistHeaderTitle.trim();
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
                            salonSettingObject.videoStylistVideoHeadingText = req.body.videoStylistVideoHeadingText.trim();
                            salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                            salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                            salonSettingObject.videoMySalonVideoHeadingText = req.body.videoMySalonVideoHeadingText.trim();
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
                    salonSettingObject.videoStylistVideoHeadingText = req.body.videoStylistVideoHeadingText.trim();
                    salonSettingObject.videoMostWatchedVideoHeadingText = req.body.videoMostWatchedVideoHeadingText.trim();
                    salonSettingObject.videoMyFavoriteVideoHeadingText = req.body.videoMyFavoriteVideoHeadingText.trim();
                    salonSettingObject.videoMySalonVideoHeadingText = req.body.videoMySalonVideoHeadingText.trim();
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
                            salonSettingObject.profileStylistDetailText = req.body.profileStylistDetailText.trim();
                            salonSettingObject.profileSalonDetailText = req.body.profileSalonDetailText.trim();
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
                    salonSettingObject.profileStylistDetailText = req.body.profileStylistDetailText.trim();
                    salonSettingObject.profileSalonDetailText = req.body.profileSalonDetailText.trim();
                    salonSettingObject.profilePreviousOrderText = req.body.profilePreviousOrderText.trim();
                    salonSettingObject.profileLogoutText = req.body.profileLogoutText.trim();
                }
            }
            await WebsiteSetting.updateOne({ _id: salonSettingResult._id }, { $set: salonSettingObject })
            return res.status(200).json({ status: true, message: 'Salon setting has updated.' })
        }
    } catch (exception) {

    }
});


export const getWebsiteSetting = catchAsync(async (req, res, next) => {
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
                stylistHeaderTitle: 1,
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
                videoMySalonVideoHeadingText: 1,
                videoStylistVideoHeadingText: 1
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
                profileStylistDetailText: 1,
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

export const getWebsiteSettingBySalonID = catchAsync(async (req, res, next) => {
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

export const getWebsiteSettingByType = catchAsync(async (req, res, next) => {
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
                stylistHeaderTitle: 1,
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
                videoMySalonVideoHeadingText: 1,
                videoStylistVideoHeadingText: 1
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
                profileStylistDetailText: 1,
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


export const getWebsiteSettingByName = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.query.name });
        if (user && !user.active) {
            return res.status(200).json({
                status: false,
                message: 'You don\'t have permission to access this salon service. Please contact your administrator.',
            });
        }

        const WebsiteSettingData = await WebsiteSetting.findOne({ salon: user._id, enable: true }).populate('salon', '_id packageName appID name email phone address photo photoDark role subscription');

        if (WebsiteSettingData) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: WebsiteSettingData
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

export const getWebsiteSettingBySalon = catchAsync(async (req, res, next) => {
    try {

        const WebsiteSettingData = await WebsiteSetting.findOne({ salon: req.query.salon, enable: true }).populate('salon', '_id packageName appID name email phone address photo photoDark role subscription');

        if (WebsiteSettingData) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: WebsiteSettingData
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

export const addSalonSetup = catchAsync(async (req, res, next) => {
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

            return res.status(200).json({ status: true, message: 'Created salon successfully.' })

        }
    } catch (exception) {

    }
});


export const registerUser = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error, value } = schema.validate({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const salon = await User.findOne({ name: req.query.name, active: true });

        if (salon._id) {
            const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, null, 'register')
            if (!isMobilePresent) {
                const isEmailPresent = await isEmailPresentFn(req.body.email, null, 'register')
                if (!isEmailPresent) {
                    const userData = new User();
                    userData.name = req.body.name;
                    userData.email = req.body.email;
                    userData.userName = req.body.email;
                    userData.phone = req.body.phone;
                    userData.salon = salon._id;
                    userData.setPassword(req.body.password);
                    let usr = await User.create(userData);
                    return res.status(200).json({
                        status: true,
                        message: 'User has been created.',
                    });
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Record already present with same email.',
                    });
                }
            } else {
                return res.json({
                    status: false,
                    message: 'Record already present with same mobile number.',
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'Salon is required  field'
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});



export const contactUs = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            subject: Joi.string().required(),
            message: Joi.string().required(),
        });

        const { error, value } = schema.validate({
            name: field.name,
            email: field.email,
            phone: field.phone,
            subject: field.subject,
            message: field.message
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const salon = await User.findOne({ name: req.query.name, active: true });
        let replyMsg = '<div style="background-color: rgb(233, 234, 236) !important;text-align: center;padding:1rem;">';
        replyMsg += '<img style="margin:1rem;width:8vh;" src="https://d1tyy0qmvnnsap.cloudfront.net/salonSetting/salonSetting_iLJxyt.png" alt="BookB">'; //' + constantData.CLOUD_FRONT_URL + 'default/default.png
        replyMsg += '<div style="padding-top:20px; padding-right:20px; padding-bottom:20px; padding-left:20px;background:white;text-align: left;">'
        replyMsg += '<h4>Hi ' + salon.name + '</h4>,';
        replyMsg += '<p>Following are the contact details of "<b>' + field.name + '</b>" :</p>';
        for (let key of Object.keys(field)) {
            if (key == 'email') {
                replyMsg += '<p style="word-break: break-word;text-transform: capitalize;">' + key + " : " + field[key] + '</p>';
            } else {
                replyMsg += '<p style="word-break: break-word;"><span style="text-transform: capitalize">' + key + "</span> : " + field[key] + '</p>';
            }
        }
        replyMsg += '</br><h4>Sincerely </h4>'
        replyMsg += '<h4> BookB </br> <p>Developed By <a style="color:#ff9000;text-decoration:none;" href="https://www.the-algo.com/" target="_blank">The Algorithm</a></p> </h4>';
        replyMsg += '<h5>';
        replyMsg += '</div>';
        replyMsg += '</div>';

        let responseReplyMsg = await emailEvent.emit('email-service', {
            toAddress: salon.email.trim(),
            content: replyMsg,
            subject: 'Contact Us',
            file: null
        })

        if (!responseReplyMsg) {
            return res.status(200).json({
                status: false,
                responseReplyMsg: responseReplyMsg,
                message: 'Error Sending Email. Please contact your administrator for assistance.'
            });
        } else {
            return res.status(200).json({
                status: true,
                data: responseReplyMsg,
                message: 'Thank you for getting in touch! We appreciate you contacting us.'
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const getBusinessHourBySalon = catchAsync(async (req, res, next) => {
    try {

        const WebsiteSettingData = await BusinessHour.findOne({ salon: req.query.salon, enable: true })

        if (WebsiteSettingData) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: WebsiteSettingData.slots
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

