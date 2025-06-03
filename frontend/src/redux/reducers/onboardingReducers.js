import {

	CREATE_NEW_ONBOARD_USER_REQUEST,
	CREATE_NEW_ONBOARD_USER_SUCCESS,
	CREATE_NEW_ONBOARD_USER_FAIL,
	CREATE_NEW_ONBOARD_USER_RESET,

	PAYMENT_ONBOARD_REQUEST,
	PAYMENT_ONBOARD_SUCCESS,
	PAYMENT_ONBOARD_FAIL,
	PAYMENT_ONBOARD_RESET,

	ONBOARD_DONE_REQUEST,
	ONBOARD_DONE_SUCCESS,
	ONBOARD_DONE_FAIL,
	ONBOARD_DONE_RESET,
} from '../constants/onboardingConstants';

export const createNewOnBoardUserReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_NEW_ONBOARD_USER_REQUEST:
			return { loading: true };

		case CREATE_NEW_ONBOARD_USER_SUCCESS:
			return { data: action.payload, loading: false };

		case CREATE_NEW_ONBOARD_USER_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_ONBOARD_USER_RESET:
			return {};

		default:
			return state;
	}
};

export const paymentOnBoardReducer = (state = {}, action) => {
	switch (action.type) {
		case PAYMENT_ONBOARD_REQUEST:
			return { loading: true };

		case PAYMENT_ONBOARD_SUCCESS:
			return { data: action.payload, loading: false };

		case PAYMENT_ONBOARD_FAIL:
			return { loading: false, error: action.payload };

		case PAYMENT_ONBOARD_RESET:
			return {};

		default:
			return state;
	}
};

export const onBoardCompleteReducer = (state = {}, action) => {
	switch (action.type) {
		case ONBOARD_DONE_REQUEST:
			return { loading: true };

		case ONBOARD_DONE_SUCCESS:
			return { data: action.payload, loading: false };

		case ONBOARD_DONE_FAIL:
			return { loading: false, error: action.payload };

		case ONBOARD_DONE_RESET:
			return {};

		default:
			return state;
	}
};
