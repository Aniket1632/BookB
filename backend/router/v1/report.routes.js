import express from 'express';
import {
    getGeneralCount, getGeneralCountStylist, getTotalEarningByDayByStylist,
    getTotalEarningByMonth, getTotalEarningByMonthForChart, getTotalEarningByMonthStylist,
    getTotalEarningByMonthStylistForChart, getTotalSalesByMonth, getTotalSalesByMonthForChart,
    getTotalSessionByMonth, getTotalSessionByMonthStylist, getTotalSessionByMonthStylistForChart,
    getTotalSessionByStylistMonthWise, getTotalSessionByStylistMonthWiseForChart
} from '../../api/report.api.js';
import {
    getDashboardCountByDateRange, getUpcomingAppointments, getCurrentAppointments, getNumberOfSalons, getNumberOfSalonsChart, getSubscriptionOfSalons, getUserChart, getAppointmentChart, getAppointmentsByCurrentMonthV2, getStylistAndHisAppointmentsByDateRangeV2,
    getDashboardCountByDateRangeV2
} from '../../api/bookb-report.api.js';
import middleware from '../../config/middleware.js';
const router = express.Router();
router.use(middleware.required)

router.get('/get-total-session-by-stylist-month-wise', getTotalSessionByStylistMonthWise)
router.get('/get-total-session-by-month', getTotalSessionByMonth)
router.get('/get-total-earning-by-month', getTotalEarningByMonth)
router.get('/get-total-earning-by-day-by-stylist', getTotalEarningByDayByStylist)
router.get('/get-total-sales-by-month', getTotalSalesByMonth)
router.get('/get-total-session-by-stylist-month-wise-for-chart', getTotalSessionByStylistMonthWiseForChart)
router.get('/get-general-count', getGeneralCount)
router.get('/get-total-earning-by-month-for-chart', getTotalEarningByMonthForChart)
router.get('/get-total-sales-by-month-for-chart', getTotalSalesByMonthForChart)
router.get('/get-general-count-stylist', getGeneralCountStylist)
router.get('/get-total-session-by-month-stylist', getTotalSessionByMonthStylist)
router.get('/get-total-session-by-month-stylist-for-chart', getTotalSessionByMonthStylistForChart)
router.get('/get-total-earning-by-month-stylist', getTotalEarningByMonthStylist)
router.get('/get-total-earning-by-month-stylist-for-chart', getTotalEarningByMonthStylistForChart)

// BOOKB REPORT API


router.post('/dashboard-count-by-date-range', getDashboardCountByDateRange)
router.post('/get-user-chart', getUserChart)
router.post('/get-appointment-chart', getAppointmentChart)
router.post('/stylist-list-with-appointments-by-date-range', getStylistAndHisAppointmentsByDateRangeV2)
router.post('/current-year-appointment-by-month', getAppointmentsByCurrentMonthV2)
router.post('/upcoming-appointments', getUpcomingAppointments)
router.post('/current-appointments', getCurrentAppointments)
router.get('/admin-dashboard-report', middleware.admin, getNumberOfSalons)
router.get('/admin-salon-report-chart', middleware.admin, getNumberOfSalonsChart)
router.get('/admin-salon-subscription', middleware.admin, getSubscriptionOfSalons)



export default router;
