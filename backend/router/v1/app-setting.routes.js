import express from 'express';
const router = express.Router();
import middleware from '../../config/middleware.js';
import { uploadImage, uploadMultipleFiles } from '../../config/multer.config.js';
import { addAppSetting, getAppSetting, getAppSettingBySalonID } from '../../api/app-settings.api.js';

router.use(middleware.optional)
// router.get('/get-app-menu-setting-by-token', getMenuSettingByToken)
router.post('/add-app-setting', uploadMultipleFiles.fields([
    {
        name: 'appLogoImageURL', maxCount: 1
    }, {
        name: 'loginBackgroundImageURL', maxCount: 1
    }, {
        name: 'registerBackgroundImageURL', maxCount: 1
    }, {
        name: 'headerImageURL', maxCount: 1
    }, {
        name: 'shopHeaderImageURL', maxCount: 1
    }, {
        name: 'profileHeaderImageURL', maxCount: 1
    }
]), addAppSetting)
router.get('/get-app-setting', getAppSetting)
router.get('/get-app-setting-by-id', getAppSettingBySalonID)

export default router;
