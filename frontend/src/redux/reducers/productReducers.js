import {
	GET_ALL_PRODUCT_CATEGORY_REQUEST,
	GET_ALL_PRODUCT_CATEGORY_SUCCESS,
	GET_ALL_PRODUCT_CATEGORY_FAIL,
	GET_ALL_PRODUCT_CATEGORY_RESET,
	ADD_PRODUCT_CATEGORY_REQUEST,
	ADD_PRODUCT_CATEGORY_SUCCESS,
	ADD_PRODUCT_CATEGORY_FAIL,
	ADD_PRODUCT_CATEGORY_RESET,
	PRODUCT_CATEGORY_STATUS_REQUEST,
	PRODUCT_CATEGORY_STATUS_SUCCESS,
	PRODUCT_CATEGORY_STATUS_FAIL,
	PRODUCT_CATEGORY_STATUS_RESET,
	DELETE_PRODUCT_CATEGORY_REQUEST,
	DELETE_PRODUCT_CATEGORY_SUCCESS,
	DELETE_PRODUCT_CATEGORY_FAIL,
	DELETE_PRODUCT_CATEGORY_RESET,
	GET_ALL_PRODUCTS_REQUEST,
	GET_ALL_PRODUCTS_SUCCESS,
	GET_ALL_PRODUCTS_FAIL,
	GET_ALL_PRODUCTS_RESET,
	GET_ONE_PRODUCT_REQUEST,
	GET_ONE_PRODUCT_SUCCESS,
	GET_ONE_PRODUCT_FAIL,
	GET_ONE_PRODUCT_RESET,
	CREATE_PRODUCT_REQUEST,
	CREATE_PRODUCT_SUCCESS,
	CREATE_PRODUCT_FAIL,
	CREATE_PRODUCT_RESET,
	CHANGE_PRODUCT_STATUS_REQUEST,
	CHANGE_PRODUCT_STATUS_SUCCESS,
	CHANGE_PRODUCT_STATUS_FAIL,
	CHANGE_PRODUCT_STATUS_RESET,
	DELETE_PRODUCT_REQUEST,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAIL,
	DELETE_PRODUCT_RESET,

	ADD_PRODUCT_STOCK_REQUEST,
	ADD_PRODUCT_STOCK_SUCCESS,
	ADD_PRODUCT_STOCK_FAIL,
	ADD_PRODUCT_STOCK_RESET,

	GET_PRODUCT_ORDER_REQUEST,
	GET_PRODUCT_ORDER_RESET,
	GET_PRODUCT_ORDER_FAIL,
	GET_PRODUCT_ORDER_SUCCESS,

	CHANGE_ORDER_STATUS_REQUEST,
	CHANGE_ORDER_STATUS_SUCCESS,
	CHANGE_ORDER_STATUS_RESET,
	CHANGE_ORDER_STATUS_FAIL,
	ADD_PRODUCTS_TO_CART,
	REMOVE_PRODUCTS_TO_CART,
	GET_SIMILAR_PRODUCT_REQUEST,
	GET_SIMILAR_PRODUCT_SUCCESS,
	GET_SIMILAR_PRODUCT_FAIL,
	GET_SIMILAR_PRODUCT_RESET,
	GET_ENABLED_CATEGORY_REQUEST,
	GET_ENABLED_CATEGORY_SUCCESS,
	GET_ENABLED_CATEGORY_FAIL,
	GET_ENABLED_CATEGORY_RESET,
	GET_CATEGORY_REQUEST,
	GET_CATEGORY_SUCCESS,
	GET_CATEGORY_FAIL,
	GET_CATEGORY_RESET,
	ADD_ORDER_REQUEST,
	ADD_ORDER_SUCCESS,
	ADD_ORDER_FAIL,
	ADD_ORDER_RESET,
	ADD_ITEM_IN_CART,
	ADJUST_ITEM_IN_CART,
	DELETE_ITEM_IN_CART,
	LOAD_ITEM_IN_CART,
	GET_PROD_LIST_CART,
	CHECKOUT,
	CHECKOUT_RESET,
	CART_RESET,
	DELETE_ALL_ITEM_IN_CART,
	GET_ORDER_BY_USER_REQUEST,
	GET_ORDER_BY_USER_SUCCESS,
	GET_ORDER_BY_USER_FAIL,
	GET_ORDER_BY_USER_RESET,
	ADD_APP_ORDER_REQUEST,
	ADD_APP_ORDER_SUCCESS,
	ADD_APP_ORDER_FAIL,
	ADD_APP_ORDER_RESET,
	GET_ORDER_BY_ID_REQUEST,
	GET_ORDER_BY_ID_SUCCESS,
	GET_ORDER_BY_ID_FAIL,
	GET_ORDER_BY_ID_RESET,
	ADD_PAYMENT_REQUEST,
	ADD_PAYMENT_SUCCESS,
	ADD_PAYMENT_FAIL,
	ADD_PAYMENT_RESET,
} from '../constants/productConstants';

