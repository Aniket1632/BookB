import express from 'express';
import { uploadImage } from '../../config/multer.config.js';

const router = express.Router();
import middleware from '../../config/middleware.js';
import { addServicePhoto, getServicePhotoByUser } from '../../api/service-photo.api.js';

router.use(middleware.optional)


router.post('/add-service-photo', uploadImage.single('image'), addServicePhoto)
router.get('/get-service-photo-by-salon', getServicePhotoByUser)



export default router;
