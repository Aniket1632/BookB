import { s3 } from '../../config/s3.config.js';

import env from '../../config/index.js';

import {generateUniqueName} from '../common/generateUniqueName.js';


export const fileUploadService = (recordId, contentType, file, bodyBuffer) => {
    try {
        let fileName = `${contentType}/`;
        const uniqueFileName = generateUniqueName(contentType);
        fileName = `${fileName}${uniqueFileName}${recordId}`
        const extenstion = file.split('.').pop();
        if (extenstion) {
            fileName = `${fileName}.${extenstion}`
        }
        const params = {
            Bucket: env.AWS_BUCKET,
            Key: fileName,
            Body: bodyBuffer
        }
        return s3.upload(params);
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}