export const getAllProductCategoriesReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_PRODUCT_CATEGORY_REQUEST:
			return { loading: true };

		case GET_ALL_PRODUCT_CATEGORY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ALL_PRODUCT_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_PRODUCT_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const createProductCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_PRODUCT_CATEGORY_REQUEST:
			return { loading: true };

		case ADD_PRODUCT_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_PRODUCT_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case ADD_PRODUCT_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const productCategoryStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case PRODUCT_CATEGORY_STATUS_REQUEST:
			return { loading: true };

		case PRODUCT_CATEGORY_STATUS_SUCCESS:
			return { category: action.payload, loading: false };

		case PRODUCT_CATEGORY_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case PRODUCT_CATEGORY_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteProductCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_PRODUCT_CATEGORY_REQUEST:
			return { loading: true };

		case DELETE_PRODUCT_CATEGORY_SUCCESS:
			return { category: action.payload, loading: false };

		case DELETE_PRODUCT_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_PRODUCT_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const getAllProductsReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ALL_PRODUCTS_REQUEST:
			return { loading: true };

		case GET_ALL_PRODUCTS_SUCCESS:
			return { products: action.payload, loading: false };

		case GET_ALL_PRODUCTS_FAIL:
			return { loading: false, error: action.payload };

		case GET_ALL_PRODUCTS_RESET:
			return {};

		default:
			return state;
	}
};

export const getOneProductReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ONE_PRODUCT_REQUEST:
			return { loading: true };

		case GET_ONE_PRODUCT_SUCCESS:
			return { product: action.payload, loading: false };

		case GET_ONE_PRODUCT_FAIL:
			return { loading: false, error: action.payload };

		case GET_ONE_PRODUCT_RESET:
			return {};

		default:
			return state;
	}
};

export const createProductReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_PRODUCT_REQUEST:
			return { loading: true };

		case CREATE_PRODUCT_SUCCESS:
			return { product: action.payload, loading: false };

		case CREATE_PRODUCT_FAIL:
			return { loading: false, error: action.payload };

		case CREATE_PRODUCT_RESET:
			return {};

		default:
			return state;
	}
};

export const changeProductStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_PRODUCT_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_PRODUCT_STATUS_SUCCESS:
			return { product: action.payload, loading: false };

		case CHANGE_PRODUCT_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_PRODUCT_STATUS_RESET:
			return {};

		default:
			return state;
	}
};

export const deleteProductReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_PRODUCT_REQUEST:
			return { loading: true };

		case DELETE_PRODUCT_SUCCESS:
			return { product: action.payload, loading: false };

		case DELETE_PRODUCT_FAIL:
			return { loading: false, error: action.payload };

		case DELETE_PRODUCT_RESET:
			return {};

		default:
			return state;
	}
};


export const getProductOrderHistoryReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_PRODUCT_ORDER_REQUEST:
			return { loading: true };

		case GET_PRODUCT_ORDER_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_PRODUCT_ORDER_FAIL:
			return { loading: false, error: action.payload };

		case GET_PRODUCT_ORDER_RESET:
			return {};

		default:
			return state;
	}
};

export const addProductStockReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_PRODUCT_STOCK_REQUEST:
			return { loading: true };

		case ADD_PRODUCT_STOCK_SUCCESS:
			return { category: action.payload, loading: false };

		case ADD_PRODUCT_STOCK_FAIL:
			return { loading: false, error: action.payload };

		case ADD_PRODUCT_STOCK_RESET:
			return {};

		default:
			return state;
	}
};



export const changeOrderStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_ORDER_STATUS_REQUEST:
			return { loading: true };

		case CHANGE_ORDER_STATUS_SUCCESS:
			return { categories: action.payload, loading: false };

		case CHANGE_ORDER_STATUS_FAIL:
			return { loading: false, error: action.payload };

		case CHANGE_ORDER_STATUS_RESET:
			return {};

		default:
			return state;
	}
};



