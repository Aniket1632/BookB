import { fileUploadService } from '../../services/aws/file-upload.js'

export const imageUploadService = async (name, file) => {
    try {
        return new Promise((resolve, reject) => {
            const response = fileUploadService('',
                name, file.originalname, file.buffer)
                .on('httpUploadProgress', (evt) => {
                    console.log('Completed ' +
                        (evt.loaded * 100 / evt.total).toFixed() +
                        '% of upload');
                }).send(async (error, data) => {
                    if (error) {
                        return reject({ status: false, message: error.message })

                    } else {
                        return resolve({
                            status: true,
                            data: data
                        })
                    }
                })
        });
    } catch (exception) {
        return { status: false, message: exception.message };
    }
}
