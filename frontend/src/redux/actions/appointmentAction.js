import axios from 'axios';
import { BASE_URL } from './ip';
import {
	ADD_APPOINTMENT_FAIL, ADD_APPOINTMENT_REQUEST, ADD_APPOINTMENT_SUCCESS, ADD_PUBLIC_APPOINTMENT_FAIL, ADD_PUBLIC_APPOINTMENT_REQUEST, ADD_PUBLIC_APPOINTMENT_SUCCESS,
	APPOINTMENT_AVAILIBILITY_FAIL,
	APPOINTMENT_AVAILIBILITY_REQUEST,
	APPOINTMENT_AVAILIBILITY_SUCCESS,
	APPOINTMENT_STATUS_LIST_FAIL,
	APPOINTMENT_STATUS_LIST_REQUEST,
	APPOINTMENT_STATUS_LIST_SUCCESS,
	CHANGE_APPOINTMENT_FAIL,
	CHANGE_APPOINTMENT_REQUEST,
	CHANGE_APPOINTMENT_SUCCESS,
	DELETE_APPOINTMENT_FAIL, DELETE_APPOINTMENT_REQUEST, DELETE_APPOINTMENT_SUCCESS, DELETE_SLOT_FAIL, DELETE_SLOT_REQUEST, DELETE_SLOT_SUCCESS, GET_ACTIVITY_FAIL, GET_ACTIVITY_REQUEST, GET_ACTIVITY_SUCCESS, GET_BUSINESS_FAIL, GET_BUSINESS_REQUEST, GET_BUSINESS_SUCCESS, GET_PUBLIC_APPOINTMENT_REQUEST, GET_PUBLIC_APPOINTMENT_RESET, GET_PUBLIC_APPOINTMENT_SUCCESS, GET_STYLIST_FAIL, GET_STYLIST_REQUEST, GET_STYLIST_SUCCESS, UPDATE_APPOINTMENT_FAIL, UPDATE_APPOINTMENT_REQUEST, UPDATE_APPOINTMENT_STATUS_FAIL, UPDATE_APPOINTMENT_STATUS_REQUEST, UPDATE_APPOINTMENT_STATUS_SUCCESS, UPDATE_APPOINTMENT_SUCCESS
} from "../constants/appointmentConstants";
import { toast } from 'react-toastify';

const utcTimeOffset = new Date().getTimezoneOffset();

export const addAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_APPOINTMENT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment/add-appointment-from-dashboard?offset=${utcTimeOffset}`, formData, config);
		console.log(data.message, 'data.message')
		// if(data.status){
		// 	toast.success(data.message)
		// }
		dispatch({
			type: ADD_APPOINTMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		toast.error(err)
		dispatch({
			type: ADD_APPOINTMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const getAppointmentAction = async (formData, userLogin) => {
	try {
		const config = {
			headers: {
				token: userLogin.userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		return await axios.post(`${BASE_URL}/appointment-availability/get-available-list-by-range`, formData, config);
	} catch (err) {
		return err
	}
}


export const updateAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: UPDATE_APPOINTMENT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment/update-appointment-from-dashboard?offset=${utcTimeOffset}`, formData, config);
		// console.log("update appointment" , data);
		dispatch({
			type: UPDATE_APPOINTMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: UPDATE_APPOINTMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const deleteSlotAction = (appointmentId) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SLOT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/appointment-availability/delete-availability?id=${appointmentId}`, config);
		dispatch({
			type: DELETE_SLOT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SLOT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
export const deleteAppointmentAction = (appointmentId) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_APPOINTMENT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/appointment/delete-appointment-dashboard/${appointmentId}`, config);
		dispatch({
			type: DELETE_APPOINTMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_APPOINTMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getPublicAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_PUBLIC_APPOINTMENT_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/public/appointment/get-available-appointment-by-date`, formData, config);
		// console.log("Public appointment" , data);
		dispatch({
			type: GET_PUBLIC_APPOINTMENT_SUCCESS,
			payload: data
		})
	} catch (err) {
		dispatch({
			type: GET_PUBLIC_APPOINTMENT_RESET,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
}


export const confirmAppointmentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: UPDATE_APPOINTMENT_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment/confirm-appointment`, formData, config);
		// console.log("confirm " , data);
		dispatch({
			type: UPDATE_APPOINTMENT_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: UPDATE_APPOINTMENT_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const addPublicAppointmentAction = (formData) => async (dispatch) => {
	try {
		dispatch({ type: ADD_PUBLIC_APPOINTMENT_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		//const { data } = await axios.post(`${BASE_URL}/public/appointment/add-appointment?offset=${utcTimeOffset}`, formData, config);
		const { data } = await axios.post(`${BASE_URL}/public/appointment/add-appointment-from-website?offset=${utcTimeOffset}`, formData, config);

		dispatch({
			type: ADD_PUBLIC_APPOINTMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_PUBLIC_APPOINTMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const appointmentStatusListAction = () => async (dispatch) => {
	try {
		dispatch({ type: APPOINTMENT_STATUS_LIST_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/appointment/get-appointment-status-list`, config);
		// console.log("appointment" , data);
		dispatch({
			type: APPOINTMENT_STATUS_LIST_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: APPOINTMENT_STATUS_LIST_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const availabilityAppointmentAction = (id) => async (dispatch) => {
	try {
		dispatch({ type: APPOINTMENT_AVAILIBILITY_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/appointment/get-availability-detail-by-appointment?availabilityId=${id}`, config);
		// console.log("availibity detail" , data);
		dispatch({
			type: APPOINTMENT_AVAILIBILITY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: APPOINTMENT_AVAILIBILITY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getBusinessHourAction = (stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_BUSINESS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
			}
		};

		const { data } = await axios.get(`${BASE_URL}/appointment-availability/get-buiness-hours?stylistId=${stylistId}`, config);

		dispatch({
			type: GET_BUSINESS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_BUSINESS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const changeAppointmentAction = (formData, appointmentId) => async (dispatch) => {
	try {
		dispatch({ type: CHANGE_APPOINTMENT_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/appointment/change-status-of-appointment?id=${appointmentId}`, formData, config);
		// console.log("change" , data);
		dispatch({
			type: CHANGE_APPOINTMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_APPOINTMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getActivityListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ACTIVITY_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/appointment-availability/get-today-activity?offset=${utcTimeOffset}`, formData, config);
		// console.log("today" , data);
		dispatch({
			type: GET_ACTIVITY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ACTIVITY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getSylistAppointmentAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_STYLIST_REQUEST });

		const { getPublicWebsite: { websiteInfo } } = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/website/get-website-stylist-by-name?offset=${utcTimeOffset}&name=${websiteInfo.data.salon.name}`, config);
		// console.log("appointmentss" , data);
		dispatch({
			type: GET_STYLIST_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_STYLIST_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};