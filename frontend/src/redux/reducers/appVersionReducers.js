import {
	GET_ALL_APP_VERSION_REQUEST,
	GET_ALL_APP_VERSION_SUCCESS,
	GET_ALL_APP_VERSION_FAIL,
	GET_ALL_APP_VERSION_RESET,
	ADD_APP_VERSION_REQUEST,
	ADD_APP_VERSION_SUCCESS,
	ADD_APP_VERSION_FAIL,
	ADD_APP_VERSION_RESET,
	CHANGE_APP_VERSION_STATUS_REQUEST,
	CHANGE_APP_VERSION_STATUS_SUCCESS,
	CHANGE_APP_VERSION_STATUS_FAIL,
	CHANGE_APP_VERSION_STATUS_RESET,
	DELETE_APP_VERSION_REQUEST,
	DELETE_APP_VERSION_SUCCESS,
	DELETE_APP_VERSION_FAIL,
	DELETE_APP_VERSION_RESET
} from '../constants/appVersionConstants';

export const getAllAppVersionReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_APP_VERSION_REQUEST:
			return { loading: true };

		case GET_ALL_APP_VERSION_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_APP_VERSION_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_APP_VERSION_RESET:
			return {};

		default:
			return state;
	}
};
 
export const createAppVersionReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_APP_VERSION_REQUEST:
			return { loading: true };

		case ADD_APP_VERSION_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_APP_VERSION_FAIL:
			return { loading: false, error: action.payload };

		case ADD_APP_VERSION_RESET:
			return {};

		default:
			return state;
	}
};



export const changeAppVersionStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_APP_VERSION_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_APP_VERSION_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case CHANGE_APP_VERSION_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_APP_VERSION_STATUS_RESET:
			return {};

		default:
			return state;
	}
};




export const deleteAppVersionReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_APP_VERSION_REQUEST:
			return { loading: true };

		case DELETE_APP_VERSION_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_APP_VERSION_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_APP_VERSION_RESET:
			return {};

		default:
			return state;
	}
};
 