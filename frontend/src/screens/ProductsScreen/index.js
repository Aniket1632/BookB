import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';

import ProductsStyle from './Products.module.css';
import {
	addProductStockAction,
	changeProductStatusAction,
	createProductAction,
	deleteProductAction,
	getAllProductsDashboardAction
} from '../../redux/actions/productActions';
import CreateProduct from './CreateEditProduct';
import {
	ADD_PRODUCT_STOCK_RESET,
	CHANGE_PRODUCT_STATUS_RESET,
	CREATE_PRODUCT_RESET,
	DELETE_PRODUCT_RESET,
	GET_ALL_PRODUCTS_RESET
} from '../../redux/constants/productConstants';
import ReadMore from '../../components/Readmore';
import DeleteProduct from './DeleteProduct';
import ProductDetailModal from './ProductDetailModal';
import AddStockProduct from './addStockProduct';
import Pagination from '../../components/Pagination';
import NoData from '../../website/components/NoData';

const ProductsScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const [addModalActive, setAddModalActive] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [modalProductDetailState, setModalProductDetailState] = useState(false);
	const [addStockModalActive, setAddStockModalActive] = useState(false);
	const [search, setSearch] = useState('');
	const [productId, setProductId] = useState('');
	const [productName, setProductName] = useState({ value: '', error: '' });
	const [productDesc, setProductDesc] = useState({ value: '', error: '' });
	const [productCategory, setProductCategory] = useState({ value: '', error: '' });
	const [productPrice, setProductPrice] = useState({ value: '', error: '' });
	const [actualPrice, setActualPrice] = useState({ value: '', error: '' });
	const [rating, setRating] = useState({ value: '', error: '' });
	const [productPoster, setProductPoster] = useState({ image: '', error: '' });

	const [quantity, setQuantity] = useState({ value: '', error: '' });
	const [type, setStockType] = useState({ value: 'credit', error: '' });

	const [imageSrc, setImageSrc] = useState('');

	const getAllProducts = useSelector((state) => state.getAllProducts);
	const createProduct = useSelector((state) => state.createProduct);
	const changeProductStatus = useSelector((state) => state.changeProductStatus);
	const deleteProduct = useSelector((state) => state.deleteProduct);
	const addProductStock = useSelector((state) => state.addProductStock);

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	useEffect(
		() => {
			if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'manager' ||
					getUserInfo.userInfo.data.role === 'superadmin')
			) {
				dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

				return () => {
					dispatch({ type: GET_ALL_PRODUCTS_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (createProduct && createProduct.product && createProduct.product.status) {
				handleAddModalClose();
				toast.success(createProduct.product.message);
				dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: CREATE_PRODUCT_RESET });
			} else if (createProduct && createProduct.product && !createProduct.product.status) {
				toast.success(createProduct.product.message);
				dispatch({ type: CREATE_PRODUCT_RESET });
			}
		},
		[createProduct, dispatch]
	);

	useEffect(
		() => {
			if (changeProductStatus && changeProductStatus.product && changeProductStatus.product.status) {
				toast.success(changeProductStatus.product.message);
				dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: CHANGE_PRODUCT_STATUS_RESET });
			}
		},
		[changeProductStatus, dispatch]
	);

	useEffect(
		() => {
			if (deleteProduct && deleteProduct.product && deleteProduct.product.status) {
				toast.success(deleteProduct.product.message);
				dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: DELETE_PRODUCT_RESET });
			}
		},
		[deleteProduct, dispatch]
	);

	useEffect(
		() => {
			if (addProductStock && addProductStock.category && addProductStock.category.status) {
				toast.success(addProductStock.category.message);
				dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				handleAddStockModalClose();
				dispatch({ type: ADD_PRODUCT_STOCK_RESET });
			} else if (addProductStock && addProductStock.category && !addProductStock.category.status) {
				toast.error(addProductStock.category.message);
				dispatch({ type: ADD_PRODUCT_STOCK_RESET });
			}
		},
		[addProductStock, dispatch]
	);

	const handleAddModalClose = () => {
		setAddModalActive(false);
		setProductId();
		setProductName({ value: '', error: '' });
		setProductDesc({ value: '', error: '' });
		setProductCategory({ value: '', error: '' });
		setProductPoster({ value: '', error: '' });
		setProductPrice({ value: '', error: '' });
		setActualPrice({ value: '', error: '' });
		setRating({ value: '', error: '' })
		setImageSrc('');
		setSearch('');
	};

	const handleUploadProduct = (e) => {
		e.preventDefault();
		if (productName.value === '' && productName.value.trim() === '') {
			setProductName({ ...productName, error: 'Please enter product title' });
		} else if (productDesc.value === '' && productDesc.value.trim() === '') {
			setProductDesc({ ...productDesc, error: 'Please enter product description' });
		} else if (productCategory.value === '' && productCategory.value.trim() === '') {
			setProductCategory({ ...productCategory, error: 'Please enter product description' });
		} else if (productPrice.value === '' && productPrice.value.trim() === '') {
			setProductPrice({ ...productPrice, error: 'Please enter product price' });
		} else if (actualPrice.value === '' && actualPrice.value.trim() === '') {
			setActualPrice({ ...actualPrice, error: 'Please enter Actual Price' });
		} else if (rating.value === '' && rating.value.trim() === '') {
			setRating({ ...rating, error: 'Please select rating' });
		} else if (!imageSrc) {
			setProductPoster({ ...productPoster, error: 'Please select product image' });
		} else {
			let data = new FormData();
			if (productId !== '' && productId !== undefined) {
				data.append('_id', productId);
			}
			data.append('productName', productName.value);
			data.append('productDescription', productDesc.value);
			data.append('category', productCategory.value);
			data.append('productPrice', productPrice.value);
			data.append('actualPrice', actualPrice.value);
			data.append('rating', rating.value)
			if (productPoster.value !== '') {
				data.append('image', productPoster.value);
			}
			dispatch(createProductAction(data));
		}
	};

	const handleEnableProduct = (id, enableStatus) => {
		dispatch(changeProductStatusAction(id, enableStatus));
	};

	const onDeleteModalClose = () => {
		setProductId('');
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteProductAction(productId));
		onDeleteModalClose();
	};

	const onProductDetailModalClose = (d) => {
		setProductId('');
		setModalProductDetailState(false);
	};

	const handleEditModalProduct = (d) => {
		setProductId(d._id);
		setProductName({ value: d.productName, error: '' });
		setProductDesc({ value: d.productDescription, error: '' });
		setProductCategory({ value: d.category._id, error: '' });
		setImageSrc(d.productImageURL);
		setProductPrice({ value: d.productPrice, error: '' });
		setActualPrice({ value: (d && d.actualPrice), error: '' })
		setRating({ value: (d && d.rating), error: '' })
		setAddModalActive(true);
	};

	const addProductStockHandler = (e) => {
		e.preventDefault();
		if (!quantity.value || quantity.value.trim() === '') {
			setQuantity({ ...quantity, error: 'Please enter product quantity' });
		} else if (!type.value || type.value.trim() === '') {
			setStockType({ ...type, error: 'Please enter product stock type' });
		} else {
			dispatch(
				addProductStockAction({
					quantity: quantity.value,
					productID: productId,
					type: type.value
				})
			);
		}
	};

	const handleAddStockModalClose = () => {
		setAddStockModalActive(false);
		setStockType('credit');
		setQuantity('');
		setProductId('');
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getAllProductsDashboardAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllProductsDashboardAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	return (
		<Content
			currentMenu='products'
			headerTitle='List of all product contents'
			addBtn={
				getUserInfo &&
					getUserInfo.userInfo &&
					getUserInfo.userInfo.data &&
					(getUserInfo.userInfo.data.role === 'salon' ||
						getUserInfo.userInfo.data.role === 'manager' ||
						getUserInfo.userInfo.data.role === 'superadmin') ? (
					true
				) : (
					false
				)
			}
			addBtnText='Add New Product'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Products...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>

			<div className={ProductsStyle.productCards}>
				{getAllProducts && getAllProducts.loading ? (
					<Spinner />
				) : getAllProducts &&
					getAllProducts.products &&
					getAllProducts.products.data &&
					getAllProducts.products.data.result &&
					getAllProducts.products.data.result.length > 0 ? (
					getAllProducts.products.data.result.map((res) => (
						<div className={ProductsStyle.productCard} key={res._id}>
							<div
								className={ProductsStyle.productCard__iImageIcon}
								onClick={() => {
									setProductId(res._id);
									setModalProductDetailState(true);
								}}>
								<img
									src={res.productImageURL}
									alt='product thumb'
									className={ProductsStyle.productCard__iImageIcon_image}
								/>
							</div>
							<div
								onClick={() => {
									setProductId(res._id);
									setModalProductDetailState(true);
								}}
								className={ProductsStyle.productCard__title}>
								{res.productName.length > 10 ? res.productName.slice(0, 20) + '...' : res.productName}
							</div>
							<h4 className={ProductsStyle.productCard__subTitle}>
								<ReadMore>{res.productDescription.length > 0 && res.productDescription}</ReadMore>
							</h4>
							<div className={ProductsStyle.productCardStats}>
								<p className={ProductsStyle.productCardCategory}>{res.category.categoryName}</p>
								<div className={ProductsStyle.productCardStatsCount}>
									<div className={ProductsStyle.productCardStat}>
										<h1 style={{ fontSize: '1.5rem', marginRight: '0.2rem' }}>$ {res.productPrice}</h1>{' '}
										<p style={{ fontSize: '1rem' }}>
											{res.quantity}/{res.stock}
										</p>
									</div>
								</div>
							</div>
							<div className={ProductsStyle.productCardActions}>
								<label className='switch'>
									<input
										checked={res.enable}
										onChange={() => {
											handleEnableProduct(res._id, res.enable);
										}}
										type='checkbox'
										className='checkbox'
										name='active'
									/>
									<span className='slider round' />
								</label>
								<div className={ProductsStyle.productCardActionBtn}>
									<button
										className={ProductsStyle.productCardAction}
										onClick={() => {
											setAddStockModalActive(true);
											setProductId(res._id);
										}}>
										<svg className={ProductsStyle.productCardActionIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-plus`} />
										</svg>
									</button>

									<button
										className={ProductsStyle.productCardAction}
										onClick={() => {
											setAddModalActive(true);
											setProductId(res._id);
											handleEditModalProduct(res);
										}}>
										<svg className={ProductsStyle.productCardActionIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
										</svg>
									</button>

									<button
										className={ProductsStyle.productCardAction}
										onClick={() => {
											setModalDeleteState(true);
											setProductId(res._id);
										}}>
										<svg className={ProductsStyle.productCardActionIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
										</svg>
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<NoData
						title='No Data Found!'
						subTitle='We could not find any product data.'
						height='40vh'
					/>
				)}

				{totalPageSize > 1 && (
					<div className='tableContainer--paginater'>
						<Pagination
							list={getAllProducts.products}
							onPageChange={handlePageChange}
							rowsPerPage={pageLimit}
							totalPageSize={totalPageSize}
							pageNumber={pageNumber}
						/>
					</div>
				)}
			</div>

			<CreateProduct
				data={{
					productId,
					addModalActive,
					handleAddModalClose,
					productName,
					setProductName,
					productDesc,
					setProductDesc,
					productCategory,
					setProductCategory,
					productPoster,
					setProductPoster,
					productPrice,
					setProductPrice,
					imageSrc,
					setImageSrc,
					actualPrice,
					setActualPrice,
					rating,
					setRating,
					handleSubmit: handleUploadProduct
				}}
			/>
			<ProductDetailModal data={{ productId, modalProductDetailState, onProductDetailModalClose, onDeleteHandler }} />
			<DeleteProduct data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />

			<AddStockProduct
				data={{
					productId,

					quantity,
					type,
					setQuantity,
					setStockType,

					handleSubmit: addProductStockHandler,

					addStockModalActive,
					handleAddStockModalClose
				}}
			/>
		</Content>
	);
};

export default ProductsScreen;
