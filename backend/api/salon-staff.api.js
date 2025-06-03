import User from '../model/user.model.js';

import catchAsync from '../config/catchAsync.js';

import Joi from 'joi';
import mongoose from 'mongoose';
import emailEvent from '../event/email-service.event.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;



export const createSalonStaff = catchAsync(async (req, res, next) => {
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
            let salonId = '';
            if (req.payload.role === 'salon') {
                salonId = req.payload._id
            } else if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
                salonId = req.body.salonId
            } else {
                salonId = req.body.salonId
            }

            const salonData = await User.findOne({ _id: salonId });
            const salonRecord = await User.find({ role: 'stylist', salon: salonId }, {
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
            if (req.body.email && req.body.name) {
                const isEmail = await isEmailPresentFn(req.body.email, '', 'register', salonData.packageName)
                if (!isEmail) {
                    const isMobile = await isMobilePresentForUserFn(req.body.phone, '', 'register')
                    if (!isMobile) {
                        const userData = new User();
                        userData.email = req.body.email.trim();
                        userData.userName = req.body.email.trim();
                        userData.phone = req.body.phone;
                        userData.name = req.body.name;
                        userData.address = req.body.address;
                        userData.salon = salonId;
                        userData.role = req.body.role;
                        userData.setPassword(req.body.password)
                        userData.packageName = salonData.packageName;
                        userData.webUrl = salonData.webUrl;

                        const signUpResult = await User.create(userData);
                        await emailEvent.emit('email-service', {
                            toAddress: req.body.email.trim(),
                            content: 'Your system generated password is ' + req.body.password + '. Please login with same password on dashboard and change password.',
                            subject: 'System generated password',
                            file: null
                        })
                        return res.status(200).json({
                            status: true,
                            message: 'Salon staff created successfully',
                        })
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Phone already present in the system',
                        })
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
            const salonData = await User.findOne({ _id: req.body.id });
            let isEmail = false
            if (req.body.email)
                isEmail = await isEmailPresentFn(req.body.email, salonData, 'update')
            if (!isEmail) {
                let isMobile = false
                if (req.body.phone)
                    isMobile = await isMobilePresentForUserFn(req.body.phone, '', 'update')
                if (!isMobile) {
                    let userObject = {
                        name: req.body.name,
                        address: req.body.address,
                    }
                    if (req.body.email) userObject.email = req.body.email
                    if (req.body.phone) userObject.phone = req.body.phone

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
                        message: 'Phone already present in the system',
                    })
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Email already present in the system',
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

export const getAllSalonStaff = catchAsync(async (req, res, next) => {
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
        let salonId = '';
        let roleArray = []
        if (req.payload.role === 'salon') {
            salonId = req.payload._id
            roleArray = ['salon', 'user', 'stylist', 'superadmin', 'company', 'admin']
            andList.push({
                role: {
                    $nin: roleArray
                },
                salon: ObjectId(salonId)
            })
        }
        if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
            salonId = req.payload.salon
            roleArray = ['salon', 'user', 'stylist', 'superadmin', 'company', 'admin']
            andList.push({
                role: {
                    $nin: roleArray
                },
                salon: ObjectId(salonId)

            })
        }
        if (req.payload.role === 'admin') {
            roleArray = ['salon', 'user', 'stylist', 'company', 'admin']
            andList.push({
                role: {
                    $nin: roleArray
                },
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
export const deleteSalonStaff = catchAsync(async (req, res, next) => {
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
                message: 'Salon staff has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Salon staff Id is required field',
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

