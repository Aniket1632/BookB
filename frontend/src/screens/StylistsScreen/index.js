import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import {
	changeStatusStylistAction,
	createNewStylistAction,
	createStylistSettingsAction,
	deleteStylistAction,
	getStylistListAction,
	getStylistSettingsAction
} from '../../redux/actions/stylistActions';
import { inputPhoneMasking, unMasking, validateEmail, validatePhone } from '../../utils/validators';
import { changePasswordUserAction } from '../../redux/actions/userActions';
import { CHANGE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants';
import {
	STYLER_RESET,
	CHANGE_STATUS_STYLER_RESET,
	CREATE_NEW_STYLER_RESET,
	DELETE_STYLER_RESET,
	CREATE_STYLIST_SETTINGS_RESET
} from '../../redux/constants/stylistConstants';
import CreateStylist from './CreateStylist';
import DeleteStylist from './DeleteStylist';
import StylistData from './StylistData';
import ChangePwdUser from '../UsersScreen/ChangePwdUser';
import Pagination from '../../components/Pagination';
import StylistSettings from './StylistSettings';
import NoData from '../../website/components/NoData';

const StylistsScreen = ({ showFilter = false, history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);

	const stylistList = useSelector((state) => state.stylistList);
	const createStylist = useSelector((state) => state.createStylist);
	const changeStatustylist = useSelector((state) => state.changeStatustylist);
	const deleteStylist = useSelector((state) => state.deleteStylist);
	const changePasswordUser = useSelector((state) => state.changePasswordUser);
	const addStylistSettings = useSelector((state) => state.addStylistSettings);
	const getStylistSettings = useSelector((state) => state.getStylistSettings);

	const [uploadFileData, setUploadFileData] = useState('');
	const [uploadFileDataError, setUploadFileDataError] = useState('');

	const [showAddModal, setShowAddModal] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
	const [stylistSettingsModal, setStylistSettingsModal] = useState(false);

	const [selectUpdateModel, setSelectUpdateModel] = useState({});
	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	const [id, setUserId] = useState('');
	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phone, setPhone] = useState('');
	const [phoneError, setPhoneError] = useState('');

	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [address, setAddress] = useState('');
	const [addressError, setAddressError] = useState('');
	const [imageSrc, setImageSrc] = useState('');
	const [imageSrcError, setImageSrcError] = useState('');
	const [search, setSearch] = useState('');

	//stylist settings
	const [serviceArray, setServiceArray] = useState({ value: '', error: '' });
	const [recurringType, setRecurringType] = useState({ value: 'month', error: '' });
	const [startTime, setStartTime] = useState({ value: '', error: '' });
	const [endTime, setEndTime] = useState({ value: '', error: '' });
	const [intervalTime, setIntervalTime] = useState({ value: '', error: '' });
	const [isCompulsory, setIsCompulsory] = useState(false);
	const [isCompulsoryError, setIsCompulsoryError] = useState('');
	// const [endTimeError, setEndTimeError] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'manager' ||
					getUserInfo.userInfo.data.role === 'admin' ||
					getUserInfo.userInfo.data.role === 'superadmin')
			) {
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

				return () => {
					dispatch({ type: STYLER_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch]
	);

	useEffect(
		() => {
			if (createStylist && createStylist.userInfo && createStylist.userInfo.status) {
				setSearch('');
				clearData();
				setShowAddModal(false);
				dispatch({ type: CREATE_NEW_STYLER_RESET });
				toast.success(createStylist.userInfo.message);
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createStylist && createStylist.userInfo && !createStylist.userInfo.status) {
				dispatch({ type: CREATE_NEW_STYLER_RESET });
				toast.error(createStylist.userInfo.message);
			}
		},
		// eslint-disable-next-line
		[createStylist, dispatch]
	);

	useEffect(
		() => {
			if (addStylistSettings && addStylistSettings.userInfo && addStylistSettings.userInfo.status) {
				clearDataSettings();
				dispatch({ type: CREATE_STYLIST_SETTINGS_RESET });
				toast.success(addStylistSettings.userInfo.message);
			} else if (addStylistSettings && addStylistSettings.userInfo && !addStylistSettings.userInfo.status) {
				dispatch({ type: CREATE_STYLIST_SETTINGS_RESET });
				toast.error(addStylistSettings.userInfo.message);
			}
		},
		// eslint-disable-next-line
		[addStylistSettings, dispatch]
	);

	useEffect(
		() => {
			if (deleteStylist && deleteStylist.userInfo && deleteStylist.userInfo.status) {
				toast.success(deleteStylist.userInfo.message);
				dispatch({ type: DELETE_STYLER_RESET });
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteStylist && deleteStylist.userInfo && !deleteStylist.userInfo.status) {
				toast.error(deleteStylist.userInfo.message);
				dispatch({ type: DELETE_STYLER_RESET });
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		// eslint-disable-next-line
		[deleteStylist, dispatch]
	);

	useEffect(
		() => {
			if (changeStatustylist && changeStatustylist.userInfo && changeStatustylist.userInfo.status) {
				toast.success(changeStatustylist.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_STATUS_STYLER_RESET });
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeStatustylist && changeStatustylist.userInfo && !changeStatustylist.userInfo.status) {
				toast.error(changeStatustylist.userInfo.message);
				dispatch({ type: CHANGE_STATUS_STYLER_RESET });
				dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		// eslint-disable-next-line
		[changeStatustylist, dispatch]
	);

	useEffect(
		() => {
			if (changePasswordUser && changePasswordUser.userInfo && changePasswordUser.userInfo.status) {
				toast.success(changePasswordUser.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(changePasswordUser.userInfo.message);
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			}
		},
		// eslint-disable-next-line
		[changePasswordUser, dispatch]
	);

	const handleAddModalClose = () => {
		clearData();
		setShowAddModal(false);
	};


	const handleSubmit = (e) => {
		e.preventDefault();

		if (name === '' && name.trim() === '') {
			setNameError('Please enter name');
		} else if (email === '' && email.trim() === '') {
			setEmailError('Please enter email address');
		} else if (!validateEmail(email)) {
			setEmailError('Please enter valid email address');
		} else if (phone === '' && phone.trim() === '') {
			setPhoneError('Please enter phone');
		} else if (!validatePhone(unMasking(phone))) {
			setPhoneError('Phone number must be 10 digits');
		} else if (address === '' && address.trim() === '') {
			setAddressError('Please enter address');
		} else if (id === '' && password === '') {
			setPasswordError('Please enter password');
		} else if (id === '' && password.length < 7) {
			setPasswordError('Password must be at least 8 characters');
		} else if (!imageSrc) {
			setUploadFileDataError('Please select files to upload');
		} else {
			let fileData = new FormData();
			if (id !== '') {
				fileData.append('id', id);
			} else {
				fileData.append('password', password);
			}

			fileData.append('name', name);
			fileData.append('email', email);
			fileData.append('address', address);
			fileData.append('phone', unMasking(phone));
			for (let i = 0; i < uploadFileData.length; i++) {
				fileData.append('image', uploadFileData[i]);
			}

			dispatch(createNewStylistAction(fileData));
		}
	};


	const handleSettingsModalClose = () => {
		clearDataSettings();
	};

	const clearDataSettings = () => {
		setSelectUpdateModel({});
		setStartTime({ value: '', error: '' })
		setEndTime({ value: '', error: '' })
		setRecurringType({ value: '', error: '' })
		setServiceArray({ value: '', error: '' })
		setIntervalTime({ value: '', error: '' })
		setIsCompulsory('');
		setIsCompulsoryError('');
		setStylistSettingsModal(false);
	}

	const settingsSubmitHandler = (e) => {
		e.preventDefault();
		let services = serviceArray.value;
		if (startTime.value === '' && startTime.value === '') {
			setStartTime({ value: '', error: 'Please enter start time' });
		} else if (endTime.value === '' && endTime.value.trim() === '') {
			setEndTime({ value: '', error: 'Please enter end time' });
		} else if (recurringType.value === '' && recurringType.value.trim() === '') {
			setRecurringType({ ...recurringType, error: 'Please select recurring type' });
		} else if (intervalTime.value === '' && intervalTime.value.trim() === '') {
			setIntervalTime({ value: '', error: 'Please enter interval time' });
		} else if (services === '' && !services.length) {
			setServiceArray('Please select services');
		} else {
			let serviceArrayTmp = [];
			for (let i = 0; i < services.length; i++) {
				serviceArrayTmp.push(services[i]._id);
			}
			// makePublic: makePublic.value,
			dispatch(createStylistSettingsAction({
				id: selectUpdateModel._id,
				recurringType: recurringType.value,
				intervalTime: intervalTime.value,
				startTime: startTime.value,
				endTime: endTime.value,
				services: serviceArrayTmp.toString(),
				isBreakTimeCompulsory: isCompulsory
			}));
		}
	};


	const onDeleteModalClose = () => {
		setSelectUpdateModel({});
		setModalDeleteState(false);
	};

	const onDeleteHandler = (d) => {
		dispatch(deleteStylistAction(selectUpdateModel._id));
		dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
		onDeleteModalClose();
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getStylistListAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const onChangeHandler = (d) => {
		dispatch(
			changeStatusStylistAction(d._id, {
				enable: d.active ? true : false
			})
		);
	};

	const clearData = () => {
		setSelectUpdateModel({});
		setUserId('');
		setEmail('');
		setPassword('');
		setPhone('');
		setAddress('');
		setName('');
		setEmailError('');
		setPasswordError('');
		setPhoneError('');
		setAddressError('');
		setNameError('');
		setImageSrc('');
		setImageSrcError('');
		// setCompany('');
		// setCompanyError('');
	};

	const handleEditModalStylist = (d) => {
		setUserId(d._id);
		setEmail(d.email);
		setPhone(inputPhoneMasking(d.phone));
		setName(d.name);
		setAddress(d.address);
		setImageSrc(d.photo);
		// setCompany(d.company);
		setShowAddModal(true);
	};

	const onChangePwdUserHandler = () => {
		let d = selectUpdateModel;
		let type = 'byAdmin';
		dispatch(changePasswordUserAction({ id: d._id, type, email: d.email }));
		onChangePwdModalClose();
	};

	const onChangePwdModalClose = () => {
		setModalChangePasswordState(false);
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getStylistListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	return (
		<Content
			currentMenu='stylist'
			headerTitle='Stylist'
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
			addBtnText='Add New Stylist'
			addBtnIcon='plus'
			addBtnClick={() => setShowAddModal(true)}
			search={true}
			searchPlaceholder='Search Stylists...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{stylistList.loading ? (
				<Spinner />
			) : stylistList &&
				stylistList.userInfo &&
				stylistList.userInfo.status &&
				stylistList.userInfo.data.result &&
				stylistList.userInfo.data.result.length > 0 ? (
				<div>
					<StylistData
						data={stylistList.userInfo.data.result}
						showFilter={showFilter}
						setShowAddModal={setShowAddModal}
						setModalDeleteState={setModalDeleteState}
						setSelectUpdateModel={setSelectUpdateModel}
						handleEditModalStylist={handleEditModalStylist}
						onChangeHandler={onChangeHandler}
						setModalChangePasswordState={setModalChangePasswordState}
						setStylistSettingsModal={setStylistSettingsModal}
					/>
					{totalPageSize > 1 && (
						<div className='tableContainer--paginater'>
							<Pagination
								list={stylistList.userInfo}
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
					subTitle='We could not find any stylist data.'
					height='40vh'
				/>
			)}

			<CreateStylist
				data={{
					name,
					email,
					password,
					address,
					phone,

					setUserId,
					setEmail,
					setPhone,
					setName,
					setAddress,
					setPassword,

					emailError,
					phoneError,
					nameError,
					passwordError,
					addressError,

					setEmailError,
					setPhoneError,
					setNameError,
					setAddressError,
					setPasswordError,

					// companyList,
					// company,
					// setCompany,
					// companyError,

					showAddModal,
					selectUpdateModel,
					handleAddModalClose,
					handleSubmit,

					imageSrc,
					setImageSrc,
					imageSrcError,
					setImageSrcError,
					setUploadFileData,
					uploadFileDataError,
					setUploadFileDataError
				}}
			/>
			<DeleteStylist data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
			<ChangePwdUser data={{ modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler }} />

			<StylistSettings
				data={{
					startTime, setStartTime,
					endTime, setEndTime,
					recurringType, setRecurringType,
					intervalTime, setIntervalTime,
					serviceArray, setServiceArray,
					selectUpdateModel,
					getStylistSettings,
					stylistSettingsModal,
					handleSettingsModalClose,
					settingsSubmitHandler,
					isCompulsory,
					setIsCompulsory,
					isCompulsoryError,
					setIsCompulsoryError
				}} />

		</Content>
	);
};

export default StylistsScreen;
