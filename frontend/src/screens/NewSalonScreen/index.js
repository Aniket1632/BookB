import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../../components/Content/Content';
import Spinner from '../../components/Spinner/Spinner';
import { changeStatusSalonAction, createNewSalonAction, deleteSalonAction, getSalonListAction } from '../../redux/actions/salonActions';
import DeleteSalon from './DeleteSalon';
import SalonData from './SalonData';
import CreateEditSalon from './CreateEditSalon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import SalonsStyle from './Salon.module.css';
import { CHANGE_MENU_SETTINGS_RESET, CHANGE_STATUS_SALON_RESET, CREATE_NEW_SALON_RESET, DELETE_SALON_RESET, SALON_RESET } from '../../redux/constants/salonConstants';
import { inputPhoneMasking, unMasking, validateEmail, validateOnlyNumber, validatePassword, validatePhone } from '../../utils/validators';
import ChangePwdUser from '../UsersScreen/ChangePwdUser';
import { changePasswordUserAction } from '../../redux/actions/userActions';
import { CHANGE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants';
import MenuSettingUser from './MenuSettingUser';
import { changeMenuSettingsAction } from '../../redux/actions/salonActions';
import Pagination from '../../components/Pagination';
import NoData from '../../website/components/NoData';
import { cancelSubscriptionAction } from '../../redux/actions/subscriptionAction';
import CancelSubscription from './CancelSubscription';
import { GET_CANCEL_SUBSCRIPTION_RESET } from '../../redux/constants/SubscriptionConstants';



const SalonScreen = ({ showFilter = false, history }) => {
	const dispatch = useDispatch();
	const getUserInfo = useSelector((state) => state.getUserInfo);

	const userInfo = useSelector((state) => state.userLogin);
	const createSalon = useSelector((state) => state.createSalon);
	const changeStatusSalon = useSelector((state) => state.changeStatusSalon);
	const deleteSalon = useSelector((state) => state.deleteSalon);
	const changePasswordUser = useSelector((state) => state.changePasswordUser);
	const changeAppMenuSetting = useSelector((state) => state.changeAppMenuSetting);
	const cancelSubscription = useSelector((state) => state.cancelSubscription);

	const salonList = useSelector((state) => state.salonList);
	const [showAddModal, setShowAddModal] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});
	const [uploadFileData, setUploadFileData] = useState('');
	const [uploadFileDataError, setUploadFileDataError] = useState('');
	const [id, setSalonId] = useState('');
	const [imageSrc, setImageSrc] = useState('');
	const [imageSrcError, setImageSrcError] = useState('');
	const [modalSettingState, setModalSettingState] = useState(false);
	const [appMenu, setAppMenu] = useState({});
	const [modalCancelSubscription, setModalCancelSubscription] = useState(false);


	const [search, setSearch] = useState('');
	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;


	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [address, setAddress] = useState('');
	const [addressError, setAddressError] = useState('');
	const [phone, setPhone] = useState('');
	const [phoneError, setPhoneError] = useState('');


	useEffect(
		() => {
			if (getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'admin')) {
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

				return () => {
					dispatch({ type: SALON_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch]
	);


	useEffect(
		() => {
			if (salonList &&
				salonList.userInfo &&
				salonList.userInfo.status &&
				salonList.userInfo.data.result.length > 0) {
				setTotalPageSize(salonList.userInfo.data.totalPageSize)
			}
		},
		[salonList]
	);

	useEffect(
		() => {
			if (createSalon && createSalon.userInfo && createSalon.userInfo.status) {
				clearData();
				setShowAddModal(false);
				setSearch('');
				toast.success(createSalon.userInfo.message);
				dispatch({ type: CREATE_NEW_SALON_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createSalon && createSalon.userInfo && !createSalon.userInfo.status) {
				dispatch({ type: CREATE_NEW_SALON_RESET });
				toast.error(createSalon.userInfo.message);
			}
		},
		[createSalon, dispatch]
	);

	useEffect(
		() => {
			if (deleteSalon && deleteSalon.userInfo && deleteSalon.userInfo.status) {
				toast.success(deleteSalon.userInfo.message);
				dispatch({ type: DELETE_SALON_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteSalon && deleteSalon.userInfo && !deleteSalon.userInfo.status) {
				toast.error(deleteSalon.userInfo.message);
				dispatch({ type: DELETE_SALON_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteSalon, dispatch]
	);

	useEffect(
		() => {
			if (changeStatusSalon && changeStatusSalon.userInfo && changeStatusSalon.userInfo.status) {
				toast.success(changeStatusSalon.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_STATUS_SALON_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeStatusSalon && changeStatusSalon.userInfo && !changeStatusSalon.userInfo.status) {
				toast.error(changeStatusSalon.userInfo.message);
				dispatch({ type: CHANGE_STATUS_SALON_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}

		},
		[changeStatusSalon, dispatch]
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
		[changePasswordUser, dispatch]
	);

	useEffect(
		() => {
			if (changeAppMenuSetting && changeAppMenuSetting.userInfo && changeAppMenuSetting.userInfo.status) {
				toast.success(changeAppMenuSetting.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_MENU_SETTINGS_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeAppMenuSetting && changeAppMenuSetting.userInfo && !changeAppMenuSetting.userInfo.status) {
				toast.error(changeAppMenuSetting.userInfo.message);
				dispatch({ type: CHANGE_MENU_SETTINGS_RESET });
			}
		},
		[changeAppMenuSetting, dispatch]
	);


	useEffect(
		() => {
			if (cancelSubscription && cancelSubscription.data && cancelSubscription.data.status) {
				toast.success(cancelSubscription.data.message);
				setSelectUpdateModel({});
				setModalCancelSubscription(false);
				dispatch({ type: GET_CANCEL_SUBSCRIPTION_RESET });
				dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (cancelSubscription && cancelSubscription.data && !cancelSubscription.data.status) {
				toast.error(cancelSubscription.data.message);
				dispatch({ type: GET_CANCEL_SUBSCRIPTION_RESET });
			}
		},
		[cancelSubscription, dispatch]
	);



	const clearData = () => {
		setSalonId('');
		setEmail('');
		setPhone('');
		setAddress('');
		setName('');
		setEmailError('');
		setPassword('');
		setPasswordError('');
		setPhoneError('');
		setAddressError('');
		setNameError('');
		setImageSrc('');
		setImageSrcError('');
		setSelectUpdateModel({})
	}

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
		} else if (!imageSrc) {
			setUploadFileDataError('Please select files to upload');
		} else if (id === '' && !validatePassword(password)) {
			setPasswordError('Please enter password');
		} else if (id === '' && password.length < 7) {
			setPasswordError('Password must be at least 8 characters');
		}
		else {
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

			dispatch(createNewSalonAction(fileData));

		}
	};

	const onDeleteModalClose = () => {
		setSelectUpdateModel({});
		setModalDeleteState(false);
	};


	const onDeleteHandler = () => {
		dispatch(deleteSalonAction(selectUpdateModel._id));
		onDeleteModalClose();
	};


	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getSalonListAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};


	const onChangeHandler = (d) => {
		dispatch(changeStatusSalonAction(d._id, {
			"enable": d.active ? true : false,
		}));
	};


	const onCancelSubscriptionHandler = () => {
		let d = selectUpdateModel;
		dispatch(cancelSubscriptionAction(d._id));
	};

	const onCancelSubscriptionModalClose = () => {
		setSelectUpdateModel({});
		setModalCancelSubscription(false);
	};

	const handleEditModalSalon = (d) => {
		setSalonId(d._id);
		setEmail(d.email);
		setPhone(inputPhoneMasking(d.phone));
		setName(d.name);
		setAddress(d.address);
		setImageSrc(d.photo);
		setShowAddModal(true);
	};


	const onChangePwdModalClose = () => {
		setModalChangePasswordState(false);
	};

	const onChangePwdUserHandler = () => {
		let d = selectUpdateModel;
		let type = 'byAdmin';
		dispatch(changePasswordUserAction({ 'id': d._id, type, 'email': d.email }));
		onChangePwdModalClose();
	};




	const onSettingHandler = () => {
		let d = selectUpdateModel;
		onSettingModalClose(false);
		dispatch(changeMenuSettingsAction(d._id, appMenu));
	};


	const onSettingModalClose = () => {
		setModalSettingState(false);
	};



	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getSalonListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};


	return (
		<Content
			currentMenu='salon'
			headerTitle='Salon'
			addBtn={
				getUserInfo &&
					getUserInfo.userInfo &&
					getUserInfo.userInfo.data &&
					(getUserInfo.userInfo.data.role === 'admin') ? true : false
			}
			addBtnText='Add New Salon'
			addBtnIcon='plus'
			addBtnClick={() => setShowAddModal(true)}
			search={true}
			searchPlaceholder='Search salon...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}
		>
			{
				salonList.loading ?
					<Spinner />
					:
					salonList &&
						salonList.userInfo &&
						salonList.userInfo.status &&
						salonList.userInfo.data.result &&
						salonList.userInfo.data.result.length > 0 ? (
						<div>
							<SalonData
								data={salonList.userInfo.data.result}
								showFilter={showFilter}
								setShowAddModal={setShowAddModal}
								setSelectUpdateModel={setSelectUpdateModel}
								setModalDeleteState={setModalDeleteState}
								onChangeHandler={onChangeHandler}
								handleEditModalSalon={handleEditModalSalon}
								setModalChangePasswordState={setModalChangePasswordState}
								setModalSettingState={setModalSettingState}
								setAppMenu={setAppMenu}
								setModalCancelSubscription={setModalCancelSubscription}
							/>
							{totalPageSize > 1 &&
								<div className="tableContainer--paginater">
									<Pagination list={salonList.userInfo} onPageChange={handlePageChange} rowsPerPage={pageLimit} totalPageSize={totalPageSize} pageNumber={pageNumber} />
								</div>}
						</div>)
						: (
							<NoData
								title='No Data Found!'
								subTitle='We could not find any salon data.'
								height='40vh'
							/>
						)
			}

			<CreateEditSalon data={{
				showAddModal,
				handleAddModalClose,
				handleSubmit,
				name,
				email,
				address,
				phone,
				setName,
				setEmail,
				setPhone,
				setAddress,
				nameError,
				addressError,
				phoneError,
				emailError,

				setNameError,
				setAddressError,
				setPhoneError,
				setEmailError,
				selectUpdateModel,
				setSelectUpdateModel,

				password,
				setPassword,
				passwordError,
				setPasswordError,

				imageSrc,
				setImageSrc,
				imageSrcError,
				setImageSrcError,
				setUploadFileData,
				uploadFileDataError,
				setUploadFileDataError,
			}} />

			<DeleteSalon data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />

			<ChangePwdUser data={{ modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler }} />

			<MenuSettingUser data={{ appMenu, setAppMenu, modalSettingState, onSettingModalClose, onSettingHandler }} />

			<CancelSubscription data={{ modalCancelSubscription, onCancelSubscriptionModalClose, onCancelSubscriptionHandler }} />

		</Content>
	);
};

export default SalonScreen;
