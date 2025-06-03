import { GET_ADMIN_DASHBOARD_REPORT_FAIL, GET_ADMIN_DASHBOARD_REPORT_REQUEST, GET_ADMIN_DASHBOARD_REPORT_RESET, GET_ADMIN_DASHBOARD_REPORT_SUCCESS, GET_APPOINTMENT_REPORT_FAIL, GET_APPOINTMENT_REPORT_REQUEST, GET_APPOINTMENT_REPORT_RESET, GET_APPOINTMENT_REPORT_SUCCESS, GET_CURRENT_YEAR_REPORT_FAIL, GET_CURRENT_YEAR_REPORT_REQUEST, GET_CURRENT_YEAR_REPORT_RESET, GET_CURRENT_YEAR_REPORT_SUCCESS, GET_RECENT_APPOINTMENT_REPORT_FAIL, GET_RECENT_APPOINTMENT_REPORT_REQUEST, GET_RECENT_APPOINTMENT_REPORT_RESET, GET_RECENT_APPOINTMENT_REPORT_SUCCESS, GET_SALON_APPOINTMENT_REPORT_FAIL, GET_SALON_APPOINTMENT_REPORT_REQUEST, GET_SALON_APPOINTMENT_REPORT_RESET, GET_SALON_APPOINTMENT_REPORT_SUCCESS, GET_SALON_SUBSCRIPTION_REPORT_FAIL, GET_SALON_SUBSCRIPTION_REPORT_REQUEST, GET_SALON_SUBSCRIPTION_REPORT_RESET, GET_SALON_SUBSCRIPTION_REPORT_SUCCESS, GET_SESSION_REPORT_FAIL, GET_SESSION_REPORT_REQUEST, GET_SESSION_REPORT_RESET, GET_SESSION_REPORT_SUCCESS, GET_UPCOMING_APPOINTMENT_REPORT_FAIL, GET_UPCOMING_APPOINTMENT_REPORT_REQUEST, GET_UPCOMING_APPOINTMENT_REPORT_RESET, GET_UPCOMING_APPOINTMENT_REPORT_SUCCESS } from "../constants/reportConstants";

export const getDahboardCountReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_SESSION_REPORT_REQUEST:
			return { loading: true };

		case GET_SESSION_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_SESSION_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_SESSION_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getCurrentYeartReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_CURRENT_YEAR_REPORT_REQUEST:
			return { loading: true };

		case GET_CURRENT_YEAR_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_CURRENT_YEAR_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_CURRENT_YEAR_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getCurrentAppointmentReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_APPOINTMENT_REPORT_REQUEST:
			return { loading: true };

		case GET_APPOINTMENT_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_APPOINTMENT_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_APPOINTMENT_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getRecentAppointmentReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_RECENT_APPOINTMENT_REPORT_REQUEST:
			return { loading: true };

		case GET_RECENT_APPOINTMENT_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_RECENT_APPOINTMENT_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_RECENT_APPOINTMENT_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getUpcomingAppointmentReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_UPCOMING_APPOINTMENT_REPORT_REQUEST:
			return { loading: true };

		case GET_UPCOMING_APPOINTMENT_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_UPCOMING_APPOINTMENT_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_UPCOMING_APPOINTMENT_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getAdminDashboardReportReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_ADMIN_DASHBOARD_REPORT_REQUEST:
			return { loading: true };

		case GET_ADMIN_DASHBOARD_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_ADMIN_DASHBOARD_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_ADMIN_DASHBOARD_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getSalonAppointmentReportReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_SALON_APPOINTMENT_REPORT_REQUEST:
			return { loading: true };

		case GET_SALON_APPOINTMENT_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_SALON_APPOINTMENT_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_SALON_APPOINTMENT_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

export const getSalonSubscriptionReportReducers = (state = {}, action) => {
	switch (action.type) {
		case GET_SALON_SUBSCRIPTION_REPORT_REQUEST:
			return { loading: true };

		case GET_SALON_SUBSCRIPTION_REPORT_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_SALON_SUBSCRIPTION_REPORT_FAIL:
			return { loading: false, error: action.payload };

		case GET_SALON_SUBSCRIPTION_REPORT_RESET:
			return {};

		default:
			return state;
	}
};

// export const getAppointmentConersionRateReducer = (state = {}, action) => {
// 	switch (action.type) {
// 		case GET_CONVERSION_RATE_REQUEST:
// 			return { loading: true };

// 		case GET_CONVERSION_RATE_SUCCESS:
// 			return { report: action.payload, loading: false };

// 		case GET_CONVERSION_RATE_FAIL:
// 			return { loading: false, error: action.payload };

// 		case GET_CONVERSION_RATE_RESET:
// 			return {};

// 		default:
// 			return state;
// 	}
// };