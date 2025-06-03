import { CREATE_NEW_SUBSCRIPTION_FAIL, CREATE_NEW_SUBSCRIPTION_REQUEST, CREATE_NEW_SUBSCRIPTION_RESET, CREATE_NEW_SUBSCRIPTION_SUCCESS, DELETE_SUBSCRIPTION_FAIL, DELETE_SUBSCRIPTION_REQUEST, DELETE_SUBSCRIPTION_RESET, DELETE_SUBSCRIPTION_SUCCESS, GET_ALL_SUBSCRIPTION_FAIL, GET_ALL_SUBSCRIPTION_REQUEST, GET_ALL_SUBSCRIPTION_RESET, GET_ALL_SUBSCRIPTION_SUCCESS, GET_CANCEL_SUBSCRIPTION_FAIL, GET_CANCEL_SUBSCRIPTION_REQUEST, GET_CANCEL_SUBSCRIPTION_RESET, GET_CANCEL_SUBSCRIPTION_SUCCESS, GET_ENABLE_SUBSCRIPTION_FAIL, GET_ENABLE_SUBSCRIPTION_REQUEST, GET_ENABLE_SUBSCRIPTION_RESET, GET_ENABLE_SUBSCRIPTION_SUCCESS, GET_SUBSCRIPTION_DETAILS_FAIL, GET_SUBSCRIPTION_DETAILS_REQUEST, GET_SUBSCRIPTION_DETAILS_RESET, GET_SUBSCRIPTION_DETAILS_SUCCESS, GET_TOTAL_PRICE_FAIL, GET_TOTAL_PRICE_REQUEST, GET_TOTAL_PRICE_RESET, GET_TOTAL_PRICE_SUCCESS, SUBSCRIPTION_STATUS_FAIL, SUBSCRIPTION_STATUS_REQUEST, SUBSCRIPTION_STATUS_RESET, SUBSCRIPTION_STATUS_SUCCESS } from "../constants/SubscriptionConstants";

export const addSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case CREATE_NEW_SUBSCRIPTION_REQUEST:
			return { loading: true };

		case CREATE_NEW_SUBSCRIPTION_SUCCESS:
			return { data: action.payload, loading: false };

		case CREATE_NEW_SUBSCRIPTION_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_SUBSCRIPTION_RESET:
			return {};

		default:
			return state;
	}
};

export const getSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case GET_ALL_SUBSCRIPTION_REQUEST:
			return { loading: true };

		case GET_ALL_SUBSCRIPTION_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ALL_SUBSCRIPTION_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_SUBSCRIPTION_RESET:
			return {};

		default:
			return state;
	}
};

export const changeStatusSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case SUBSCRIPTION_STATUS_REQUEST:
			return { loading: true };

		case SUBSCRIPTION_STATUS_SUCCESS:
			return { data: action.payload, loading: false };

		case SUBSCRIPTION_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case SUBSCRIPTION_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case DELETE_SUBSCRIPTION_REQUEST:
			return { loading: true };

		case DELETE_SUBSCRIPTION_SUCCESS:
			return { data: action.payload, loading: false };

		case DELETE_SUBSCRIPTION_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SUBSCRIPTION_RESET:
			return {};

		default:
			return state;
	}
};


export const getEnableSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case GET_ENABLE_SUBSCRIPTION_REQUEST:
			return { loading: true };

		case GET_ENABLE_SUBSCRIPTION_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ENABLE_SUBSCRIPTION_FAIL:
			return { loading: false, error: action.payload };

		case GET_ENABLE_SUBSCRIPTION_RESET:
			return {};

		default:
			return state;
	}
};

export const getTotalPriceReducer = (state = {}, action) => {
	switch (action.type) {

		case GET_TOTAL_PRICE_REQUEST:
			return { loading: true };

		case GET_TOTAL_PRICE_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_TOTAL_PRICE_FAIL:
			return { loading: false, error: action.payload };

		case GET_TOTAL_PRICE_RESET:
			return {};

		default:
			return state;
	}
};



export const getCancelSubscriptionReducer = (state = {}, action) => {
	switch (action.type) {

		case GET_CANCEL_SUBSCRIPTION_REQUEST:
			return { loading: true };

		case GET_CANCEL_SUBSCRIPTION_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_CANCEL_SUBSCRIPTION_FAIL:
			return { loading: false, error: action.payload };

		case GET_CANCEL_SUBSCRIPTION_RESET:
			return {};

		default:
			return state;
	}
};


export const getSubscriptionDetailsReducer = (state = {}, action) => {
	switch (action.type) {

		case GET_SUBSCRIPTION_DETAILS_REQUEST:
			return { loading: true };

		case GET_SUBSCRIPTION_DETAILS_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_SUBSCRIPTION_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		case GET_SUBSCRIPTION_DETAILS_RESET:
			return {};

		default:
			return state;
	}
};