import express from 'express';
import { sendNotification,getNotification, getNotificationForUser, sendNotificationByUser} from '../../api/notification.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

router.use(middleware.optional)

router.post('/send-notification', sendNotification);
router.get('/get-notification', getNotification)
router.get('/get-notification-for-user', getNotificationForUser)
router.post('/send-notification-by-user', sendNotificationByUser);

export default router;
