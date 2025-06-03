import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    enable: { type: Boolean, default: true },
    videoTitle: { type: String, default: '' },
    videoDescription: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    videoKey: { type: String, default: '' },
    videoThumbnailUrl: { type: String, default: '' },
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    likeCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    uploadedBy: { type: String, default: 'stylist', enum: ['salon', 'stylist'] },
    videoCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'VideoCategory', required: false },
    analyticsType: { type: String, default: 'view', enum: ['view', 'like','favorite','share'] },

}, { timestamps: true, usePushEach: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
