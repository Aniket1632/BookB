import axios from 'axios';
import {
	GET_ALL_COMPANY_REQUEST,
	GET_ALL_COMPANY_SUCCESS,
	GET_ALL_COMPANY_FAIL,
	ADD_COMPANY_REQUEST,
	ADD_COMPANY_SUCCESS,
	ADD_COMPANY_FAIL,
	CHANGE_COMPANY_STATUS_REQUEST,
	CHANGE_COMPANY_STATUS_SUCCESS,
	CHANGE_COMPANY_STATUS_FAIL,
	DELETE_COMPANY_REQUEST,
	DELETE_COMPANY_SUCCESS,
	DELETE_COMPANY_FAIL,
	GET_ALL_ENABLE_COMPANY_REQUEST,
	GET_ALL_ENABLE_COMPANY_SUCCESS,
	GET_ALL_ENABLE_COMPANY_FAIL
} from '../constants/companyConstants';
import { BASE_URL } from './ip';

export const getAllCompanyAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_COMPANY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/stylist/get-company?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_COMPANY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_COMPANY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const getAllEnableCompanyAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_ENABLE_COMPANY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/stylist/get-enable-company?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}`, config);

		dispatch({
			type: GET_ALL_ENABLE_COMPANY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_ENABLE_COMPANY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createCompanyAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_COMPANY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/stylist/create-company`, formData, config);

		dispatch({
			type: ADD_COMPANY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_COMPANY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const changeCompanyStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_COMPANY_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/stylist/enable-disable-company?id=${id}`, enableStatus, config);

		dispatch({
			type: CHANGE_COMPANY_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_COMPANY_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteCompanyAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_COMPANY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/stylist/delete-company?id=${id}`, config);

		dispatch({
			type: DELETE_COMPANY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_COMPANY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

