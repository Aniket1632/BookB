import { ACTIVATE_PROMO_CODES_FAIL, ACTIVATE_PROMO_CODES_REQUEST, ACTIVATE_PROMO_CODES_RESET, ACTIVATE_PROMO_CODES_SUCCESS, ADD_PROMO_CODES_FAIL, ADD_PROMO_CODES_REQUEST, ADD_PROMO_CODES_RESET, ADD_PROMO_CODES_SUCCESS } from "../constants/promoCodesConstant";


export const activatePromoCodesReducer = (state = {}, action) => {
	switch (action.type) {

		case ACTIVATE_PROMO_CODES_REQUEST:
			return { loading: true };

		case ACTIVATE_PROMO_CODES_SUCCESS:
			return { data: action.payload, loading: false };

		case ACTIVATE_PROMO_CODES_FAIL:
			return { loading: false, error: action.payload };

		case ACTIVATE_PROMO_CODES_RESET:
			return {};

		default:
			return state;
	}
};


export const addPromCodesReducer = (state = {}, action) => {
	switch (action.type) {

		case ADD_PROMO_CODES_REQUEST:
			return { loading: true };

		case ADD_PROMO_CODES_SUCCESS:
			return { data: action.payload, loading: false };

		case ADD_PROMO_CODES_FAIL:
			return { loading: false, error: action.payload };

		case ADD_PROMO_CODES_RESET:
			return {};

		default:
			return state;
	}
};