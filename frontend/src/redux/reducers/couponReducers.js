import { ACTIVATE_COUPON_FAIL,
    ACTIVATE_COUPON_REQUEST,
    ACTIVATE_COUPON_RESET, ACTIVATE_COUPON_SUCCESS,
    ADD_COUPON_FAIL, ADD_COUPON_REQUEST,
    ADD_COUPON_RESET,
    ADD_COUPON_SUCCESS,
    DELETE_COUPON_FAIL,
    DELETE_COUPON_REQUEST,
    DELETE_COUPON_RESET,
    DELETE_COUPON_SUCCESS,
    GET_ADMIN_COUPONS_FAIL,
    GET_ADMIN_COUPONS_REQUEST,
    GET_ADMIN_COUPONS_RESET,
    GET_ADMIN_COUPONS_SUCCESS,
    GET_ALL_COUPONS_FAIL,
     GET_ALL_COUPONS_REQUEST,
     GET_ALL_COUPONS_RESET,
     GET_ALL_COUPONS_SUCCESS,
	 VERIFY_COUPON_FAIL,
	 VERIFY_COUPON_REQUEST,
	 VERIFY_COUPON_RESET,
	 VERIFY_COUPON_SUCCESS
    } from "../constants/couponConstants";


export const getAllCouponsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_COUPONS_REQUEST:
			return { loading: true };

		case GET_ALL_COUPONS_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ALL_COUPONS_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_COUPONS_RESET:
			return {};

		default:
			return state;
	}
};

export const addCouponReducer = (state = {}, action) => {
	switch (action.type) {

		case ADD_COUPON_REQUEST:
			return { loading: true };

		case ADD_COUPON_SUCCESS:
			return { data: action.payload, loading: false };

		case ADD_COUPON_FAIL:
			return { loading: false, error: action.payload };

		case ADD_COUPON_RESET:
			return {};

		default:
			return state;
	}
};

export const activateCouponReducer = (state = {}, action) => {
	switch (action.type) {

		case ACTIVATE_COUPON_REQUEST:
			return { loading: true };

		case ACTIVATE_COUPON_SUCCESS:
			return { data: action.payload, loading: false };

		case ACTIVATE_COUPON_FAIL:
			return { loading: false, error: action.payload };

		case ACTIVATE_COUPON_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteCouponReducer = (state = {}, action) => {
	switch (action.type) {

		case DELETE_COUPON_REQUEST:
			return { loading: true };

		case DELETE_COUPON_SUCCESS:
			return { data: action.payload, loading: false };

		case DELETE_COUPON_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_COUPON_RESET:
			return {};

		default:
			return state;
	}
};

export const verifyCouponsReducer = (state = {}, action) => {
	switch (action.type) {
		case VERIFY_COUPON_REQUEST:
			return { loading: true };

		case VERIFY_COUPON_SUCCESS:
			return { data: action.payload, loading: false };

		case VERIFY_COUPON_FAIL:
			return { loading: false, error: action.payload };

		case VERIFY_COUPON_RESET:
			return {};

		default:
			return state;
	}
};

export const getAdminCouponsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ADMIN_COUPONS_REQUEST:
			return { loading: true };

		case GET_ADMIN_COUPONS_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ADMIN_COUPONS_FAIL:
			return { loading: false, error: action.payload };

		case GET_ADMIN_COUPONS_RESET:
			return {};

		default:
			return state;
	}
};