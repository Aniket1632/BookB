import axios from 'axios';
import {
	GET_ALL_PRODUCT_CATEGORY_REQUEST,
	GET_ALL_PRODUCT_CATEGORY_SUCCESS,
	GET_ALL_PRODUCT_CATEGORY_FAIL,
	ADD_PRODUCT_CATEGORY_REQUEST,
	ADD_PRODUCT_CATEGORY_SUCCESS,
	ADD_PRODUCT_CATEGORY_FAIL,
	PRODUCT_CATEGORY_STATUS_REQUEST,
	PRODUCT_CATEGORY_STATUS_SUCCESS,
	PRODUCT_CATEGORY_STATUS_FAIL,
	DELETE_PRODUCT_CATEGORY_REQUEST,
	DELETE_PRODUCT_CATEGORY_SUCCESS,
	DELETE_PRODUCT_CATEGORY_FAIL,
	GET_ALL_PRODUCTS_REQUEST,
	GET_ALL_PRODUCTS_SUCCESS,
	GET_ALL_PRODUCTS_FAIL,
	GET_ONE_PRODUCT_REQUEST,
	GET_ONE_PRODUCT_SUCCESS,
	GET_ONE_PRODUCT_FAIL,
	CREATE_PRODUCT_REQUEST,
	CREATE_PRODUCT_SUCCESS,
	CREATE_PRODUCT_FAIL,
	CHANGE_PRODUCT_STATUS_REQUEST,
	CHANGE_PRODUCT_STATUS_SUCCESS,
	CHANGE_PRODUCT_STATUS_FAIL,
	DELETE_PRODUCT_REQUEST,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAIL,

	ADD_PRODUCT_STOCK_REQUEST,
	ADD_PRODUCT_STOCK_SUCCESS,
	ADD_PRODUCT_STOCK_FAIL,
	ADD_PRODUCT_STOCK_RESET,

	GET_PRODUCT_ORDER_REQUEST,
	GET_PRODUCT_ORDER_SUCCESS,
	GET_PRODUCT_ORDER_FAIL,
	GET_PRODUCT_ORDER_RESET,
	CHANGE_ORDER_STATUS_REQUEST,
	CHANGE_ORDER_STATUS_SUCCESS,
	CHANGE_ORDER_STATUS_FAIL,
	GET_SIMILAR_PRODUCT_REQUEST,
	GET_SIMILAR_PRODUCT_SUCCESS,
	GET_SIMILAR_PRODUCT_FAIL,
	GET_ENABLED_CATEGORY_REQUEST,
	GET_ENABLED_CATEGORY_SUCCESS,
	GET_ENABLED_CATEGORY_FAIL,
	GET_CATEGORY_REQUEST,
	GET_CATEGORY_SUCCESS,
	GET_CATEGORY_FAIL,
	ADD_ORDER_REQUEST,
	ADD_ORDER_SUCCESS,
	ADD_ORDER_FAIL,
	ADD_ITEM_IN_CART,
	DELETE_ITEM_IN_CART,
	ADJUST_ITEM_IN_CART,
	GET_PROD_LIST_CART,
	CHECKOUT,
	DELETE_ALL_ITEM_IN_CART,
	ADD_ORDER_RESET,
	GET_ORDER_BY_USER_REQUEST,
	GET_ORDER_BY_USER_SUCCESS,
	GET_ORDER_BY_USER_FAIL,
	ADD_APP_ORDER_REQUEST,
	ADD_APP_ORDER_SUCCESS,
	ADD_APP_ORDER_FAIL,
	GET_ORDER_BY_ID_REQUEST,
	GET_ORDER_BY_ID_SUCCESS,
	GET_ORDER_BY_ID_FAIL,
	ADD_PAYMENT_REQUEST,
	ADD_PAYMENT_SUCCESS,
	ADD_PAYMENT_FAIL,
} from '../constants/productConstants';
import { BASE_URL } from './ip';

