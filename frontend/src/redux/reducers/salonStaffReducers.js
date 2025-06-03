import {
	SALON_STAFF_REQUEST,
	SALON_STAFF_SUCCESS,
	SALON_STAFF_FAIL,
	SALON_STAFF_RESET,

	CREATE_NEW_SALON_STAFF_REQUEST,
	CREATE_NEW_SALON_STAFF_SUCCESS,
	CREATE_NEW_SALON_STAFF_FAIL,
	CREATE_NEW_SALON_STAFF_RESET,

	UPDATE_SALON_STAFF_REQUEST,
	UPDATE_SALON_STAFF_RESET,
	UPDATE_SALON_STAFF_FAIL,
	UPDATE_SALON_STAFF_SUCCESS,

	DELETE_SALON_STAFF_FAIL,
	DELETE_SALON_STAFF_RESET,
	DELETE_SALON_STAFF_REQUEST,
	DELETE_SALON_STAFF_SUCCESS,

	CHANGE_STATUS_SALON_STAFF_REQUEST,
	CHANGE_STATUS_SALON_STAFF_SUCCESS,
	CHANGE_STATUS_SALON_STAFF_FAIL,
	CHANGE_STATUS_SALON_STAFF_RESET
} from '../constants/salonStaffConstants';


export const getSalonStaffListReducer = (state = {}, action) => {
	switch (action.type) {
		case SALON_STAFF_REQUEST:
			return { loading: true };

		case SALON_STAFF_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case SALON_STAFF_FAIL:
			return { loading: false, error: action.payload };

		case SALON_STAFF_RESET:
			return {};

		default:
			return state;
	}
};



export const createNewSalonStaffReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_NEW_SALON_STAFF_REQUEST:
			return { loading: true };

		case CREATE_NEW_SALON_STAFF_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CREATE_NEW_SALON_STAFF_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_SALON_STAFF_RESET:
			return {};

		default:
			return state;
	}
};


export const updateSalonStaffReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_SALON_STAFF_REQUEST:
			return { loading: true };

		case UPDATE_SALON_STAFF_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case UPDATE_SALON_STAFF_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_SALON_STAFF_RESET:
			return {};

		default:
			return state;
	}
};




export const deleteSalonStaffReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_SALON_STAFF_REQUEST:
			return { loading: true };

		case DELETE_SALON_STAFF_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case DELETE_SALON_STAFF_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SALON_STAFF_RESET:
			return {};

		default:
			return state;
	}
};


export const changeStatusSalonStaffReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_STATUS_SALON_STAFF_REQUEST:
			return { loading: true };

		case CHANGE_STATUS_SALON_STAFF_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CHANGE_STATUS_SALON_STAFF_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_STATUS_SALON_STAFF_RESET:
			return {};

		default:
			return state;
	}
};


