import express from 'express';
import { forgotPassword } from '../../api/auth.api.js';
import { getAllEnabledStylistBySalon, getAllEnabledStylistForWebsite } from '../../api/stylist.api.js';
import {
    addSalonSetup,
    addWebsiteSetting,
    getWebsiteSetting,
    getWebsiteSettingByName,
    getWebsiteSettingBySalonID, registerUser,
    contactUs,
    getWebsiteSettingBySalon,
    getBusinessHourBySalon
} from '../../api/website-settings.api.js';
import middleware from '../../config/middleware.js';
import { uploadMultipleFiles } from '../../config/multer.config.js';
const router = express.Router();


router.get('/get-website-setting-by-name', getWebsiteSettingByName)
router.get('/get-website-setting-by-salon', getWebsiteSettingBySalon)
router.get('/get-website-stylist-by-name', getAllEnabledStylistForWebsite)
router.get('/get-website-stylist-by-salon', getAllEnabledStylistBySalon)
router.post('/register-user', registerUser)
router.post('/contact-us', contactUs)
router.patch('/forgot-password', forgotPassword)

router.use(middleware.optional)
router.post('/add-website-setting', uploadMultipleFiles.fields([
    {
        name: 'websiteLogoImageURL', maxCount: 1
    },
    {
        name: 'websiteBannerImageURL', maxCount: 1
    },
    {
        name: 'appLogoImageURL', maxCount: 1
    }, {
        name: 'loginBackgroundImageURL', maxCount: 1
    }, {
        name: 'registerBackgroundImageURL', maxCount: 1
    }, {
        name: 'headerImageURL', maxCount: 1
    }
]), addWebsiteSetting)
router.get('/get-website-setting', getWebsiteSetting)
router.get('/get-website-setting-by-id', getWebsiteSettingBySalonID)
router.post('/create-salon-from-website', addSalonSetup)
router.get('/get-business-hour', getBusinessHourBySalon)

export default router;
