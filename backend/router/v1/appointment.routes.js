import express from 'express';
import middleware from '../../config/middleware.js';
import {
    getAppointmentForDashboard, deleteAppointment, deleteAppointmentDashboard,
    getAppointmentHistoryByUser, getAppointmentsByStylist,
    getAvailableAppointmentByDate, confirmAppointment,
    getAppointmentTypeList,
    getLatestAppointment, testAPI, getAvailabilityDetailByAppointment, getAppointmentDetails, getAppointmentConversionRate, getCustomerRetentionRateRate, getAverageTicketValue, addAppointmentFormDashboardV2, changeStatusOfAppointmentV2
} from '../../api/appointment.api.js';
import { getAllActivityByUser } from '../../api/appointment-availability.api.js';
const router = express.Router();

router.use(middleware.optional)

// router.post('/add-appointment', addAppointment)
router.get('/get-appointment-by-stylist', getAppointmentsByStylist)
router.get('/get-appointment-history-by-user', getAppointmentHistoryByUser)
router.delete('/delete-appointment', deleteAppointment)
// router.patch('/change-status-of-appointment', changeStatusOfAppointment)
router.get('/get-latest-appointment-by-user', getLatestAppointment)
router.post('/add-appointment-from-dashboard', addAppointmentFormDashboardV2);
router.post('/get-appointment-from-dashboard', getAppointmentForDashboard);
router.post('/get-available-appointment-by-date', getAvailableAppointmentByDate)
router.post('/confirm-appointment', confirmAppointment)
router.post('/test-api', testAPI)
router.get('/appointment-conversion-rate', getAppointmentConversionRate)
router.get('/customer-retention-rate', getCustomerRetentionRateRate)
router.get('/average-ticket-value', getAverageTicketValue)

router.delete('/delete-appointment-dashboard/:appointmentId', deleteAppointmentDashboard)
router.patch('/change-status-of-appointment', changeStatusOfAppointmentV2);
router.get('/get-availability-detail-by-appointment', getAvailabilityDetailByAppointment)
router.get('/get-appointment-status-list', getAppointmentTypeList)
router.get('/get-user-activity', getAllActivityByUser) 
router.get('/get-appointment-detail', getAppointmentDetails)


// router.delete('/delete-availability-appointment/:appointmentId', deleteAvailabilityAppointment); 

export default router;
