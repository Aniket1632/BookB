import axios from 'axios';
import {
	SALON_REQUEST,
	SALON_SUCCESS,
	SALON_FAIL,

	DELETE_SALON_SUCCESS,
	DELETE_SALON_REQUEST,
	DELETE_SALON_FAIL,

	CREATE_NEW_SALON_REQUEST,
	CREATE_NEW_SALON_SUCCESS,
	CREATE_NEW_SALON_FAIL,

	UPDATE_SALON_REQUEST,
	UPDATE_SALON_RESET,
	UPDATE_SALON_FAIL,
	UPDATE_SALON_SUCCESS,
	CHANGE_STATUS_SALON_REQUEST,
	CHANGE_STATUS_SALON_SUCCESS,
	CHANGE_STATUS_SALON_FAIL,


	GET_ALL_ENABLE_SALON_REQUEST,
	GET_ALL_ENABLE_SALON_SUCCESS,
	GET_ALL_ENABLE_SALON_FAIL,
	GET_ALL_ENABLE_SALON_RESET,
	CHANGE_MENU_SETTINGS_REQUEST,
	CHANGE_MENU_SETTINGS_SUCCESS,
	CHANGE_MENU_SETTINGS_FAIL,
} from '../constants/salonConstants';
import { BASE_URL } from './ip';


export const getSalonListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: SALON_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/salon/get-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: SALON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: SALON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const deleteSalonAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SALON_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.delete(`${BASE_URL}/salon/delete-salon?salonID=${id}`, config);

		dispatch({
			type: DELETE_SALON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SALON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};




export const createNewSalonAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_SALON_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};



		const { data } = await axios.post(`${BASE_URL}/salon/create-salon`, formData, config);

		dispatch({
			type: CREATE_NEW_SALON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_SALON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const changeStatusSalonAction = (id, formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_STATUS_SALON_REQUEST });


		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.patch(`${BASE_URL}/salon/enable-disable-salon?userID=${id}`, formData, config);

		dispatch({
			type: CHANGE_STATUS_SALON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_STATUS_SALON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const getAllEnabledSalonListAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_ENABLE_SALON_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/salon/get-enable-salon`, config);

		dispatch({
			type: GET_ALL_ENABLE_SALON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_ENABLE_SALON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const changeMenuSettingsAction = (id, formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_MENU_SETTINGS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/salon/change-menu-setting?userID=${id}`, { 'appMenu': formData }, config);

		dispatch({
			type: CHANGE_MENU_SETTINGS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_MENU_SETTINGS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};