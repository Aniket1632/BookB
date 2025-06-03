import axios from 'axios';
import {
	GET_ALL_SERVICE_REQUEST,
	GET_ALL_SERVICE_SUCCESS,
	GET_ALL_SERVICE_FAIL,

	ADD_SERVICE_REQUEST,
	ADD_SERVICE_SUCCESS,
	ADD_SERVICE_FAIL,

	CHANGE_SERVICE_STATUS_REQUEST,
	CHANGE_SERVICE_STATUS_SUCCESS,
	CHANGE_SERVICE_STATUS_FAIL,

	DELETE_SERVICE_REQUEST,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,

	GET_ALL_ENABLE_SERVICE_REQUEST,
	GET_ALL_ENABLE_SERVICE_SUCCESS,
	GET_ALL_ENABLE_SERVICE_FAIL,

	GET_ALL_SERVICE_CATEGORY_REQUEST,
	GET_ALL_SERVICE_CATEGORY_SUCCESS,
	GET_ALL_SERVICE_CATEGORY_FAIL,

	ADD_SERVICE_CATEGORY_REQUEST,
	ADD_SERVICE_CATEGORY_SUCCESS,
	ADD_SERVICE_CATEGORY_FAIL,

	SERVICE_CATEGORY_STATUS_REQUEST,
	SERVICE_CATEGORY_STATUS_SUCCESS,
	SERVICE_CATEGORY_STATUS_FAIL,

	DELETE_SERVICE_CATEGORY_REQUEST,
	DELETE_SERVICE_CATEGORY_SUCCESS,
	DELETE_SERVICE_CATEGORY_FAIL,
	GET_ALL_ENABLE_SUB_SERVICE_FAIL,
	GET_ALL_ENABLE_SUB_SERVICE_REQUEST,
	GET_ALL_ENABLE_SUB_SERVICE_SUCCESS,

	UPDATE_RANK_SERVICE_REQUEST,
	UPDATE_RANK_SERVICE_SUCCESS,
	UPDATE_RANK_SERVICE_RESET,

} from '../constants/serviceConstants';
import { BASE_URL } from './ip';


export const getAllServiceCategoriesAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_SERVICE_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/service/get-main-service?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_SERVICE_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_SERVICE_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const serviceCategoryStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: SERVICE_CATEGORY_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/service/enable-disable-service?serviceId=${id}`,
			{ enable: enableStatus },
			config
		);

		dispatch({
			type: SERVICE_CATEGORY_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: SERVICE_CATEGORY_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteServiceCategoryAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SERVICE_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/service/delete-category?categoryId=${id}`, config);

		dispatch({
			type: DELETE_SERVICE_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SERVICE_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAllServiceAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const id = formData.id ? `id=${formData.id}&` : '';
		const { data } = await axios.get(`${BASE_URL}/service/get-service-groupby-category?${id}pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAllEnableServiceAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_ENABLE_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/service/get-enable-main-service?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}`, config);

		dispatch({
			type: GET_ALL_ENABLE_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_ENABLE_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createServiceAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/service/add-service`, formData, config);

		dispatch({
			type: ADD_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const changeServiceStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_SERVICE_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/service/enable-disable-service?serviceId=${id}`, enableStatus, config);

		dispatch({
			type: CHANGE_SERVICE_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_SERVICE_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteServiceAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/service/delete-service?serviceId=${id}`, config);

		dispatch({
			type: DELETE_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAllEnableSubServiceAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_ENABLE_SUB_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/service/get-enable-sub-service?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}`, config);

		dispatch({
			type: GET_ALL_ENABLE_SUB_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_ENABLE_SUB_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const updateRankServiceAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: UPDATE_RANK_SERVICE_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/service/rank-update-service`, formData, config);

		dispatch({
			type: UPDATE_RANK_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: UPDATE_RANK_SERVICE_RESET,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};