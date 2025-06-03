import axios from 'axios';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  CREATE_NEW_USER_REQUEST,
  CREATE_NEW_USER_SUCCESS,
  CREATE_NEW_USER_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  MY_PROFILE_DETAILS_REQUEST,
  MY_PROFILE_DETAILS_SUCCESS,
  MY_PROFILE_DETAILS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  CHANGE_STATUS_USER_REQUEST,
  CHANGE_STATUS_USER_SUCCESS,
  CHANGE_STATUS_USER_FAIL,
  GET_USER_BY_TOKEN_REQUEST,
  GET_USER_BY_TOKEN_SUCCESS,
  GET_USER_BY_TOKEN_FAIL,
  CHANGE_PASSWORD_USER_REQUEST,
  CHANGE_PASSWORD_USER_SUCCESS,
  CHANGE_PASSWORD_USER_FAIL,
  CHANGE_PASSWORD_USER_RESET,
  CHANGE_ADMIN_REQUEST,
  CHANGE_ADMIN_SUCCESS,
  CHANGE_ADMIN_FAIL,
  CHANGE_ADMIN_RESET,
  ADD_MESSAGE_REQUEST,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  ADD_NOTES_REQUEST,
  ADD_NOTES_SUCCESS,
  ADD_NOTES_FAIL,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  UPDATE_PASSWORD_USER_REQUEST,
  UPDATE_PASSWORD_USER_SUCCESS,
  UPDATE_PASSWORD_USER_FAIL,
} from '../constants/userConstants';

import { GET_CONVERSION_RATE_REQUEST, GET_CONVERSION_RATE_SUCCESS, GET_CONVERSION_RATE_FAIL, GET_CONVERSION_RATE_RESET } from '../constants/userConstants';

import { BASE_URL } from './ip';
import { toast } from 'react-toastify';
const utcTimeOffset = new Date().getTimezoneOffset();

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(`${BASE_URL}/users/login`, { email, password }, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const createNewUserAction = userData => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_NEW_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(`${BASE_URL}/users/user-signup`, userData, config);

    dispatch({
      type: CREATE_NEW_USER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: CREATE_NEW_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const getUserListAction =
  (formData = { pageNumber: 1, pageSize: 15 }) =>
    async (dispatch, getState) => {
      try {
        dispatch({ type: USER_LIST_REQUEST });

        const {
          userLogin: { userInfo },
        } = getState();

        const config = {
          headers: {
            token: userInfo.data.token,
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.get(
          `${BASE_URL}/users/get-user?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`,
          config
        );

        dispatch({
          type: USER_LIST_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: USER_LIST_FAIL,
          payload: err.response && err.response.data.message ? err.response.data.message : err.message,
        });
      }
    };

export const getUsersAction =
  (formData = { pageNumber: 1, pageSize: 15 }) =>
    async (dispatch, getState) => {
      try {
        dispatch({ type: USER_LIST_REQUEST });

        const {
          userLogin: { userInfo },
        } = getState();

        const config = {
          headers: {
            token: userInfo.data.token,
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.get(`${BASE_URL}/users/get-user?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}`, config);

        dispatch({
          type: USER_LIST_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: USER_LIST_FAIL,
          payload: err.response && err.response.data.message ? err.response.data.message : err.message,
        });
      }
    };

export const getMyProfileDeatilsAction = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PROFILE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.get(`${BASE_URL}/users/get-user-by-token`, config);
    // console.log("user" , data);
    dispatch({
      type: MY_PROFILE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: MY_PROFILE_DETAILS_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const updateMyProfile = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PROFILE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    // console.log(userInfo.data.token, 'token');

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'multipart/form-data',

      },
    };
    const { data } = await axios.put(`${BASE_URL}/users/update-profile`, formData, config);

    // console.log(data, 'data');
    dispatch({
      type: MY_PROFILE_DETAILS_SUCCESS,
      payload: data,
    });
    if (data.status) {
      toast.success('Your profile has been successfully updated');
    }
    if (!data.status) {
      toast.error('Something went wrong! Try again');
    }
  } catch (err) {
    dispatch({
      type: MY_PROFILE_DETAILS_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const deleteUserAction = id => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });


    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.delete(`${BASE_URL}/users/delete-user?userID=${id}`, config);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
}
export const getAppointmentConersionRate = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PROFILE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.get(
      `${BASE_URL}/appointment/appointment-conversion-rate`,
      config
    );
    dispatch({
      type: GET_CONVERSION_RATE_SUCCESS,
      payload: data
    });
    return data;
  } catch (err) {
    console.log(err)
  }
};
export const getRetentionStats = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_CONVERSION_RATE_REQUEST });


    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.get(
      `${BASE_URL}/appointment/customer-retention-rate`,
      config
    );
    dispatch({
      type: GET_CONVERSION_RATE_SUCCESS,
      payload: data
    });
    return data;
  } catch (err) {
    console.log(err)
  }
};


