import mongoose from 'mongoose';


const SessionSchema = new mongoose.Schema(
	{

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
		session: { type: Number, default: 0 },
		sessionDate: { type: Date, },
		sessionDateString: { type: String, default: '' },
		offset: { type: Number, default: 0 },
		enable: { type: Boolean, default: true },
		sessionAddedBy: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'User Checkin must belong to a salon']
		},
		sessionAddedByRole: {
			type: String,
			enum: ['admin', 'salon', 'stylist', 'salonadmin', 'superadmin'],
			default: 'stylist'
		},
		week: { type: Number, default: 0 },
		year: { type: Number, default: 0 },
		month: { type: Number, default: 0 },
		weekDay: { type: String, default: '' },
		date: { type: Number, default: 0 },

	},
	{ timestamps: true, usePushEach: true }
);
const Session = mongoose.model('Session', SessionSchema);
export default Session


