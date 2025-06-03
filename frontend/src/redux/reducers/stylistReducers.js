import {
	STYLER_REQUEST,
	STYLER_SUCCESS,
	STYLER_FAIL,
	STYLER_RESET,

	CREATE_NEW_STYLER_REQUEST,
	CREATE_NEW_STYLER_SUCCESS,
	CREATE_NEW_STYLER_FAIL,
	CREATE_NEW_STYLER_RESET,

	UPDATE_STYLER_REQUEST,
	UPDATE_STYLER_RESET,
	UPDATE_STYLER_FAIL,
	UPDATE_STYLER_SUCCESS,

	DELETE_STYLER_REQUEST,
	DELETE_STYLER_SUCCESS,
	DELETE_STYLER_FAIL,
	DELETE_STYLER_RESET,

	CHANGE_STATUS_STYLER_REQUEST,
	CHANGE_STATUS_STYLER_SUCCESS,
	CHANGE_STATUS_STYLER_FAIL,
	CHANGE_STATUS_STYLER_RESET,

	GET_ENABLE_STYLER_LIST_REQUEST,
	GET_ENABLE_STYLER_LIST_SUCCESS,
	GET_ENABLE_STYLER_LIST_FAIL,
	GET_ENABLE_STYLER_LIST_RESET,
	GET_STYLIST_SETTINGS_REQUEST,
	GET_STYLIST_SETTINGS_SUCCESS,
	GET_STYLIST_SETTINGS_FAIL,
	GET_STYLIST_SETTINGS_RESET,
	CREATE_STYLIST_SETTINGS_REQUEST,
	CREATE_STYLIST_SETTINGS_SUCCESS,
	CREATE_STYLIST_SETTINGS_FAIL,
	CREATE_STYLIST_SETTINGS_RESET,
} from '../constants/stylistConstants';


export const getStylistListReducer = (state = {}, action) => {
	switch (action.type) {
		case STYLER_REQUEST:
			return { loading: true };

		case STYLER_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case STYLER_FAIL:
			return { loading: false, error: action.payload };

		case STYLER_RESET:
			return {};

		default:
			return state;
	}
};



export const createNewStylistReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_NEW_STYLER_REQUEST:
			return { loading: true };

		case CREATE_NEW_STYLER_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CREATE_NEW_STYLER_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_STYLER_RESET:
			return {};

		default:
			return state;
	}
};


export const updateStylistReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_STYLER_REQUEST:
			return { loading: true };

		case UPDATE_STYLER_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case UPDATE_STYLER_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_STYLER_RESET:
			return {};

		default:
			return state;
	}
};




export const deleteStylistReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_STYLER_REQUEST:
			return { loading: true };

		case DELETE_STYLER_SUCCESS:
			return { userInfo: action.payload.userInfo, loading: false };

		case DELETE_STYLER_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_STYLER_RESET:
			return {};

		default:
			return state;
	}
};



export const changeStatustylistReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_STATUS_STYLER_REQUEST:
			return { loading: true };

		case CHANGE_STATUS_STYLER_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CHANGE_STATUS_STYLER_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_STATUS_STYLER_RESET:
			return {};

		default:
			return state;
	}
};

export const getEnableStylistListReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ENABLE_STYLER_LIST_REQUEST:
			return { loading: true };

		case GET_ENABLE_STYLER_LIST_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case GET_ENABLE_STYLER_LIST_FAIL:
			return { loading: false, error: action.payload };

		case GET_ENABLE_STYLER_LIST_RESET:
			return {};

		default:
			return state;
	}
};


export const getStylistSettingsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_STYLIST_SETTINGS_REQUEST:
			return { loading: true };

		case GET_STYLIST_SETTINGS_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case GET_STYLIST_SETTINGS_FAIL:
			return { loading: false, error: action.payload };

		case GET_STYLIST_SETTINGS_RESET:
			return {};

		default:
			return state;
	}
};
 
export const addStylistSettingsReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_STYLIST_SETTINGS_REQUEST:
			return { loading: true };

		case CREATE_STYLIST_SETTINGS_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CREATE_STYLIST_SETTINGS_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_STYLIST_SETTINGS_RESET:
			return {};

		default:
			return state;
	}
};