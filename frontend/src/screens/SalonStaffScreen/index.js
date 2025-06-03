import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Content from '../../components/Content/Content';
import DeleteSalonUser from './DeleteSalonUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { inputPhoneMasking, unMasking, validateEmail, validateOnlyNumber, validatePassword, validatePhone } from '../../utils/validators';
import SalonStaffData from './SalonStaffData';
import CreateSalonStaffUser from './CreateSalonStaffUser';
import {
	CHANGE_STATUS_SALON_STAFF_RESET,
	CREATE_NEW_SALON_STAFF_RESET,
	DELETE_SALON_STAFF_RESET
} from '../../redux/constants/salonStaffConstants';
import {
	changeStatusSalonStaffAction,
	createNewStaffSalonAction,
	deleteSalonStaffAction,
	getSalonStaffListAction
} from '../../redux/actions/salonStaffActions';
import { changePasswordUserAction } from '../../redux/actions/userActions';
import { CHANGE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants';
import { getAllEnabledSalonListAction } from '../../redux/actions/salonActions';
import ChangePwdUser from '../UsersScreen/ChangePwdUser';
import Pagination from '../../components/Pagination';
import NoData from '../../website/components/NoData';

const SalonStaffScreen = ({ showFilter = false, history }) => {
	const dispatch = useDispatch();
	const userInfo = useSelector((state) => state.userLogin);
	const staffList = useSelector((state) => state.salonStaffList);
	const userData = useSelector((state) => state.getUserInfo);
	const salonList = useSelector((state) => state.salonEnabledList);

	const createSalonStaff = useSelector((state) => state.createSalonStaff);
	const deleteSalonStaff = useSelector((state) => state.deleteSalonStaff);
	const changeStatusSalonStaff = useSelector((state) => state.changeStatusSalonStaff);
	const changePasswordUser = useSelector((state) => state.changePasswordUser);

	const [showAddModal, setShowAddModal] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});
	const [id, setUserId] = useState('');
	const [roleList, setRoleList] = useState([]);

	const [search, setSearch] = useState('');
	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	const [role, setRole] = useState('');
	const [roleError, setRoleError] = useState('');
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
	const [userType, setUserType] = useState('');

	const [salonId, setSalonId] = useState('');
	const [salonError, setSalonIdError] = useState('');
	useEffect(
		() => {
			if (
				userData &&
				userData.userInfo &&
				userData.userInfo.data &&
				(userData.userInfo.data.role === 'superadmin' || userData.userInfo.data.role === 'admin')
			) {
				setUserType(userData.userInfo.data.role);
				setRoleList([
					// {
					// 	_id: 1,
					// 	name: 'Super Admin',
					// 	value: 'superadmin'
					// },
					{
						_id: 2,
						name: 'Manager',
						value: 'manager'
					}
				]);

				dispatch(getAllEnabledSalonListAction());
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				setTotalPageSize(staffList.totalPageSize);
			} else if (userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role === 'salon') {
				setUserType(userData.userInfo.data.role);
				setRoleList([
					{
						_id: 2,
						name: 'Manager',
						value: 'manager'
					}
				]);

				dispatch(getAllEnabledSalonListAction());
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				setTotalPageSize(staffList.totalPageSize);
			} else {
				history.push('/');
			}
		},
		[userInfo, userData, dispatch]
	);

	useEffect(
		() => {
			if (createSalonStaff && createSalonStaff.userInfo && createSalonStaff.userInfo.status) {
				clearData();
				setShowAddModal(false);
				setSearch('');
				toast.success(createSalonStaff.userInfo.message);
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET });
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createSalonStaff && createSalonStaff.userInfo && !createSalonStaff.userInfo.status) {
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET });
				toast.error(createSalonStaff.userInfo.message);
			}
		},
		[createSalonStaff, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (deleteSalonStaff && deleteSalonStaff.userInfo && deleteSalonStaff.userInfo.status) {
				toast.success(deleteSalonStaff.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: DELETE_SALON_STAFF_RESET });
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteSalonStaff && deleteSalonStaff.userInfo && !deleteSalonStaff.userInfo.status) {
				toast.error(deleteSalonStaff.userInfo.message);
				dispatch({ type: DELETE_SALON_STAFF_RESET });
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteSalonStaff, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (changeStatusSalonStaff && changeStatusSalonStaff.userInfo && changeStatusSalonStaff.userInfo.status) {
				toast.success(changeStatusSalonStaff.userInfo.message);
				setSelectUpdateModel({});
				dispatch({ type: CHANGE_STATUS_SALON_STAFF_RESET });
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeStatusSalonStaff && changeStatusSalonStaff.userInfo && !changeStatusSalonStaff.userInfo.status) {
				toast.error(changeStatusSalonStaff.userInfo.message);
				dispatch({ type: CHANGE_STATUS_SALON_STAFF_RESET });
				dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[changeStatusSalonStaff, pageNumber, pageLimit, dispatch]
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
		[changePasswordUser, pageNumber, pageLimit, dispatch]
	);

	const handleAddModalClose = () => {
		clearData();
		setShowAddModal(false);
	};

	const clearData = () => {
		setSelectUpdateModel({});
		setEmail('');
		setName('');
		setPhone('');
		setRole('');
		setAddress('');
		setPassword('');
		setRoleError('');
		setNameError('');
		setPhoneError('');
		setEmailError('');
		setPasswordError('');
		setAddressError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (name === '' && name.trim() === '') {
			setNameError('Please enter name');
		} else if (email === '' && email.trim() === '') {
			setEmailError('Please enter email address');
		} else if (!validateEmail(email)) {
			setEmailError('Please enter valid email');
		} else if (phone === '' && phone.trim() === '') {
			setPhoneError('Please enter phone');
		} else if (!validatePhone(unMasking(phone))) {
			setPhoneError('Phone number must be 10 digits');
		} else if (address === '' && address.trim() === '') {
			setAddressError('Please enter address');
		} else if (id === '' && !validatePassword(password)) {
			setPasswordError('Please enter password');
		} else if (id === '' && password.length < 7) {
			setPasswordError('Password must be at least 8 characters');
		} else if (role === '' && role.trim() === '') {
			setRoleError('Please select role');
		} else if (userType === 'admin' && salonId === '' && salonId.trim() === '') {
			setSalonIdError('Please select salon');
		} else {
			if (id !== '') {
				dispatch(createNewStaffSalonAction({ id, name, email, address, phone: unMasking(phone), role, salonId: salonId }));
			} else {
				dispatch(createNewStaffSalonAction({ name, email, password, address, phone: unMasking(phone), role, salonId: salonId }));
			}
		}
	};

	const onDeleteModalClose = () => {
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteSalonStaffAction(selectUpdateModel._id));
		onDeleteModalClose();
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getSalonStaffListAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const handleEditModalUser = (d) => {
		setSelectUpdateModel(d);
		setUserId(d._id);
		setEmail(d.email);
		setAddress(d.address);
		setPhone(inputPhoneMasking(d.phone));
		setName(d.name);
		setRole(d.role);
		if (userType === 'admin') {
			setSalonId(d.salon);
		} else {
			setSalonId(null);
		}
		setShowAddModal(true);
	};

	const onChangeHandler = (d) => {
		dispatch(
			changeStatusSalonStaffAction(d._id, {
				enable: d.active ? true : false
			})
		);
	};

	const onChangePwdModalClose = () => {
		setModalChangePasswordState(false);
	};

	const onChangePwdUserHandler = () => {
		let d = selectUpdateModel;
		let type = 'byAdmin';
		dispatch(changePasswordUserAction({ id: d._id, type, email: d.email }));
		onChangePwdModalClose();
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getSalonStaffListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	return (
		<Content
			currentMenu='salonstaff'
			headerTitle='Salon Staff'
			addBtn={true}
			addBtnText='Add Salon User'
			addBtnIcon='plus'
			addBtnClick={() => setShowAddModal(true)}
			search={true}
			searchPlaceholder='Search Salon'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{staffList.loading ? (
				<Spinner />
			) : staffList &&
				staffList.userInfo &&
				staffList.userInfo.status &&
				staffList.userInfo.data.result &&
				staffList.userInfo.data.result.length > 0 ? (
				<div>
					<SalonStaffData
						data={staffList.userInfo.data.result}
						showFilter={showFilter}
						setModalDeleteState={setModalDeleteState}
						setSelectUpdateModel={setSelectUpdateModel}
						handleEditModalUser={handleEditModalUser}
						onChangeHandler={onChangeHandler}
						setModalChangePasswordState={setModalChangePasswordState}
					/>
					{totalPageSize > 1 && (
						<div className='tableContainer--paginater'>
							<Pagination
								list={staffList.userInfo}
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
					subTitle='We could not find any salon staff data.'
					height='40vh'
				/>
			)}

			<CreateSalonStaffUser
				data={{
					showAddModal,
					handleAddModalClose,
					handleSubmit,
					name,
					email,
					phone,
					address,
					password,
					role,

					setName,
					setEmail,
					setPhone,
					setRole,
					setAddress,
					setPassword,

					nameError,
					phoneError,
					emailError,
					addressError,
					passwordError,
					roleError,

					setRoleError,
					setNameError,
					setPhoneError,
					setEmailError,
					setAddressError,
					setPasswordError,

					userType,
					salonId,
					setSalonId,
					salonError,
					setSalonIdError,

					roleList,
					salonList,
					selectUpdateModel
				}}
			/>
			<DeleteSalonUser data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />

			<ChangePwdUser data={{ modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler }} />

			{/* <ChangePassword data={{
				selectUpdateModel,
				setSelectUpdateModel,
				modalChangePasswordState,
				setModalChangePasswordState,
			}} /> */}
		</Content>
	);
};

export default SalonStaffScreen;
