import axios from 'axios';
import {
	GET_ALL_APP_VERSION_REQUEST,
	GET_ALL_APP_VERSION_SUCCESS,
	GET_ALL_APP_VERSION_FAIL,
	ADD_APP_VERSION_REQUEST,
	ADD_APP_VERSION_SUCCESS,
	ADD_APP_VERSION_FAIL,
	CHANGE_APP_VERSION_STATUS_REQUEST,
	CHANGE_APP_VERSION_STATUS_SUCCESS,
	CHANGE_APP_VERSION_STATUS_FAIL,

	DELETE_APP_VERSION_REQUEST,
	DELETE_APP_VERSION_SUCCESS,
	DELETE_APP_VERSION_FAIL,
} from '../constants/appVersionConstants';
import { BASE_URL } from './ip';

export const getAllAppVersionAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_APP_VERSION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/version/get-version?salon=${formData.salon}&pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_APP_VERSION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_APP_VERSION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const createAppVersionAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_APP_VERSION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/version/add-version`, formData, config);

		dispatch({
			type: ADD_APP_VERSION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_APP_VERSION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const changeAppVersionStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_APP_VERSION_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/version/enable-disable-version?id=${id}`, enableStatus, config);

		dispatch({
			type: CHANGE_APP_VERSION_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_APP_VERSION_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const deleteAppVersionAction = (id, salon) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_APP_VERSION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/version/delete-version?id=${id}&salonId=${salon}`, config);

		dispatch({
			type: DELETE_APP_VERSION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_APP_VERSION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

