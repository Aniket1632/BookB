import axios from 'axios';
import {
	GET_ALL_NOTIFICATIONS_REQUEST,
	GET_ALL_NOTIFICATIONS_SUCCESS,
	GET_ALL_NOTIFICATIONS_FAIL,
	SEND_NOTIFICATION_REQUEST,
	SEND_NOTIFICATION_SUCCESS,
	SEND_NOTIFICATION_FAIL
} from '../constants/notificationConstants';
import { BASE_URL } from './ip';

export const getAllNotificationsAction = (pageNumber = 1, pageSize = 5) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_NOTIFICATIONS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(
			`${BASE_URL}/notification/get-notification?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			config
		);

		dispatch({
			type: GET_ALL_NOTIFICATIONS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_NOTIFICATIONS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const sendNotificationAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: SEND_NOTIFICATION_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/notification/send-notification?offset=-330`, formData, config);

		dispatch({
			type: SEND_NOTIFICATION_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: SEND_NOTIFICATION_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};