export const getAllProductCategoriesAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ALL_PRODUCT_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-category?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_PRODUCT_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_PRODUCT_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createProductCategoryAction = (id, categoryName) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_PRODUCT_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const formData = id ? { categoryID: id, categoryName } : { categoryName };
		const { data } = await axios.post(`${BASE_URL}/product/create-category`, formData, config);

		dispatch({
			type: ADD_PRODUCT_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_PRODUCT_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const productCategoryStatusAction = (id, enableStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CATEGORY_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/product/enable-disable-category?categoryId=${id}`,
			{ enable: enableStatus },
			config
		);

		dispatch({
			type: PRODUCT_CATEGORY_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: PRODUCT_CATEGORY_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteProductCategoryAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_PRODUCT_CATEGORY_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/product/delete-category?categoryId=${id}`, config);

		dispatch({
			type: DELETE_PRODUCT_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_PRODUCT_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getAllProductsDashboardAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ALL_PRODUCTS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-product-by-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ALL_PRODUCTS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_PRODUCTS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getAllProductsAction = (formData) => async (dispatch) => {

	try {
		dispatch({ type: GET_ALL_PRODUCTS_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		formData.filter = formData.filter.filter(function (v) { return !!v; });
		const { data } = await axios.post(`${BASE_URL}/product/get-product-by-salon-for-website`, formData, config);

		dispatch({
			type: GET_ALL_PRODUCTS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ALL_PRODUCTS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getOneProductAction = (id) => async (dispatch) => {
	try {
		dispatch({ type: GET_ONE_PRODUCT_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-website-product-by-id?productID=${id}`, config);

		dispatch({
			type: GET_ONE_PRODUCT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ONE_PRODUCT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const createProductAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_PRODUCT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/product/add-product`, formData, config);

		dispatch({
			type: CREATE_PRODUCT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CREATE_PRODUCT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const changeProductStatusAction = (id, productStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_PRODUCT_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/product/enable-disable-product?productID=${id}`,
			{ enable: productStatus },
			config
		);

		dispatch({
			type: CHANGE_PRODUCT_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_PRODUCT_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const deleteProductAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_PRODUCT_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.delete(`${BASE_URL}/product/delete-product?productID=${id}`, config);

		dispatch({
			type: DELETE_PRODUCT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: DELETE_PRODUCT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const addProductStockAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_PRODUCT_STOCK_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/product/add-stock`, formData, config);

		dispatch({
			type: ADD_PRODUCT_STOCK_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_PRODUCT_STOCK_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const changeOrderStatusAction = (id, productStatus) => async (dispatch, getState) => {
	try {
		dispatch({ type: CHANGE_ORDER_STATUS_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.patch(
			`${BASE_URL}/product/change-order-status?orderID=${id}`,
			{ orderStatus: productStatus },
			config
		);

		dispatch({
			type: CHANGE_ORDER_STATUS_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: CHANGE_ORDER_STATUS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getProductOrderHistoryAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_PRODUCT_ORDER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-order-by-salon?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_PRODUCT_ORDER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_PRODUCT_ORDER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getSimilarProductAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SIMILAR_PRODUCT_REQUEST });
		const { getPublicWebsite: { websiteInfo } } = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-similar-website-product?productID=${formData.id}&offset=-330&name=${websiteInfo.data.salon.name}&pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_SIMILAR_PRODUCT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_SIMILAR_PRODUCT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getEnabledCategoryAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ENABLED_CATEGORY_REQUEST });
		const { getPublicWebsite: { websiteInfo } } = getState();
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-enabled-website-category?pageNumber=1&pageSize=1000&name=${websiteInfo.data.salon.name}`, config);

		dispatch({
			type: GET_ENABLED_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ENABLED_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const getCategoryAction = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_CATEGORY_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-category?pageNumber=1&pageSize=1000&filter`, config);

		dispatch({
			type: GET_CATEGORY_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_CATEGORY_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addOrderAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_ORDER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/product/add-order`, formData, config);

		dispatch({
			type: ADD_ORDER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_ORDER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addProductsAction = (item) => async (dispatch) => {
	dispatch({
		type: GET_PROD_LIST_CART,
		payload: item
	})
}
export const addToCartAction = (itemID) => async (dispatch) => {
	dispatch({ type: ADD_ORDER_RESET })
	dispatch({
		type: ADD_ITEM_IN_CART,
		payload: {
			id: itemID
		}
	})
}

export const deleteItemCartAction = (itemID) => async (dispatch) => {
	dispatch({
		type: DELETE_ITEM_IN_CART,
		payload: {
			id: itemID
		}
	})
}



export const deleteAllItemCartAction = () => async (dispatch) => {
	dispatch({
		type: DELETE_ALL_ITEM_IN_CART,
		payload: {}
	})
}


export const adjustQtyCartAction = (itemID, value) => async (dispatch) => {
	dispatch({
		type: ADJUST_ITEM_IN_CART,
		payload: {
			id: itemID,
			quantity: value
		}
	})
}

export const loadCurrentItemAction = (item) => async (dispatch) => {
	dispatch({
		type: ADJUST_ITEM_IN_CART,
		payload: item
	})
}

export const checkOutAction = (prices) => async (dispatch) => {
	dispatch({ type: ADD_ORDER_RESET })
	dispatch({
		type: CHECKOUT,
		payload: prices
	})
}


export const getOrderHistoryAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_ORDER_BY_USER_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-order-by-user?pageNumber=${formData.pageNumber}&pageSize=${formData.pageSize}&filterValue=${formData.filter}`, config);

		dispatch({
			type: GET_ORDER_BY_USER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ORDER_BY_USER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};

export const addAppOrderAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_APP_ORDER_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/product/add-order`, formData, config);

		dispatch({
			type: ADD_APP_ORDER_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_APP_ORDER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const getOrderByIdAction = (formData) => async (dispatch, getState) => {

	try {
		dispatch({ type: GET_ORDER_BY_ID_REQUEST });

		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				// token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.get(`${BASE_URL}/product/get-order-by-id?orderId=${formData}`, config);

		dispatch({
			type: GET_ORDER_BY_ID_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: GET_ORDER_BY_ID_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};


export const addPaymentAction = (formData) => async (dispatch, getState) => {
	try {
		dispatch({ type: ADD_PAYMENT_REQUEST });
		const { userLogin: { userInfo } } = getState();

		const config = {
			headers: {
				// token: userInfo.data.token,
				'Content-Type': 'application/json'
			}
		};

		const { data } = await axios.post(`${BASE_URL}/product/payment`, formData, config);

		dispatch({
			type: ADD_PAYMENT_SUCCESS,
			payload: data
		});
	} catch (err) {
		dispatch({
			type: ADD_PAYMENT_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message
		});
	}
};