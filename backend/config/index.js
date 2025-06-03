
import dotenv from 'dotenv'

dotenv.config();

const constant = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
    MONGO_URI: process.env.MONGO_URI,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
    CLOUD_FRONT_URL: process.env.CLOUD_FRONT_URL,
    NODE_ENV: process.env.NODE_ENV,
    twilioAccountSid: process.env.twilioAccountSid,
    twilioAuthToken: process.env.twilioAuthToken,
    APP_NAME: process.env.APP_NAME,
    EMAIL: process.env.email,
    URL: process.env.url,

}
export default constant;
