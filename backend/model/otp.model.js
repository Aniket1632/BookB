import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import jwt from 'jsonwebtoken';

const OTPSchema = new Schema({
    mobile: { type: String, default: '' },
    token: { type: String, default: '' },
    offset: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 40 });
OTPSchema.methods.generateJWT = function (mobile, otp) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);
    return jwt.sign({
        mobile: mobile,
        otp: otp,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
}
const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;