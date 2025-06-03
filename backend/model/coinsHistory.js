import mongoose from 'mongoose';

//const { Schema } = mongoose;


const coinsHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    actionType:{
     type:String,
     enum:['reference','Sign-up','first-appointment','complete-profile']
    },
    transactionType: {
        type: String,
        enum: ['added', 'spent', 'redeemed', 'deducted'],
        required: true,
    },
    amount: {
        type: Number,
    },
    coin:{
         type:Number
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    currentBalance: {
        type: Number,
    },
    referredUsedBy:{
        type: mongoose.Schema.Types.ObjectId,
    }
}, 	{
    timestamps: true
    , usePushEach: true
});

// Create and export the model
const CoinsHistory = mongoose.model('CoinsHistory', coinsHistorySchema);
export default CoinsHistory;

