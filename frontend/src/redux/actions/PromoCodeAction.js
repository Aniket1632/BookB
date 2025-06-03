import axios from 'axios';
import { ACTIVATE_PROMO_CODES_FAIL, ACTIVATE_PROMO_CODES_REQUEST, ACTIVATE_PROMO_CODES_SUCCESS, ADD_PROMO_CODES_FAIL, ADD_PROMO_CODES_REQUEST, ADD_PROMO_CODES_SUCCESS } from '../constants/promoCodesConstant';
import { BASE_URL } from './ip';

export const getAllPromoCodesAction = () => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/promo-codes/`, config);

		return data;
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};

export const getPromoCodeAction = (code) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/promo-codes/${code}`, config);

		return data;
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};

export const getPromoByCodeAction = (code) => async (dispatch, getState) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/promo-codes/promo-codes/${code}`, config);

		return data;
	} catch (err) {
		return err.response && err.response.data ? err.response.data : err.message;
	}
};

// export const createNewPromoCodeAction = (formData) => async (dispatch, getState) => {
// 	try {
// 		const { userLogin: { userInfo } } = getState();
// 		const config = {
// 			headers: {
// 				Authorization: `Bearer ${userInfo.token}`,
// 				'Content-Type': 'application/json'
// 			}
// 		};

// 		const { data } = await axios.post(`${BASE_URL}/promo-codes`, formData, config);

// 		return data;
// 	} catch (err) {
// 		return err.response && err.response.data.message ? err.response.data.message : err.message;
// 	}
// };

export const createNewPromoCodeAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: ADD_PROMO_CODES_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/promo-codes`, formData, config);

		dispatch({
			type: ADD_PROMO_CODES_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_PROMO_CODES_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const updatePromoCodeAction = (formData, id) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/promo-codes/${id}`, formData, config);

		return data;
	} catch (err) {
		return err.response && err.response.data ? err.response.data : err.message;
	}
};

export const deletePromoCodeAction = (id) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
				'Content-Type': 'application/json'
			}
		};

		await axios.delete(`${BASE_URL}/promo-codes/${id}`, config);

		return { status: 'success' };
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};

export const activatePromoCodesAction = (id, status) => async (dispatch, getState) => {

	try {
		dispatch({ type: ACTIVATE_PROMO_CODES_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/promo-codes/${id}`, status, config);

		dispatch({
			type: ACTIVATE_PROMO_CODES_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ACTIVATE_PROMO_CODES_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
