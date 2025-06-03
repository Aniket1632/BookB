import {
	GET_ALL_VIDEO_CATEGORY_REQUEST,
	GET_ALL_VIDEO_CATEGORY_SUCCESS,
	GET_ALL_VIDEO_CATEGORY_FAIL,
	GET_ALL_VIDEO_CATEGORY_RESET,
	ADD_VIDEO_CATEGORY_REQUEST,
	ADD_VIDEO_CATEGORY_SUCCESS,
	ADD_VIDEO_CATEGORY_FAIL,
	ADD_VIDEO_CATEGORY_RESET,
	VIDEO_CATEGORY_STATUS_REQUEST,
	VIDEO_CATEGORY_STATUS_SUCCESS,
	VIDEO_CATEGORY_STATUS_FAIL,
	VIDEO_CATEGORY_STATUS_RESET,
	DELETE_VIDEO_CATEGORY_REQUEST,
	DELETE_VIDEO_CATEGORY_SUCCESS,
	DELETE_VIDEO_CATEGORY_FAIL,
	DELETE_VIDEO_CATEGORY_RESET,
	GET_ALL_VIDEOS_REQUEST,
	GET_ALL_VIDEOS_SUCCESS,
	GET_ALL_VIDEOS_FAIL,
	GET_ALL_VIDEOS_RESET,
	GET_ONE_VIDEO_REQUEST,
	GET_ONE_VIDEO_SUCCESS,
	GET_ONE_VIDEO_FAIL,
	GET_ONE_VIDEO_RESET,
	CREATE_VIDEO_REQUEST,
	CREATE_VIDEO_SUCCESS,
	CREATE_VIDEO_FAIL,
	CREATE_VIDEO_RESET,
	CHANGE_VIDEO_STATUS_REQUEST,
	CHANGE_VIDEO_STATUS_SUCCESS,
	CHANGE_VIDEO_STATUS_FAIL,
	CHANGE_VIDEO_STATUS_RESET,
	DELETE_VIDEO_REQUEST,
	DELETE_VIDEO_SUCCESS,
	DELETE_VIDEO_FAIL,
	DELETE_VIDEO_RESET
} from '../constants/videoConstants';

export const getAllVideoCategoriesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_VIDEO_CATEGORY_REQUEST:
			return { loading: true };

		case GET_ALL_VIDEO_CATEGORY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_VIDEO_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_VIDEO_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const createVideoCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_VIDEO_CATEGORY_REQUEST:
			return { loading: true };

		case ADD_VIDEO_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_VIDEO_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case ADD_VIDEO_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const videoCategoryStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case VIDEO_CATEGORY_STATUS_REQUEST:
			return { loading: true };

		case VIDEO_CATEGORY_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case VIDEO_CATEGORY_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case VIDEO_CATEGORY_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteVideoCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_VIDEO_CATEGORY_REQUEST:
			return { loading: true };

		case DELETE_VIDEO_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_VIDEO_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_VIDEO_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const getAllVideosReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_VIDEOS_REQUEST:
			return { loading: true };

		case GET_ALL_VIDEOS_SUCCESS:
			return { videos: action.payload, loading: false };

		case GET_ALL_VIDEOS_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_VIDEOS_RESET:
			return {};

		default:
			return state;
	}
};

export const getOneVideoReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ONE_VIDEO_REQUEST:
			return { loading: true };

		case GET_ONE_VIDEO_SUCCESS:
			return { video: action.payload, loading: false };

		case GET_ONE_VIDEO_FAIL:
			return { loading: false, error: action.payload };

		case GET_ONE_VIDEO_RESET:
			return {};

		default:
			return state;
	}
};

export const createVideoReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_VIDEO_REQUEST:
			return { loading: true };

		case CREATE_VIDEO_SUCCESS:
			return { video: action.payload, loading: false };

		case CREATE_VIDEO_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_VIDEO_RESET:
			return {};

		default:
			return state;
	}
};

export const changeVideoStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_VIDEO_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_VIDEO_STATUS_SUCCESS:
			return { video: action.payload, loading: false };

		case CHANGE_VIDEO_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_VIDEO_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteVideoReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_VIDEO_REQUEST:
			return { loading: true };

		case DELETE_VIDEO_SUCCESS:
			return { video: action.payload, loading: false };

		case DELETE_VIDEO_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_VIDEO_RESET:
			return {};

		default:
			return state;
	}
};
