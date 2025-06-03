import axios from 'axios';
import { GET_ALL_COUPONS_FAIL, GET_ALL_COUPONS_REQUEST, GET_ALL_COUPONS_SUCCESS } from '../constants/couponConstants';
import { CHANGE_PASSWORD_USER_FAIL, CHANGE_PASSWORD_USER_REQUEST, CHANGE_PASSWORD_USER_SUCCESS, CREATE_NEW_USER_FAIL, CREATE_NEW_USER_REQUEST, CREATE_NEW_USER_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from '../constants/userConstants';
import { ADD_WEBSITE_CONTACT_US_FAIL, ADD_WEBSITE_CONTACT_US_REQUEST, ADD_WEBSITE_CONTACT_US_SUCCESS, ADD_WEBSITE_SETTING_FAIL, ADD_WEBSITE_SETTING_REQUEST, ADD_WEBSITE_SETTING_SUCCESS, GET_WEBSITE_SERVICE_FAIL, GET_WEBSITE_SERVICE_REQUEST, GET_WEBSITE_SERVICE_SUCCESS, GET_WEBSITE_SETTING_FAIL, GET_WEBSITE_SETTING_REQUEST, GET_WEBSITE_SETTING_SUCCESS } from '../constants/websiteSettingConstant';
import { BASE_URL } from './ip';

const utcTimeOffset = new Date().getTimezoneOffset();

export const addWebsiteSettingAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_WEBSITE_SETTING_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/website/add-website-setting?offset=${utcTimeOffset}&type=website`, formData, config);

		dispatch({
			type: ADD_WEBSITE_SETTING_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_WEBSITE_SETTING_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getWebsiteSettingAction = (salonId) => async (dispatch) => {
	try {
		dispatch({ type: GET_WEBSITE_SETTING_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/website/get-website-setting-by-name?offset=${utcTimeOffset}&name=${salonId}`, config);

		dispatch({
			type: GET_WEBSITE_SETTING_SUCCESS,
			payload: data
		});

		localStorage.setItem('websiteInfo', JSON.stringify(data));

	} catch (err) {
		dispatch({
			type: GET_WEBSITE_SETTING_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getWebsiteSlotsAction = (salonId) => async (dispatch) => {
	try {
		dispatch({ type: GET_WEBSITE_SETTING_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/website/get-business-hour?offset=${utcTimeOffset}&salon=${salonId}`, config);

		console.log(data)

		dispatch({
			type: GET_WEBSITE_SETTING_SUCCESS,
			payload: data
		});


	} catch (err) {
		dispatch({
			type: GET_WEBSITE_SETTING_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getWebsiteSettingActionById = (salonId) => async (dispatch) => {
	try {
		dispatch({ type: GET_WEBSITE_SETTING_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/website/get-website-setting-by-salon?offset=${utcTimeOffset}&salon=${salonId}`, config);
		dispatch({
			type: GET_WEBSITE_SETTING_SUCCESS,
			payload: data
		});

		localStorage.setItem('websiteInfo', JSON.stringify(data));

	} catch (err) {
		dispatch({
			type: GET_WEBSITE_SETTING_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getWebsiteServiceAction = (salonName) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_WEBSITE_SERVICE_REQUEST });
		// const { getPublicWebsite: { websiteInfo } } = getState(); 

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/service/get-website-service-groupby-category?offset=${utcTimeOffset}&name=${salonName}`, config);

		dispatch({
			type: GET_WEBSITE_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_WEBSITE_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getWebsiteServiceActionById = (salonId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_WEBSITE_SERVICE_REQUEST });
		// const { getPublicWebsite: { websiteInfo } } = getState(); 

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/service/get-website-service-groupby-category-salon?offset=${utcTimeOffset}&salon=${salonId}`, config);

		dispatch({
			type: GET_WEBSITE_SERVICE_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_WEBSITE_SERVICE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addWebsiteContactUsAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_WEBSITE_CONTACT_US_REQUEST });
		const { getPublicWebsite: { websiteInfo } } = getState();


		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/website/contact-us?offset=${utcTimeOffset}&name=${websiteInfo.data.salon.name}`, formData, config);

		dispatch({
			type: ADD_WEBSITE_CONTACT_US_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_WEBSITE_CONTACT_US_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const webLogin = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/users/login`, { email, password }, config);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const registerUserAction = (userData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_NEW_USER_REQUEST });
		const { getPublicWebsite: { websiteInfo } } = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/website/register-user?name=${websiteInfo.data.salon.name}`, userData, config);

		dispatch({
			type: CREATE_NEW_USER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_NEW_USER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};



export const forgotPasswordUserAction = (userData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_PASSWORD_USER_REQUEST });

		const { getPublicWebsite: { websiteInfo } } = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const { data } = await axios.patch(`${BASE_URL}/users/forgot-password?name=${websiteInfo.data.salon.name}`, userData, config);

		dispatch({
			type: CHANGE_PASSWORD_USER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_PASSWORD_USER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};




export const getAllWebsiteCouponsAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ALL_COUPONS_REQUEST });
		const { getPublicWebsite: { websiteInfo } } = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/coupon/get-website-coupon-by-salon-name?name=${websiteInfo.data.salon.name}&pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

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
