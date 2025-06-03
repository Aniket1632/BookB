import express from 'express';

const router = express.Router();
import middleware from '../../config/middleware.js';
import { createSalon, getAllSalon, deleteSalon, changeStatusOfUser, getAllEnabledSalon, changeMenuSetting, getMenuSettingByToken, getSalonByPackageName, getSalonByWebUrl, getSalonSettingByType } from '../../api/salon.api.js';
import { uploadImage } from '../../config/multer.config.js';

router.get('/get-enable-salon', getAllEnabledSalon) 
router.get('/get-salon-setting-by-type', getSalonSettingByType)
router.get('/get-salon-by-package', getSalonByPackageName)
router.get('/get-salon-by-url', getSalonByWebUrl)


router.use(middleware.optional)
router.post('/create-salon', uploadImage.single('image'), createSalon)
router.get('/get-salon', getAllSalon)
router.delete('/delete-salon', deleteSalon)
router.patch('/enable-disable-salon', changeStatusOfUser)
router.patch('/change-menu-setting', changeMenuSetting)
router.get('/get-salon-menu-setting-by-token', getMenuSettingByToken)


export default router;
