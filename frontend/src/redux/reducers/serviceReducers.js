import {
	GET_ALL_SERVICE_REQUEST,
	GET_ALL_SERVICE_SUCCESS,
	GET_ALL_SERVICE_FAIL,
	GET_ALL_SERVICE_RESET,

	ADD_SERVICE_REQUEST,
	ADD_SERVICE_SUCCESS,
	ADD_SERVICE_FAIL,
	ADD_SERVICE_RESET,

	CHANGE_SERVICE_STATUS_REQUEST,
	CHANGE_SERVICE_STATUS_SUCCESS,
	CHANGE_SERVICE_STATUS_FAIL,
	CHANGE_SERVICE_STATUS_RESET,

	DELETE_SERVICE_REQUEST,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	DELETE_SERVICE_RESET,

	GET_ALL_ENABLE_SERVICE_REQUEST,
	GET_ALL_ENABLE_SERVICE_SUCCESS,
	GET_ALL_ENABLE_SERVICE_FAIL,
	GET_ALL_ENABLE_SERVICE_RESET,

	GET_ALL_SERVICE_CATEGORY_REQUEST,
	GET_ALL_SERVICE_CATEGORY_SUCCESS,
	GET_ALL_SERVICE_CATEGORY_FAIL,
	GET_ALL_SERVICE_CATEGORY_RESET,

	ADD_SERVICE_CATEGORY_REQUEST,
	ADD_SERVICE_CATEGORY_SUCCESS,
	ADD_SERVICE_CATEGORY_FAIL,
	ADD_SERVICE_CATEGORY_RESET,

	SERVICE_CATEGORY_STATUS_REQUEST,
	SERVICE_CATEGORY_STATUS_SUCCESS,
	SERVICE_CATEGORY_STATUS_FAIL,
	SERVICE_CATEGORY_STATUS_RESET,

	DELETE_SERVICE_CATEGORY_REQUEST,
	DELETE_SERVICE_CATEGORY_SUCCESS,
	DELETE_SERVICE_CATEGORY_FAIL,
	DELETE_SERVICE_CATEGORY_RESET,
	
	GET_ALL_ENABLE_SUB_SERVICE_RESET,
	GET_ALL_ENABLE_SUB_SERVICE_FAIL,
	GET_ALL_ENABLE_SUB_SERVICE_SUCCESS,
	GET_ALL_ENABLE_SUB_SERVICE_REQUEST,
	UPDATE_RANK_SERVICE_REQUEST,
	UPDATE_RANK_SERVICE_SUCCESS,
	UPDATE_RANK_SERVICE_FAIL,
	UPDATE_RANK_SERVICE_RESET,
 
} from '../constants/serviceConstants';


export const getAllServiceCategoriesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_SERVICE_CATEGORY_REQUEST:
			return { loading: true };

		case GET_ALL_SERVICE_CATEGORY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_SERVICE_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_SERVICE_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const createServiceCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_SERVICE_CATEGORY_REQUEST:
			return { loading: true };

		case ADD_SERVICE_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_SERVICE_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case ADD_SERVICE_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const productCategoryStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case SERVICE_CATEGORY_STATUS_REQUEST:
			return { loading: true };

		case SERVICE_CATEGORY_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case SERVICE_CATEGORY_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case SERVICE_CATEGORY_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteServiceCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_SERVICE_CATEGORY_REQUEST:
			return { loading: true };

		case DELETE_SERVICE_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_SERVICE_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SERVICE_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};


export const getAllServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_SERVICE_REQUEST:
			return { loading: true };

		case GET_ALL_SERVICE_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};

export const getAllEnableServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_ENABLE_SERVICE_REQUEST:
			return { loading: true };

		case GET_ALL_ENABLE_SERVICE_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_ENABLE_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_ENABLE_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};

export const createServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_SERVICE_REQUEST:
			return { loading: true };

		case ADD_SERVICE_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case ADD_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};

export const changeServiceStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_SERVICE_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_SERVICE_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case CHANGE_SERVICE_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_SERVICE_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_SERVICE_REQUEST:
			return { loading: true };

		case DELETE_SERVICE_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};



export const getAllEnableSubServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_ENABLE_SUB_SERVICE_REQUEST:
			return { loading: true };

		case GET_ALL_ENABLE_SUB_SERVICE_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_ENABLE_SUB_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_ENABLE_SUB_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};




export const updateRankServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_RANK_SERVICE_REQUEST:
			return { loading: true };

		case UPDATE_RANK_SERVICE_SUCCESS:
			return { categories: action.payload, loading: false };

		case UPDATE_RANK_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_RANK_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};
