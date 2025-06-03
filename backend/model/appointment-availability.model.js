import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TimeAvailabilitySchema = new Schema({
    timeAsAString: { type: String, default: '' },
    timeAsADate: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    slotStatus: { type: String, default: 'available', enum: ['available', 'requested', 'confirmed', 'waiting', 'canceled', 'completed'] },
}, { timestamps: true, usePushEach: true });

const AppointmentAvailabilitySchema = new Schema({
    dateAsAString: { type: String, default: '' },
    dateAsADate: { type: Date },
    isAvailable: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' ,required: false },
    week: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    weekDay: { type: String, default: '' },
    date: { type: Number, default: 0 },
    offset: { type: Number, default: 0 },
    timeData: [TimeAvailabilitySchema],
    appointmentList: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
    isBusinessHour: { type: Schema.Types.Boolean, default: false },
    startAppointment: { type: Date, default: Date.now }
}, { timestamps: true, usePushEach: true });

export const AppointmentAvailability = mongoose.model('AppointmentAvailability', AppointmentAvailabilitySchema);
export const TimeAvailability = mongoose.model('TimeAvailability', TimeAvailabilitySchema);


