import { ADD_WEBSITE_CONTACT_US_FAIL, ADD_WEBSITE_CONTACT_US_REQUEST, ADD_WEBSITE_CONTACT_US_RESET, ADD_WEBSITE_CONTACT_US_SUCCESS, ADD_WEBSITE_SETTING_FAIL, ADD_WEBSITE_SETTING_REQUEST, ADD_WEBSITE_SETTING_RESET, ADD_WEBSITE_SETTING_SUCCESS, GET_WEBSITE_SERVICE_FAIL, GET_WEBSITE_SERVICE_REQUEST, GET_WEBSITE_SERVICE_RESET, GET_WEBSITE_SERVICE_SUCCESS, GET_WEBSITE_SETTING_FAIL, GET_WEBSITE_SETTING_REQUEST, GET_WEBSITE_SETTING_RESET, GET_WEBSITE_SETTING_SUCCESS } from "../constants/websiteSettingConstant";


export const websiteDataReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_WEBSITE_SETTING_REQUEST:
			return { loading: true };

		case ADD_WEBSITE_SETTING_SUCCESS:
			return { session: action.payload, loading: false };

		case ADD_WEBSITE_SETTING_FAIL:
			return { loading: false, error: action.payload };

		case ADD_WEBSITE_SETTING_RESET:
			return {};

		default:
			return state;
	}
};

export const getWebsiteDataReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_WEBSITE_SETTING_REQUEST:
			return { loading: true };

		case GET_WEBSITE_SETTING_SUCCESS:
			return { websiteInfo: action.payload, loading: false };

		case GET_WEBSITE_SETTING_FAIL:
			return { loading: false, error: action.payload };

		case GET_WEBSITE_SETTING_RESET:
			return {};

		default:
			return state;
	}
};

export const getWebsiteServiceReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_WEBSITE_SERVICE_REQUEST:
			return { loading: true };

		case GET_WEBSITE_SERVICE_SUCCESS:
			return { session: action.payload, loading: false };

		case GET_WEBSITE_SERVICE_FAIL:
			return { loading: false, error: action.payload };

		case GET_WEBSITE_SERVICE_RESET:
			return {};

		default:
			return state;
	}
};

export const addWebsiteContactUsReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_WEBSITE_CONTACT_US_REQUEST:
			return { loading: true };

		case ADD_WEBSITE_CONTACT_US_SUCCESS:
			return { data: action.payload, loading: false };

		case ADD_WEBSITE_CONTACT_US_FAIL:
			return { loading: false, error: action.payload };

		case ADD_WEBSITE_CONTACT_US_RESET:
			return {};

		default:
			return state;
	}
};
