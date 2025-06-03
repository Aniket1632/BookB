import VideoAnalytics from '../model/video-analytics.model.js';
import Video from '../model/video.model.js';

import catchAsync from '../config/catchAsync.js';
import moment from 'moment';
import mongoose from 'mongoose';
import videoAnalyticsEvent from '../event/video.event.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
moment.suppressDeprecationWarnings = true;
const ObjectId = mongoose.Types.ObjectId;


export const addAnalytics = catchAsync(async (req, res, next) => {
    try {

        const currentDate = moment(Math.round(new Date().getTime())).utcOffset(-Number((req.query.offset)))
        const currentWeek = moment(currentDate).format('WW GGGG')

        if (req.body.analyticsType === 'view' || req.body.analyticsType === 'share') {
            let information = {
                'user': req.payload._id,
                'stylist': req.payload.stylist,
                'salon': req.payload.salon,
                'video': req.body.video,
                'analyticsType': req.body.analyticsType,
                'week': currentWeek.split(' ')[0],
                'year': currentWeek.split(' ')[1]
            }
            const result = await VideoAnalytics.create(information)
            if (req.body.analyticsType === 'view') {
                videoAnalyticsEvent.emit('update-video-view', {
                    video: req.body.video
                })
            }
            if (req.body.analyticsType === 'share') {
                videoAnalyticsEvent.emit('update-video-share', {
                    video: req.body.video
                })
            }

            return res.json({
                status: true,
            });
        }
        if (req.body.analyticsType === 'like' || req.body.analyticsType === 'favorite') {
            const dataPresent = await VideoAnalytics.findOne({
                'user': req.payload._id,
                'stylist': req.payload.stylist,
                'salon': req.payload.salon,
                'video': req.body.video,
                'analyticsType': req.body.analyticsType,
            })
            if (dataPresent) {
                await VideoAnalytics.deleteOne({ _id: dataPresent._id })
                if (req.body.analyticsType === 'like') {
                    videoAnalyticsEvent.emit('update-video-like', {
                        video: req.body.video
                    })
                }
                if (req.body.analyticsType === 'favorite') {
                    videoAnalyticsEvent.emit('update-video-favorite', {
                        video: req.body.video
                    })
                }
                return res.json({
                    status: true,
                });
            } else {
                let information = {
                    'user': req.payload._id,
                    'stylist': req.payload.stylist,
                    'salon': req.payload.salon,
                    'video': req.body.video,
                    'analyticsType': req.body.analyticsType,
                    'week': currentWeek.split(' ')[0],
                    'year': currentWeek.split(' ')[1]
                }
                const result = await VideoAnalytics.create(information)
                if (req.body.analyticsType === 'like') {
                    videoAnalyticsEvent.emit('update-video-like', {
                        video: req.body.video
                    })
                }
                if (req.body.analyticsType === 'favorite') {
                    videoAnalyticsEvent.emit('update-video-favorite', {
                        video: req.body.video
                    })
                }
                return res.json({
                    status: true,
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
export const getMostViewedVideoBySalon = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        const query = {};
        let andList = []; let orList = [];
        andList.push(
            {
                enable: true,
                salon: ObjectId(req.payload.salon)
            })
        if (req.query.filter) {
            req.query.filter.toLowerCase()
            orList = [
                { 'videoTitle': { $regex: req.query.filter, $options: "i" } },
                { 'videoDescription': { $regex: req.query.filter, $options: "i" } },

                { 'videoTitle': req.query.filter },
                { 'videoDescription': req.query.filter }

            ]
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;


        result = await Video.aggregate([
            {
                '$match': query
            },
            {
                '$sort': {
                    viewCount: -1
                }
            },
            {
                '$group': {
                    _id: null,
                    count: { $sum: 1 },
                    records: { $push: "$$ROOT" }
                }
            },
            {
                '$project': {
                    count: '$count',
                    records: { $slice: ['$records', ((pageNumber - 1) * pageSize), pageSize] }
                }
            }
        ])




        if (result.length) {
            return res.json({
                status: true,
                data: {
                    result: result[0].records,
                    totalPageSize: result[0].count
                },
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
                data: null,
                message: 'Data not present.',
            });
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
export const getFavoriteVideoByUser = catchAsync(async (req, res, next) => {
    try {
        let result = null;
        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)
        const query = {};
        let andList = []; let orList = [];
        andList.push(
            {
                analyticsType: 'favorite',
                salon: ObjectId(req.payload.salon),
                user: ObjectId(req.payload._id)

            })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;


        result = await VideoAnalytics.aggregate([
            {
                '$match': query
            },
            {
                '$lookup': {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video'
                }
            },
            {
                '$unwind': '$video'
            },
            {
                '$sort': {
                    createdAt: -1
                }
            },
            {
                '$group': {
                    _id: null,
                    count: { $sum: 1 },
                    records: { $push: "$$ROOT" }
                }
            },
            {
                '$project': {
                    count: '$count',
                    records: { $slice: ['$records', ((pageNumber - 1) * pageSize), pageSize] }
                }
            }
        ])




        if (result.length) {
            return res.json({
                status: true,
                data: {
                    result: result[0].records,
                    totalPageSize: result[0].count
                },
                message: 'Data send successfully.',
            });
        } else {
            return res.json({
                status: true,
                data: null,
                message: 'Data not present.',
            });
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});
