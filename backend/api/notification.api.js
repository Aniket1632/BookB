import User from '../model/user.model.js';
import Notification from '../model/notification.model.js';
import { sendNotificationTokens, sendNotificationTopic, sendNotificationToken } from '../services/firebase/send-notification-function.js';

import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import moment from 'moment';
moment.suppressDeprecationWarnings = true;
import Joi from 'joi';
import catchAsync from '../config/catchAsync.js';

const options = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true // remove unknown props
};

export const sendNotification = catchAsync(async (req, res, next) => {
	try {
		const schema = Joi.object({
			title: Joi.string().required(),
			body: Joi.string().required(),
			entryAddedFrom: Joi.string().valid('dashboard', 'app'),
		});
		const { error, value } = schema.validate({ to: req.body.to, title: req.body.title, body: req.body.body, entryAddedFrom: req.body.entryAddedFrom }, options);

		if (error) {
			return res.status(200).json({
				status: false,
				message: `${error.details.map(x => x.message).join(', ')}`,
			});
		}
		let salon = '';
		let deviceID = [];
		let query = {};
		if (req.body.to === 'stylist') {
			query = { salon: req.payload._id, role: 'stylist', userDeviceID: { $nin: ["", null] } }
		} else if (req.body.to === 'user') {
			query = { salon: req.payload._id, role: 'user', userDeviceID: { $nin: ["", null] } }
		} else {
			query = { salon: req.payload._id, userDeviceID: { $nin: ["", null] } }
		}

		if (req.payload.role === 'stylist') {
			salon = req.payload.salon
			deviceID = await User.distinct('userDeviceID', { stylist: req.payload._id, role: 'user', userDeviceID: { $nin: ["", null] } })
		}
		if (req.payload.role === 'salon') {
			salon = req.payload._id
			deviceID = await User.distinct('userDeviceID', query)
		}
		if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
			salon = req.payload.salon
			deviceID = await User.distinct('userDeviceID', query)
		}
		const data = await User.findOne({ _id: req.payload._id });
		if (deviceID.length) {
			const payload = { notificationType: 'notification' }
			const fcmResult = await sendNotificationTokens(req.body.title, req.body.body, deviceID, payload);
			let notificationObject = {
				'title': req.body.title,
				'body': req.body.body,
				'data': payload,
				'response': fcmResult,
				'entryAddedFrom': req.body.entryAddedFrom,
				'salon': salon,
				'offset': req.query.offset,
				'dateByOffset': moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset))),
				'sendType': req.payload.role,
				'sender': req.payload._id
			}
			const result = await Notification.create(notificationObject)

			return res.status(200).json({
				status: true,
				message: 'Notification sent successfully',
			});

		} else {
			return res.status(200).json({ status: false, message: `User list is empty to send a notification` })

		}
	} catch (err) {
		return res.status(200).json({ status: false, message: err.message })
	}
});
export const getNotification = catchAsync(async (req, res, next) => {
	try {

		let query = {}
		let andList = []
		const pageNumber = Number(req.query.pageNumber)
		const pageSize = Number(req.query.pageSize)
		if (req.payload.role === 'stylist') {
			andList.push({
				sender: ObjectId(req.payload._id),
			})
		}
		if (req.payload.role === 'salon') {
			andList.push({
				salon: ObjectId(req.payload._id),

			})
		}
		if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
			andList.push({
				salon: ObjectId(req.payload.salon),

			})
		}


		if (andList.length)
			query.$and = andList;
		const userList = await Notification.aggregate()
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
				return res.status(200).json({ status: false, data: [], message: 'No Result Found.' })
			}
		} else {
			return res.status(200).json({ status: false, data: [], message: 'No Result Found.' })
		}
	} catch (err) {
		return res.status(200).json({ status: false, message: err.message })
	}
});
export const getNotificationForUser = catchAsync(async (req, res, next) => {
	try {

		let query = {}
		let andList = []
		andList.push({
			salon: ObjectId(req.payload.salon),

		})

		if (andList.length)
			query.$and = andList;
		const userList = await Notification.aggregate()
			.match(query)


		if (userList.length) {
			return res.status(200).json({
				status: true, data: {
					result: userList,
				},
				message: 'Data sent successfully'
			})
		} else {
			return res.status(200).json({ status: false, data: [], message: 'No Result Found.' })
		}
	} catch (err) {
		return res.status(200).json({ status: false, message: err.message })
	}
});
export const sendNotificationByUser = catchAsync(async (req, res, next) => {
	try {
		const schema = Joi.object({
			title: Joi.string().required(),
			body: Joi.string().required(),
			entryAddedFrom: Joi.string().valid('dashboard', 'app'),
		});
		const { error, value } = schema.validate({ title: req.body.title, body: req.body.body, entryAddedFrom: req.body.entryAddedFrom }, options);

		if (error) {
			return res.status(200).json({
				status: false,
				message: `${error.details.map(x => x.message).join(', ')}`,
			});
		}
		let salon = '';
		if (req.payload.role === 'stylist') {
			salon = req.payload.salon
		}
		if (req.payload.role === 'salon') {
			salon = req.payload._id

		}
		if (req.payload.role === 'manager' || req.payload.role === 'superadmin') {
			salon = req.payload.salon
		}
		const data = await User.findOne({ _id: req.query._id });
		if (data) {
			const payload = { notificationType: 'notification' }
			const fcmResult = await sendNotificationTokens(req.body.title, req.body.body, [data.userDeviceID], payload);


			return res.status(200).json({
				status: true,
				message: 'Message sent successfully',
			});
		} else {
			return res.status(200).json({ status: false, message: 'Gym not found' })

		}
	} catch (err) {
		return res.status(200).json({ status: false, message: err.message })
	}
});