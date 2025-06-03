import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const VideoAnalyticsSchema = new Schema({
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    analyticsType: { type: String, default: 'view', enum: ['view', 'like','favorite','share'] },
    week: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

const VideoAnalytics = mongoose.model('VideoAnalytics', VideoAnalyticsSchema);

export default VideoAnalytics;