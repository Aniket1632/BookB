import User from '../model/user.model.js';
import catchAsync from '../config/catchAsync.js';
import moment from 'moment';
import Joi from 'joi';
import mongoose from 'mongoose';
import emailEvent from '../event/email-service.event.js';
import { AppointmentAvailability } from '../model/appointment-availability.model.js';
import Appointment from '../model/appointment.model.js';
import BusinessHour from '../model/businessHour.model.js';
import Stripe from 'stripe';
import SubscriptionPlan from '../model/subscription-plan.model.js';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';
import { constant } from '../config/constants.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
const stripe = new Stripe(process.env.stripeSecretKey)

export const getUserByToken = catchAsync(async (req, res, next) => {
    try {
        // const io = req.app.get('server-socket');

        // if (io) {
        //     const onlineUser = await onlineUsers.find(item => item.stylist === req.payload._id)
        //     if (onlineUser) {
        //         io.to(onlineUser.socketId).emit('appointment-request', {
        //             message: `Your appointment has been scheduled`,
        //         });
        //     }
        // }
        const user = await User.findOne({ _id: req.payload._id, active: true }, { salt: 0, hash: 0, __v: 0, subscription: 0 }).populate('salon').populate('stylist').populate('services')
        if (user) {
            return res.status(200).json({
                status: true,
                message: 'Date send successfully',
                data: user
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
export const updateUser = catchAsync(async (req, res, next) => {
    try {
        const userObject = {}

        if (req.payload._id) {
            if (req.file) {
                const imageUploadResult = await imageUploadService(constant.userImage, req.file);
                if (imageUploadResult.status) {
                    userObject.photo = await cloudFrontUrl(imageUploadResult.data.Key);
                    userObject.photoKey = imageUploadResult.data.Key;
                    userObject.name = req.body.name;
                    userObject.description = req.body.description;
                    userObject.phone = req.body.phone;
                    userObject.email = req.body.email;
                    userObject.lunchStartTime = req.body.lunchStartTime;
                    userObject.lunchEndTime = req.body.lunchEndTime;

                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Exception throws while uploading profile image.'
                    });
                }
            } else {
                userObject.name = req.body.name;
                userObject.description = req.body.description;
                userObject.phone = req.body.phone;
                userObject.email = req.body.email;
                userObject.lunchStartTime = req.body.lunchStartTime;
                userObject.lunchEndTime = req.body.lunchEndTime;
            }
            const result = await User.updateOne({
                _id: req.payload._id
            }, {
                $set: userObject
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
export const updatePassword = catchAsync(async (req, res, next) => {
    try {

        let field = req.body;
        let id, email;
        id = req.payload._id
        email = req.payload.email
        User.findOne({ email: email, active: true })
            .then(async (user) => {
                if (!user || !user.validatePassword(field.oldPassword)) {
                    return res.json({ status: false, message: 'Invalid old password' })
                }
            });
        const result = await User.findOne({ _id: id })
        if (result) {
            const userPassword = field.password
            result.setPassword(userPassword);
            result.save();
            return res.json({
                status: true,
                message: 'Successfully password changed',
            });
        } else {
            return res.json({
                status: false,
                message: 'User not found',
            });
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const updateNote = catchAsync(async (req, res, next) => {
    try {
        if (req.query.user) {
            const result = await User.updateOne({
                _id: req.query.user
            }, {
                $set: {
                    userNote: req.body.userNote
                }
            })
            return res.status(200).json({
                status: true,
                message: 'Note has been updated.',
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
export const getNote = catchAsync(async (req, res, next) => {
    try {
        if (req.query.user) {
            const result = await User.findById(req.query.user, { userNote: 1 })
            return res.status(200).json({
                status: true,
                data: result,
                message: 'Data successfully send ',
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


//onbording API start

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
                const userRecord = await User.findOne({ phone: field.salon.phone, role: 'salon' });
                if (!userRecord) {
                    const isEmailPresent = await User.findOne({ email: field.salon.email.trim(), role: 'salon' })
                    if (!isEmailPresent) {
                        let salonObject = {};
                        salonObject.email = field.salon.email.trim();
                        salonObject.userName = field.salon.email.trim();
                        salonObject.phone = field.salon.phone;
                        salonObject.countryCode = field.salon.countryCode
                        salonObject.name = field.salon.name;
                        salonObject.address = field.salon.address;
                        salonObject.role = 'salon';
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
                                field.stylist.map(async (item) => {
                                    let recurringType = 'month';
                                    const userPassword = await (generatePassword());
                                    const stylistData = await User.create({
                                        'email': item.email,
                                        'userName': item.email,
                                        'phone': item.phone,
                                        'name': item.name,
                                        'gender': item.gender,
                                        'salon': salonResult._id,
                                        'role': 'stylist'
                                    });
                                    stylistData.setPassword(userPassword);
                                    stylistData.save();

                                    if (stylistData._id) {
                                        let emailobject = await emailEvent.emit('email-service', {
                                            toAddress: item.email.trim(),
                                            content: 'Your system generated password is ' + userPassword + ' . Please login with same password on dashboard and change password.',
                                            subject: 'System generated password',
                                            file: null
                                        });

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
                                            const slots = field.businessHours.filter(it => it.slot.length)
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
                                    }
                                })

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


//onBoardingAPI end   
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