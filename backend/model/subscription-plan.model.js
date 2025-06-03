import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SubscriptionPlanSchema = new Schema({
    productId: {
        type: String,
        required: [true, 'Please enter product id'],
        trim: true
    },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    metadata: {
        calendars: {
            type: Number,
            required: [true, 'Please select calendars']
        },
        users: {
            type: Number,
            required: [true, 'Please enter users']
        }
    },
    enable: { type: Boolean, default: true },
    dateByOffset: { type: String, default: '' },
    offset: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
export default SubscriptionPlan;
