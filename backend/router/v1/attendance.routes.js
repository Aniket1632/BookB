import express from 'express';

const router = express.Router();
import middleware from '../../config/middleware.js';
import { attendanceEntry, getTodaysAttendanceBySalon, getAttendanceByUser, updateNote,getAttendanceHistoryBySalon, deleteCheckInByID } from '../../api/attendance.api.js';

router.use(middleware.required)

router.post('/attendance', attendanceEntry)
router.get('/get-todays-attendance-by-salon', getTodaysAttendanceBySalon)
router.get('/get-attendance-by-user', getAttendanceByUser)
router.patch('/update-note', updateNote)
router.get('/get-attendance-history-by-salon', getAttendanceHistoryBySalon)
router.delete('/delete-attendance', deleteCheckInByID)


export default router;
