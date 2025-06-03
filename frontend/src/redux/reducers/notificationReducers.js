import {
	GET_ALL_NOTIFICATIONS_REQUEST,
	GET_ALL_NOTIFICATIONS_SUCCESS,
	GET_ALL_NOTIFICATIONS_FAIL,
	GET_ALL_NOTIFICATIONS_RESET,
	SEND_NOTIFICATION_REQUEST,
	SEND_NOTIFICATION_SUCCESS,
	SEND_NOTIFICATION_FAIL,
	SEND_NOTIFICATION_RESET
} from '../constants/notificationConstants';

export const allNotificationsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_NOTIFICATIONS_REQUEST:
			return { loading: true };

		case GET_ALL_NOTIFICATIONS_SUCCESS:
			return { notifications: action.payload, loading: false };

		case GET_ALL_NOTIFICATIONS_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_NOTIFICATIONS_RESET:
			return {};

		default:
			return state;
	}
};

export const sendNotificationReducer = (state = {}, action) => {
	switch (action.type) {
		case SEND_NOTIFICATION_REQUEST:
			return { loading: true };

		case SEND_NOTIFICATION_SUCCESS:
			return { notification: action.payload, loading: false };

		case SEND_NOTIFICATION_FAIL:
			return { loading: false, error: action.payload };

		case SEND_NOTIFICATION_RESET:
			return {};

		default:
			return state;
	}
};
