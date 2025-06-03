import { ACTIVATE_COUPON_BOOKB_FAIL,
    ACTIVATE_COUPON_BOOKB_REQUEST,
    ACTIVATE_COUPON_BOOKB_RESET, ACTIVATE_COUPON_BOOKB_SUCCESS,
    ADD_COUPON_BOOKB_FAIL, ADD_COUPON_BOOKB_REQUEST,
    ADD_COUPON_BOOKB_RESET,
    ADD_COUPON_BOOKB_SUCCESS,
    DELETE_COUPON_BOOKB_FAIL,
    DELETE_COUPON_BOOKB_REQUEST,
    DELETE_COUPON_BOOKB_RESET,
    DELETE_COUPON_BOOKB_SUCCESS,
    GET_ACTIVE_COUPONS_BOOKB_FAIL,
    GET_ACTIVE_COUPONS_BOOKB_REQUEST,
    GET_ACTIVE_COUPONS_BOOKB_RESET,
    GET_ACTIVE_COUPONS_BOOKB_SUCCESS,
    GET_ADMIN_COUPONS_BOOKB_FAIL,
    GET_ADMIN_COUPONS_BOOKB_REQUEST,
    GET_ADMIN_COUPONS_BOOKB_RESET,
    GET_ADMIN_COUPONS_BOOKB_SUCCESS,
    GET_ALL_COUPONS_BOOKB_FAIL,
     GET_ALL_COUPONS_BOOKB_REQUEST,
     GET_ALL_COUPONS_BOOKB_RESET,
     GET_ALL_COUPONS_BOOKB_SUCCESS,
	 VERIFY_COUPON_BOOKB_FAIL,
	 VERIFY_COUPON_BOOKB_REQUEST,
	 VERIFY_COUPON_BOOKB_RESET,
	 VERIFY_COUPON_BOOKB_SUCCESS
    } from "../constants/couponBookBConstants";


export const getAllCouponsBookBReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_COUPONS_BOOKB_REQUEST:
			return { loading: true };

		case GET_ALL_COUPONS_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ALL_COUPONS_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_COUPONS_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};


export const getActiveCouponsBookBReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ACTIVE_COUPONS_BOOKB_REQUEST:
			return { loading: true };

		case GET_ACTIVE_COUPONS_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ACTIVE_COUPONS_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case GET_ACTIVE_COUPONS_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};



export const addCouponBookBReducer = (state = {}, action) => {
	switch (action.type) {

		case ADD_COUPON_BOOKB_REQUEST:
			return { loading: true };

		case ADD_COUPON_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case ADD_COUPON_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case ADD_COUPON_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};

export const activateCouponBookBReducer = (state = {}, action) => {
	switch (action.type) {

		case ACTIVATE_COUPON_BOOKB_REQUEST:
			return { loading: true };

		case ACTIVATE_COUPON_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case ACTIVATE_COUPON_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case ACTIVATE_COUPON_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteCouponBookBReducer = (state = {}, action) => {
	switch (action.type) {

		case DELETE_COUPON_BOOKB_REQUEST:
			return { loading: true };

		case DELETE_COUPON_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case DELETE_COUPON_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_COUPON_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};

export const verifyCouponsBookBReducer = (state = {}, action) => {
	switch (action.type) {
		case VERIFY_COUPON_BOOKB_REQUEST:
			return { loading: true };

		case VERIFY_COUPON_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case VERIFY_COUPON_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case VERIFY_COUPON_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};

export const getAdminCouponsBookBReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ADMIN_COUPONS_BOOKB_REQUEST:
			return { loading: true };

		case GET_ADMIN_COUPONS_BOOKB_SUCCESS:
			return { data: action.payload, loading: false };

		case GET_ADMIN_COUPONS_BOOKB_FAIL:
			return { loading: false, error: action.payload };

		case GET_ADMIN_COUPONS_BOOKB_RESET:
			return {};

		default:
			return state;
	}
};