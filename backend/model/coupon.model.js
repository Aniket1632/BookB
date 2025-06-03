import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    code: { type: String, default: '' },
    enable: { type: Boolean, default: true },
    dateByOffset: { type: String, default: '' },
    isExpired: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    expireDate: { type: Date, default: Date.now },
    discount: { type: String, default: '' },
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    offset: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;