import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BusinessHourSchema = new Schema({
    slots: [{
        day: { type: String, default: '' },
        slot: [{
            startTime: { type: String, default: '' },
            endTime: { type: String, default: '' }
        }],
    }],
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, usePushEach: true });

const BusinessHour = mongoose.model('BusinessHour', BusinessHourSchema); 

export default BusinessHour;
