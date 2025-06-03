import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';
import Content from '../../components/Content/Content'
import {
	createProductCategoryAction,
	deleteProductCategoryAction,
	getAllProductCategoriesAction,
	productCategoryStatusAction
} from '../../redux/actions/productActions';
import {
	ADD_PRODUCT_CATEGORY_RESET,
	DELETE_PRODUCT_CATEGORY_RESET,
	GET_ALL_PRODUCT_CATEGORY_RESET,
	PRODUCT_CATEGORY_STATUS_RESET
} from '../../redux/constants/productConstants';
import ProductsCategories from './NewProductsCategoriesScreen';

import Styles from './NewProductsCategoriesScreen.module.css';
import Pagination from '../../components/Pagination';
import DeleteModal from '../../components/Modal/DeleteModal';
import NoData from '../../website/components/NoData';


const ProductCategoriesScreen = () => {
	const dispatch = useDispatch();

	const [addModalActive, setAddModalActive] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});
	const [search, setSearch] = useState('');

	const [categoryName, setCategoryName] = useState({ value: '', error: '' });
	const [selectedCategory, setSelectedCategory] = useState({});

	const getAllProductCategories = useSelector((state) => state.getAllProductCategories);
	const createProductCategory = useSelector((state) => state.createProductCategory);
	const deleteProductCategory = useSelector((state) => state.deleteProductCategory);
	const productCategoryStatus = useSelector((state) => state.productCategoryStatus);

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	useEffect(
		() => {
			dispatch(getAllProductCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

			return () => {
				dispatch({ type: GET_ALL_PRODUCT_CATEGORY_RESET });
			};
		},
		[dispatch, pageNumber]
	);

	useEffect(
		() => {
			if (createProductCategory && createProductCategory.category && createProductCategory.category.status) {
				toast.success(createProductCategory.category.message);
				dispatch({ type: ADD_PRODUCT_CATEGORY_RESET });
				dispatch(getAllProductCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				handleAddModalClose();
			}
		},
		[createProductCategory, dispatch]
	);

	useEffect(
		() => {
			if (productCategoryStatus && productCategoryStatus.category && productCategoryStatus.category.status) {
				toast.success(productCategoryStatus.category.message);
				dispatch({ type: PRODUCT_CATEGORY_STATUS_RESET });
				dispatch(getAllProductCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[productCategoryStatus, dispatch]
	);

	useEffect(
		() => {
			if (deleteProductCategory && deleteProductCategory.category && deleteProductCategory.category.status) {
				toast.success(deleteProductCategory.category.message);
				dispatch({ type: DELETE_PRODUCT_CATEGORY_RESET });
				dispatch(getAllProductCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteProductCategory, dispatch]
	);

	useEffect(
		() => {
			if (selectedCategory && selectedCategory._id) {
				setCategoryName({ value: selectedCategory.categoryName });
			}
		},
		[selectedCategory]
	);

	const handleAddModalClose = () => {
		setCategoryName({ value: '', error: '' });
		setSelectedCategory({});
		setAddModalActive(false);
	};

	const handleEditButton = (categoryData) => {
		setSelectedCategory(categoryData);
		setAddModalActive(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (categoryName.value === '' && categoryName.value.trim() === '') {
			setCategoryName({ ...categoryName, error: 'Please enter category name' });
		} else {
			if (selectedCategory && selectedCategory._id)
				dispatch(createProductCategoryAction(selectedCategory._id, categoryName.value));
			else dispatch(createProductCategoryAction(null, categoryName.value));
		}
	};

	const handleEnableCategory = (id, enableStatus) => {
		dispatch(productCategoryStatusAction(id, enableStatus));
	};

	const onDeleteModalClose = () => {
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteProductCategoryAction(selectUpdateModel._id));
		onDeleteModalClose();
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllProductCategoriesAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(
			getAllProductCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value })
		);
	};

	return (
		<Content
			currentMenu='products'
			headerTitle='Product Categories'
			addBtn={true}
			addBtnText='Add Category'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Categories...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{getAllProductCategories.loading ? (
				<Spinner />
			) : (
				<div>
					{getAllProductCategories &&
						getAllProductCategories.categories &&
						getAllProductCategories.categories.data &&
						getAllProductCategories.categories.data.result &&
						getAllProductCategories.categories.data.result.length > 0 ? (
						<div>
							<div className={Styles.tableContainer} style={{ height: '65vh' }}>
								<table className={Styles.table}>
									<thead>
										<tr>
											<th>#</th>
											<th>Category Name</th>
											<th>Created At</th>
											<th>Active Status</th>
											<th >Actions</th>
										</tr>
									</thead>
									<tbody>
										{getAllProductCategories && getAllProductCategories.loading ? (
											<tr>
												<td>
													<Spinner />
												</td>
											</tr>
										) : (
											getAllProductCategories &&
											getAllProductCategories.categories &&
											getAllProductCategories.categories.data &&
											getAllProductCategories.categories.data.result &&
											getAllProductCategories.categories.data.result.map((res, index) => (
												<tr key={res._id}>
													<td>{index + 1}</td>
													<td>{res.categoryName}</td>
													<td>{new Date(res.createdAt).toLocaleDateString()}</td>
													<td>
														<label className='switch'>
															<input
																checked={res.enable}
																onChange={() => {
																	handleEnableCategory(res._id, res.enable);
																}}
																type='checkbox'
																className='checkbox'
																name='active'
															/>
															<span className='slider round' />
														</label>
													</td>
													<td>
														<div className='table__iconBox'>
															<button className='table__button' onClick={() => handleEditButton(res)}>
																<svg className='table__button--icon'>
																	<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
																</svg>
																<span>Edit Category Details</span>
															</button>
															<button
																className='table__button table__button--delete'
																onClick={() => {
																	setSelectUpdateModel(res);
																	setModalDeleteState(true);
																}}>
																<svg className='table__button--icon-red'>
																	<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
																</svg>
																<span>Delete Category</span>
															</button>
														</div>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>

							{totalPageSize > 1 && (
								<div className='tableContainer--paginater'>
									<Pagination
										list={getAllProductCategories.categories}
										onPageChange={handlePageChange}
										rowsPerPage={pageLimit}
										totalPageSize={totalPageSize}
										pageNumber={pageNumber}
									/>
								</div>
							)}
						</div>
					) : (
						<NoData
							title='No Data Found!'
							subTitle='We could not find any product category data.'
							height='40vh'
						/>
					)}
				</div>
			)}
			<ProductsCategories
				data={{ addModalActive, handleAddModalClose, categoryName, setCategoryName, selectedCategory, handleSubmit }}
			/>
			<DeleteModal data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default ProductCategoriesScreen;
