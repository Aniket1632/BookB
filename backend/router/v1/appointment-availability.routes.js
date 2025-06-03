import express from 'express';
import middleware from '../../config/middleware.js';
import {
    blockAvailability, createAvailability, createAvailabilityBulk,
    createAvailabilityDaily, createAvailabilityForDay, deleteAvailability,
    getActivityListByDate,
    getAllAvailabilityBySalon, getAllAvailabilityByStylist, getAllAvailabilityByStylistForMobile,
    getAppointmentsWithBlockUnblockStatusByDate, getAvailableListByDateRangeV2, getBusinessHours
} from '../../api/appointment-availability.api.js';

const router = express.Router();

router.use(middleware.optional)

router.post('/create-availability', createAvailability)
router.get('/get-availability-by-salon', getAllAvailabilityBySalon)
router.get('/get-availability-by-stylist', getAllAvailabilityByStylist)
router.delete('/delete-availability', deleteAvailability)
router.get('/get-availability-by-stylist-for-mobile', getAllAvailabilityByStylistForMobile)
router.post('/create-availability-daily', createAvailabilityDaily)
router.post('/create-availability-bulk', createAvailabilityBulk)
router.post('/create-availability-day', createAvailabilityForDay)
router.get('/get-appointment-list-with-block-unblock-status', getAppointmentsWithBlockUnblockStatusByDate)
router.delete('/block-availability', blockAvailability)
router.post('/get-available-list-by-range', getAvailableListByDateRangeV2)
router.get('/get-buiness-hours', getBusinessHours)
router.post('/get-today-activity', getActivityListByDate) 

export default router;
