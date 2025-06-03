import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import {
	createVideoCategoryAction,
	deleteVideoCategoryAction,
	getAllVideoCategoriesAction,
	videoCategoryStatusAction
} from '../../redux/actions/videoActions';
import {
	ADD_VIDEO_CATEGORY_RESET,
	DELETE_VIDEO_CATEGORY_RESET,
	GET_ALL_VIDEO_CATEGORY_RESET,
	VIDEO_CATEGORY_STATUS_RESET
} from '../../redux/constants/videoConstants';
import CreateCategory from './CreateCategory';

import VideoCategoriesStyle from './VideoCategories.module.css';
import Pagination from '../../components/Pagination';
import DeleteVideoCategory from './DeleteVideoCategory';
import NoData from '../../website/components/NoData';

const VideoCategoriesScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);

	const [addModalActive, setAddModalActive] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [search, setSearch] = useState('');

	const [categoryName, setCategoryName] = useState({ value: '', error: '' });
	const [selectedCategory, setSelectedCategory] = useState({});

	const getAllVideoCategories = useSelector((state) => state.getAllVideoCategories);
	const createVideoCategory = useSelector((state) => state.createVideoCategory);
	const deleteVideoCategory = useSelector((state) => state.deleteVideoCategory);
	const videoCategoryStatus = useSelector((state) => state.videoCategoryStatus);

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
				dispatch(getAllVideoCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

				return () => {
					dispatch({ type: GET_ALL_VIDEO_CATEGORY_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (createVideoCategory && createVideoCategory.category && createVideoCategory.category.status) {
				toast.success(createVideoCategory.category.message);
				dispatch({ type: ADD_VIDEO_CATEGORY_RESET });
				dispatch(getAllVideoCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				handleAddModalClose();
			}
		},
		[createVideoCategory, dispatch]
	);

	useEffect(
		() => {
			if (videoCategoryStatus && videoCategoryStatus.category && videoCategoryStatus.category.status) {
				toast.success(videoCategoryStatus.category.message);
				dispatch({ type: VIDEO_CATEGORY_STATUS_RESET });
				dispatch(getAllVideoCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[videoCategoryStatus, dispatch]
	);

	useEffect(
		() => {
			if (deleteVideoCategory && deleteVideoCategory.category && deleteVideoCategory.category.status) {
				toast.success(deleteVideoCategory.category.message);
				dispatch({ type: DELETE_VIDEO_CATEGORY_RESET });
				dispatch(getAllVideoCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteVideoCategory, dispatch]
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
				dispatch(createVideoCategoryAction(selectedCategory._id, categoryName.value));
			else dispatch(createVideoCategoryAction(null, categoryName.value));
		}
	};

	const handleEnableCategory = (id, enableStatus) => {
		dispatch(videoCategoryStatusAction(id, enableStatus));
	};

	const onDeleteModalClose = () => {
		setCategoryName({ value: '', error: '' });
		setSelectedCategory({});
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteVideoCategoryAction(selectedCategory._id));
		onDeleteModalClose();
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getAllVideoCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllVideoCategoriesAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	return (
		<Content
			currentMenu='videos'
			headerTitle='Video Categories'
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
			addBtnText='Add Category'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Categories...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{getAllVideoCategories.loading ? (
				<Spinner />
			) : (
				<div>
					{getAllVideoCategories &&
						getAllVideoCategories.categories &&
						getAllVideoCategories.categories.data &&
						getAllVideoCategories.categories.data.result &&
						getAllVideoCategories.categories.data.result.length > 0 ? (
						<div>
							<div className='tableContainer' style={{ height: '65vh' }}>
								<table className='table'>
									<thead>
										<tr>
											<th>#</th>
											<th>Category Name</th>
											{/* <th>Created At</th> */}
											<th>Active Status</th>
											<th />
										</tr>
									</thead>
									<tbody>
										{getAllVideoCategories && getAllVideoCategories.loading ? (
											<tr>
												<td>
													<Spinner />
												</td>
											</tr>
										) : (
											getAllVideoCategories &&
											getAllVideoCategories.categories &&
											getAllVideoCategories.categories.data &&
											getAllVideoCategories.categories.data.result &&
											getAllVideoCategories.categories.data.result.map((res, index) => (
												<tr key={res._id}>
													<td>{index + 1}</td>
													<td>{res.categoryName}</td>
													{/* <td>{new Date(res.createdAt).toLocaleDateString()}</td> */}
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
															<button
																className='table__button'
																onClick={() => {
																	handleEditButton(res);
																}}>
																<svg className='table__button--icon'>
																	<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
																</svg>
																<span>Edit Category Details</span>
															</button>
															<button
																className='table__button table__button--delete'
																onClick={() => {
																	setSelectedCategory(res);
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
										list={getAllVideoCategories.categories}
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
							subTitle='We could not find any video category data.'
							height='40vh'
						/>
					)}
				</div>
			)}

			<CreateCategory
				data={{ addModalActive, handleAddModalClose, categoryName, setCategoryName, handleSubmit, selectedCategory }}
			/>
			<DeleteVideoCategory data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default VideoCategoriesScreen;
