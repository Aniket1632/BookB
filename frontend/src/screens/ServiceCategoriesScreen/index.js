import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import {
	createServiceAction,
	deleteServiceAction,
	getAllServiceCategoriesAction,
	changeServiceStatusAction
} from '../../redux/actions/serviceActions';
import {
	ADD_SERVICE_CATEGORY_RESET,
	DELETE_SERVICE_CATEGORY_RESET,
	GET_ALL_SERVICE_CATEGORY_RESET,
	SERVICE_CATEGORY_STATUS_RESET
} from '../../redux/constants/serviceConstants';
import NoData from '../../website/components/NoData';
import AddService from '../ServiceScreen/AddService';
import DeleteService from '../ServiceScreen/DeleteService';
import ServiceStyle from './ServiceCategories.module.css';

const ServiceCategoriesScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const [addModalActive, setAddModalActive] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});

	const getAllServiceCategories = useSelector((state) => state.getAllServiceCategories);
	const createService = useSelector((state) => state.createService);
	const deleteService = useSelector((state) => state.deleteService);
	const changeServiceStatus = useSelector((state) => state.changeServiceStatus);


	const [modalDeleteState, setModalDeleteState] = useState(false);


	const [id, setServiceId] = useState('');

	const [search, setSearch] = useState('');

	const [title, setTitle] = useState('');
	const [titleError, setTitleError] = useState('');
	const [isMainService, setIsMainService] = useState(true);

	const [description, setDescription] = useState('');
	const [descriptionError, setDescriptionError] = useState('');
	const [charges, setCharges] = useState('');
	const [chargesError, setChargesError] = useState('');
	const [service, setService] = useState('');
	const [serviceError, setServiceError] = useState('');

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
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else {
				history.push('/');
			}
		},
		[history, getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (createService && createService.category && createService.category.status) {
				clearData();
				setAddModalActive(false);
				toast.success(createService.category.message);
				dispatch({ type: ADD_SERVICE_CATEGORY_RESET });
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createService && createService.category && !createService.category.status) {
				dispatch({ type: ADD_SERVICE_CATEGORY_RESET });
				toast.error(createService.category.message);
			}
		},
		[createService, dispatch]
	);

	useEffect(
		() => {
			if (deleteService && deleteService.category && deleteService.category.status) {
				toast.success(deleteService.category.message);
				dispatch({ type: SERVICE_CATEGORY_STATUS_RESET });
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteService && deleteService.category && !deleteService.category.status) {
				toast.error(deleteService.category.message);
				dispatch({ type: SERVICE_CATEGORY_STATUS_RESET });
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteService, dispatch]
	);

	useEffect(
		() => {
			if (changeServiceStatus && changeServiceStatus.category && changeServiceStatus.category.status) {
				toast.success(changeServiceStatus.category.message);
				setSelectUpdateModel({});
				dispatch({ type: DELETE_SERVICE_CATEGORY_RESET });
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeServiceStatus && changeServiceStatus.category && !changeServiceStatus.category.status) {
				toast.error(changeServiceStatus.category.message);
				dispatch({ type: DELETE_SERVICE_CATEGORY_RESET });
				dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[changeServiceStatus, dispatch]
	);

	const handleAddModalClose = () => {
		clearData();
		setSelectUpdateModel({});
		setAddModalActive(false);
	};

	const handleEditButton = (d) => {
		setServiceId(d._id);
		setDescription(d.description);
		setCharges(d.charges);
		setTitle(d.title);
		setSelectUpdateModel(d);
		setAddModalActive(true);
	};

	const clearData = () => {
		setServiceId('');
		setDescription('');
		setCharges('');
		setTitle('');
		setDescriptionError('');
		setChargesError('');
		setTitleError('');
		setService('');
		setServiceError('');
		setSelectUpdateModel('');
	};


	const handleSubmit = (e) => {
		e.preventDefault();
		if (title === '' && title.trim() === '') {
			setTitleError('Please enter title');
		} else {
			if (id !== '') {
				dispatch(createServiceAction({ id, title, isMainService, description, charges }));
			} else {
				dispatch(createServiceAction({ title, isMainService, description, charges }));
			}
		}

	};


	const handleEnableCategory = (id, enableStatus) => {
		dispatch(
			changeServiceStatusAction(id, {
				enable: enableStatus ? false : true
			})
		);
	};

	const onDeleteModalClose = () => {
		clearData();
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteServiceAction(selectUpdateModel._id));
		onDeleteModalClose();
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getAllServiceCategoriesAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	return (
		<Content
			currentMenu='services'
			headerTitle='Service'
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
			addBtnText='Add Service'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Service...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{getAllServiceCategories && getAllServiceCategories.loading ? (
				<Spinner />
			) : (
				<div>
					{getAllServiceCategories &&
						getAllServiceCategories.categories &&
						getAllServiceCategories.categories.data &&
						getAllServiceCategories.categories.data.result &&
						getAllServiceCategories.categories.data.result.length > 0 ? (
						<div className='tableContainer' style={{ height: '65vh' }}>
							<table className='table'>
								<thead>
									<tr>
										<th>#</th>
										<th>Service Title</th>

										<th>Active Status</th>
										<th />
									</tr>
								</thead>
								<tbody>
									{getAllServiceCategories && getAllServiceCategories.loading ? (
										<tr>
											<td>
												<Spinner />
											</td>
										</tr>
									) : (
										getAllServiceCategories &&
										getAllServiceCategories.categories &&
										getAllServiceCategories.categories.data &&
										getAllServiceCategories.categories.data.result &&
										getAllServiceCategories.categories.data.result.length > 0 &&
										getAllServiceCategories.categories.data.result.map((res, index) => (
											<tr key={res._id}>
												<td>{index + 1}</td>
												<td>{res.title}</td>
												<td>
													<label className='switch'>
														<input
															checked={res.enable}
															onChange={() => {
																handleEnableCategory(res._id, res.enable);
															}}
															type='checkbox'
															className='checkbox'
															title='active'
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
															<span>Edit Service Details</span>
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
															<span>Delete Service</span>
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					) : (
						<NoData
							title='No Data Found!'
							subTitle='We could not find any service category data.'
							height='40vh'
						/>
					)}
				</div>
			)}
			<AddService
				data={{
					addModalActive,
					handleAddModalClose,
					handleSubmit,
					selectUpdateModel,

					title,
					description,
					isMainService,
					charges,

					setTitle,
					setDescription,
					setCharges,

					titleError,
					chargesError,
					descriptionError,

					setTitleError,
					setChargesError,
					setDescriptionError,

					service,
					setService,
					serviceError,
					setServiceError,
				}}
			/>

			<DeleteService data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default ServiceCategoriesScreen;
