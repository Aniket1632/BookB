import User from '../model/user.model.js';
import OTP from '../model/otp.model.js';
import jwtDecode from 'jwt-decode';
import catchAsync from '../config/catchAsync.js';
import twilio from 'twilio';
import constants from '../config/index.js';
import moment from 'moment';
import Joi from 'joi';
import mongoose from 'mongoose';
import emailEvent from '../event/email-service.event.js';
import addCoinsEvent from '../event/coins.event.js'
import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Appointment from '../model/appointment.model.js';
import BusinessHour from '../model/businessHour.model.js';
import Stripe from 'stripe';
import SubscriptionPlan from '../model/subscription-plan.model.js';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';
import { constant } from '../config/constants.js';
import { v4 as uuidv4 } from 'uuid';
import CoinsHistory from '../model/coinsHistory.js'
import {completeProfile } from '../socket/socketReward.js' 
import { onlineUsers } from '../server.js';
import currency from '../config/currency.json' assert { type: "json" };
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
const stripe = new Stripe(process.env.stripeSecretKey)

export const login = catchAsync(async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email) {
            return res.json({
                status: false,
                message: 'Email is required',
            });
        }
        if (!password) {
            return res.json({
                status: false,
                message: 'Password is required',
            });
        }
        let userList = User.find({ userName: email, active: true });
        if (userList.length > 1) {
            User.findOne({ userName: email, active: true, role: 'salon' })
                .then(async (user) => {
                    if (!user || !user.validatePassword(password)) {
                        return res.json({ status: false, message: 'Invalid email or password' })
                    }
                    const result = await getToken(user, 1)
                    return res.json({ status: true, data: result, message: 'login successfully' });
                });
        } else {
            User.findOne({ userName: email, active: true })
                .then(async (user) => {
                    if (!user || !user.validatePassword(password)) {
                        return res.json({ status: false, message: 'Invalid email or password' })
                    }
                    const result = await getToken(user, 1);
                    let isFirstLogin=false;
                    if(user.isFirstLogin){
                        isFirstLogin=true;
                        await User.findOneAndUpdate({userName: email, active: true},{$set:{"isFirstLogin":false}})
                    }

                    return res.json({ status: true ,isFirstLogin, data: result, message: 'login successfully' });
                });
        }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
})
export const checkMobileNumber = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            phone: Joi.string().required()
        });
        const { error, value } = schema.validate({ phone: req.body.phone }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let userObj = null;
        userObj = await User.findOne({ 'phone': req.body.phone, 'countryCode': req.body.countryCode, packageName: req.query.packageName, role: { $in: ['user', 'stylist'] } });
        // userObj = await User.findOne({ 'phone': req.body.phone, packageName: req.query.packageName, role: { $in: ['user', 'stylist'] } });
        if (userObj) {
            if (constants.NODE_ENV === 'development' || constants.NODE_ENV === 'staging' ||
                req.body.phone === '9595389502' || req.body.phone === '9595389507' ||
                req.body.phone === '9595389503' || req.body.phone === '9595389504' || req.body.phone === '9595389505') {
                const token = await new OTP().generateJWT(req.body.phone, 1234);
                const deleteData = await OTP.deleteMany({ mobile: req.body.phone, packageName: req.query.packageName });
                const result = await OTP.create({ mobile: req.body.phone, token: token, packageName: req.query.packageName });
                return res.json({
                    status: true,
                    data: token,
                    message: 'Your SECURE CODE is 1234 and is valid for 90 seconds.',
                });
            } else {
                const client = new twilio(constants.twilioAccountSid, constants.twilioAuthToken);
                const randomNumber = Math.floor(1000 + Math.random() * 9000);

                client.messages.create({
                    body: `Your SECURE CODE is: ${randomNumber} , and this request initiated through ${constants.APP_NAME}`,
                    // to: `+1${req.body.phone}`,
                    to: `${req.body.countryCode}${req.body.phone}`,
                    from: '+17205730087'
                }).then(async function (message) {
                    const token = await new OTP().generateJWT(req.body.phone, randomNumber);
                    const deleteData = await OTP.deleteMany({ mobile: req.body.phone, packageName: req.query.packageName });
                    const result = await OTP.create({ mobile: req.body.phone, token: token, packageName: req.query.packageName })
                    return res.json({
                        status: true,
                        data: token,
                        message: `SECURE CODE: has been sent on ${req.body.phone} and is valid for 90 seconds.`,
                    });
                }).catch(async function (e) {
                    return res.json({
                        status: false,
                        data: null,
                        message: `The phone number provided ${req.body.phone} is not a valid number.`,
                    });
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'User not found'
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const OTPVerification = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            phone: Joi.string().required(),
            otp: Joi.number().required()

        });
        const { error, value } = schema.validate({ phone: req.body.phone, otp: req.body.otp }, options);

        if (error) {
            return res.json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let otpObj = null;
        otpObj = await OTP.findOne({ mobile: req.body.phone, packageName: req.body.packageName }).sort({ createdAt: -1 })
        if (otpObj) {
            const tokenDecode = await jwtDecode(otpObj.token);
            if (Number(tokenDecode.otp) === Number(req.body.otp)) {
                let userObj = null;
                userObj = await User.findOne({ 'phone': req.body.phone, packageName: req.body.packageName });
                if (userObj) {
                    const token = userObj.generateJWT(90, false);
                    let isFirstLogin=false
                    if(userObj.isFirstLogin){
                        isFirstLogin=true
                    }
                    const resultupdate = await User.updateOne({
                        _id: userObj._id
                    }, {
                        $set: {
                            'platform': req.body.platform,
                            'deviceInfo': req.body.deviceInfo,
                            'deviceId': req.body.deviceId,
                            'accessToken': token,
                            'isFirstLogin': false
                        }
                    })
                    return res.json({
                        status: true,
                        data: token,
                        role: userObj.role,
                        isFirstLogin,
                        message: 'Login successfully.',
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'User not found',
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Invalid SECURE CODE',
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'Your SECURE CODE session has been expired.Please resend SECURE CODE',
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const userSignup = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            gender: Joi.string().required(),
        });
        const { error, value } = schema.validate({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        if (req.body._id) {
            const userRecord = await User.findOne({ _id: req.body._id })
            if (userRecord) {
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, userRecord, 'update')
                if (!isMobilePresent) {
                    const isEmailPresent = await isEmailPresentFn(req.body.email, userRecord, 'update')
                    if (!isEmailPresent) {
                        const result = await User.updateOne({
                            _id: req.body._id
                        }, {
                            $set: {
                                'email': req.body.email,
                                'phone': req.body.phone,
                                'name': req.body.name,
                                'gender': req.body.gender,
                                'clientNote': req.body.clientNote,
                            }
                        })
                        return res.status(200).json({
                            status: true,
                            message: 'Your profile has been updated.',
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'User already present with same email.Try with different email.',
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'User already present with same mobile number.Try with different mobile number.'
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'User not present.'
                });
            }
        } else {
            if (req.payload.role === 'salon') {
                req.body.salon = req.payload._id
            }
            if (req.payload.role === 'stylist') {
                req.body.salon = req.payload.salon
                req.body.stylist = req.payload._id
            }
            const salonData = await User.findOne({ _id: req.body.salon })
            if (req.body.salon) {
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, null, 'register', salonData.packageName)
                if (!isMobilePresent) {
                    const isEmailPresent = await isEmailPresentFn(req.body.email, null, 'register', salonData.packageName)
                    if (!isEmailPresent) {
                        const resultData = await User.create({
                            'email': req.body.email,
                            'userName': req.body.email,
                            'phone': req.body.phone,
                            'name': req.body.name,
                            'gender': req.body.gender,
                            'salon': req.body.salon,
                            'packageName': salonData.packageName,
                            'webUrl': salonData.webUrl,
                            'availableRole': req.body.availableRole?.length > 1 ? req.body.availableRole : [],
                            'isMultiRole': req.body.availableRole?.length > 1 ? true : false,
                        })
                        return res.status(200).json({
                            status: true,
                            message: 'User has been created.',
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'User already present with same email.Try with different email.',
                        });
                    }
                } else {
                    return res.json({
                        status: false,
                        message: 'User already present with same mobile number.Try with different mobile number.',
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Salon is required  field.'
                });
            }

        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeRole = catchAsync(async (req, res, next) => {
    try {
        const email = req.payload.email;
        const role = req.body.role;

        if (!email) {
            return res.json({
                status: false,
                message: 'Please login',
            });
        }
        if (!role) {
            return res.json({
                status: false,
                message: 'Role is required',
            });
        }
        await User.findOne({ email, role })
            .then(async (user) => {
                if (user) {
                    const result = await getToken(user, 1)
                    return res.json({ status: true, data: result, message: 'Role switched successfully' });
                } else {
                    return res.json({ status: false, message: 'User not found' });

                }
            });
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
})
export const sendMessage = catchAsync(async (req, res, next) => {
    try {
        let userObj = {}, message;
        message = req.body.message;
        userObj = await User.findOne({ _id: req.body.userId });
        const client = new twilio(constants.twilioAccountSid, constants.twilioAuthToken);
        let to = userObj && userObj.countryCode?`${userObj.countryCode}${userObj.phone}`: `+1${userObj.phone}`;
        client.messages.create({
            body: message,
            to: to,//`+1${userObj.phone}`,
            from: '+17205730087'
        }).then(async function (message) {
            return res.status(200).json({
                status: true,
                data: message,
                message: 'Message sent successfully',
            });
        }).catch(async function (e) {
            return res.status(200).json({
                status: false,
                data: null,
                message: e.message,
            });
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const AssignStylistToUser = catchAsync(async (req, res, next) => {
    try {

        if (req.payload._id) {
            const result = await User.updateOne({
                _id: req.payload._id
            }, {
                $set: {
                    'stylist': req.body.stylist,
                }
            })
            const userData = await User.findOne({ _id: req.payload._id })

            const token = await getToken(userData, 365);

            return res.status(200).json({
                status: true,
                token: token,
                message: 'Stylist has been set.',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data not present.',
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const getAllUsers = catchAsync(async (req, res, next) => {
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
        if (req.payload.role === 'salon') {
            andList.push({
                role: {
                    $in: ['user']
                },
                salon: ObjectId(req.payload._id)
            })
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            andList.push({
                role: {
                    $in: ['user']
                },
                salon: ObjectId(req.payload.salon)
            })
        }
        if (req.payload.role === 'stylist') {
            andList.push({
                role: {
                    $in: ['user']
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
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind({ path: "$stylist", preserveNullAndEmptyArrays: true })
            .lookup({
                from: 'users',
                localField: 'salon',
                foreignField: '_id',
                as: 'salon'
            })
            .unwind({ path: "$salon", preserveNullAndEmptyArrays: true })
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
export const updateAllUsersUserName = catchAsync(async (req, res, next) => {
    try {
        const users = await User.find({});
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            await User.updateOne({ _id: element._id }, {
                $set: {
                    userName: element.email
                }
            })

        }
        return res.status(200).json({ status: true, message: 'Updated all users' })

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getUserByDeviceToken = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.payload._id, active: true }, { salt: 0, hash: 0, __v: 0, subscription: 0 }).populate('salon');
        user.platform = req.body.platform;
        user.deviceInfo = req.body.deviceInfo;
        user.deviceId = req.body.deviceId;
        user.save();
        if (user && !user.accessToken) {
            return res.status(200).json({
                status: false,
                message: 'Your token has expired. Please log in again!',
                code: 'credentials_required',
            });
        } else if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Failed'
            })
        }
    } catch (exception) {
        return res.status(200).json({
            status: false,
            message: exception.message
        })
    }
});

export const logOutUser = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        let id, email;
        if (field.type === 'bySelf') {
            id = req.payload._id
            email = req.payload.email
        } else {
            id = req.body.id
            email = req.body.email
        }

        if (field.type === 'byAdmin') {
            const userObject = await User.findOne({ _id: id })
            if (userObject) {
                const userRecord = await User.updateOne({ "_id": ObjectId(id) }, { $unset: { accessToken: 1 } });
            }
            return res.json({
                status: true,
                message: 'Successfully logout this user',
            });
        } else {
            return res.json({
                status: false,
                message: 'This user might not be present in our system',
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const deleteUser = catchAsync(async (req, res, next) => {
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
        if (req.query.userID) {
            await User.deleteOne({ _id: req.query.userID });

            return res.status(200).json({
                status: true,
                message: 'User has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'User Id is required field',
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
export const userSignupForMobile = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            salon: Joi.string().required(),
            countryCode: Joi.string().required(),
        });
        const { error, value } = schema.validate({
            name: req.body.name, email: req.body.email, phone: req.body.phone,
            salon: req.body.salon,
            countryCode: req.body.countryCode,
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        if (req.payload) {
            const userRecord = await User.findOne({ phone: req.body.phone, countryCode: req.body.countryCode })
            if (userRecord) {
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, req.body.countryCode, userRecord, 'update')
                if (!isMobilePresent) {
                    const isEmailPresent = await isEmailPresentFn(req.body.email, userRecord, 'update')
                    if (!isEmailPresent) {
                        const result = await User.updateOne({
                            _id: req.payload._id
                        }, {
                            $set: {
                                'email': req.body.email,
                                'phone': req.body.phone,
                                'name': req.body.name,
                                'gender': req.body.gender,
                                'countryCode': req.body.countryCode,
                            }
                        });
                        const io = req.app.get('server-socket');
                        if ( req.body.email && req.body.phone && req.body.name &&  req.body.gender  &&  userRecord.photo && userRecord.photo !== 'https://d1tyy0qmvnnsap.cloudfront.net/default/default.png') {
                            let coinHistoryExist = await CoinsHistory.find({ userId: req.payload._id,actionType: 'complete-profile'});
                           if(coinHistoryExist.length===0){
                               let data = await completeProfile(req.payload._id);
                               if(data && io){
                                const userSocketId = await onlineUsers.find(item => item.user === req.payload._id);
                                if (userSocketId) {
                                    io.to(userSocketId.socketId).emit('complete-profile', data);
                                }
                               }
                           }
                        } 
                        
                        return res.status(200).json({
                            status: true,
                            message: 'Your profile has been updated.',
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Record already present with same email.',
                        });
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
                    message: 'Record already present with same mobile number.'
                });
            }
        } else {
            if (req.body.salon) {
                const isMobilePresent = await isMobilePresentForUserFn(req.body.phone, req.body.countryCode, null, 'register')
                if (!isMobilePresent) {
                    const isEmailPresent = await isEmailPresentFn(req.body.email, null, 'register')
                    if (!isEmailPresent) {
                        const referralCode = await generateUniqueReferralCode();
                        const resultData = await User.create({
                            'email': req.body.email,
                            'userName': req.body.email,
                            'phone': req.body.phone,
                            'name': req.body.name,
                            'salon': req.body.salon,
                            'countryCode': req.body.countryCode,
                            'referralCode' : referralCode?referralCode:'',
                            'referredBy':req.body.referralCode?req.body.referralCode:''
                        })
                        if(referralCode){
                        addCoinsEvent.emit('add-coin-enduser-signup',{
                            user_id:resultData._id,
                        })
                   }
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
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const updateSalonForSuperAdmin = catchAsync(async (req, res, next) => {
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

        const result = await User.updateOne({
            _id: req.payload._id,
            role: 'superadmin'
        }, {
            $set: {
                'salon': req.query.salonID
            }
        })
        if (req.payload.role === 'superadmin') {

            const userData = await User.findOne({ _id: req.payload._id })
            if (userData) {
                const token = await getToken(userData, 1);
                return res.json({
                    status: true,
                    data: token,
                    message: 'User has been updated.',
                });
            }
        }
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
export const changePassword = catchAsync(async (req, res, next) => {
    try {

        let field = req.body;
        let id, email;
        if (field.type === 'bySelf') {
            id = req.payload._id
            email = req.payload.email
        } else {
            id = req.body.id
            email = req.body.email
        }
        const result = await User.findOne({ _id: id })
        if (result) {

            if (field.type === 'byAdmin') {
                const userPassword = await (generatePassword())
                result.setPassword(userPassword);
                result.save();
                await emailEvent.emit('email-service', {
                    toAddress: email.trim(),
                    content: 'Your system generated password is ' + userPassword + '. Please login with same password on dashboard and change password.',
                    subject: 'System generated password',
                    file: null
                })
            } else {
                const userPassword = field.password
                result.setPassword(userPassword);
                result.save();
            }
            return res.json({
                status: true,
                message: field.type === 'bySelf' ? 'Successfully password changed' : 'Password sent successfully',
            });
        } else {
            return res.json({
                status: false,
                message: 'Updates failed',
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const forgotPassword = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        const salon = await User.findOne({ name: req.query.name, active: true });
        const result = await User.findOne({ email: field.email, salon: salon._id, active: true })
        if (result) {
            const userPassword = await (generatePassword())
            result.setPassword(userPassword);
            result.save();
            await emailEvent.emit('email-service', {
                toAddress: field.email.trim(),
                content: 'Your system generated password is ' + userPassword + '. Please login with same password on dashboard and change password.',
                subject: 'System generated password',
                file: null
            })
            return res.json({
                status: true,
                message: 'Password sent successfully',
            });
        } else {
            return res.json({
                status: false,
                message: 'Updates failed',
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const deviceIDUpdate = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            userDeviceID: Joi.string().required()
        });
        const { error, value } = schema.validate({ userDeviceID: req.body.userDeviceID }, options);

        if (error) {
            return ({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.payload._id) {
            const result = await User.updateOne({
                _id: req.payload._id
            }, {
                $set: {
                    userDeviceID: req.body.userDeviceID
                }
            })
            return res.status(200).json({
                status: true,
                message: 'User has been updated.',
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'User not found'
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const updateUserProfileImage = catchAsync(async (req, res, next) => {
    try {
        if (req.payload._id) {
            if (req.file) {
                const userObject = {}
                const imageUploadResult = await imageUploadService(constant.userImage, req.file);
                if (imageUploadResult.status) {
                    userObject.photo = await cloudFrontUrl(imageUploadResult.data.Key);
                    userObject.photoKey = imageUploadResult.data.Key;
                    const result = await User.updateOne({
                        _id: req.payload._id
                    }, {
                        $set: {
                            photo: userObject.photo,
                            photoKey: userObject.photoKey,
                            name: req.body.name,
                            description: req.body.description,
                            phone: req.body.phone,

                        }
                    })
                    //added for reward socket
                    const userData = await User.findOne({_id:req.payload._id});
                    const io = req.app.get('server-socket');
                    if ( userData.email && userData.phone && userData.name &&  userData.gender  &&  userData.photo && userData.photo !== 'https://d1tyy0qmvnnsap.cloudfront.net/default/default.png') {
                        let coinHistoryExist = await CoinsHistory.find({ userId: req.payload._id,actionType: 'complete-profile'});
                       if(coinHistoryExist.length===0){
                           let data = await completeProfile(req.payload._id);
                           if(data && io){
                            const userSocketId = await onlineUsers.find(item => item.user === req.payload._id);
                            if (userSocketId) {
                                io.to(userSocketId.socketId).emit('complete-profile', data);
                            }
                           }
                       }
                    } 
                    return res.status(200).json({
                        status: true,
                        message: 'Your profile image has been uploaded.',
                    });
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Exception throws while uploading profile image.'
                    });
                }
            } else {
                const result = await User.updateOne({
                    _id: req.payload._id
                }, {
                    $set: {
                        name: req.body.name,
                        description: req.body.description,
                        phone: req.body.phone,
                    }
                })
                return res.status(200).json({
                    status: true,
                    message: 'User has been updated.',
                });
            }

        } else {
            return res.status(200).json({
                status: false,
                message: 'User not found'
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
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
async function isMobilePresentForUserFn(mobile, countryCode = '+1', user, type) {
    try {
        const userRecord = await User.findOne({ phone: mobile, countryCode })
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

//onboarding API start v1

export const onBoardSignUp = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        if (field.stylist.length > field.maxCalendar) {
            return res.json({
                status: false,
                message: 'RangeError: Maximum stylist calendar stack size exceeded. Current size is ' + field.maxCalendar,
            });
        }
        if (field.payment && field.payment.id) {
            const { id, promotion_code } = field.payment;
            if (field.salon) {
                const userRecord = await User.findOne({ phone: field.salon.phone, 'countryCode': field.salon.countryCode, role: 'salon' });
                if (!userRecord) {
                    const isEmailPresent = await User.findOne({ email: field.salon.email.trim(), role: 'salon' })
                    if (!isEmailPresent) {
                        const slots = field.businessHours.filter(it => it.slot.length)
                        const firstSlot = slots[0].slot[0]
                        let salonObject = {};
                        salonObject.email = field.salon.email.trim();
                        salonObject.userName = field.salon.email.trim();
                        salonObject.phone = field.salon.phone;
                        salonObject.countryCode = field.salon.countryCode;
                        salonObject.countryCode = field.salon.countryCode;
                        salonObject.name = field.salon.name;
                        salonObject.address = field.salon.address;
                        salonObject.role = 'salon';
                        salonObject.isMultiRole = field.salon.multiRole
                        const salonResult = await User.create(salonObject);
                        salonResult.setPassword(field.salon.password);
                        salonResult.save();
                        if (salonResult._id) {
                            const paymentDetails = await stripePayment({
                                payment_method: id,
                                email: salonObject.email,
                                name: salonObject.name,
                                plan: field.subscription && field.subscription.plan,
                                clientId: salonResult._id,
                                promotion_code: promotion_code
                            })
                            if (paymentDetails.statusCode === 400) {
                                await User.remove({ email: field.salon.email.trim(), role: 'salon' });
                                return res.status(200).json({
                                    status: false,
                                    data: paymentDetails,
                                    message: 'Payment Failed',
                                });
                            }
                            if (field.stylist && field.stylist.length > 0) {
                                for (let index = 0; index < field.stylist.length; index++) {
                                    const item = field.stylist[index];
                                    let recurringType = 'month';
                                    const userPassword = await (generatePassword());
                                    const stylistData = await User.create({
                                        'email': item.email,
                                        'userName': item.email,
                                        'phone': item.phone,
                                        'countryCode': field.salon.countryCode,
                                        'name': item.name,
                                        'countryCode': field.salon.countryCode,
                                        'gender': item.gender,
                                        'salon': salonResult._id,
                                        'startTime': firstSlot.startTime,
                                        'endTime': firstSlot.endTime,
                                        'role': 'stylist',
                                        'availableRole': item.multiRole ? ['salon', 'stylist'] : [],
                                        'isMultiRole': item.multiRole,
                                    });
                                    stylistData.setPassword(userPassword);
                                    stylistData.save();

                                    if (stylistData._id) {
                                        if (field.businessHours && field.businessHours.length > 0) {
                                            const settings = await User.findOne(
                                                { _id: stylistData._id, active: true, role: 'stylist' },
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

                                            const startBreakTime = new Date();
                                            startBreakTime.setHours(settings.startTime.split(':')[0])
                                            startBreakTime.setMinutes(settings.startTime.split(':')[1])
                                            const endBreakTime = new Date();
                                            endBreakTime.setHours(settings.endTime.split(':')[0])
                                            endBreakTime.setMinutes(settings.endTime.split(':')[1])
                                            if (settings.recurringType) { recurringType = settings && settings.recurringType };
                                            const start = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));
                                            const entryDate = moment(Math.round(new Date().getTime())).subtract(1, 'days').utcOffset(-Number((req.query.offset)));
                                            const end = moment(Math.round(new Date().getTime())).endOf(recurringType).format('YYYY-MM-DD hh:mm');
                                            var dates = [];
                                            while (start.isBefore(end)) {
                                                const currentDate = start.format('MM/DD/YYYY');
                                                dates.push({ date: currentDate, day: moment(currentDate).format('ddd') });
                                                start.add(1, 'days');
                                            }
                                            const appointmetsToAdd = [];

                                            if (stylistData._id) {
                                                const creatHours = await BusinessHour.create({
                                                    slots: field.businessHours,
                                                    salon: salonResult._id,
                                                    stylist: stylistData._id
                                                })
                                            } else {
                                                const deleteData = await AppointmentAvailability.deleteMany({
                                                    isBusinessHour: true,
                                                    appointmentList: {
                                                        $eq: []
                                                    },
                                                    dateAsADate: {
                                                        $gte: new Date(entryDate)
                                                    },
                                                    salon: salonResult._id,
                                                    stylist: stylistData._id
                                                });
                                            }

                                            for (const slotItem of slots) {
                                                const requredDates = dates.filter(item => item.day === slotItem.day);
                                                for (const singleDate of requredDates) {
                                                    let currentDate = moment(Math.round(new Date(singleDate.date).getTime())).utcOffset(-Number((req.query.offset)))
                                                    let currentWeek = moment(currentDate).format('WW GGGG')
                                                    let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                                                    let month = moment(currentDate).format('MM')
                                                    let date = moment(currentDate).format('DD')

                                                    for (const slotTime of slotItem.slot) {
                                                        let timeStops = await getTimeStops(slotTime.startTime, slotTime.endTime, 30);
                                                        for (const slotbreak of timeStops) {
                                                            const slotbreakDateTime = new Date();
                                                            slotbreakDateTime.setHours(slotbreak.split(':')[0])
                                                            slotbreakDateTime.setMinutes(slotbreak.split(':')[1])
                                                            let isNot = (slotbreakDateTime >= startBreakTime && slotbreakDateTime <= endBreakTime);
                                                            if (settings.isBreakTimeCompulsory && isNot) {
                                                                console.log('return');
                                                            } else {
                                                                const appointmentData = await getAppointmentByDateAndTime(slotbreak, singleDate.date, salonResult._id, stylistData._id)
                                                                if (!appointmentData) {
                                                                    let timeObject = {};
                                                                    timeObject.timeAsADate = slotbreak
                                                                    timeObject.timeAsAString = await timeConvertTo12Hr(slotbreak)
                                                                    timeObject.isAvailable = true;

                                                                    let appointment = {
                                                                        salon: salonResult._id,
                                                                        stylist: stylistData._id,
                                                                        dateAsADate: new Date(singleDate.date),
                                                                        dateAsAString: singleDate.date,
                                                                        isAvailable: true,
                                                                        week: currentWeek.split(' ')[0],
                                                                        year: currentWeek.split(' ')[1],
                                                                        weekDay, date, month,
                                                                        offset: req.query.offset,
                                                                        timeData: [timeObject],
                                                                        isBusinessHour: true,
                                                                    };

                                                                    appointmetsToAdd.push(appointment)
                                                                }
                                                            }
                                                        }
                                                    }

                                                }
                                            }
                                            const result = await AppointmentAvailability.insertMany(appointmetsToAdd);
                                        }
                                        let emailobject = await emailEvent.emit('email-service', {
                                            toAddress: item.email.trim(),
                                            content: 'Your system generated password is ' + userPassword + ' . Please login with same password on dashboard and change password.',
                                            subject: 'System generated password',
                                            file: null
                                        });


                                    }
                                }

                                await emailEvent.emit('email-service', {
                                    toAddress: salonObject.email.trim(),
                                    content: 'You have successfully register on portal and your password is ' + field.salon.password + ' . Please login with same password on dashboard.',
                                    subject: `Welcome ${salonObject.name}`,
                                    file: null
                                });
                                return res.status(200).json({
                                    status: true,
                                    data: paymentDetails,
                                    message: 'Payment Done',
                                    paymentStatus: 'success'
                                });
                            } else {
                                return res.status(200).json({
                                    status: true,
                                    data: paymentDetails,
                                    message: 'Payment Done',
                                    paymentStatus: 'success'
                                });
                            }
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Record already present with same email id.',
                        });
                    }

                } else {
                    return res.json({
                        status: false,
                        message: 'Record already present with same mobile number.',
                    });
                }
            }
        } else {
            return res.json({
                status: false,
                message: 'Payment failed.',
            });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: false,
            message: err.message
        });
    }
});

//onboarding API start v2


export const onBoardSignUpNew = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;
        if (field.stylist.length > field.maxCalendar) {
            return res.json({
                status: false,
                message: 'RangeError: Maximum stylist calendar stack size exceeded. Current size is ' + field.maxCalendar,
            });
        }
        if (field.payment && field.payment.id) {
            const { id, promotion_code } = field.payment;
            if (field.salon) {
                const userRecord = await User.findOne({ phone: field.salon.phone, 'countryCode': field.salon.countryCode, role: 'salon' });
                if (!userRecord) {
                    const isEmailPresent = await User.findOne({ email: field.salon.email.trim(), role: 'salon' })
                    if (!isEmailPresent) {
                        const slots = field.businessHours.filter(it => it.slot.length)
                        const firstSlot = slots[0].slot[0]
                        let salonObject = {};
                        salonObject.email = field.salon.email.trim();
                        salonObject.userName = field.salon.email.trim();
                        salonObject.phone = field.salon.phone;
                        salonObject.countryCode = field.salon.countryCode;
                        salonObject.currency = currency[field.salon.countryCode] || "$"
                        salonObject.name = field.salon.name;
                        salonObject.address = field.salon.address;
                        salonObject.role = 'salon';
                        salonObject.isMultiRole = field.salon.multiRole;
                        salonObject.referralCode = await generateUniqueReferralCode();
                        const salonResult = await User.create(salonObject);
                        salonResult.setPassword(field.salon.password);
                        salonResult.save();
                        if (salonResult._id) {
                            const paymentDetails = await stripePaymentNew({
                                payment_method: id,
                                email: salonObject.email,
                                name: salonObject.name,
                                plan: field.subscription && field.subscription.plan,
                                quantity: field.subscription && field.subscription.quantity,
                                clientId: salonResult._id,
                                promotion_code: promotion_code
                            })
                            if (paymentDetails.statusCode === 400) {
                                await User.remove({ email: field.salon.email.trim(), role: 'salon' });
                                return res.status(200).json({
                                    status: false,
                                    data: paymentDetails,
                                    message: 'Payment Failed',
                                });
                            }
                            if (field.stylist && field.stylist.length > 0) {
                                for (let index = 0; index < field.stylist.length; index++) {
                                    const item = field.stylist[index];
                                    let recurringType = 'month';
                                    const userPassword = await (generatePassword());
                                    const stylistData = await User.create({
                                        'email': item.email,
                                        'userName': item.email,
                                        'phone': item.phone,
                                        'countryCode': field.salon.countryCode,
                                        'currency':salonObject.currency,
                                        'name': item.name,
                                        'gender': item.gender,
                                        'salon': salonResult._id,
                                        'startTime': firstSlot.startTime,
                                        'endTime': firstSlot.endTime,
                                        'role': 'stylist',
                                        'availableRole': item.multiRole ? ['salon', 'stylist'] : [],
                                        'isMultiRole': item.multiRole,
                                    });
                                    stylistData.setPassword(userPassword);
                                    stylistData.save();

                                    if (stylistData._id) {
                                        if (field.businessHours && field.businessHours.length > 0) {
                                            const settings = await User.findOne(
                                                { _id: stylistData._id, active: true, role: 'stylist' },
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

                                            const startBreakTime = new Date();
                                            startBreakTime.setHours(settings.startTime.split(':')[0])
                                            startBreakTime.setMinutes(settings.startTime.split(':')[1])
                                            const endBreakTime = new Date();
                                            endBreakTime.setHours(settings.endTime.split(':')[0])
                                            endBreakTime.setMinutes(settings.endTime.split(':')[1])
                                            if (settings.recurringType) { recurringType = settings && settings.recurringType };
                                            const start = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)));
                                            const entryDate = moment(Math.round(new Date().getTime())).subtract(1, 'days').utcOffset(-Number((req.query.offset)));
                                            const end = moment(Math.round(new Date().getTime())).endOf(recurringType).format('YYYY-MM-DD hh:mm');
                                            var dates = [];
                                            while (start.isBefore(end)) {
                                                const currentDate = start.format('MM/DD/YYYY');
                                                dates.push({ date: currentDate, day: moment(currentDate).format('ddd') });
                                                start.add(1, 'days');
                                            }
                                            const appointmetsToAdd = [];

                                            if (stylistData._id) {
                                                const creatHours = await BusinessHour.create({
                                                    slots: field.businessHours,
                                                    salon: salonResult._id,
                                                    stylist: stylistData._id
                                                })
                                            } else {
                                                const deleteData = await AppointmentAvailability.deleteMany({
                                                    isBusinessHour: true,
                                                    appointmentList: {
                                                        $eq: []
                                                    },
                                                    dateAsADate: {
                                                        $gte: new Date(entryDate)
                                                    },
                                                    salon: salonResult._id,
                                                    stylist: stylistData._id
                                                });
                                            }

                                            for (const slotItem of slots) {
                                                const requredDates = dates.filter(item => item.day === slotItem.day);
                                                for (const singleDate of requredDates) {
                                                    let currentDate = moment(Math.round(new Date(singleDate.date).getTime())).utcOffset(-Number((req.query.offset)))
                                                    let currentWeek = moment(currentDate).format('WW GGGG')
                                                    let weekDay = await getWeekDay(moment(currentDate).isoWeekday()) // returns 1-7 where 1 is Monday and 7 is Sunday
                                                    let month = moment(currentDate).format('MM')
                                                    let date = moment(currentDate).format('DD')

                                                    for (const slotTime of slotItem.slot) {
                                                        let timeStops = await getTimeStops(slotTime.startTime, slotTime.endTime, 30);
                                                        for (const slotbreak of timeStops) {
                                                            const slotbreakDateTime = new Date();
                                                            slotbreakDateTime.setHours(slotbreak.split(':')[0])
                                                            slotbreakDateTime.setMinutes(slotbreak.split(':')[1])
                                                            let isNot = (slotbreakDateTime >= startBreakTime && slotbreakDateTime <= endBreakTime);
                                                            if (settings.isBreakTimeCompulsory && isNot) {
                                                                console.log('return');
                                                            } else {
                                                                const appointmentData = await getAppointmentByDateAndTime(slotbreak, singleDate.date, salonResult._id, stylistData._id)
                                                                if (!appointmentData) {
                                                                    let timeObject = {};
                                                                    timeObject.timeAsADate = slotbreak
                                                                    timeObject.timeAsAString = await timeConvertTo12Hr(slotbreak)
                                                                    timeObject.isAvailable = true;

                                                                    let appointment = {
                                                                        salon: salonResult._id,
                                                                        stylist: stylistData._id,
                                                                        dateAsADate: new Date(singleDate.date),
                                                                        dateAsAString: singleDate.date,
                                                                        isAvailable: true,
                                                                        week: currentWeek.split(' ')[0],
                                                                        year: currentWeek.split(' ')[1],
                                                                        weekDay, date, month,
                                                                        offset: req.query.offset,
                                                                        timeData: [timeObject],
                                                                        isBusinessHour: true,
                                                                    };

                                                                    appointmetsToAdd.push(appointment)
                                                                }
                                                            }
                                                        }
                                                    }

                                                }
                                            }
                                            const result = await AppointmentAvailability.insertMany(appointmetsToAdd);
                                        }
                                        let emailobject = await emailEvent.emit('email-service', {
                                            toAddress: item.email.trim(),
                                            content: 'Your system generated password is ' + userPassword + ' . Please login with same password on dashboard and change password.',
                                            subject: 'System generated password',
                                            file: null
                                        });


                                    }
                                }
                        
                                if(req.body.referralCode){
                                     addCoinsEvent.emit('add-referal-coin',{
                                     user_id:salonResult._id,
                                     referralCode:req.body.referralCode
                                    })
                                }

                                await emailEvent.emit('email-service', {
                                    toAddress: salonObject.email.trim(),
                                    content: 'You have successfully register on portal and your password is ' + field.salon.password + ' . Please login with same password on dashboard.',
                                    subject: `Welcome ${salonObject.name}`,
                                    file: null
                                });
                                return res.status(200).json({
                                    status: true,
                                    data: paymentDetails,
                                    message: 'Payment Done',
                                    paymentStatus: 'success'
                                });
                            } else {
                                return res.status(200).json({
                                    status: true,
                                    data: paymentDetails,
                                    message: 'Payment Done',
                                    paymentStatus: 'success'
                                });
                            }
                        }
                    } else {
                        return res.json({
                            status: false,
                            message: 'Record already present with same email id.',
                        });
                    }

                } else {
                    return res.json({
                        status: false,
                        message: 'Record already present with same mobile number.',
                    });
                }
            }
        } else {
            return res.json({
                status: false,
                message: 'Payment failed.',
            });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: false,
            message: err.message
        });
    }
});


export const onBoardCompelete = catchAsync(async (req, res, next) => {
    const { clientId, plan } = req.body;

    const schema = Joi.object({
        clientId: Joi.string().required(),
        plan: Joi.string().required(),
    });

    const { error, value } = schema.validate({ clientId: clientId, plan: plan }, options);

    if (error) {
        return res.status(200).json({
            status: false,
            message: `${error.details.map(x => x.message).join(', ')}`,
        });
    }

    const client = await User.findById(clientId);

    if (!client) {
        return res.status(200).json({
            status: false,
            message: 'No data found',
        });
    }

    const planData = await stripe.plans.retrieve(plan);

    if (!planData) {
        return res.status(200).json({
            status: false,
            message: 'Please provide valid plan id',
        });
    }

    const productData = await SubscriptionPlan.findOne({ productId: planData.product });

    if (!productData) {
        return res.status(200).json({
            status: false,
            message: 'Please provide valid plan id'
        });
    }

    const duration = planData.interval === 'month' ? 1 : 12;
    let packageExpiry = new Date(Date.now());
    packageExpiry.setMonth(packageExpiry.getMonth() + duration);

    client.maxCalendar = planData.metadata && planData.metadata.calendars ? planData.metadata.calendars : 0
    client.subscription.push({
        startDate: new Date(Date.now()),
        packageExpiry: packageExpiry,
        package: productData._id,
        plan: plan,
        maxCalendar: planData.metadata && planData.metadata.calendars ? planData.metadata.calendars : 0,
        active: true
    })

    client.save();

    return res.status(200).json({ status: true, message: 'success' });
});

// export const checkSalonStylistDeatils = catchAsync(async (req, res, next) => {

//     const { salon, stylist } = req.body;

//     if (!salon || !salon.email || !salon.phone || !salon.countryCode || !stylist || !stylist.phone || !stylist.email) {
//         return res.status(200).json({ msg: "Please provide salon and stylist details",status:false });
//     }


//     const salonWithPhone = await User.findOne({ phone :salon.phone , 'countryCode': salon.countryCode , role: 'salon'});

//     if(salonWithPhone) return res.status(200).json({msg:"Salon alredy there with that phone number",status:false});

//     const salonWithEmail = await User.findOne({ email:salon.email , role:'salon'});

//     if(salonWithEmail) return res.status(200).json({msg:"Salon alredy there with this email", status:false});

//     const stylistWithPhone = await User.findOne({phone:stylist[0].phone, 'countryCode': salon.countryCode , role:"stylist"});

//     if(stylistWithPhone) return res.status(200).json({msg:"Stylist with mobile no alredy there",status:false});

//     const stylistWithEmail = await User.findOne({email: stylist[0].email, role: { $ne: 'salon' }});

//     if(stylistWithEmail) return res.status(200).json({msg:"Stylist with this no alredy prsent"});


// })



//onBoardingAPI end  v1 


export const checkSalonStylistDeatils = catchAsync(async (req, res, next) => {
    const { salon, stylist } = req.body;
     console.log(salon,stylist)
   
    if (!salon || !salon.email || !salon.phone || !salon.countryCode || !stylist || !stylist[0].phone || !stylist[0].email) {
        return res.status(400).json({ msg: "Please provide all required salon and stylist details.", status: false });
    }

    // Check for existing salon with the same phone number and country code
    const salonWithPhone = await User.findOne({ phone: salon.phone, countryCode: salon.countryCode, role: 'salon' });
    if (salonWithPhone) {
        return res.status(400).json({ msg: "A salon with this phone number already exists.", status: false });
    }

    // Check for existing salon with the same email
    const salonWithEmail = await User.findOne({ email: salon.email, role: 'salon' });
    if (salonWithEmail) {
        return res.status(400).json({ msg: "A salon with this email address already exists.", status: false });
    }

    // Check for existing stylist with the same phone number and country code
    const stylistWithPhone = await User.findOne({ phone: stylist[0].phone, countryCode: salon.countryCode, role: 'stylist' });
    if (stylistWithPhone) {
        return res.status(400).json({ msg: "A stylist with this phone number already exists.", status: false });
    }

    // Check for existing stylist with the same email
    const stylistWithEmail = await User.findOne({ email: stylist[0].email, role: { $ne: 'salon' } });
    if (stylistWithEmail) {
        return res.status(400).json({ msg: "A stylist with this email address already exists.", status: false });
    }

    return res.status(200).json({ msg: "Salon and stylist details are valid.", status: true });
});


async function stripePayment(formData) {
    try {

        const { name, email, plan, payment_method, clientId, promotion_code } = formData;

        const client = await User.findById(clientId).select('+stripeCustomerID +stripeSubscriptionID');
        if (!client) {
            return null;
        }

        const customer = await stripe.customers.create({
            payment_method: payment_method,
            name,
            email,
            invoice_settings: {
                default_payment_method: payment_method
            }
        });

        const subData = {
            customer: customer.id,
            items: [{ plan: plan }],
            expand: ['latest_invoice.payment_intent']
        };

        if (promotion_code) subData.promotion_code = promotion_code;
        const subscription = await stripe.subscriptions.create(subData);

        client.stripeCustomerID = customer.id;
        client.stripeSubscriptionID = subscription.id;
        client.save();

        const status = subscription['latest_invoice']['payment_intent']['status'];
        const client_secret = subscription['latest_invoice']['payment_intent']['client_secret'];

        return { clientId: clientId, client_secret: client_secret, status: status };
    } catch (error) {
        return error
    }
}

//onBoardingAPI end   v2
async function stripePaymentNew(formData) {
    try {

        const { name, email, plan, payment_method, clientId, promotion_code, quantity } = formData;

        const client = await User.findById(clientId).select('+stripeCustomerID +stripeSubscriptionID +stylistCount +maxCalendar');
        if (!client) {
            return null;
        }

        const customer = await stripe.customers.create({
            payment_method: payment_method,
            name,
            email,
            invoice_settings: {
                default_payment_method: payment_method
            }
        });

        const subData = {
            customer: customer.id,
            items: [{ plan: plan, quantity: quantity, }],
            expand: ['latest_invoice.payment_intent'],
            default_tax_rates: [process.env.STRIPE_TAX_RATE_ID]
        };

        if (promotion_code) subData.promotion_code = promotion_code;
        const subscription = await stripe.subscriptions.create(subData);
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice.id);

        console.log('Invoice Details:');
        console.log(`Invoice ID: ${invoice.id}`);
        console.log(`Amount Paid: $${(invoice.amount_paid / 100).toFixed(2)}`);
        console.log(`Amount Due: $${(invoice.amount_due / 100).toFixed(2)}`);
        console.log(`Currency: ${invoice.currency}`);
        console.log(`Status: ${invoice.status}`);
        console.log(`Promotion Code: ${promotion_code || 'None'}`);
        console.log(`Tax Amount: $${(invoice.amount || 0) / 100}`);
        console.log('Invoice Items:');
        for (const item of invoice.lines.data) {
            console.log(`  Description: ${item.description}`);
            console.log(`  Amount: $${(item.amount / 100).toFixed(2)}`);
            console.log(`  Quantity: ${item.quantity}`);
        }

        client.stripeCustomerID = customer.id;
        client.stripeSubscriptionID = subscription.id;
        client.stylistCount = quantity;
        client.maxCalendar = quantity;
        client.save();

        const status = subscription['latest_invoice']['payment_intent']['status'];
        const client_secret = subscription['latest_invoice']['payment_intent']['client_secret'];

        return { clientId: clientId, client_secret: client_secret, status: status };
    } catch (error) {
        return error
    }
}

async function getAppointmentByDateAndTime(time, date, salon, stylist) {
    let checkDate = [date]
    if (date.includes('-')) {
        checkDate.push(date.replace(/\-/g, '/'))
    } else {
        checkDate.push(date.replace(/\//g, '-'))
    }
    const appointment = await Appointment.findOne({ dateAsAString: { $in: checkDate }, timeAsADate: time, stylist: stylist, salon: salon })
    return appointment;
}

async function generatePassword() {
    // tslint:disable-next-line:max-line-length
    return getRandomString(4) + getRandomStringCaps(1) + getRandomNumber(1) + getRandomSymbol(1) + getRandomString(4);
}


function getRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomStringCaps(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomNumber(length) {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomSymbol(length) {
    let result = '';
    const characters = '$@!%*?&';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//LOCAL FUNCTION
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
async function timeConvertTo12Hr(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('');
}

async function getTimeStops(start, end, gap) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
    }

    var timeStops = [];

    while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format('HH:mm'));
        startTime.add(gap, 'minutes');
    }
    return timeStops;
}

async function numberConvertTo24Hr(time) {
    const timeInString = time.toString();
    const timeLength = timeInString.length;
    if (timeLength === 3) {
        let oneDigitHrToTwoDigitHr = `0${timeInString}`;
        const timeStringArray = oneDigitHrToTwoDigitHr.split('');
        return `${timeStringArray[0]}${timeStringArray[1]}:${timeStringArray[2]}${timeStringArray[3]}`
    } else {
        const timeStringArray = timeInString.split('');
        return `${timeStringArray[0]}${timeStringArray[1]}:${timeStringArray[2]}${timeStringArray[3]}`
    }
}

async function getUpdatedTime(time, duration) {
    return Number(moment(time, 'HH:mm').add(duration, 'minutes').format('HH:mm').split(':').join(''))
}

async function generateUniqueReferralCode() {
    let referralCode;
    let isUnique = false;

    do {
        referralCode = uuidv4().slice(0, 8).toUpperCase();
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
            isUnique = true; 
        }
    } while (!isUnique);

    return referralCode;
}


async function assignReferralCodesToExistingUsers() {
    try {
        const usersWithoutReferralCode = await User.find({ referralCode: { $exists: false } });

        for (const user of usersWithoutReferralCode) {
            const newReferralCode = await generateUniqueReferralCode();
            user.referralCode = newReferralCode;
            await user.save();
            console.log(`Referral code generated for user ${user._id}: ${newReferralCode}`);
        }

        if (usersWithoutReferralCode.length === 0) {
            console.log("All users already have referral codes.");
        }
    } catch (error) {
        console.error('Error assigning referral codes to users:', error);
    }
}


