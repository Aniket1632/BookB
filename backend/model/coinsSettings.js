import mongoose from 'mongoose';

const coinSettingsSchema = new mongoose.Schema({
    userType:{
        type:String,
        enum:['end-user','salon','stylist']
    },
    actionType: {
        type: String,
        enum: ['referral', 'login', 'first-appointment', 'review','Sign-up','complete-profile'], 
        required: true,
    },
    coins: {
        type: Number,
        required: true, 
    },
    description: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    title:{
        type:String
    }
}, {
    timestamps: true, usePushEach: true 
});

const CoinSettings = mongoose.model('CoinSettings', coinSettingsSchema);
export default CoinSettings;
