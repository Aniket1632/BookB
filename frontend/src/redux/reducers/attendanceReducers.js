import {
	ATTENDANCE_LIST_FAIL,
	ATTENDANCE_LIST_REQUEST,
	ATTENDANCE_LIST_SUCCESS,
	ATTENDANCE_LIST_RESET,
	CHECKINOUT_REQUEST,
	CHECKINOUT_SUCCESS,
	CHECKINOUT_FAIL,
	CHECKINOUT_RESET,
	DELETE_CHECKIN_REQUEST,
	DELETE_CHECKIN_SUCCESS,
	DELETE_CHECKIN_FAIL,
	DELETE_CHECKIN_RESET,
	GET_STYLIST_AVAILABILITYS_REQUEST,
	GET_STYLIST_AVAILABILITYS_SUCCESS,
	GET_STYLIST_AVAILABILITYS_FAIL,
	GET_STYLIST_AVAILABILITYS_RESET,
	ADD_STYLIST_AVAILABILITY_REQUEST,
	ADD_STYLIST_AVAILABILITY_SUCCESS,
	ADD_STYLIST_AVAILABILITY_FAIL,
	ADD_STYLIST_AVAILABILITY_RESET,
	TOTAL_STYLIST_AVAILABILITY_REQUEST,
	TOTAL_STYLIST_AVAILABILITY_SUCCESS,
	TOTAL_STYLIST_AVAILABILITY_FAIL,
	TOTAL_STYLIST_AVAILABILITY_RESET
} from '../constants/attendanceConstants';

export const checkInOutReducer = (state = {}, action) => {
	switch (action.type) {
		case CHECKINOUT_REQUEST:
			return { loading: true };

		case CHECKINOUT_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CHECKINOUT_FAIL:
			return { loading: false, error: action.payload };

		case CHECKINOUT_RESET:
			return {};

		default:
			return state;
	}
};

export const getAttendanceListReducer = (state = {}, action) => {
	switch (action.type) {
		case ATTENDANCE_LIST_REQUEST:
			return { loading: true };

		case ATTENDANCE_LIST_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case ATTENDANCE_LIST_FAIL:
			return { loading: false, error: action.payload };

		case ATTENDANCE_LIST_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteCheckinReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_CHECKIN_REQUEST:
			return { loading: true };

		case DELETE_CHECKIN_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case DELETE_CHECKIN_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_CHECKIN_RESET:
			return {};

		default:
			return state;
	}
};

export const getStylistSessionsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_STYLIST_AVAILABILITYS_REQUEST:
			return { loading: true };

		case GET_STYLIST_AVAILABILITYS_SUCCESS:
			return { sessions: action.payload, loading: false };

		case GET_STYLIST_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case GET_STYLIST_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};

export const addStylistSessionReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_STYLIST_AVAILABILITY_REQUEST:
			return { loading: true };

		case ADD_STYLIST_AVAILABILITY_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_STYLIST_AVAILABILITY_FAIL:
			return { loading: false, error: action.payload };

		case ADD_STYLIST_AVAILABILITY_RESET:
			return {};

		default:
			return state;
	}
};

export const totalStylistSessionReducer = (state = {}, action) => {
	switch (action.type) {
		case TOTAL_STYLIST_AVAILABILITY_REQUEST:
			return { loading: true };

		case TOTAL_STYLIST_AVAILABILITY_SUCCESS:
			return { session: action.payload, loading: false };

		case TOTAL_STYLIST_AVAILABILITY_FAIL:
			return { loading: false, error: action.payload };

		case TOTAL_STYLIST_AVAILABILITY_RESET:
			return {};

		default:
			return state;
	}
};
