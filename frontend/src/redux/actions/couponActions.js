import axios from 'axios';
import { BASE_URL } from './ip';

import {
	ACTIVATE_COUPON_FAIL, ACTIVATE_COUPON_REQUEST, ACTIVATE_COUPON_SUCCESS, ADD_COUPON_FAIL, ADD_COUPON_REQUEST, ADD_COUPON_SUCCESS, DELETE_COUPON_FAIL, DELETE_COUPON_REQUEST, DELETE_COUPON_SUCCESS, GET_ADMIN_COUPONS_FAIL, GET_ADMIN_COUPONS_REQUEST, GET_ADMIN_COUPONS_SUCCESS, GET_ALL_COUPONS_FAIL, GET_ALL_COUPONS_REQUEST,
	GET_ALL_COUPONS_SUCCESS,
	VERIFY_COUPON_FAIL,
	VERIFY_COUPON_REQUEST,
	VERIFY_COUPON_SUCCESS
} from "../constants/couponConstants";

export const getAllCouponsAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ALL_COUPONS_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/coupon/get-coupons?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_COUPONS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_COUPONS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: ADD_COUPON_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/coupon/add-coupon`, formData, config);

		dispatch({
			type: ADD_COUPON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_COUPON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const activateCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: ACTIVATE_COUPON_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/coupon/enable-disable-coupon?couponId=${formData.id}`, formData.enableDisable, config);

		dispatch({
			type: ACTIVATE_COUPON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ACTIVATE_COUPON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteCouponAction = (id) => async (dispatch, getState) => {

	try {
		dispatch({ type: DELETE_COUPON_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/coupon/delete-coupon?couponId=${id}`, config);

		dispatch({
			type: DELETE_COUPON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_COUPON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const verifyCouponAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: VERIFY_COUPON_REQUEST });
		const config = {
			headers: {

				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/promo-codes/promo-codes/${formData}`, config);

		dispatch({
			type: VERIFY_COUPON_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: VERIFY_COUPON_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAdminCouponsAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ADMIN_COUPONS_REQUEST });
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/promo-codes/get-promo-codes`, config);

		dispatch({
			type: GET_ADMIN_COUPONS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ADMIN_COUPONS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};