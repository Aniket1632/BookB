import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import {
	createServiceAction,
	deleteServiceAction,
	getAllServiceAction,
	changeServiceStatusAction,
	getAllEnableServiceAction,
	updateRankServiceAction
} from '../../redux/actions/serviceActions';
import {
	ADD_SERVICE_RESET,
	CHANGE_SERVICE_STATUS_RESET,
	DELETE_SERVICE_RESET,
	GET_ALL_ENABLE_SERVICE_RESET,
	GET_ALL_SERVICE_RESET,
	UPDATE_RANK_SERVICE_RESET
} from '../../redux/constants/serviceConstants';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import AddService from './AddService';
import DeleteService from './DeleteService';
import ServiceStyle from './Service.module.css';
import NoData from '../../website/components/NoData';

const ServiceScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const [addModalActive, setAddModalActive] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});

	const serviceList = useSelector((state) => state.serviceList);
	const createService = useSelector((state) => state.createService);
	const deleteService = useSelector((state) => state.deleteService);
	const changeServiceStatus = useSelector((state) => state.changeServiceStatus);
	const enableServiceList = useSelector((state) => state.enableServiceList);
	const updateRankService = useSelector((state) => state.updateRankService);

	const [modalDeleteState, setModalDeleteState] = useState(false);


	const [id, setServiceId] = useState('');
	const [search, setSearch] = useState('');
	const [filterId, setFilterId] = useState('');

	const [title, setTitle] = useState('');
	const [titleError, setTitleError] = useState('');
	const [isMainService, setIsMainService] = useState(false);

	const [description, setDescription] = useState('');
	const [descriptionError, setDescriptionError] = useState('');
	const [charges, setCharges] = useState('');
	const [chargesError, setChargesError] = useState('');
	const [service, setService] = useState('');
	const [serviceError, setServiceError] = useState('');

	const [minutes, setMinutes] = useState(0);
	const [minutesError, setMinutesError] = useState('');
	const [hours, setHours] = useState(0);
	const [hoursError, setHoursError] = useState('');
	const [stylistArray, setStylistArray] = useState('');
	const [stylistArrayError, setStylistArrayError] = useState('');
	const [totalPageSize, setTotalPageSize] = useState(1);

	const [leadTime, setLeadTime] = useState({ value: 0, type: 'Mins' });
	const [leadTimeError, setLeadTimeError] = useState('');


	const [breakTime, setBreakTime] = useState({ value: 0, type: 'Mins' });
	const [breakTimeError, setBreakTimeError] = useState('');

	const [pageNumber, setPageNumber] = useState(1);
	const [serviceListArr, setServiceListArr] = useState([])
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
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch(getAllEnableServiceAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
			} else {
				history.push('/');
			}

			return () => {
				dispatch({ type: GET_ALL_SERVICE_RESET });
				dispatch({ type: GET_ALL_ENABLE_SERVICE_RESET });
			};
		},
		[history, getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (!serviceListArr.length) {
				if (serviceList &&
					serviceList.categories &&
					serviceList.categories.data &&
					serviceList.categories.data.result.length > 0) {
					setServiceListArr(serviceList.categories.data.result);
				}
			}
		},
		[serviceList, serviceListArr]
	);

	useEffect(
		() => {
			if (createService && createService.category && createService.category.status) {
				clearData();
				setAddModalActive(false);
				setServiceListArr([]);
				toast.success(createService.category.message);
				dispatch({ type: ADD_SERVICE_RESET });
				dispatch({ type: GET_ALL_ENABLE_SERVICE_RESET });
				dispatch(getAllEnableServiceAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createService && createService.category && !createService.category.status) {
				dispatch({ type: ADD_SERVICE_RESET });
				toast.error(createService.category.message);
			}
		},
		[createService, dispatch]
	);

	useEffect(
		() => {
			if (updateRankService && updateRankService.categories && updateRankService.categories.status) {
				toast.success(updateRankService.categories.message);
				dispatch({ type: UPDATE_RANK_SERVICE_RESET });
			} else if (updateRankService && updateRankService.categories && !updateRankService.categories.status) {
				dispatch({ type: UPDATE_RANK_SERVICE_RESET });
				toast.error(updateRankService.categories.message);
			}
		},
		[updateRankService, dispatch]
	);


	useEffect(
		() => {
			if (deleteService && deleteService.category && deleteService.category.status) {
				toast.success(deleteService.category.message);
				dispatch({ type: DELETE_SERVICE_RESET });
				setServiceListArr([])
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteService && deleteService.category && !deleteService.category.status) {
				toast.error(deleteService.category.message);
				dispatch({ type: DELETE_SERVICE_RESET });
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteService, dispatch]
	);

	useEffect(
		() => {
			if (changeServiceStatus && changeServiceStatus.category && changeServiceStatus.category.status) {
				toast.success(changeServiceStatus.category.message);
				setSelectUpdateModel({});
				setServiceListArr([])
				dispatch({ type: CHANGE_SERVICE_STATUS_RESET });
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeServiceStatus && changeServiceStatus.category && !changeServiceStatus.category.status) {
				toast.error(changeServiceStatus.category.message);
				dispatch({ type: CHANGE_SERVICE_STATUS_RESET });
				dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[changeServiceStatus, dispatch]
	);

	const handleAddModalClose = () => {
		clearData();
		setSelectUpdateModel({});
		setAddModalActive(false);
		setIsMainService(false);
	};

	const handleEditButton = async (d, isMain) => {
		if (isMain) {
			setServiceId(d.category._id);
			setTitle(d.category.title);
			setSelectUpdateModel(d.category);
			setIsMainService(isMain);
			setAddModalActive(true);
		} else {
			setTitle(d.title);
			setServiceId(d._id);
			setService(d.service);
			setIsMainService(isMain);
			setLeadTime({ ...leadTime, value: d.leadTime });
			setBreakTime({ ...breakTime, value: d.breakTime });
			setDescription(d.description);
			setCharges(d.charges);
			if (d && d.requiredTime >= 60) {
				setMinutes(d.requiredTime % 60)
				setHours((d.requiredTime / 60).toFixed(0));
			}
			setSelectUpdateModel(d);
			setAddModalActive(true);
		}
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
		setHours('');
		setMinutes('');
		setHoursError('');
		setLeadTimeError('');
		setLeadTime({ value: 0, type: 'Mins' });
		setBreakTime({ value: 0, type: 'Mins' });
		setBreakTimeError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isMainService) {
			if (title === '' && title.trim() === '') {
				setTitleError('Please enter title');
			} else {
				if (id !== '') {
					dispatch(createServiceAction({ id, title, isMainService, description, charges }));
				} else {
					dispatch(createServiceAction({ title, isMainService, description, charges }));
				}
			}
		} else {
			let requiredTime = (+hours * 60) + (+minutes);
			if (title === '' && title.trim() === '') {
				setTitleError('Please enter name');
			} else if (service === '' && service.trim() === '') {
				setServiceError('Please select service');
			} else if (requiredTime == '' && requiredTime == 0) {
				setHoursError('Please select hours or minutes');
			} else if (charges === '' && charges.trim() === '') {
				setChargesError('Please enter charges');
			} else if (description === '' && description.trim() === '') {
				setDescriptionError('Please enter description');
			} else {
				let lead_time = leadTime.value;
				let break_time = breakTime.value;
				if (breakTime.type === 'Hours') { break_time = (+breakTime.value * 60); }
				if (leadTime.type === 'Hours') { lead_time = (+leadTime.value * 60); }
				if (id !== '') {
					dispatch(createServiceAction({ id, title, requiredTime, isMainService, description, charges, service, leadTime: +lead_time, breakTime: +break_time }));
				} else {
					dispatch(createServiceAction({ title, requiredTime, isMainService, description, charges, service, leadTime: +lead_time, breakTime: +break_time }));
				}
			}
		}
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
		dispatch(getAllServiceAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	const handleEnableCategory = (id, enableStatus) => {
		dispatch(
			changeServiceStatusAction(id, {
				enable: enableStatus ? false : true
			})
		);
	};

	const onDragEnd = (e) => {
		if (!e.destination) {
			return;
		}
		const sorted = reorder(serviceListArr, e.source.index, e.destination.index);
		setServiceListArr(sorted);
		updateRankServiceHandler(sorted);
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};



	const onDragEndChildTable = (e, arr) => {
		if (!e.destination) {
			return;
		}
		const sorted = reorder(arr.subService, e.source.index, e.destination.index);
		serviceListArr[0].subService = sorted;
		setServiceListArr([...serviceListArr]);
	};



	const updateRankServiceHandler = (arr) => {
		let ids = [];
		if (arr.length > 0) {
			arr.map((itm, index) => (
				ids.push({
					"_id": itm._id,
					"rank": index
				})
			)) 
			dispatch(updateRankServiceAction({ ids: ids }));
		}
	}
 
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
			{serviceList && serviceList.loading ? (
				<Spinner />
			) : (
				<div>
					{serviceList &&
						serviceList.categories &&
						serviceList.categories.data &&
						serviceList.categories.data.result &&
						serviceList.categories.data.result.length > 0 ? (
						<div className='tableContainer' style={{ height: '80vh' }}>
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable droppableId="Table">
									{mainProvided => (
										<table className='table table-service-container main-table-contain' {...mainProvided.droppableProps} ref={mainProvided.innerRef}>
											<thead>
												<tr>
													<th>#</th>
													<th>Service Title</th>
													<th>Duration</th>
													<th>Price</th>
													<th>Active Status</th>
													<th />
												</tr>
											</thead>
											<tbody>

												{serviceListArr &&
													serviceListArr.length > 0 &&
													serviceListArr.map((mainItem, mainIndex) => (

														<Draggable
															key={mainItem._id}
															draggableId={mainItem._id}
															index={mainIndex}
														>
															{mainProvided => (

																//tr tag
																<tr key={mainIndex + 1}
																	ref={mainProvided.innerRef}
																	{...mainProvided.draggableProps}
																	{...mainProvided.dragHandleProps}
																>

																	<td colSpan={6} style={{ padding: '0rem', margin: '0rem' }}>

																		<DragDropContext onDragEnd={(e) => { onDragEndChildTable(e, mainItem) }}>
																			<Droppable droppableId="ChildTable">
																				{provided => (

																					<table {...provided.droppableProps} ref={provided.innerRef}
																						className='table table-service-container table-contain'>
																						<thead>
																							<tr className='accordianContainer'>
																								<td colSpan={4} className='expandable-icon textCapitalize'>
																									<div style={{ display: 'flex', alignItems: 'center' }}>
																										<button className='accordianContainer__button' style={{ backgroundColor: '#0000' }}>
																											<svg className='accordianContainer--icon-move'>
																												<use xlinkHref={`/assets/sprite.svg#icon-drag_indicator`} />
																											</svg>
																											<span>Move table up or down</span>
																										</button>
																										{mainItem.category.title}
																									</div>
																								</td>
																								<td>
																									<label className='switch'>
																										<input
																											checked={mainItem.category.enable}
																											onChange={() => {
																												handleEnableCategory(mainItem._id, mainItem.category.enable);
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
																										<button className='table__button' onClick={() => handleEditButton(mainItem, true)}>
																											<svg className='table__button--icon'>
																												<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
																											</svg>
																										</button>
																										<button
																											className='table__button table__button--delete'
																											onClick={() => {
																												setSelectUpdateModel(mainItem.category);
																												setModalDeleteState(true);
																											}}>
																											<svg className='table__button--icon-red'>
																												<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
																											</svg>
																										</button>
																									</div>
																								</td>
																							</tr>
																						</thead>
																						<tbody>
																							{mainItem.subService.length > 0 ? (
																								mainItem.subService.map((res, index) => (
																									<Draggable
																										key={res._id}
																										draggableId={res._id}
																										index={index}
																									>
																										{provided => (

																											<tr
																												className='expandable'
																												key={index + 1}
																												ref={provided.innerRef}
																												{...provided.draggableProps}
																												{...provided.dragHandleProps}
																											>

																												<td className='expandable-icon'>
																													<div style={{ display: 'flex', alignItems: 'center' }}>
																														<button className='accordianContainer__button' style={{ backgroundColor: '#0000' }}>
																															<svg className='accordianContainer--icon-move'>
																																<use xlinkHref={`/assets/sprite.svg#icon-drag_indicator`} />
																															</svg>
																															<span>Move row up or down</span>
																														</button>
																														{index + 1}
																													</div>
																												</td>
																												<td>{res.title}</td>
																												<td>{res.requiredTime} m</td>
																												<td>$ {res.charges}</td>
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
																														<button className='table__button' onClick={() => handleEditButton(res, false)}>
																															<svg className='table__button--icon'>
																																<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
																															</svg>
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
																														</button>
																													</div>
																												</td>
																											</tr>
																										)}
																									</Draggable>
																								))
																							) : (
																								<tr>
																									<td colSpan="5">
																										<div className='not_data_found'>
																											<h1>No data found !</h1>
																										</div>																			</td>
																								</tr>
																							)
																							}
																						</tbody>
																					</table>
																				)}
																			</Droppable>
																		</DragDropContext>
																	</td>
																</tr>
															)}
														</Draggable>
													))
												}
											</tbody>

										</table>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					) : (
						<NoData
							title='No Data Found!'
							subTitle='We could not find any service data.'
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
					enableServiceList,

					title,
					setTitle,
					isMainService,
					setIsMainService,

					service,
					charges,
					description,

					setDescription,
					setCharges,

					titleError,
					chargesError,
					descriptionError,

					setTitleError,
					setChargesError,
					setDescriptionError,

					setService,
					serviceError,
					setServiceError,

					minutes,
					setMinutes,
					hours,
					setHours,
					hoursError,
					setHoursError,


					stylistArray,
					setStylistArray,
					stylistArrayError,
					setStylistArrayError,

					leadTime,
					setLeadTime,
					leadTimeError,
					setLeadTimeError,


					breakTime,
					setBreakTime,
					breakTimeError,
					setBreakTimeError
				}}
			/>

			<DeleteService data={{ selectUpdateModel, modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default ServiceScreen;
