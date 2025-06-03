import axios from "axios";
import { GET_ADMIN_DASHBOARD_REPORT_FAIL, GET_ADMIN_DASHBOARD_REPORT_REQUEST, GET_ADMIN_DASHBOARD_REPORT_SUCCESS, GET_APPOINTMENT_REPORT_FAIL, GET_APPOINTMENT_REPORT_REQUEST, GET_APPOINTMENT_REPORT_SUCCESS, GET_CURRENT_YEAR_REPORT_FAIL, GET_CURRENT_YEAR_REPORT_REQUEST, GET_CURRENT_YEAR_REPORT_SUCCESS, GET_RECENT_APPOINTMENT_REPORT_FAIL, GET_RECENT_APPOINTMENT_REPORT_REQUEST, GET_RECENT_APPOINTMENT_REPORT_SUCCESS, GET_SALON_APPOINTMENT_REPORT_FAIL, GET_SALON_APPOINTMENT_REPORT_REQUEST, GET_SALON_APPOINTMENT_REPORT_SUCCESS, GET_SALON_SUBSCRIPTION_REPORT_FAIL, GET_SALON_SUBSCRIPTION_REPORT_REQUEST, GET_SALON_SUBSCRIPTION_REPORT_SUCCESS, GET_SESSION_REPORT_FAIL, GET_SESSION_REPORT_REQUEST, GET_SESSION_REPORT_SUCCESS, GET_UPCOMING_APPOINTMENT_REPORT_FAIL, GET_UPCOMING_APPOINTMENT_REPORT_REQUEST, GET_UPCOMING_APPOINTMENT_REPORT_SUCCESS } from "../constants/reportConstants";
import { BASE_URL } from "./ip";
const utcTimeOffset = new Date().getTimezoneOffset();


export const getDahboardCountAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SESSION_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(
			`${BASE_URL}/report/dashboard-count-by-date-range?offset=${utcTimeOffset}`, formData,
			config
		);
		// console.log(data , "REPORT");
		dispatch({
			type: GET_SESSION_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_SESSION_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const geCurrentYearAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_CURRENT_YEAR_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(
			`${BASE_URL}/report/current-year-appointment-by-month?offset=${utcTimeOffset}`, formData, config
		);
		// console.log(data , "report");
		dispatch({
			type: GET_CURRENT_YEAR_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_CURRENT_YEAR_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const geCurrentAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_APPOINTMENT_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.post(
			`${BASE_URL}/report/stylist-list-with-appointments-by-date-range?offset=${utcTimeOffset}`,
			formData,
			config
		);
		// console.log(data , "stylist");

		dispatch({
			type: GET_APPOINTMENT_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_APPOINTMENT_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getRecentAppointmentReportAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_RECENT_APPOINTMENT_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(
			`${BASE_URL}/report/current-appointments?offset=${utcTimeOffset}`, formData, config
		);
		// console.log("recent " , data);

		dispatch({
			type: GET_RECENT_APPOINTMENT_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_RECENT_APPOINTMENT_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getUpcomingAppointmentReportAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_UPCOMING_APPOINTMENT_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(
			`${BASE_URL}/report/upcoming-appointments?offset=${utcTimeOffset}`, formData, config
		);
		// console.log("upcoming appointment" , data);
		dispatch({
			type: GET_UPCOMING_APPOINTMENT_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_UPCOMING_APPOINTMENT_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAdminDashboardReportAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ADMIN_DASHBOARD_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/report/admin-dashboard-report?offset=${utcTimeOffset}`, config
		);
		// console.log("Report" , data);

		dispatch({
			type: GET_ADMIN_DASHBOARD_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ADMIN_DASHBOARD_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAdminSalonAppointmentReportAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SALON_APPOINTMENT_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/report/admin-salon-report-chart?offset=${utcTimeOffset}`, config
		);
			// console.log("salon" , data);
		dispatch({
			type: GET_SALON_APPOINTMENT_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_SALON_APPOINTMENT_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAdminSalonSubscriptionReportAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SALON_SUBSCRIPTION_REPORT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/report/admin-salon-subscription?offset=${utcTimeOffset}`, config
		);

		dispatch({
			type: GET_SALON_SUBSCRIPTION_REPORT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_SALON_SUBSCRIPTION_REPORT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