export const getSimilarProductReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_SIMILAR_PRODUCT_REQUEST:
			return { loading: true };

		case GET_SIMILAR_PRODUCT_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_SIMILAR_PRODUCT_FAIL:
			return { loading: false, error: action.payload };

		case GET_SIMILAR_PRODUCT_RESET:
			return {};

		default:
			return state;
	}
};

export const getEnabledCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ENABLED_CATEGORY_REQUEST:
			return { loading: true };

		case GET_ENABLED_CATEGORY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ENABLED_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case GET_ENABLED_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};
export const getCategoryReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_CATEGORY_REQUEST:
			return { loading: true };

		case GET_CATEGORY_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_CATEGORY_FAIL:
			return { loading: false, error: action.payload };

		case GET_CATEGORY_RESET:
			return {};

		default:
			return state;
	}
};

export const addOrderReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_ORDER_REQUEST:
			return { loading: true };

		case ADD_ORDER_SUCCESS:
			return { categories: action.payload, loading: false };

		case ADD_ORDER_FAIL:
			return { loading: false, error: action.payload };

		case ADD_ORDER_RESET:
			return {};

		default:
			return state;
	}
};
const INITIAL_STATE = {
	products: [],
	cart: [],
	currentItem: null
}
export const cartProductReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_PROD_LIST_CART:
			return {
				...state,
				products: action.payload
			}

		case ADD_ITEM_IN_CART:
			const item = state.products.find(prod => prod._id === action.payload.id);

			const inCart = state.cart.find(item => item._id === action.payload.id ? true : false)
			//const addedData = inCart? state.cart.map(item=> item._id === action.payload.id ? {...item, quantity: item.quantity + 1 }: item): [...state.cart, {...item, quantity: 1}]
			const addedData = inCart ? state.cart.map(item => item._id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item) : [...state.cart, { ...item, quantity: 1 }]
			localStorage.setItem('cart', JSON.stringify(addedData))
			return {
				...state,
				cart: addedData,

			};

		case ADJUST_ITEM_IN_CART:
			const adjustedData = state.cart.map(item => item._id === action.payload.id ? { ...item, quantity: +action.payload.quantity } : item);
			localStorage.setItem('cart', JSON.stringify(adjustedData))
			return {
				...state,
				cart: adjustedData
			};

		case DELETE_ITEM_IN_CART:
			const deletedData = state.cart.filter(item => item._id !== action.payload.id)
			localStorage.setItem('cart', JSON.stringify(deletedData))
			return {
				...state,
				cart: deletedData
			};

		case DELETE_ALL_ITEM_IN_CART:
			localStorage.removeItem('cart')
			return {
				...state,
				cart: []
			};

		case LOAD_ITEM_IN_CART:
			return {
				...state,
				currentItem: action.payload,
			};

		case CART_RESET:
			return {
				...state,
				cart: [],
			};

		default:
			return state;
	}
};
export const checkOutReducer = (state = {
	cart: []
}, action) => {
	switch (action.type) {
		case CHECKOUT:
			localStorage.setItem('checkout', JSON.stringify(action.payload))
			return {
				cart: action.payload
			};
		case CHECKOUT_RESET:
			return {};

		default:
			return state;
	}
};


export const getOrderHistoryReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ORDER_BY_USER_REQUEST:
			return { loading: true };

		case GET_ORDER_BY_USER_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ORDER_BY_USER_FAIL:
			return { loading: false, error: action.payload };

		case GET_ORDER_BY_USER_RESET:
			return {};

		default:
			return state;
	}
};


export const addAppOrderReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_APP_ORDER_REQUEST:
			return { loading: true };

		case ADD_APP_ORDER_SUCCESS:
			return { categories: action.payload, loading: false };

		case ADD_APP_ORDER_FAIL:
			return { loading: false, error: action.payload };

		case ADD_APP_ORDER_RESET:
			return {};

		default:
			return state;
	}
};


export const getOrderByIdReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ORDER_BY_ID_REQUEST:
			return { loading: true };

		case GET_ORDER_BY_ID_SUCCESS:
			return { categories: action.payload, loading: false };

		case GET_ORDER_BY_ID_FAIL:
			return { loading: false, error: action.payload };

		case GET_ORDER_BY_ID_RESET:
			return {};

		default:
			return state;
	}
};

export const addAPaymentReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_PAYMENT_REQUEST:
			return { loading: true };

		case ADD_PAYMENT_SUCCESS:
			return { categories: action.payload, loading: false };

		case ADD_PAYMENT_FAIL:
			return { loading: false, error: action.payload };

		case ADD_PAYMENT_RESET:
			return {};

		default:
			return state;
	}
};