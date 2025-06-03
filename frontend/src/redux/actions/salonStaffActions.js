import axios from 'axios';
import {
	SALON_STAFF_REQUEST,
	SALON_STAFF_SUCCESS,
	SALON_STAFF_FAIL,

	DELETE_SALON_STAFF_SUCCESS,
	DELETE_SALON_STAFF_REQUEST,
	DELETE_SALON_STAFF_FAIL,

	CREATE_NEW_SALON_STAFF_REQUEST,
	CREATE_NEW_SALON_STAFF_SUCCESS,
	CREATE_NEW_SALON_STAFF_FAIL,

	UPDATE_SALON_STAFF_REQUEST,
	UPDATE_SALON_STAFF_RESET,
	UPDATE_SALON_STAFF_FAIL,
	UPDATE_SALON_STAFF_SUCCESS,
	CHANGE_STATUS_SALON_STAFF_REQUEST,
	CHANGE_STATUS_SALON_STAFF_SUCCESS,
	CHANGE_STATUS_SALON_STAFF_FAIL
} from '../constants/salonStaffConstants';
import { BASE_URL } from './ip';

export const getSalonStaffListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: SALON_STAFF_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/salon-staff/get-salon-staff?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);
		dispatch({
			type: SALON_STAFF_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: SALON_STAFF_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const deleteSalonStaffAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SALON_STAFF_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.delete(`${BASE_URL}/salon-staff/delete-salon-staff?salonID=${id}`, config);

		dispatch({
			type: DELETE_SALON_STAFF_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SALON_STAFF_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};




export const createNewStaffSalonAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_SALON_STAFF_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};



		const { data } = await axios.post(`${BASE_URL}/salon-staff/create-salon-staff`, formData, config);

		dispatch({
			type: CREATE_NEW_SALON_STAFF_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_SALON_STAFF_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const changeStatusSalonStaffAction = (id, formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_STATUS_SALON_STAFF_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.patch(`${BASE_URL}/salon-staff/enable-disable-salon-staff?userID=${id}`, formData, config);

		dispatch({
			type: CHANGE_STATUS_SALON_STAFF_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_STATUS_SALON_STAFF_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};