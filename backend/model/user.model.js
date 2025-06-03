import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import constant from '../config/index.js';

const User = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name']
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, 'Please enter a valid email address.']
		},
		userName: {
			type: String,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, 'Please enter a valid email address.']
		},
		phone: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true
		},
		photo: {
			type: String,
			default: `${constant.CLOUD_FRONT_URL}default/default.png`
		},
		photoKey: {
			type: String,
			default: ``
		},
		photoDark: {
			type: String,
			default: `${constant.CLOUD_FRONT_URL}default/default.png`
		},
		photoKeyDark: {
			type: String,
			default: ``
		},
		role: {
			type: String,
			enum: ['admin', 'salon', 'stylist', 'user', 'manager', 'superadmin'],
			default: 'user'
		},
		stylistCount:{type:Number},
		hash: { type: String },
		salt: { type: String },
		salon: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [false, 'Stylist must belong to a salon']
		},
		stylist: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [false, 'Stylist must belong to a salon']
		},
		passwordChangedAt: {
			type: Date,
			default: Date.now()
		},
		active: {
			type: Boolean,
			default: true
		},
		gender: {
			type: String,
			default: 'male',
			enum: ['male', 'female', 'other']
		},
		age: {
			type: Number,
			default: 0
		},
		userDeviceID: {
			type: String
		},
		dob: {
			type: String
		},
		appMenu: {},
		packageName: {
			type: String,
			default: 'io.thealgorithm.bookb'
		},
		appID: {
			type: String,
			default: 'id1599670447'
		},
		isSpecialApp: {
			type: Boolean,
			default: false
		},
		webUrl: {
			type: String,
			default: 'http://dashboard.bookb.io/'
		},
		services: [{
			type: mongoose.Schema.ObjectId,
			ref: 'Service'
		}],
		startTime: { type: String, default: '' },
		endTime: { type: String, default: '' },
		lunchStartTime: { type: String, default: '' },
		lunchEndTime: { type: String, default: '' },
		recurringType: {
			type: String,
			default: 'month',
			enum: ['week', 'month', 'year'],
		},
		intervalTime: { type: String, default: '' },
		isBreakTimeCompulsory: {
			type: Boolean,
			default: false
		},
		clientNote: { type: String, default: '' },
		shippingAddress: {},
		billingAddress: {},
		stripeCustomerID: {
			type: String,
			default: '',
			select: false
		},
		stripeSubscriptionID: {
			type: String,
			default: '',
			select: false
		},
		maxCalendar: {
			type: Number,
			default: '',
		},
		subscription: [{
			package: { type: String, default: '' },
			plan: { type: String, default: '' },
			startDate: { type: Date, default: '' },
			packageExpiry: { type: Date, default: '' },
			maxCalendar: { type: Number, default: 0 },
			active: { type: Boolean, default: true }
		}],
		cancel_at_period_end: {
			type: Boolean,
			default: true
		},
		platform: {
			type: String,
			default: 'web',
			enum: ['android', 'ios', 'web']
		},
		deviceInfo: {
			type: String
		},
		deviceId: {
			type: String
		},
		accessToken: {
			type: String
		},
		description: {
			type: String
		},
		userNote: {
			type: String
		},
		countryCode: {
			type: String
		},
		currency:{
			type:String
		},
		availableRole: [],
		isMultiRole: {
			type: Boolean,
			default: false
		},
		addedFrom: {
			type: String,
			enum: ['bulk', 'dashboard'],
			default: 'dashboard'
		},
		referralCode: {
			 type: String, 
		},
		referredBy:{
             type:String,
			 default:''
		},
		coins:{
			type:Number,
			default:0
		},
		isFirstLogin: {
			type: Boolean,
			default: true,
		},		
	},
	{
		timestamps: true
		, usePushEach: true
	}
);

User.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

User.methods.validatePassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};
User.methods.generateJWT = function (days, isTempLogin) {
	const today = new Date();
	const tempLogin = isTempLogin;
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + days);
	return jwt.sign({
		name: this.name,
		email: this.email,
		phone: this.phone,
		_id: this._id,
		address: this.address,
		photo: this.photo,
		role: this.role,
		salon: this.salon,
		active: this.active,
		userIsActiveByAdmin: this.userIsActiveByAdmin,
		isTemporaryLogin: tempLogin,
		gender: this.gender,
		userDeviceID: this.userDeviceID,
		stylist: this.stylist,
		sessionCharges: this.sessionCharges,
		isMultiRole: this.isMultiRole,
		services: this.services,
		exp: parseInt(expirationDate.getTime() / 1000, 10),
	}, constant.JWT_SECRET);
}
User.methods.toAuthJSON = function (token) {
	return {
		token: token,
	};
};
const UserModel = mongoose.model('User', User);

UserModel.findOne({ role: 'admin' }, function (err, user) {
	if (!user) {
		var us = new UserModel({
			email: 'admin@the-algo.com',
			userName: 'admin@the-algo.com',
			name: 'Admin',
			phone: '9999999999',
			role: 'admin',
		});
		us.setPassword('Admin@123')
		us.save((rs) => {
			if (rs)
				console.log('ADMIN CREATED Successfully--------------------')
		})
	}
});


UserModel.findOne({ role: 'superadmin' }, function (err, user) {
	if (!user) {
		var us = new UserModel({
			email: 'superadmin@bookb.com',
			name: 'superadmin',
			userName: 'superadmin@bookb.com',
			phone: '9999999990',
			role: 'superadmin',
		});
		us.setPassword('Teamwork@1234')
		us.save((rs) => {
			if (rs)
				console.log('SUPER ADMIN CREATED Successfully--------------------')
		})
	}
});

export default UserModel;
