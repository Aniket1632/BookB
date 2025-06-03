import axios from 'axios';
import {
	GET_DAILY_AVAILABILITYS_REQUEST,
	GET_DAILY_AVAILABILITYS_SUCCESS,
	GET_DAILY_AVAILABILITYS_FAIL,

	ADD_DAILY_AVAILABILITYS_FAIL,
	ADD_DAILY_AVAILABILITYS_SUCCESS,
	ADD_DAILY_AVAILABILITYS_REQUEST,

	ADD_BULK_AVAILABILITYS_REQUEST,
	ADD_BULK_AVAILABILITYS_SUCCESS,
	ADD_BULK_AVAILABILITYS_FAIL,

	ADD_DAY_AVAILABILITYS_REQUEST,
	ADD_DAY_AVAILABILITYS_SUCCESS,
	ADD_DAY_AVAILABILITYS_FAIL,

	GET_UNBLOCK_AVAILABILITYS_FAIL,
	GET_UNBLOCK_AVAILABILITYS_SUCCESS,
	GET_UNBLOCK_AVAILABILITYS_REQUEST,
	DEL_BLOCK_AVAILABILITYS_REQUEST,
	DEL_BLOCK_AVAILABILITYS_SUCCESS,
	DEL_BLOCK_AVAILABILITYS_FAIL,
} from '../constants/availabilityConstants';
import { BASE_URL } from './ip';
import { toast } from 'react-toastify';

const utcTimeOffset = new Date().getTimezoneOffset();


export const getStylistAvailabilitysAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_DAILY_AVAILABILITYS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		let uri = `${BASE_URL}/appointment-availability/get-availability-daily?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`;

		const { data } = await axios.get(uri, config);

		dispatch({
			type: GET_DAILY_AVAILABILITYS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_DAILY_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addDailyAvailabilityAction = (date, stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_DAILY_AVAILABILITYS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment-availability/create-availability-daily?offset=${utcTimeOffset}&stylistId=${stylistId}`, date, config);

		dispatch({
			type: ADD_DAILY_AVAILABILITYS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_DAILY_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addBulkAvailabilityAction = (formData, stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_BULK_AVAILABILITYS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment-availability/create-availability-bulk?offset=-330&stylistId=${stylistId}`, formData, config);

		dispatch({
			type: ADD_BULK_AVAILABILITYS_SUCCESS,
			payload: data
		});
	} catch (err) {
		toast.error(err.response.data.message)
		dispatch({
			type: ADD_BULK_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const addDayAvailabilityAction = (date, stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_DAY_AVAILABILITYS_REQUEST });

		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment-availability/create-availability-day?offset=-330&stylistId=${stylistId}`, date, config);

		dispatch({
			type: ADD_DAY_AVAILABILITYS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_DAY_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


// export const getUnBlockAvailabilitysAction = (formData) => async (dispatch, getState) => {
// 	try {
// 		dispatch({ type: GET_UNBLOCK_AVAILABILITYS_REQUEST });

// 		const { userLogin: { userInfo } } = getState();

// 		const config = {
// 			headers: {
// 				token: userInfo.data.token,
// 				'Content-Type': 'application/json'
// 			}
// 		};


// 		let uri = `${BASE_URL}/appointment-availability/get-appointment-list-with-block-unblock-status?date=${formData}`;
// 		// pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}

// 		if (formData.date) {
// 			uri = uri + '?date=' + formData.date;
// 		}

// 		const { data } = await axios.get(uri, config);

// 		dispatch({
// 			type: GET_UNBLOCK_AVAILABILITYS_SUCCESS,
// 			payload: data
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: GET_UNBLOCK_AVAILABILITYS_FAIL,
// 			payload: err.response && err.response.data.message ? err.response.data.message : err.message
// 		});
// 	}
// };

export const blockAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: DEL_BLOCK_AVAILABILITYS_REQUEST })
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		let uri = `${BASE_URL}/appointment-availability/block-availability?date=${formData}`;

		const { data } = await axios.delete(uri, config);

		dispatch({
			type: DEL_BLOCK_AVAILABILITYS_SUCCESS,
			payload: data
		})

	} catch (err) {
		dispatch({
			type: DEL_BLOCK_AVAILABILITYS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
}

export const getUnBlockAvailabilitysAction = async (data, userLogin) => {
	try {

		const config = {
			headers: {
				token: userLogin.userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		return await axios.post(`${BASE_URL}/appointment-availability/get-available-list-by-range`, data, config);
	} catch (err) {
		return err
	}
}
