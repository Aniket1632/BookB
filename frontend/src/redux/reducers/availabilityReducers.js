import {
	GET_DAILY_AVAILABILITYS_REQUEST,
	GET_DAILY_AVAILABILITYS_SUCCESS,
	GET_DAILY_AVAILABILITYS_FAIL,
	GET_DAILY_AVAILABILITYS_RESET,

	ADD_DAILY_AVAILABILITYS_REQUEST,
	ADD_DAILY_AVAILABILITYS_SUCCESS,
	ADD_DAILY_AVAILABILITYS_FAIL,
	ADD_DAILY_AVAILABILITYS_RESET,

	ADD_BULK_AVAILABILITYS_REQUEST,
	ADD_BULK_AVAILABILITYS_SUCCESS,
	ADD_BULK_AVAILABILITYS_FAIL,
	ADD_BULK_AVAILABILITYS_RESET,
	ADD_DAY_AVAILABILITYS_REQUEST,
	ADD_DAY_AVAILABILITYS_SUCCESS,
	ADD_DAY_AVAILABILITYS_FAIL,
	ADD_DAY_AVAILABILITYS_RESET,
	GET_UNBLOCK_AVAILABILITYS_REQUEST,
	GET_UNBLOCK_AVAILABILITYS_SUCCESS,
	GET_UNBLOCK_AVAILABILITYS_FAIL,
	GET_UNBLOCK_AVAILABILITYS_RESET,
	DEL_BLOCK_AVAILABILITYS_REQUEST,
	DEL_BLOCK_AVAILABILITYS_SUCCESS,
	DEL_BLOCK_AVAILABILITYS_FAIL,
	DEL_BLOCK_AVAILABILITYS_RESET,
} from '../constants/availabilityConstants';

export const getDailyAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_DAILY_AVAILABILITYS_REQUEST:
			return { loading: true };

		case GET_DAILY_AVAILABILITYS_SUCCESS:
			return { sessions: action.payload, loading: false };

		case GET_DAILY_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case GET_DAILY_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};

export const addDailyAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_DAILY_AVAILABILITYS_REQUEST:
			return { loading: true };

		case ADD_DAILY_AVAILABILITYS_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_DAILY_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case ADD_DAILY_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};


export const addBulkAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_BULK_AVAILABILITYS_REQUEST:
			return { loading: true };

		case ADD_BULK_AVAILABILITYS_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_BULK_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case ADD_BULK_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};


export const addDayAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_DAY_AVAILABILITYS_REQUEST:
			return { loading: true };

		case ADD_DAY_AVAILABILITYS_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_DAY_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case ADD_DAY_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
}; 


export const getUnblockAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_UNBLOCK_AVAILABILITYS_REQUEST:
			return { loading: true };

		case GET_UNBLOCK_AVAILABILITYS_SUCCESS:
			return { sessions: action.payload, loading: false };

		case GET_UNBLOCK_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case GET_UNBLOCK_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};

export const delBlockAvailabilitysReducer = (state = {}, action) => {
	switch (action.type) {
		case DEL_BLOCK_AVAILABILITYS_REQUEST:
			return { loading: true };

		case DEL_BLOCK_AVAILABILITYS_SUCCESS:
			return { sessions: action.payload, loading: false };

		case DEL_BLOCK_AVAILABILITYS_FAIL:
			return { loading: false, error: action.payload };

		case DEL_BLOCK_AVAILABILITYS_RESET:
			return {};

		default:
			return state;
	}
};