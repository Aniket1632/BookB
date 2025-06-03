import mongoose from 'mongoose';
import constant from '../config/index.js';

const connectDB = async () => {
	try {
		const con = await mongoose.connect(constant.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		mongoose.set('strictQuery', true);

		console.log(`MongoDB Connected: ${con.connection.host}`);
	} catch (err) {
		console.log(`Error: ${err.message}`);
		process.exit(1);
	}
};

export default connectDB;
