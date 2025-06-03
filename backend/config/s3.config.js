import SES from 'aws-sdk/clients/ses.js';
import S3 from 'aws-sdk/clients/s3.js';

import constant from './index.js'

export const s3 = new S3({
    accessKeyId: constant.AWS_ACCESS_KEY,
    secretAccessKey: constant.AWS_SECRET_ACCESS_KEY,
    region: constant.AWS_REGION,
});
export const ses = new SES({
    accessKeyId: constant.AWS_ACCESS_KEY,
    secretAccessKey: constant.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});