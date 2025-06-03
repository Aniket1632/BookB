import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const VideoCategorySchema = new Schema({
    categoryName: { type: String, default: '' },
    categoryId: { type: String, default: '' },
    enable: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },

}, { timestamps: true, usePushEach: true });

const VideoCategory = mongoose.model('VideoCategory', VideoCategorySchema);

export default VideoCategory;
