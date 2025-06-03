import express from 'express';
import {
    addAppointmentV2,
    getAppointmentForDashboard,
    getAvailableAppointmentByDate
} from '../../api/appointment.api.js';
const router = express.Router();


router.post('/add-appointment-from-website', addAppointmentV2)
router.post('/get-appointment-from-dashboard', getAppointmentForDashboard);
router.post('/get-available-appointment-by-date', getAvailableAppointmentByDate)
 
export default router;
