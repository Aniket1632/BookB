import mongoose from 'mongoose';


const AttendanceSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Checkin must belong to a user']
		},
		stylist: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Checkin must belong to a stylist']
		},
		salon: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'User Checkin must belong to a salon']
		},
		checkInDate: { type: Date, },
		checkOutDate: { type: Date },
		checkInDateString: { type: String, default: '' },
		checkOutDateString: { type: String, default: '' },
		checkInTimeString: { type: String, default: '' },
		checkOutTimeString: { type: String, default: '' },
		workOutMinute: { type: Number, default: 0 },
		isCheckedIn: { type: Boolean, default: false },
		isCheckedOut: { type: Boolean, default: false },
		offset: { type: Number, default: 0 },
		enable: { type: Boolean, default: true },
		checkInFrom: { type: String, default: 'dashboard', enum: ['dashboard', 'app'] },
		checkOutFrom: { type: String, default: 'dashboard', enum: ['dashboard', 'app'] },
		note: { type: String, default: '' },
	},
	{ timestamps: true, usePushEach: true }
);
const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance


