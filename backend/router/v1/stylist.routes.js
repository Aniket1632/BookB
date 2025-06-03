import express from 'express';
import { uploadImage } from '../../config/multer.config.js';
import middleware from '../../config/middleware.js';
import {
    addStylistSettings,
    changeStatusOfUser,
    createStylist,
    deleteStylist,
    getAllEnabledStylist,
    getAllStylistBySalon, getStylistBySalonV2,
    getStylistSettings,
    updateServices
} from '../../api/stylist.api.js';
import { getNote, updateNote } from '../../api/user.api.js';

const router = express.Router();

router.use(middleware.optional)
router.post('/create-stylist', uploadImage.single('image'), createStylist)
router.get('/get-stylist', getAllStylistBySalon)
router.delete('/delete-stylist', deleteStylist)
router.patch('/enable-disable-stylist', changeStatusOfUser)
router.get('/get-enable-stylist', getAllEnabledStylist)
router.patch('/update-stylist-services', updateServices)
router.post('/add-stylist-settings', addStylistSettings)
router.get('/get-stylist-settings', getStylistSettings)
router.put('/note', updateNote)
router.get('/note', getNote)
router.get('/get-stylist-by-salon', getStylistBySalonV2)

export default router;
