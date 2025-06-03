import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    data: {},
    response: {},
    enable: { type: Boolean, default: true },
    dateByOffset: { type: String, default: '' },
    entryAddedFrom: { type: String, default: 'dashboard', enum: ['dashboard', 'app'] },
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sendType: { type: String, default: 'all', enum: ['admin', 'salon', 'stylist', 'user', 'manager', 'superadmin', 'company'] },
    offset: { type: Number, default: 0 },
}, { timestamps: true, usePushEach: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;