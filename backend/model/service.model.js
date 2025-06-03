import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ServiceSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    charges: { type: Number, default: 0 },
    requiredTime: { type: Number, default: 0 },// in minute
    leadTime: { type: Number, default: 0 },// in minute // 
    breakTime: { type: Number, default: 0 },// in minute // 
    isMainService: { type: Boolean, default: false },
    enable: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: false },
    rank: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
