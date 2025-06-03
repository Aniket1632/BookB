import express from 'express';
import { addSession, getSessionByStylist, getTotalSessionByStylist } from '../../api/session.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

router.use(middleware.required)

router.post('/add-session', addSession)
router.get('/get-session-by-stylist', getSessionByStylist)
router.get('/get-total-session-by-stylist', getTotalSessionByStylist)

export default router;
