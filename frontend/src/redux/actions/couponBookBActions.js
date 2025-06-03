import axios from 'axios';
import { BASE_URL } from './ip';

import {
	ACTIVATE_COUPON_BOOKB_FAIL, ACTIVATE_COUPON_BOOKB_REQUEST, ACTIVATE_COUPON_BOOKB_SUCCESS, ADD_COUPON_BOOKB_FAIL, ADD_COUPON_BOOKB_REQUEST, ADD_COUPON_BOOKB_SUCCESS, DELETE_COUPON_BOOKB_FAIL, DELETE_COUPON_BOOKB_REQUEST, DELETE_COUPON_BOOKB_SUCCESS, GET_ACTIVE_COUPONS_BOOKB_FAIL, GET_ACTIVE_COUPONS_BOOKB_REQUEST, GET_ACTIVE_COUPONS_BOOKB_SUCCESS, GET_ADMIN_COUPONS_BOOKB_FAIL, GET_ADMIN_COUPONS_BOOKB_REQUEST, GET_ADMIN_COUPONS_BOOKB_SUCCESS, GET_ALL_COUPONS_BOOKB_FAIL, GET_ALL_COUPONS_BOOKB_REQUEST,
	GET_ALL_COUPONS_BOOKB_SUCCESS,
	VERIFY_COUPON_BOOKB_FAIL,
	VERIFY_COUPON_BOOKB_REQUEST,
	VERIFY_COUPON_BOOKB_SUCCESS
} from "../constants/couponBookBConstants";

export const getAllCouponsAction = () => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ALL_COUPONS_BOOKB_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.get(`${BASE_URL}/coupon`, config);


		dispatch({
			type: GET_ALL_COUPONS_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_COUPONS_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

// export const getAllActiveCouponsAction = () => async (dispatch, getState) => {

// 	try {
// 		dispatch({ type: GET_ACTIVE_COUPONS_BOOKB_REQUEST });
// 		const { userLogin: { userInfo } } = getState();
// 		const config = {
// 			headers: {
// 				token: userInfo.data.token,
// 				'Content-Type': 'application/json'
// 			}
// 		};

// 		const { data } = await axios.get(`${BASE_URL}/coupon/get-active-coupon`, config);


// 		dispatch({
// 			type: GET_ACTIVE_COUPONS_BOOKB_SUCCESS,
// 			payload: data
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: GET_ACTIVE_COUPONS_BOOKB_FAIL,
// 			payload: err.response && err.response.data.message ? err.response.data.message : err.message
// 		});
// 	}
// };

export const addCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: ADD_COUPON_BOOKB_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/coupon`, formData, config);

		dispatch({
			type: ADD_COUPON_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_COUPON_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const activateCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: ACTIVATE_COUPON_BOOKB_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		// const { data } = await axios.patch(`${BASE_URL}/coupon/enable-disable-coupon?couponId=${formData.id}`, formData.enableDisable, config);

		const { data } = await axios.patch(`${BASE_URL}/coupon/${formData.id}`, { name: formData.name }, config);


		dispatch({
			type: ACTIVATE_COUPON_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ACTIVATE_COUPON_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteCouponAction = (id) => async (dispatch, getState) => {

	try {
		dispatch({ type: DELETE_COUPON_BOOKB_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/coupon/${id}`, config);

		dispatch({
			type: DELETE_COUPON_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_COUPON_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const verifyCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: VERIFY_COUPON_BOOKB_REQUEST });
		const config = {
			headers: {

				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/coupon/verify-coupon?code=${formData}`, config);

		dispatch({
			type: VERIFY_COUPON_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: VERIFY_COUPON_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAdminCouponsAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ADMIN_COUPONS_BOOKB_REQUEST });
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/coupon/get-coupons-for-on-boarding`, config);

		dispatch({
			type: GET_ADMIN_COUPONS_BOOKB_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ADMIN_COUPONS_BOOKB_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};