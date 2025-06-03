import axios from 'axios';
import { CREATE_NEW_SUBSCRIPTION_FAIL, CREATE_NEW_SUBSCRIPTION_REQUEST, CREATE_NEW_SUBSCRIPTION_SUCCESS, DELETE_SUBSCRIPTION_FAIL, DELETE_SUBSCRIPTION_REQUEST, DELETE_SUBSCRIPTION_SUCCESS, GET_ALL_SUBSCRIPTION_FAIL, GET_ALL_SUBSCRIPTION_REQUEST, GET_ALL_SUBSCRIPTION_SUCCESS, GET_CANCEL_SUBSCRIPTION_FAIL, GET_CANCEL_SUBSCRIPTION_REQUEST, GET_CANCEL_SUBSCRIPTION_SUCCESS, GET_ENABLE_SUBSCRIPTION_FAIL, GET_ENABLE_SUBSCRIPTION_REQUEST, GET_ENABLE_SUBSCRIPTION_SUCCESS, GET_SUBSCRIPTION_DETAILS_FAIL, GET_SUBSCRIPTION_DETAILS_REQUEST, GET_SUBSCRIPTION_DETAILS_SUCCESS, GET_TOTAL_PRICE_FAIL, GET_TOTAL_PRICE_REQUEST, GET_TOTAL_PRICE_SUCCESS, SUBSCRIPTION_STATUS_FAIL, SUBSCRIPTION_STATUS_REQUEST, SUBSCRIPTION_STATUS_SUCCESS } from '../constants/SubscriptionConstants';
import { BASE_URL } from './ip';
const utcTimeOffset = new Date().getTimezoneOffset();

export const addSubscriptionAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: CREATE_NEW_SUBSCRIPTION_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/plan/add-subscription-plan`, formData, config);

		dispatch({
			type: CREATE_NEW_SUBSCRIPTION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_SUBSCRIPTION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getSubscriptionAction = (interval = '') => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_SUBSCRIPTION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/plan/get-subscription-plans?interval=${interval}`,
			config
		);

		dispatch({
			type: GET_ALL_SUBSCRIPTION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_SUBSCRIPTION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const changeStatusSubscriptionAction = (id, formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: SUBSCRIPTION_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/plan/enable-disable-subscription-plan?productId=${id}`,
			formData,
			config
		);

		dispatch({
			type: SUBSCRIPTION_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: SUBSCRIPTION_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteSubscriptionAction = (productId) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_SUBSCRIPTION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(
			`${BASE_URL}/plan/delete-subscription-plan?productId=${productId}`,
			config
		);

		dispatch({
			type: DELETE_SUBSCRIPTION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_SUBSCRIPTION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getEnableSubscriptionAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ENABLE_SUBSCRIPTION_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.get(`${BASE_URL}/plan/get-packages`, config);

		dispatch({
			type: GET_ENABLE_SUBSCRIPTION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ENABLE_SUBSCRIPTION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getTotalPriceAction = (priceId, coupon) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_TOTAL_PRICE_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		// const { data } = await axios.get(${BASE_URL}/plan/total-price/${priceId}, config);
		const url = coupon 
		? `${BASE_URL}/plan/total-price/${priceId}/${coupon}` 
		: `${BASE_URL}/plan/total-price/${priceId}`;
  
	  const { data } = await axios.get(url, config);

		dispatch({
			type: GET_TOTAL_PRICE_SUCCESS,
			payload: data
		});
		return data;
	} catch (err) {
		dispatch({
			type: GET_TOTAL_PRICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const createPlanAction = (formData) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.post(`${BASE_URL}/plan/plans/`, formData, config);

		return data;
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};

export const updatePlanAction = (active, id) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(`${BASE_URL}/plan/plans/${id}`, { active: active }, config);

		return data;
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};

export const deletePlanAction = (id) => async (dispatch, getState) => {
	try {
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/plan/plans/${id}`, config);

		return data;
	} catch (err) {
		return err.response && err.response.data.message ? err.response.data.message : err.message;
	}
};




export const cancelSubscriptionAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_CANCEL_SUBSCRIPTION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/plan/cancel-subscription?id=${id}`, config);

		dispatch({
			type: GET_CANCEL_SUBSCRIPTION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_CANCEL_SUBSCRIPTION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getSubscriptionDetailsAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SUBSCRIPTION_DETAILS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/plan/get-subscription-detail`, config);

		dispatch({
			type: GET_SUBSCRIPTION_DETAILS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_SUBSCRIPTION_DETAILS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
