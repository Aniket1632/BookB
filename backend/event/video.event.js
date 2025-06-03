import { EventEmitter } from 'events';
import Video from '../model/video.model.js';
import VideoAnalytics from '../model/video-analytics.model.js';

const em = new EventEmitter();
import ffmpeg from 'ffmpeg';
import path from 'path';
import fs from 'fs';
import { imageUploadService } from '../services/common/image-upload.service.js';
import { generateUniqueName } from '../services/common/generateUniqueName.js';

import { constant } from '../config/constants.js';
import { cloudFrontUrl } from '../services/aws/cloud-front-urls.js';
import extractFrames from 'ffmpeg-extract-frames';

em.on('update-video-view', async (obj) => {
    const { video } = obj;
    try {
        const viewCount = await VideoAnalytics.find({ video: video, analyticsType: 'view' }).countDocuments();
        await Video.updateOne({
            _id: video
        }, {
            $set: {
                viewCount
            }
        })
    } catch (exception) {
        console.log(exception);

    }

});
em.on('update-video-share', async (obj) => {
    const { video } = obj;
    try {
        const shareCount = await VideoAnalytics.find({ video: video, analyticsType: 'share' }).countDocuments();
        await Video.updateOne({
            _id: video
        }, {
            $set: {
                shareCount
            }
        })
    } catch (exception) {
        console.log(exception);

    }

});
em.on('update-video-like', async (obj) => {
    const { video } = obj;
    try {
        const likeCount = await VideoAnalytics.find({ video: video, analyticsType: 'like' }).countDocuments();
        await Video.updateOne({
            _id: video
        }, {
            $set: {
                likeCount
            }
        })
    } catch (exception) {
        console.log(exception);

    }

});
em.on('update-video-favorite', async (obj) => {
    const { video } = obj;
    try {
        const favoriteCount = await VideoAnalytics.find({ video: video, analyticsType: 'favorite' }).countDocuments();
        await Video.updateOne({
            _id: video
        }, {
            $set: {
                favoriteCount
            }
        })
    } catch (exception) {
        console.log(exception);

    }

});
em.on('video-size-compression', async (obj) => {
    const { filename, videoID } = obj;
    try {
        const sourcePath = `${path.resolve()}/backend/asset/${filename}`
        const destinationPath = `${path.resolve()}/backend/asset/result/${filename}`
        const destinationPathForThumbnail = `${path.resolve()}/backend/asset/thumbnail/`

        const tempS = `${path.resolve()}/backend/asset`
        const tempD = `${path.resolve()}/backend/asset/result`

        if (!fs.existsSync(tempS))
            fs.mkdirSync(temp)
        if (!fs.existsSync(tempD))
            fs.mkdirSync(tempD)
        if (!fs.existsSync(destinationPathForThumbnail))
            fs.mkdirSync(destinationPathForThumbnail)
        const imageName = `${generateUniqueName('snapshot')}.png`
        const imageThumbnail = `${destinationPathForThumbnail}${imageName}`
        await extractFrames({
            input: sourcePath,
            output: imageThumbnail,
            offsets: [
                5000
            ]
        })
        await fs.readFile(imageThumbnail, async (err, fileDataImage) => {
            if (err) {

            } else {
                fs.unlink(imageThumbnail, (err) => {
                });

                const data = {
                    originalname: imageName,
                    buffer: fileDataImage
                }
                const updateObjectVideoThumbnail = {};

                const imageUploadResult = await imageUploadService(constant.videoThumbnail, data);
                if (imageUploadResult.status) {
                    updateObjectVideoThumbnail.videoThumbnailUrl = await cloudFrontUrl(imageUploadResult.data.Key);
                    await Video.updateOne({
                        _id: videoID
                    }, {
                        $set: updateObjectVideoThumbnail
                    })
                }
            }

        });
        new ffmpeg(sourcePath, function (err, video) {
            if (!err) {
                console.log('The video is ready to be processed');
                video
                    .setVideoSize('640x480', true, false)
                    .save(destinationPath, function (error, file) {
                        if (!error) {
                            console.log('Video file: ' + file);
                            fs.readFile(destinationPath, async (err, fileData) => {
                                if (err) {

                                } else {
                                    fs.unlink(destinationPath, (err) => {
                                    });
                                    fs.unlink(sourcePath, (err) => {
                                    });
                                    const data = {
                                        originalname: filename,
                                        buffer: fileData
                                    }
                                    const updateObject = {};

                                    const imageUploadResult = await imageUploadService(constant.video, data);
                                    if (imageUploadResult.status) {
                                        updateObject.videoUrl = await cloudFrontUrl(imageUploadResult.data.Key);
                                        updateObject.videoKey = imageUploadResult.data.Key;
                                        await Video.updateOne({
                                            _id: videoID
                                        }, {
                                            $set: updateObject
                                        })
                                    }
                                }

                            });
                        }
                        else
                            console.log('Video file erro: ' + error);

                    });

            } else {
                console.log('Error: ' + err);
            }
        });
    } catch (exception) {
        console.log(exception);

    }

});
export default em;