import express from 'express';
import { uploadVideo } from '../../config/multer.config.js';

const router = express.Router();
import middleware from '../../config/middleware.js';
import { changeStatusOfCategory, createCategory, deleteCategory, getAllCategory, getAllEnableCategory } from '../../api/video-category.api.js';
import { addVideo, getVideoBySalon, getVideoByStylist, getVideoByCategory, deleteVideo, changeStatusOfVideo, getSimilarVideo, getVideoById, compressVideo } from '../../api/video.api.js';
import { addAnalytics, getMostViewedVideoBySalon, getFavoriteVideoByUser } from '../../api/video-analytics.api.js';

router.use(middleware.optional)

router.post('/create-category', createCategory)
router.get('/get-category', getAllCategory)
router.delete('/delete-category', deleteCategory)
router.patch('/enable-disable-category', changeStatusOfCategory)
router.get('/get-enabled-category', getAllEnableCategory)
router.post('/add-video', uploadVideo.single('video'), addVideo)
router.get('/get-video-by-salon', getVideoBySalon)
router.get('/get-video-by-stylist', getVideoByStylist)
router.get('/get-video-by-category', getVideoByCategory)
router.delete('/delete-video', deleteVideo)
router.patch('/enable-disable-video', changeStatusOfVideo)
router.post('/add-analytics', addAnalytics)
router.get('/get-most-viewed-video-by-salon', getMostViewedVideoBySalon)
router.get('/get-similar-video', getSimilarVideo)
router.get('/get-video-by-id', getVideoById)
router.get('/get-favorite-video-by-user', getFavoriteVideoByUser)
router.get('/compress-video', compressVideo)



export default router;