export const getAverageTicketValue = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PROFILE_DETAILS_REQUEST });


    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.get(
      `${BASE_URL}/appointment/average-ticket-value`,
      config
    );
    dispatch({
      type: GET_CONVERSION_RATE_SUCCESS,
      payload: data
    });
    return data;
  } catch (err) {
    console.log(err)
  }
};


export const activeUserAction = (id, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHANGE_STATUS_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.patch(`${BASE_URL}/users/enable-disable-user?userID=${id}`, formData, config);

    dispatch({
      type: CHANGE_STATUS_USER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: CHANGE_STATUS_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const getUserByTokenAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_BY_TOKEN_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.get(`${BASE_URL}/users/get-user-by-token`, config);

    dispatch({
      type: GET_USER_BY_TOKEN_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_USER_BY_TOKEN_FAIL,
      payload: err.response && err.response.data ? err.response.data : err.message,
    });
  }
};

export const changePasswordUserAction = userData => async (dispatch, getState) => {
  try {
    dispatch({ type: CHANGE_PASSWORD_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.patch(`${BASE_URL}/users/change-password`, userData, config);

    dispatch({
      type: CHANGE_PASSWORD_USER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: CHANGE_PASSWORD_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const updatePasswordUserAction = userData => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.patch(`${BASE_URL}/users/update-password`, userData, config);

    dispatch({
      type: UPDATE_PASSWORD_USER_SUCCESS,
      payload: data,
    });

    if (data.status) toast.success(data.message);
    if (!data.status) toast.error(data.message);
  } catch (err) {
    dispatch({
      type: UPDATE_PASSWORD_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const changeAdminAction = (id, userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHANGE_ADMIN_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.patch(`${BASE_URL}/users/update-salon-for-superadmin?salonID=${id}`, userData, config);

    localStorage.setItem('userInfo', JSON.stringify(data));

    dispatch({
      type: CHANGE_ADMIN_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: CHANGE_ADMIN_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const changeUserRole = (role) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHANGE_ADMIN_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.put(`${BASE_URL}/users/change-role`, {
      role: role
      }, config);

    // dispatch({
    //   type: CHANGE_ADMIN_SUCCESS,
    //   payload: data,
    // });
    localStorage.setItem('userInfo', JSON.stringify(data));
    window.location.reload();
  } catch (err) {
    // dispatch({
    //   type: CHANGE_ADMIN_FAIL,
    //   payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    // });
  }
};

export const addMessageAction = userData => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_MESSAGE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`${BASE_URL}/users/send-message`, userData, config);

    dispatch({
      type: ADD_MESSAGE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ADD_MESSAGE_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const addNotesAction = (id, userNote) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_NOTES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(`${BASE_URL}/stylist/note?user=${id}`, userNote, config);
    dispatch({
      type: ADD_NOTES_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ADD_NOTES_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const logOutUserAction = userData => async (dispatch, getState) => {
  try {
    dispatch({ type: LOGOUT_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        token: userInfo.data.token,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.patch(`${BASE_URL}/users/logout-user`, userData, config);

    dispatch({
      type: LOGOUT_USER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOGOUT_USER_FAIL,
      payload: err.response && err.response.data.message ? err.response.data.message : err.message,
    });
  }
};

export const logout = () => dispatch => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};
