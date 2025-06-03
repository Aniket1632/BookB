import {
	GET_ALL_COMPANY_REQUEST,
	GET_ALL_COMPANY_SUCCESS,
	GET_ALL_COMPANY_FAIL,
	GET_ALL_COMPANY_RESET,
	ADD_COMPANY_REQUEST,
	ADD_COMPANY_SUCCESS,
	ADD_COMPANY_FAIL,
	ADD_COMPANY_RESET,
	CHANGE_COMPANY_STATUS_REQUEST,
	CHANGE_COMPANY_STATUS_SUCCESS,
	CHANGE_COMPANY_STATUS_FAIL,
	CHANGE_COMPANY_STATUS_RESET,
	DELETE_COMPANY_REQUEST,
	DELETE_COMPANY_SUCCESS,
	DELETE_COMPANY_FAIL,
	DELETE_COMPANY_RESET,

	GET_ALL_ENABLE_COMPANY_REQUEST,
	GET_ALL_ENABLE_COMPANY_SUCCESS,
	GET_ALL_ENABLE_COMPANY_FAIL,
	GET_ALL_ENABLE_COMPANY_RESET

} from '../constants/companyConstants';

export const getAllCompanyReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_COMPANY_REQUEST:
			return { loading: true };

		case GET_ALL_COMPANY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_COMPANY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_COMPANY_RESET:
			return {};

		default:
			return state;
	}
};

export const getAllEnableCompanyReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_ENABLE_COMPANY_REQUEST:
			return { loading: true };

		case GET_ALL_ENABLE_COMPANY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_ENABLE_COMPANY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_ENABLE_COMPANY_RESET:
			return {};

		default:
			return state;
	}
};

export const createCompanyReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_COMPANY_REQUEST:
			return { loading: true };

		case ADD_COMPANY_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_COMPANY_FAIL:
			return { loading: false, error: action.payload };

		case ADD_COMPANY_RESET:
			return {};

		default:
			return state;
	}
};

export const changeCompanyStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_COMPANY_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_COMPANY_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case CHANGE_COMPANY_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_COMPANY_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteCompanyReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_COMPANY_REQUEST:
			return { loading: true };

		case DELETE_COMPANY_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_COMPANY_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_COMPANY_RESET:
			return {};

		default:
			return state;
	}
};
