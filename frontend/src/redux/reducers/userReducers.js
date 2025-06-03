import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  CREATE_NEW_USER_REQUEST,
  CREATE_NEW_USER_SUCCESS,
  CREATE_NEW_USER_FAIL,
  CREATE_NEW_USER_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  MY_PROFILE_DETAILS_REQUEST,
  MY_PROFILE_DETAILS_SUCCESS,
  MY_PROFILE_DETAILS_FAIL,
  MY_PROFILE_DETAILS_RESET,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_RESET,
  CHANGE_STATUS_USER_REQUEST,
  CHANGE_STATUS_USER_SUCCESS,
  CHANGE_STATUS_USER_FAIL,
  CHANGE_STATUS_USER_RESET,
  GET_USER_BY_TOKEN_REQUEST,
  GET_USER_BY_TOKEN_SUCCESS,
  GET_USER_BY_TOKEN_FAIL,
  GET_USER_BY_TOKEN_RESET,
  CHANGE_PASSWORD_USER_RESET,
  CHANGE_PASSWORD_USER_FAIL,
  CHANGE_PASSWORD_USER_SUCCESS,
  CHANGE_PASSWORD_USER_REQUEST,
  CHANGE_ADMIN_REQUEST,
  CHANGE_ADMIN_SUCCESS,
  CHANGE_ADMIN_FAIL,
  CHANGE_ADMIN_RESET,
  ADD_MESSAGE_REQUEST,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  ADD_MESSAGE_RESET,
  ADD_NOTES_REQUEST,
  ADD_NOTES_SUCCESS,
  ADD_NOTES_FAIL,
  ADD_NOTES_RESET,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_RESET,
  UPDATE_PASSWORD_USER_REQUEST,
  UPDATE_PASSWORD_USER_SUCCESS,
  UPDATE_PASSWORD_USER_FAIL,
  UPDATE_PASSWORD_USER_RESET,
} from '../constants/userConstants';
import {GET_CONVERSION_RATE_REQUEST , GET_CONVERSION_RATE_SUCCESS ,GET_CONVERSION_RATE_FAIL , GET_CONVERSION_RATE_RESET} from '../constants/userConstants';
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const createNewUserReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_NEW_USER_REQUEST:
      return { loading: true };

    case CREATE_NEW_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case CREATE_NEW_USER_FAIL:
      return { loading: false, error: action.payload };

    case CREATE_NEW_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const getUserListReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true };

    case USER_LIST_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };

    case USER_LIST_RESET:
      return {};

    default:
      return state;
  }
};

export const myProfileDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case MY_PROFILE_DETAILS_REQUEST:
      return { loading: true };

    case MY_PROFILE_DETAILS_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case MY_PROFILE_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case MY_PROFILE_DETAILS_RESET:
      return {};

    default:
      return state;
  }
};

export const deleteUserReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_USER_REQUEST:
      return { loading: true };

    case DELETE_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case DELETE_USER_FAIL:
      return { loading: false, error: action.payload };

    case DELETE_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const changeStatusUserReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_STATUS_USER_REQUEST:
      return { loading: true };

    case CHANGE_STATUS_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case CHANGE_STATUS_USER_FAIL:
      return { loading: false, error: action.payload };

    case CHANGE_STATUS_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const getUserByTokenReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_BY_TOKEN_REQUEST:
      return { loading: true };

    case GET_USER_BY_TOKEN_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case GET_USER_BY_TOKEN_FAIL:
      return { loading: false, error: action.payload };

    case GET_USER_BY_TOKEN_RESET:
      return {};

    default:
      return state;
  }
};

export const changePasswordUserReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_USER_REQUEST:
      return { loading: true };

    case CHANGE_PASSWORD_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case CHANGE_PASSWORD_USER_FAIL:
      return { loading: false, error: action.payload };

    case CHANGE_PASSWORD_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const updatePasswordUserReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PASSWORD_USER_REQUEST:
      return { loading: true };

    case UPDATE_PASSWORD_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case UPDATE_PASSWORD_USER_FAIL:
      return { loading: false, error: action.payload };

    case UPDATE_PASSWORD_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const changeAdminUserReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_ADMIN_REQUEST:
      return { loading: true };

    case CHANGE_ADMIN_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case CHANGE_ADMIN_FAIL:
      return { loading: false, error: action.payload };

    case CHANGE_ADMIN_RESET:
      return {};

    default:
      return state;
  }
};

export const addMessageUserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_MESSAGE_REQUEST:
      return { loading: true };

    case ADD_MESSAGE_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case ADD_MESSAGE_FAIL:
      return { loading: false, error: action.payload };

    case ADD_MESSAGE_RESET:
      return {};

    default:
      return state;
  }
};

export const addNotesUserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_NOTES_REQUEST:
      return { loading: true };

    case ADD_NOTES_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case ADD_NOTES_FAIL:
      return { loading: false, error: action.payload };

    case ADD_NOTES_RESET:
      return {};

    default:
      return state;
  }
};

export const logOutUserReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT_USER_REQUEST:
      return { loading: true };

    case LOGOUT_USER_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case LOGOUT_USER_FAIL:
      return { loading: false, error: action.payload };

    case LOGOUT_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const getAppointmentConersionRateReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_CONVERSION_RATE_REQUEST:
			return { loading: true };

		case GET_CONVERSION_RATE_SUCCESS:
			return { report: action.payload, loading: false };

		case GET_CONVERSION_RATE_FAIL:
			return { loading: false, error: action.payload };

		case GET_CONVERSION_RATE_RESET:
			return {};

		default:
			return state;
	}
};
