import axios from 'axios';
import {
	CREATE_NEW_ONBOARD_USER_REQUEST,
	CREATE_NEW_ONBOARD_USER_SUCCESS,
	CREATE_NEW_ONBOARD_USER_FAIL,

	PAYMENT_ONBOARD_REQUEST,
	PAYMENT_ONBOARD_SUCCESS,
	PAYMENT_ONBOARD_FAIL,

	ONBOARD_DONE_REQUEST,
	ONBOARD_DONE_SUCCESS,
	ONBOARD_DONE_FAIL,
} from '../constants/onboardingConstants';

import { BASE_URL } from './ip';
const utcTimeOffset = new Date().getTimezoneOffset();

export const onBoardNewUserAction = (userData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_ONBOARD_USER_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/users/onboard-signup?offset=${utcTimeOffset}`, userData, config);

		dispatch({
			type: CREATE_NEW_ONBOARD_USER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_ONBOARD_USER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const onBoardAdminAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: PAYMENT_ONBOARD_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/users/onboard`, formData, config);

		dispatch({
			type: PAYMENT_ONBOARD_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: PAYMENT_ONBOARD_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const completeOnboardAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ONBOARD_DONE_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/users/onboard-done`, formData, config);

		dispatch({
			type: ONBOARD_DONE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ONBOARD_DONE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


