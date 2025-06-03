import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import AppversionStyle from './Appversion.module.css';
import AddAppVersion from './AddAppVersion';
import {
	changeAppVersionStatusAction,
	createAppVersionAction,
	deleteAppVersionAction,
	getAllAppVersionAction
} from '../../redux/actions/appVersionActions';
import {
	ADD_APP_VERSION_RESET,
	CHANGE_APP_VERSION_STATUS_RESET,
	DELETE_APP_VERSION_RESET
} from '../../redux/constants/appVersionConstants';
import DeleteAppVersion from './DeleteAppVersion';
import Pagination from '../../components/Pagination';
import NoData from '../../components/NoData';
import { getAllEnabledSalonListAction } from '../../redux/actions/salonActions';

const AppVersionScreen = ({ history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const [addModalActive, setAddModalActive] = useState(false);

	const appVersionList = useSelector((state) => state.appVersionList);
	const createAppVersion = useSelector((state) => state.createAppVersion);
	const changeAppVersionStatus = useSelector((state) => state.changeAppVersionStatus);
	const deleteAppVersion = useSelector((state) => state.deleteAppVersion);
	const salonEnabledList = useSelector((state) => state.salonEnabledList);

	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});
	const [salonList, setSalonList] = useState([]);

	const [versionTitleAndroid, setVersionTitleAndroid] = useState('');
	const [versionTitleAndroidError, setVersionTitleAndroidError] = useState('');

	const [androidStoreURL, setAndroidStoreURL] = useState('');
	const [androidStoreURLError, setAndroidStoreURLError] = useState('');

	const [versionTitleIOS, setVersionTitleIOS] = useState('');
	const [versionTitleIOSError, setVersionTitleIOSError] = useState('');

	const [iosStoreURL, setIOSStoreURL] = useState('');
	const [iosStoreURLError, setIOSStoreURLError] = useState('');

	const [versionDescription, setVersionDescription] = useState('');
	const [versionDescriptionError, setVersionDescriptionError] = useState('');
	const [isCompulsory, setIsCompulsory] = useState(false);
	const [isCompulsoryError, setIsCompulsoryError] = useState('');

	const [salon, setSalonId] = useState('');
	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	useEffect(
		() => {
			if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				getUserInfo.userInfo.data.role === 'admin'
			) {
				dispatch(getAllEnabledSalonListAction());
			} else {
				history.push('/');
			}
		},
		[history, getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (
				salonEnabledList &&
				salonEnabledList.userInfo &&
				salonEnabledList.userInfo.data &&
				salonEnabledList.userInfo.data.result &&
				salonEnabledList.userInfo.data.result.length > 0
			) {
				let tmparr = salonEnabledList.userInfo.data.result.map((item) => ({ ...item, label: item.name, value: item._id }));
				setSalonList(tmparr);
				if (salonList && salonList.length > 0) {
					setSalonId(salonList[0]._id);
				}
			}
		},
		[salonEnabledList, dispatch]
	);

	useEffect(
		() => {
			if (salon && salon.trim() !== '') {
				dispatch(getAllAppVersionAction({ salon: salon, pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[salon, dispatch]
	);


	useEffect(
		() => {
			if (createAppVersion && createAppVersion.category && createAppVersion.category.status) {
				clearData();
				setAddModalActive(false);
				toast.success(createAppVersion.category.message);
				dispatch({ type: ADD_APP_VERSION_RESET });
				dispatch(getAllAppVersionAction({ salon: salon, pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createAppVersion && createAppVersion.category && !createAppVersion.category.status) {
				dispatch({ type: ADD_APP_VERSION_RESET });
				toast.error(createAppVersion.category.message);
			}
		},
		[createAppVersion, dispatch]
	);

	useEffect(
		() => {
			if (changeAppVersionStatus && changeAppVersionStatus.category && changeAppVersionStatus.category.status) {
				clearData();
				setAddModalActive(false);
				toast.success(changeAppVersionStatus.category.message);
				dispatch({ type: CHANGE_APP_VERSION_STATUS_RESET });
				dispatch(getAllAppVersionAction({ salon: salon, pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeAppVersionStatus && changeAppVersionStatus.category && !changeAppVersionStatus.category.status) {
				dispatch({ type: CHANGE_APP_VERSION_STATUS_RESET });
				toast.error(changeAppVersionStatus.category.message);
			}
		},
		[changeAppVersionStatus, dispatch]
	);

	useEffect(
		() => { 
			if (deleteAppVersion && deleteAppVersion.category && deleteAppVersion.category.status) {
				clearData();
				setAddModalActive(false);
				toast.success(deleteAppVersion.category.message);
				dispatch({ type: DELETE_APP_VERSION_RESET });
				dispatch(getAllAppVersionAction({ salon: salon, pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteAppVersion && deleteAppVersion.category && !deleteAppVersion.category.status) {
				dispatch({ type: DELETE_APP_VERSION_RESET });
				toast.error(deleteAppVersion.category.message);
			}
		},
		[deleteAppVersion, dispatch]
	);

	const clearData = () => {
		setVersionTitleAndroid('');
		setVersionTitleAndroidError('');
		setVersionTitleIOS('');
		setVersionTitleIOSError('');
		setVersionDescription('');
		setVersionDescriptionError('');
		setIsCompulsory(false);
		setIsCompulsoryError('');
		setSelectUpdateModel({});

		setAndroidStoreURL('');
		setAndroidStoreURLError('');
		setIOSStoreURL('');
		setIOSStoreURLError('');
	};

	const handleAddModalClose = () => {
		clearData();
		setAddModalActive(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (versionTitleAndroid === '' && versionTitleAndroid.trim() === '') {
			setVersionTitleAndroidError('Please enter android version number');
		} else if (versionTitleIOS === '' && versionTitleIOS.trim() === '') {
			setVersionTitleIOSError('Please enter ios version number');
		} else if (androidStoreURL === '' && androidStoreURL.trim() === '') {
			setAndroidStoreURLError('Please enter package name');
		} else if (iosStoreURL === '' && iosStoreURL.trim() === '') {
			setIOSStoreURLError('Please enter bundle ID');
		} else {
			dispatch(createAppVersionAction({
				salon,
				versionTitleIOS,
				versionTitleAndroid,
				packageName: androidStoreURL,
				bundleID: iosStoreURL,
				versionDescription,
				isCompulsory
			}));
		}
	};

	const onChangeHandler = (d) => {
		dispatch(
			changeAppVersionStatusAction(d._id, {
				salon: salon,
				enable: d.enable ? true : false
			})
		);
	};

	const onDeleteModalClose = () => {
		clearData();
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteAppVersionAction(selectUpdateModel._id, salon));
		onDeleteModalClose();
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllAppVersionAction({ salon: salon, pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const onSalonChange = async (item) => {
		setSalonId(item);
		// var salon = salonList.find(item => item._id === item);
		// setAndroidStoreURL(salon.androidStoreURL);
		// setIOSStoreURL(salon.iosStoreURL);
		// dispatch(getAllAppVersionAction({ salon: salon, pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
	}

	return (
		<Content
			currentMenu='appversion'
			headerTitle='App Version'
			addBtn={
				getUserInfo &&
					getUserInfo.userInfo &&
					getUserInfo.userInfo.data &&
					getUserInfo.userInfo.data.role === 'admin' ? (
					true
				) : (
					false
				)
			}
			addBtnText='Add App Version'
			addBtnIcon='plus'
			addBtnClick={() => setAddModalActive(true)}
			search={false}
			searchPlaceholder=''
			searchIcon='search'
			listFilter={true}
			listType={salon}
			getTypeList={salonList}
			onTypeListChange={(e) => { onSalonChange(e) }}
		>
			<div className='tableContainer' style={{ height: '65vh' }}>
				<table className='table'>
					<thead>
						<tr>
							<th>#</th>
							<th>
								Version( Android &nbsp;
								<svg className='table__button--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-android`} />
								</svg>{' '}
								)
							</th>
							<th>
								Version( iOS &nbsp;
								<svg className='table__button--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-apple`} />
								</svg>)
							</th>
							<th>Description</th>
							<th>Compulsory</th>
							<th>Status</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{appVersionList && appVersionList.loading ? (
							<tr>
								<td colSpan='7' style={{ textAlign: 'center' }}>
									<Spinner />
								</td>
							</tr>
						) : appVersionList &&
							appVersionList.categories &&
							appVersionList.categories.data &&
							appVersionList.categories.data.length > 0 ? (
							appVersionList.categories.data.map((res, index) => (
								<tr key={res._id}>
									<td>{index + 1}</td>
									<td>{res.versionTitleAndroid}</td>
									<td>{res.versionTitleIOS}</td>
									<td className='text_wrap_desc'>{res.versionDescription}</td>
									<td>{res.isCompulsory ? 'Yes' : 'No'}</td>

									<td>
										<label className='switch'>
											<input
												id={res._id}
												checked={res.enable}
												onChange={() => {
													onChangeHandler(res);
												}}
												type='checkbox'
												className='checkbox'
												name='active'
											/>
											<span className='slider round' />
										</label>
									</td>
									<td>
										{!res.enable && (
											<button
												className='table__button table__button--delete'
												onClick={() => {
													setSelectUpdateModel(res);
													setModalDeleteState(true);
												}}>
												<svg className='table__button--icon-red'>
													<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
												</svg>
												<span>Delete Version</span>
											</button>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan='7' style={{ textAlign: 'center' }}>
									<NoData
										title='No Data Found!'
										subTitle='We could not find any app version. Please add one'
										height='40vh'
									/>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{totalPageSize > 1 && (
					<div className='tableContainer--paginater'>
						<Pagination
							list={appVersionList.categories}
							onPageChange={handlePageChange}
							rowsPerPage={pageLimit}
							totalPageSize={totalPageSize}
							pageNumber={pageNumber}
						/>
					</div>
				)}
			</div>

			<AddAppVersion
				data={{
					addModalActive,
					handleAddModalClose,
					handleSubmit,

					versionTitleAndroid,
					setVersionTitleAndroid,
					versionTitleAndroidError,
					setVersionTitleAndroidError,
					versionTitleIOS,
					setVersionTitleIOS,
					versionTitleIOSError,
					setVersionTitleIOSError,
					versionDescription,
					setVersionDescription,
					versionDescriptionError,
					setVersionDescriptionError,
					isCompulsory,
					setIsCompulsory,
					isCompulsoryError,
					setIsCompulsoryError,

					androidStoreURL,
					setAndroidStoreURL,
					iosStoreURL,
					setIOSStoreURL,
					androidStoreURLError,
					setAndroidStoreURLError,
					iosStoreURLError,
					setIOSStoreURLError
				}}
			/>

			<DeleteAppVersion data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default AppVersionScreen;
