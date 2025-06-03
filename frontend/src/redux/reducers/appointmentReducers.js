import {
	ADD_APPOINTMENT_FAIL,
	ADD_APPOINTMENT_REQUEST,
	ADD_APPOINTMENT_RESET,
	ADD_APPOINTMENT_SUCCESS,
	ADD_PUBLIC_APPOINTMENT_FAIL,
	ADD_PUBLIC_APPOINTMENT_REQUEST,
	ADD_PUBLIC_APPOINTMENT_RESET,
	ADD_PUBLIC_APPOINTMENT_SUCCESS,
	GET_PUBLIC_APPOINTMENT_REQUEST,
	GET_PUBLIC_APPOINTMENT_SUCCESS,
	GET_PUBLIC_APPOINTMENT_FAIL,
	GET_PUBLIC_APPOINTMENT_RESET,
	DELETE_APPOINTMENT_FAIL,
	DELETE_APPOINTMENT_REQUEST,
	DELETE_APPOINTMENT_RESET,
	DELETE_APPOINTMENT_SUCCESS,
	UPDATE_APPOINTMENT_FAIL,
	UPDATE_APPOINTMENT_REQUEST,
	UPDATE_APPOINTMENT_RESET,
	UPDATE_APPOINTMENT_STATUS_FAIL,
	UPDATE_APPOINTMENT_STATUS_REQUEST,
	UPDATE_APPOINTMENT_STATUS_RESET,
	UPDATE_APPOINTMENT_STATUS_SUCCESS,
	UPDATE_APPOINTMENT_SUCCESS,
	DELETE_SLOT_REQUEST,
	DELETE_SLOT_SUCCESS,
	DELETE_SLOT_FAIL,
	DELETE_SLOT_RESET,
	APPOINTMENT_STATUS_LIST_SUCCESS,
	APPOINTMENT_STATUS_LIST_FAIL,
	APPOINTMENT_STATUS_LIST_RESET,
	APPOINTMENT_STATUS_LIST_REQUEST,
	APPOINTMENT_AVAILIBILITY_REQUEST,
	APPOINTMENT_AVAILIBILITY_SUCCESS,
	APPOINTMENT_AVAILIBILITY_FAIL,
	APPOINTMENT_AVAILIBILITY_RESET,
	GET_BUSINESS_REQUEST,
	GET_BUSINESS_SUCCESS,
	GET_BUSINESS_FAIL,
	GET_BUSINESS_RESET,
	CHANGE_APPOINTMENT_REQUEST,
	CHANGE_APPOINTMENT_SUCCESS,
	CHANGE_APPOINTMENT_FAIL,
	CHANGE_APPOINTMENT_RESET,
	GET_ACTIVITY_REQUEST,
	GET_ACTIVITY_SUCCESS,
	GET_ACTIVITY_FAIL,
	GET_ACTIVITY_RESET,
	GET_STYLIST_REQUEST,
	GET_STYLIST_SUCCESS,
	GET_STYLIST_FAIL,
	GET_STYLIST_RESET,
} from "../constants/appointmentConstants";


export const addAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_APPOINTMENT_REQUEST:
			return { loading: true };

		case ADD_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case ADD_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};

export const getPublicAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_PUBLIC_APPOINTMENT_REQUEST:
			return { loading: true };

		case GET_PUBLIC_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case GET_PUBLIC_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case GET_PUBLIC_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};

export const updateAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_APPOINTMENT_REQUEST:
			return { loading: true };

		case UPDATE_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case UPDATE_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_APPOINTMENT_REQUEST:
			return { loading: true };

		case DELETE_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case DELETE_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteSlotReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_SLOT_REQUEST:
			return { loading: true };

		case DELETE_SLOT_SUCCESS:
			return { session: action.payload, loading: false };

		case DELETE_SLOT_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_SLOT_RESET:
			return {};

		default:
			return state;
	}
};


export const confirmAppointmentStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_APPOINTMENT_STATUS_REQUEST:
			return { loading: true };

		case UPDATE_APPOINTMENT_STATUS_SUCCESS:
			return { session: action.payload, loading: false };

		case UPDATE_APPOINTMENT_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case UPDATE_APPOINTMENT_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const addPublicAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_PUBLIC_APPOINTMENT_REQUEST:
			return { loading: true };

		case ADD_PUBLIC_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_PUBLIC_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case ADD_PUBLIC_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};

export const appointmentStatusListReducer = (state = {}, action) => {
	switch (action.type) {
		case APPOINTMENT_STATUS_LIST_REQUEST:
			return { loading: true };

		case APPOINTMENT_STATUS_LIST_SUCCESS:
			return { session: action.payload, loading: false };

		case APPOINTMENT_STATUS_LIST_FAIL:
			return { loading: false, error: action.payload };

		case APPOINTMENT_STATUS_LIST_RESET:
			return {};

		default:
			return state;
	}
};

export const availabilityAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case APPOINTMENT_AVAILIBILITY_REQUEST:
			return { loading: true };

		case APPOINTMENT_AVAILIBILITY_SUCCESS:
			return { session: action.payload, loading: false };

		case APPOINTMENT_AVAILIBILITY_FAIL:
			return { loading: false, error: action.payload };

		case APPOINTMENT_AVAILIBILITY_RESET:
			return {};

		default:
			return state;
	}
};

export const getBusinessHourReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_BUSINESS_REQUEST:
			return { loading: true };

		case GET_BUSINESS_SUCCESS:
			return { session: action.payload, loading: false };

		case GET_BUSINESS_FAIL:
			return { loading: false, error: action.payload };

		case GET_BUSINESS_RESET:
			return {};

		default:
			return state;
	}
};


export const changeAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_APPOINTMENT_REQUEST:
			return { loading: true };

		case CHANGE_APPOINTMENT_SUCCESS:
			return { session: action.payload, loading: false };

		case CHANGE_APPOINTMENT_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_APPOINTMENT_RESET:
			return {};

		default:
			return state;
	}
};


export const getActivityReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ACTIVITY_REQUEST:
			return { loading: true };

		case GET_ACTIVITY_SUCCESS:
			return { session: action.payload, loading: false };

		case GET_ACTIVITY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ACTIVITY_RESET:
			return {};

		default:
			return state;
	}
};


export const getStylistAppointmentReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_STYLIST_REQUEST:
			return { loading: true };

		case GET_STYLIST_SUCCESS:
			return { session: action.payload, loading: false };

		case GET_STYLIST_FAIL:
			return { loading: false, error: action.payload };

		case GET_STYLIST_RESET:
			return {};

		default:
			return state;
	}
};