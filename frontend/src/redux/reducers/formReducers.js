import {
	GET_USER_BY_WAIER_LIABILITY_REQUEST,
	GET_USER_BY_WAIER_LIABILITY_SUCCESS,
	GET_USER_BY_WAIER_LIABILITY_FAIL,
	GET_USER_BY_WAIER_LIABILITY_RESET,
	CREATE_NEW_INDEPENT_AGREEMENT_REQUEST,
	CREATE_NEW_INDEPENT_AGREEMENT_FAIL,
	CREATE_NEW_INDEPENT_AGREEMENT_RESET,
	CREATE_NEW_INDEPENT_AGREEMENT_SUCCESS,

	GET_NEW_INDEPENT_AGREEMENT_REQUEST,
	GET_NEW_INDEPENT_AGREEMENT_SUCCESS,
	GET_NEW_INDEPENT_AGREEMENT_FAIL,
	GET_NEW_INDEPENT_AGREEMENT_RESET,
} from '../constants/formConstants';

export const getFormByWaierLiabilityReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_USER_BY_WAIER_LIABILITY_REQUEST:
			return { loading: true };

		case GET_USER_BY_WAIER_LIABILITY_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case GET_USER_BY_WAIER_LIABILITY_FAIL:
			return { loading: false, error: action.payload };

		case GET_USER_BY_WAIER_LIABILITY_RESET:
			return {};

		default:
			return state;
	}
};



export const getFormByIndependentAgreementReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_NEW_INDEPENT_AGREEMENT_REQUEST:
			return { loading: true };

		case GET_NEW_INDEPENT_AGREEMENT_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case GET_NEW_INDEPENT_AGREEMENT_FAIL:
			return { loading: false, error: action.payload };

		case GET_NEW_INDEPENT_AGREEMENT_RESET:
			return {};

		default:
			return state;
	}
};




export const createFormByIndependentAgreementReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_NEW_INDEPENT_AGREEMENT_REQUEST:
			return { loading: true };

		case CREATE_NEW_INDEPENT_AGREEMENT_SUCCESS:
			return { userInfo: action.payload, loading: false };

		case CREATE_NEW_INDEPENT_AGREEMENT_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_NEW_INDEPENT_AGREEMENT_RESET:
			return {};

		default:
			return state;
	}
};
