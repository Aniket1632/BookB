import axios from 'axios';
import {
	GET_USER_BY_WAIER_LIABILITY_REQUEST,
	GET_USER_BY_WAIER_LIABILITY_SUCCESS,
	GET_USER_BY_WAIER_LIABILITY_FAIL,
	GET_USER_BY_WAIER_LIABILITY_RESET,
	CREATE_NEW_INDEPENT_AGREEMENT_FAIL,
	CREATE_NEW_INDEPENT_AGREEMENT_SUCCESS,
	CREATE_NEW_INDEPENT_AGREEMENT_REQUEST,
	GET_NEW_INDEPENT_AGREEMENT_REQUEST,
	GET_NEW_INDEPENT_AGREEMENT_SUCCESS,
	GET_NEW_INDEPENT_AGREEMENT_FAIL,
} from '../constants/formConstants';

import { BASE_URL } from './ip';
const utcTimeOffset = new Date().getTimezoneOffset();


export const getFormByWaierLiabilityAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_USER_BY_WAIER_LIABILITY_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};


		const { data } = await axios.get(
			`${BASE_URL}/form/get-form-waiver-liability-by-user-id?id=${id}`,
			config
		);

		dispatch({
			type: GET_USER_BY_WAIER_LIABILITY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_USER_BY_WAIER_LIABILITY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getFormByIndependentAgreementAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_NEW_INDEPENT_AGREEMENT_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/form/get-form-independent-agreement-by-user-id?id=${id}`,
			config
		);

		dispatch({
			type: GET_NEW_INDEPENT_AGREEMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_NEW_INDEPENT_AGREEMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const createIndepentAgreementByStylistAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_INDEPENT_AGREEMENT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.post(`${BASE_URL}/form/add-form-independent-agreement?offset=${utcTimeOffset}`, formData, config);

		dispatch({
			type: CREATE_NEW_INDEPENT_AGREEMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_INDEPENT_AGREEMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};





