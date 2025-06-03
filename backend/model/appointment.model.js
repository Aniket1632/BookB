import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    dateAsAString: { type: String, default: '' },
    dateAsADate: { type: Date, default: Date.now },
    timeAsAString: { type: String, default: '' },
    timeAsADate: { type: String, default: '' },
    isUser: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    availability: { type: Schema.Types.ObjectId, ref: 'AppointmentAvailability', required: false },
    mainService: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    subService: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    userMobile: { type: String, default: '' },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female', 'other']
    },
    comment: { type: String, default: '' },
    week: { type: Number, default: 0 },
    appointmentTimestamp: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    weekDay: { type: String, default: '' },
    date: { type: Number, default: 0 },
    offset: { type: Number, default: 0 },
    appointmentCompletedStatus: { type: Boolean, default: false },
    stylistConfirmationStatus: { type: Boolean },
    requiredDuration: { type: Number, default: 30 },
    servicePhoto: { type: Schema.Types.ObjectId, ref: 'ServicePhoto', required: false },
    status: { type: String, default: 'available', enum: ['available', 'requested', 'confirmed', 'waiting', 'canceled', 'completed'] },
    appointmentId: { type: String, default: '' },
}, { timestamps: true, usePushEach: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;

