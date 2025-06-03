import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ServicePhotoSchema = new Schema({
    mainService: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    subService: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    enable: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    imageUrl: { type: String, default: '' },
}, { timestamps: true, usePushEach: true });

const ServicePhoto = mongoose.model('ServicePhoto', ServicePhotoSchema);

export default ServicePhoto;
