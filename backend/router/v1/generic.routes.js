import express from 'express';
import { getGenericData, BulkUpload } from '../../api/generic.api.js';
import { uploadFile } from '../../config/multer.config.js';

const router = express.Router();

router.get('/get-generic-data', getGenericData)
router.put('/upload-user-in-bulk', uploadFile.single('file'), BulkUpload);

export default router;
