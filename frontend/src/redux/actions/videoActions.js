import axios from 'axios';
import {
	GET_ALL_VIDEO_CATEGORY_REQUEST,
	GET_ALL_VIDEO_CATEGORY_SUCCESS,
	GET_ALL_VIDEO_CATEGORY_FAIL,
	ADD_VIDEO_CATEGORY_REQUEST,
	ADD_VIDEO_CATEGORY_SUCCESS,
	ADD_VIDEO_CATEGORY_FAIL,
	VIDEO_CATEGORY_STATUS_REQUEST,
	VIDEO_CATEGORY_STATUS_SUCCESS,
	VIDEO_CATEGORY_STATUS_FAIL,
	DELETE_VIDEO_CATEGORY_REQUEST,
	DELETE_VIDEO_CATEGORY_SUCCESS,
	DELETE_VIDEO_CATEGORY_FAIL,
	GET_ALL_VIDEOS_REQUEST,
	GET_ALL_VIDEOS_SUCCESS,
	GET_ALL_VIDEOS_FAIL,
	GET_ONE_VIDEO_REQUEST,
	GET_ONE_VIDEO_SUCCESS,
	GET_ONE_VIDEO_FAIL,
	CREATE_VIDEO_REQUEST,
	CREATE_VIDEO_SUCCESS,
	CREATE_VIDEO_FAIL,
	CHANGE_VIDEO_STATUS_REQUEST,
	CHANGE_VIDEO_STATUS_SUCCESS,
	CHANGE_VIDEO_STATUS_FAIL,
	DELETE_VIDEO_REQUEST,
	DELETE_VIDEO_SUCCESS,
	DELETE_VIDEO_FAIL
} from '../constants/videoConstants';
import { BASE_URL } from './ip';

export const getAllVideoCategoriesAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_VIDEO_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/video/get-category?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_VIDEO_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_VIDEO_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createVideoCategoryAction = (id, categoryName) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_VIDEO_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const formData = id ? { categoryID: id, categoryName } : { categoryName };
		const { data } = await axios.post(`${BASE_URL}/video/create-category`, formData, config);

		dispatch({
			type: ADD_VIDEO_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_VIDEO_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const videoCategoryStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: VIDEO_CATEGORY_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/video/enable-disable-category?categoryId=${id}`,
			{ enable: enableStatus },
			config
		);

		dispatch({
			type: VIDEO_CATEGORY_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: VIDEO_CATEGORY_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteVideoCategoryAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_VIDEO_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/video/delete-category?categoryId=${id}`, config);

		dispatch({
			type: DELETE_VIDEO_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_VIDEO_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAllVideosAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_VIDEOS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/video/get-video-by-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_VIDEOS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_VIDEOS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getOneVideoAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ONE_VIDEO_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/video/get-video-by-id?videoID=${id}`, config);

		dispatch({
			type: GET_ONE_VIDEO_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ONE_VIDEO_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createVideoAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_VIDEO_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/video/add-video`, formData, config);

		dispatch({
			type: CREATE_VIDEO_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_VIDEO_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const changeVideoStatusAction = (id, videoStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_VIDEO_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/video/enable-disable-video?videoID=${id}`,
			{ enable: videoStatus },
			config
		);

		dispatch({
			type: CHANGE_VIDEO_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_VIDEO_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteVideoAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_VIDEO_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/video/delete-video?videoID=${id}`, config);

		dispatch({
			type: DELETE_VIDEO_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_VIDEO_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
