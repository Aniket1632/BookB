import express from 'express';
import { addVersion, changeStatusOfVersion, deleteVersion, getAllEnableVersion, getAllVersion } from '../../api/version.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

router.post('/add-version', addVersion)
router.get('/get-version', getAllVersion)
router.patch('/enable-disable-version', changeStatusOfVersion)
router.delete('/delete-version', deleteVersion)
router.get('/get-enabled-version', getAllEnableVersion)

export default router;
