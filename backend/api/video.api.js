import Video from '../model/video.model.js';
import ffmpeg from 'ffmpeg';
import path from 'path';

import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import videoAnalyticsEvent from '../event/video.event.js';
import env from '../config/index.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;


export const addVideo = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            videoDescription: Joi.string().required(),
            videoTitle: Joi.string().required(),
            videoCategory: Joi.string().required(),

        });
        const { error, value } = schema.validate({
            videoDescription: req.body.videoDescription,
            videoTitle: req.body.videoTitle,
            videoCategory: req.body.videoCategory
        }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;
        if (field._id) {
            if (req.file) {
                const updateObject = {};


                updateObject.videoDescription = req.body.videoDescription
                updateObject.videoTitle = req.body.videoTitle
                updateObject.videoCategory = req.body.videoCategory


                await Video.updateOne({
                    _id: req.body._id
                }, {
                    $set: updateObject
                })
                videoAnalyticsEvent.emit('video-size-compression', {
                    filename: req.file.filename,
                    videoID: req.body._id
                })
                return res.json({
                    status: true,
                    message: `${req.body.videoTitle} has been updated.`,
                });
            } else {
                const updateObject = {};

                updateObject.videoDescription = req.body.videoDescription
                updateObject.videoTitle = req.body.videoTitle
                updateObject.videoCategory = req.body.videoCategory

                await Video.updateOne({
                    _id: req.body._id
                }, {
                    $set: updateObject
                })

                return res.json({
                    status: true,
                    message: `${req.body.videoTitle} has been updated.`,
                });
            }

        } else {
            if (req.file) {
                let salonId = '';
                if (req.payload.role === 'salon') {
                    salonId = req.payload._id
                } else {
                    salonId = req.body.salon

                }
                const updateObject = {};
                updateObject.videoDescription = req.body.videoDescription
                updateObject.videoTitle = req.body.videoTitle
                updateObject.videoCategory = req.body.videoCategory
                updateObject.uploadedBy = req.body.uploadedBy
                updateObject.salon = salonId
                updateObject.videoUrl = `${env.URL}/${req.file.filename}`
                if (req.body.uploadedBy === 'stylist') {
                    updateObject.stylist = req.body.stylist
                }
                const id = await Video.create(updateObject)

                videoAnalyticsEvent.emit('video-size-compression', {
                    filename: req.file.filename,
                    videoID: id._id
                })
                return res.json({
                    status: true,
                    message: `${req.body.videoTitle} has been added.`,
                });
            } else {
                return res.json({
                    status: false,
                    message: 'Video file is required field',
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
export const getVideoBySalon = catchAsync(async (req, res, next) => {
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
                { 'videoTitle': { $regex: req.query.filterValue, $options: "i" } },
                { 'videoTitle': req.query.filterValue },
            ]
        }
        if (req.payload.role === 'salon') {
            andList.push({

                salon: ObjectId(req.payload._id)
            })
        }
        if (req.payload.role === 'salonadmin' || req.payload.role === 'superadmin') {
            andList.push({

                salon: ObjectId(req.payload.salon)
            })
        }
        if (req.payload.role === 'stylist') {
            andList.push({

                stylist: ObjectId(req.payload._id)
            })
        }
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Video.aggregate()
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
export const getVideoByStylist = catchAsync(async (req, res, next) => {
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
                { 'videoTitle': { $regex: req.query.filterValue, $options: "i" } },
                { 'videoTitle': req.query.filterValue },
            ]
        }
       
        andList.push({
            stylist: ObjectId(req.payload._id),
            uploadedBy: 'stylist',

        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Video.aggregate()
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
export const getVideoByCategory = catchAsync(async (req, res, next) => {
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
                { 'videoTitle': { $regex: req.query.filterValue, $options: "i" } },
                { 'videoTitle': req.query.filterValue },
            ]
        }
        
        andList.push({
            salon: ObjectId(req.payload.salon),
            videoCategory: ObjectId(req.query.videoCategory),
            enable: true

        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Video.aggregate()
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
export const deleteVideo = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            videoID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ videoID: req.query.videoID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        if (req.query.videoID) {
            await Video.deleteOne({ _id: req.query.videoID });

            return res.status(200).json({
                status: true,
                message: 'Video has been deleted.',
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Video Id is required field',
            })
        }

    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
export const changeStatusOfVideo = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            videoID: Joi.string().required(),
        });
        const { error, value } = schema.validate({ videoID: req.query.videoID }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }
        let field = req.body;

        const result = await Video.updateOne({
            _id: req.query.videoID
        }, {
            $set: {
                'enable': !field.enable
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
export const getVideoById = catchAsync(async (req, res, next) => {
    try {

        const userList = await Video.findOne({
            _id: req.query.videoID,
            enable: true
        }).populate('stylist').populate('salon').populate('videoCategory');
        if (userList) {
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

export const getSimilarVideo = catchAsync(async (req, res, next) => {
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
                { 'videoTitle': { $regex: req.query.filterValue, $options: "i" } },
                { 'videoTitle': req.query.filterValue },
            ]
        }
        andList.push({
            enable: true,
            salon: ObjectId(req.payload.salon),
            _id: { $ne: ObjectId(req.query.videoID) }
        })
        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const userList = await Video.aggregate()
            .match(query)
            .lookup({
                from: 'users',
                localField: 'stylist',
                foreignField: '_id',
                as: 'stylist'
            })
            .unwind('$stylist')
            .lookup({
                from: 'videocategories',
                localField: 'videoCategory',
                foreignField: '_id',
                as: 'videoCategory'
            })
            .unwind('$videoCategory')
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
export const compressVideo = catchAsync(async (req, res, next) => {
    const temp = `${path.resolve()}` 
    try {
        new ffmpeg('D:/Projects/salonwyse-dashboard/backend/asset/videoplayback.mp4', function (err, video) {
            if (!err) { 
                video
                    .setVideoSize('640x480', true, false)
                    .save('D:/Projects/salonwyse-dashboard/backend/asset/result/abc.mp4', function (error, file) {
                        if (!error)
                            console.log('Video file: ' + file);
                        else
                            console.log('Video file erro: ' + error);

                    });

            } else {
                console.log('Error: ' + err);
            }
        });

        return res.status(200).json({ status: false, data: null, message: 'The video is ready to be processed' })

    } catch (e) {
        return res.status(200).json({ status: false, data: null, message: e.msg })
    }

});