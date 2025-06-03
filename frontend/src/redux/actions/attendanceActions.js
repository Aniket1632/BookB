import axios from 'axios';
import {
	ATTENDANCE_LIST_FAIL,
	ATTENDANCE_LIST_REQUEST,
	ATTENDANCE_LIST_SUCCESS,
	CHECKINOUT_REQUEST,
	CHECKINOUT_SUCCESS,
	CHECKINOUT_FAIL,
	DELETE_CHECKIN_REQUEST,
	DELETE_CHECKIN_SUCCESS,
	DELETE_CHECKIN_FAIL,
	GET_STYLIST_AVAILABILITYS_REQUEST,
	GET_STYLIST_AVAILABILITYS_SUCCESS,
	GET_STYLIST_AVAILABILITYS_FAIL,
	ADD_STYLIST_AVAILABILITY_REQUEST,
	ADD_STYLIST_AVAILABILITY_SUCCESS,
	ADD_STYLIST_AVAILABILITY_FAIL,
	TOTAL_STYLIST_AVAILABILITY_REQUEST,
	TOTAL_STYLIST_AVAILABILITY_SUCCESS,
	TOTAL_STYLIST_AVAILABILITY_FAIL
} from '../constants/attendanceConstants';
import { BASE_URL } from './ip';

const utcTimeOffset = new Date().getTimezoneOffset();

export const checkIAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHECKINOUT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/attendance/attendance?offset=${utcTimeOffset}`, formData, config);

		dispatch({
			type: CHECKINOUT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHECKINOUT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAttendListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ATTENDANCE_LIST_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/attendance/get-todays-attendance-by-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&offset=${utcTimeOffset}`,
			config
		);

		dispatch({
			type: ATTENDANCE_LIST_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ATTENDANCE_LIST_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteCheckinAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_CHECKIN_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/attendance/delete-attendance?id=${id}`, config);

		dispatch({
			type: DELETE_CHECKIN_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_CHECKIN_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getStylistSessionsAction = (month, stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_STYLIST_AVAILABILITYS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		let uri = `${BASE_URL}/appointment-availability/get-availability-by-stylist?pageNumber=1&pageSize=10&filter`;

		const { data } = await axios.get(uri, config);

		dispatch({
			type: GET_STYLIST_AVAILABILITYS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_STYLIST_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addStylistAvailabilityAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_STYLIST_AVAILABILITY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment-availability/create-availability?offset=-330`, formData, config);

		dispatch({
			type: ADD_STYLIST_AVAILABILITY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_STYLIST_AVAILABILITY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const totalStylistSessionAction = (month) => async (dispatch, getState) => {
	try {
		dispatch({ type: TOTAL_STYLIST_AVAILABILITY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/session/get-total-session-by-stylist?month=${month}&offset=-330`,
			config
		);

		dispatch({
			type: TOTAL_STYLIST_AVAILABILITY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: TOTAL_STYLIST_AVAILABILITY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
