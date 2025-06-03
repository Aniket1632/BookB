import { constant } from '../config/constants.js';
import em from '../event/generic.event.js';

import catchAsync from '../config/catchAsync.js';
import mongoose from 'mongoose';
import readXlsxFile from 'read-excel-file/node';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;




export const getGenericData = catchAsync(async (req, res, next) => {
    try {
        return res.json({
            status: true,
            data: {
                shareLink: constant.shareLink
            },
            message: 'Data send successfully.',
        });
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});
export const BulkUpload = catchAsync(async (req, res) => {
    try {
        await readXlsxFile(req.file.buffer)
            .then(rows => {

                if (rows.length > 1) {
                    em.emit('upload-bulk-data', { rows, salon: '6299b9293eae091c59206850' })
                    res.status(201).json({
                        status: true,
                        message: `File data uploaded successfully`,
                    });
                } else {
                    res.status(401).json({
                        status: false,
                        message: `Invalid file`,
                    });
                }
            })
            .catch(err => {
                res.status(401).json({
                    status: false,
                    message: err.message,
                });
            });
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message,
        });
    }
});

