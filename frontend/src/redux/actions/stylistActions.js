import axios from 'axios';
import {
	STYLER_REQUEST,
	STYLER_SUCCESS,
	STYLER_FAIL,
	DELETE_STYLER_SUCCESS,
	DELETE_STYLER_REQUEST,
	DELETE_STYLER_FAIL,
	CREATE_NEW_STYLER_REQUEST,
	CREATE_NEW_STYLER_SUCCESS,
	CREATE_NEW_STYLER_FAIL,
	CHANGE_STATUS_STYLER_REQUEST,
	CHANGE_STATUS_STYLER_SUCCESS,
	CHANGE_STATUS_STYLER_FAIL,
	GET_ENABLE_STYLER_LIST_REQUEST,
	GET_ENABLE_STYLER_LIST_FAIL,
	GET_ENABLE_STYLER_LIST_SUCCESS,
	GET_STYLIST_SETTINGS_REQUEST,
	GET_STYLIST_SETTINGS_SUCCESS,
	GET_STYLIST_SETTINGS_FAIL,
	CREATE_STYLIST_SETTINGS_SUCCESS,
	CREATE_STYLIST_SETTINGS_FAIL,
	CREATE_STYLIST_SETTINGS_REQUEST
} from '../constants/stylistConstants';
import { BASE_URL } from './ip';

// export const getStylistListAction = (formData) => async (dispatch, getState) => {
// 	try {
// 		dispatch({ type: STYLER_REQUEST });

// 		const { userLogin: { userInfo } } = getState();

// 		const config = {
// 			headers: {
// 				token: userInfo.data.token,
// 				'Content-Type': 'application/json'
// 			}
// 		};

// 		const { data } = await axios.get(
// 			`${BASE_URL}/stylist/get-stylist?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`,
// 			config
// 		);
// 			console.log("Stylist List" , data);
// 		dispatch({
// 			type: STYLER_SUCCESS,
// 			payload: data
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: STYLER_FAIL,
// 			payload: err.response && err.response.data.message ? err.response.data.message : err.message
// 		});
// 	}
// };
export const getStylistListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: STYLER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/stylist/get-stylist-by-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`,
			config
		);
		// console.log("Stylist List" , data);
		dispatch({
			type: STYLER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: STYLER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
export const deleteStylistAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_STYLER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const data = await axios.delete(`${BASE_URL}/stylist/delete-stylist?stylistId=${id}`, config);

		dispatch({
			type: DELETE_STYLER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_STYLER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createNewStylistAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_STYLER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/stylist/create-stylist`, formData, config);

		dispatch({
			type: CREATE_NEW_STYLER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_STYLER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const changeStatusStylistAction = (id, formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_STATUS_STYLER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/stylist/enable-disable-stylist?userID=${id}`, formData, config);

		dispatch({
			type: CHANGE_STATUS_STYLER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_STATUS_STYLER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getEnableStylistListAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ENABLE_STYLER_LIST_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/stylist/get-enable-stylist?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`,
			config
		);

		dispatch({
			type: GET_ENABLE_STYLER_LIST_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ENABLE_STYLER_LIST_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getStylistSettingsAction = (stylistId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_STYLIST_SETTINGS_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/stylist/get-stylist-settings?stylistId=${stylistId}`,
			config
		);

		dispatch({
			type: GET_STYLIST_SETTINGS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_STYLIST_SETTINGS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const createStylistSettingsAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_STYLIST_SETTINGS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/stylist/add-stylist-settings`, formData, config);

		dispatch({
			type: CREATE_STYLIST_SETTINGS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_STYLIST_SETTINGS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
