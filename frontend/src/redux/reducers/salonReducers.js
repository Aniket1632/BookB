import {
	SALON_REQUEST,
	SALON_SUCCESS,
	SALON_FAIL,
	SALON_RESET,

	CREATE_NEW_SALON_REQUEST,
	CREATE_NEW_SALON_SUCCESS,
	CREATE_NEW_SALON_FAIL,
	CREATE_NEW_SALON_RESET,

	UPDATE_SALON_REQUEST,
	UPDATE_SALON_RESET,
	UPDATE_SALON_FAIL,
	UPDATE_SALON_SUCCESS,

	DELETE_SALON_FAIL,
	DELETE_SALON_RESET,
	DELETE_SALON_REQUEST,
	DELETE_SALON_SUCCESS,

	CHANGE_STATUS_SALON_REQUEST,
	CHANGE_STATUS_SALON_SUCCESS,
	CHANGE_STATUS_SALON_FAIL,
	CHANGE_STATUS_SALON_RESET,
	GET_ALL_ENABLE_SALON_REQUEST,
	GET_ALL_ENABLE_SALON_FAIL,
	GET_ALL_ENABLE_SALON_RESET,
	GET_ALL_ENABLE_SALON_SUCCESS,
	CHANGE_MENU_SETTINGS_REQUEST,
	CHANGE_MENU_SETTINGS_SUCCESS,
	CHANGE_MENU_SETTINGS_FAIL,
	CHANGE_MENU_SETTINGS_RESET
} from '../constants/salonConstants';


export const getSalonListReducer = (state = {}, action) => {
	switch (action.type) {
		case SALON_REQUEST:
			return { loading: true };

		case SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case SALON_FAIL:
			return { loading: false, error: action.payload };

		case SALON_RESET:
			return {};

		default:
			return state;
	}
};



export const createNewSalonReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_NEW_SALON_REQUEST:
			return { loading: true };

		case CREATE_NEW_SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CREATE_NEW_SALON_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_SALON_RESET:
			return {};

		default:
			return state;
	}
};


export const updateSalonReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_SALON_REQUEST:
			return { loading: true };

		case UPDATE_SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case UPDATE_SALON_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_SALON_RESET:
			return {};

		default:
			return state;
	}
};




export const deleteSalonReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_SALON_REQUEST:
			return { loading: true };

		case DELETE_SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case DELETE_SALON_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SALON_RESET:
			return {};

		default:
			return state;
	}
};


export const changeStatusSalonReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_STATUS_SALON_REQUEST:
			return { loading: true };

		case CHANGE_STATUS_SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CHANGE_STATUS_SALON_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_STATUS_SALON_RESET:
			return {};

		default:
			return state;
	}
};


 

export const getAllEnabledSalonsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_ENABLE_SALON_REQUEST:
			return { loading: true };

		case GET_ALL_ENABLE_SALON_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case GET_ALL_ENABLE_SALON_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_ENABLE_SALON_RESET:
			return {};

		default:
			return state;
	}
};


 
export const changeAppMenuSettingReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_MENU_SETTINGS_REQUEST:
			return { loading: true };

		case CHANGE_MENU_SETTINGS_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CHANGE_MENU_SETTINGS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_MENU_SETTINGS_RESET:
			return {};

		default:
			return state;
	}
};

