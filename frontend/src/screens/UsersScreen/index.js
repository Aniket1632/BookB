import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Content from '../../components/Content';
import UsersData from './UsersData';
import DeleteUser from './DeleteUser';
import CreateUser from './CreateUser';
import {
	activeUserAction,
	addMessageAction,
	addNotesAction,
	createNewUserAction,
	deleteUserAction,
	getUserListAction,
	logout,
	logOutUserAction
} from '../../redux/actions/userActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getStylistListAction } from '../../redux/actions/stylistActions';
import { STYLER_RESET } from '../../redux/constants/stylistConstants';
import {
	ADD_MESSAGE_RESET,
	ADD_NOTES_RESET,
	CHANGE_PASSWORD_USER_RESET,
	CHANGE_STATUS_USER_RESET,
	CREATE_NEW_USER_RESET,
	DELETE_USER_RESET,
	LOGOUT_USER_RESET
} from '../../redux/constants/userConstants';
import { inputPhoneMasking, unMasking, validateEmail, validateOnlyNumber, validatePhone } from '../../utils/validators';
import Pagination from '../../components/Pagination';
import AddNotes from './AddNotes';
import SendMessage from './SendMessage';
import NoData from '../../website/components/NoData';
import LogOutUser from '../../components/Modal/LogOutUser';

const UsersScreen = ({ showFilter = false, history }) => {
	const dispatch = useDispatch();
	const userInfo = useSelector((state) => state.userLogin);
	const userRole = useSelector((state) => state.getUserInfo);

	const userList = useSelector((state) => state.userList);
	const stylistList = useSelector((state) => state.stylistList);

	const createUser = useSelector((state) => state.createUser);
	const deleteUser = useSelector((state) => state.deleteUser);
	const changeStatusUser = useSelector((state) => state.changeStatusUser);
	const changePasswordUser = useSelector((state) => state.changePasswordUser);
	const sendMessageUser = useSelector((state) => state.sendMessageUser);
	const addNotesUser = useSelector((state) => state.addNotesUser);
	const logOutUser = useSelector((state) => state.logOutUser);

	const [showAddModal, setShowAddModal] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [modalDoumentState, setModalDoumentState] = useState(false);
	const [selectUpdateModelUser, setSelectUpdateModelUser] = useState({});
	const [addNotesModal, setAddNotesModal] = useState(false);
	const [sendMessageModal, setSendMessageModal] = useState(false)
	const [modalLogOutUserState, setModalLogOutUserState] = useState(false);

	const [search, setSearch] = useState('');
	const [_id, setUserId] = useState('');

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 15;

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phone, setPhone] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [gender, setGender] = useState('');
	const [genderError, setGenderError] = useState('');
	const [notes, setNotes] = useState('');
	const [notesError, setNotesError] = useState('');
	const [messageTitle, setMessageTitle] = useState('');
	const [messageTitleError, setMessageTitleError] = useState('');
	const [messageHead, setMessageHead] = useState('');
	const [messageError, setMessageError] = useState('')
	const [stylist, setStylist] = useState('');
	const [stylistIdError, setStylistError] = useState('');

	useEffect(
		() => {
			if (userRole && userRole.userInfo && !userRole.userInfo.status && userRole.userInfo.code === "invalid_token") {
				dispatch(logout());
				toast.error(userRole.userInfo.message);
				history.push('/login');
			} else if (userRole && userRole.userInfo && !userRole.userInfo.status && userRole.userInfo.message === "jwt malformed") {
				dispatch(logout());
				toast.error(userRole.userInfo.message);
				history.push('/login');
			} else if (userRole && userRole.userInfo && userRole.userInfo.data && userRole.userInfo.data.role === 'user') {
				dispatch(logout());
				history.push('/login');
			}
		},
		[history, userRole, dispatch]
	);


	useEffect(
		() => {
			if (userList && userList.userInfo && userList.userInfo.status && userList.userInfo.data.result.length > 0) {
				setTotalPageSize(userList.userInfo.data.totalPageSize);
			} else if (userList && userList.userInfo && !userList.userInfo.status && userList.userInfo.code === "invalid_token") {
				dispatch(logout());
				toast.error(userList.userInfo.message);
				history.push('/login');
			}
		},
		[userList]
	);


	useEffect(
		() => {
			if (userInfo && userInfo.data && userInfo.data.token) {
				dispatch({ type: STYLER_RESET });
				dispatch(getStylistListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
			} else dispatch(getStylistListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
		},
		[userInfo, dispatch]
	);

	useEffect(
		() => {
			if (createUser && createUser.userInfo && createUser.userInfo.status) {
				clearData();
				setShowAddModal(false);
				setSearch('');
				toast.success(createUser.userInfo.message);
				dispatch({ type: CREATE_NEW_USER_RESET });
				dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (createUser && createUser.userInfo && !createUser.userInfo.status) {
				dispatch({ type: CREATE_NEW_USER_RESET });
				toast.error(createUser.userInfo.message);

			}
		},
		[createUser, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (sendMessageUser && sendMessageUser.userInfo && sendMessageUser.userInfo.status) {
				toast.success(sendMessageUser.userInfo.message)
				clearData();
				setShowAddModal(false);
				dispatch({ type: ADD_MESSAGE_RESET });
				handleMessageClose();
			} else if (sendMessageUser && sendMessageUser.userInfo && !sendMessageUser.userInfo.status) {
				toast.error(sendMessageUser.userInfo.message)
				clearData();
				setShowAddModal(false);
				dispatch({ type: ADD_MESSAGE_RESET });
				handleMessageClose();
			}
		},
		[sendMessageUser, dispatch]
	);

	useEffect(
		() => {
			if (deleteUser && deleteUser.userInfo && deleteUser.userInfo.status) {
				toast.success(deleteUser.userInfo.message);
				setSelectUpdateModelUser({});
				dispatch({ type: DELETE_USER_RESET });
				dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (deleteUser && deleteUser.userInfo && !deleteUser.userInfo.status) {
				toast.error(deleteUser.userInfo.message);
				dispatch({ type: DELETE_USER_RESET });
				dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[deleteUser, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (changeStatusUser && changeStatusUser.userInfo && changeStatusUser.userInfo.status) {
				toast.success(changeStatusUser.userInfo.message);
				setSelectUpdateModelUser({});
				dispatch({ type: CHANGE_STATUS_USER_RESET });
				dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (changeStatusUser && changeStatusUser.userInfo && !changeStatusUser.userInfo.status) {
				toast.error(changeStatusUser.userInfo.message);
				dispatch({ type: CHANGE_STATUS_USER_RESET });
				dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			}
		},
		[changeStatusUser, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (changePasswordUser && changePasswordUser.userInfo && changePasswordUser.userInfo.status) {
				toast.success(changePasswordUser.userInfo.message);
				setSelectUpdateModelUser({});
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(changePasswordUser.userInfo.message);
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			}
		},
		[changePasswordUser, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (sendMessageUser && sendMessageUser.userInfo && sendMessageUser.userInfo.status) {
				toast.success(sendMessageUser.userInfo.message);
				handleMessageClose();
				dispatch({ type: ADD_MESSAGE_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(sendMessageUser.userInfo.message);
				dispatch({ type: ADD_MESSAGE_RESET });
				handleMessageClose();
			}
		},
		[sendMessageUser, dispatch]
	);

	useEffect(
		() => {
			if (addNotesUser && addNotesUser.userInfo && addNotesUser.userInfo.status) {
				toast.success(addNotesUser.userInfo.message);
				handleAddNotesModalClose();
				dispatch({ type: ADD_NOTES_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(addNotesUser.userInfo.message);
				dispatch({ type: ADD_NOTES_RESET });
			}
		},
		[addNotesUser, dispatch]
	);


	useEffect(
		() => {
			if (logOutUser && logOutUser.userInfo && logOutUser.userInfo.status) {
				toast.success(logOutUser.userInfo.message);
				setSelectUpdateModelUser({})
				dispatch({ type: LOGOUT_USER_RESET });
			} else if (logOutUser && logOutUser.userInfo && !logOutUser.userInfo.status) {
				toast.error(logOutUser.userInfo.message);
				dispatch({ type: LOGOUT_USER_RESET });
			}
		},
		// eslint-disable-next-line
		[logOutUser, dispatch]
	);


	const handleAddModalClose = () => {
		clearData();
		setShowAddModal(false);
	};

	const handleAddNotesModalClose = () => {
		setAddNotesModal(false)
	}

	const clearData = () => {
		setSelectUpdateModelUser({});
		setEmail('');
		setPhone('');
		setStylist('');
		setName('');
		setStylist('');
		setGender('');
		setEmailError('');
		setPhoneError('');
		setStylistError('');
		setNameError('');
		setNotes('');
		setNotesError('')
		// setAge('');
		// setAgeError('');
		// setDOB('');
		// setDOBError('');
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
		} else if (gender === '' && gender.trim() === '') {
			setGenderError('Please select gender.');
		} else if (stylist === '' && stylist.trim() === '') {
			setStylistError('Please select stylist');
		} else if (notes === '' && notes.trim() === '') {
			setNotesError('Please add Notes');
		} else {
			if (_id !== '') {
				dispatch(createNewUserAction({ _id, name, email, gender, phone: unMasking(phone), stylist, clientNote: notes }));
			} else {
				dispatch(createNewUserAction({ name, email, gender, phone: unMasking(phone), stylist, clientNote: notes }));
			}
		}
	};

	//Add Notes Handler
	const handleNoteModal = (d) => {
		setAddNotesModal(true)
	}
	const handleNotesSubmit = () => {
		if (notes === '') {
			setNotesError("Please add notes")
		} else {
			dispatch(addNotesAction(notes))
		}
	}

	//Add Message Handler
	const handleMessageClose = () => {
		setSendMessageModal(false);
		setMessageHead('');
		setMessageTitle('')
		setMessageError('');
		setMessageTitleError('')
		setUserId('');
	}

	const handleMessageModal = (d) => {
		setUserId(d._id)
		setSendMessageModal(true)
	}

	const handleMessageSubmit = (e) => {
		e.preventDefault()
		if (messageHead === '') {
			setMessageError('Please Enter Message')
		} else {
			let data = {
				userId: _id,
				message: messageHead
			}

			dispatch(addMessageAction(data))
		}
	}

	const onDeleteModalClose = () => {
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteUserAction(selectUpdateModelUser._id));
		onDeleteModalClose();
	};

	const onFormHandler = () => {
		setModalDoumentState(false);
	};

	const onFormModalClose = () => {
		setModalDoumentState(false);
		setSelectUpdateModelUser({});
	};

	// const onChangePwdUserHandler = () => {
	// 	let d = selectUpdateModelUser;
	// 	let type = 'byAdmin';
	// 	dispatch(changePasswordUserAction({ 'id': d._id, type, 'email': d.email }));
	// 	onChangePwdModalClose();
	// };

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getUserListAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const handleEditModalUser = (d) => {
		setUserId(d._id);
		setEmail(d.email);
		setPhone(inputPhoneMasking(d.phone));
		setName(d.name);
		setStylist(d.stylist._id);
		setGender(d.gender);
		setSelectUpdateModelUser(d);
		setNotes(d.clientNote)
		// setAge(d.age);
		// setDOB(d.dob);
		setShowAddModal(true);
	};

	const onChangeHandler = (d) => {
		dispatch(
			activeUserAction(d._id, {
				enable: d.active ? true : false
			})
		);
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getUserListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};


	const onLogOutUserClose = () => {
		setModalLogOutUserState(false);
	};

	const onLogOutUserHandler = () => {
		let d = selectUpdateModelUser;
		let type = 'byAdmin';
		dispatch(logOutUserAction({ id: d._id, type, email: d.email }));
		onLogOutUserClose();
	};

	return (
		<Content
			currentMenu='users'
			headerTitle='Users'
			addBtn={true}
			addBtnText='Add New User'
			addBtnIcon='plus'
			addBtnClick={() => setShowAddModal(true)}
			search={true}
			searchPlaceholder='Search Users...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{userList.loading ? (
				<Spinner />
			) : userList &&
				userList.userInfo &&
				userList.userInfo.status &&
				userList.userInfo.data.result &&
				userList.userInfo.data.result.length > 0 ? (
				<div>
					<UsersData
						data={userList.userInfo.data.result}
						showFilter={showFilter}
						setModalDeleteState={setModalDeleteState}
						setSelectUpdateModelUser={setSelectUpdateModelUser}
						handleEditModalUser={handleEditModalUser}
						onChangeHandler={onChangeHandler}
						setModalDoumentState={setModalDoumentState}
						addNotesModal={addNotesModal}
						setAddNotesModal={setAddNotesModal}
						sendMessageModal={sendMessageModal}
						setSendMessageModal={setSendMessageModal}
						handleNoteModal={handleNoteModal}
						handleMessageModal={handleMessageModal}
						setModalLogOutUserState={setModalLogOutUserState}
					/>
					{totalPageSize > 1 && (
						<div className='tableContainer--paginater'>
							<Pagination
								list={userList.userInfo}
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
					subTitle='We could not find any user data.'
					height='40vh'
				/>
			)}

			<CreateUser
				data={{
					showAddModal,
					handleAddModalClose,
					handleSubmit,
					name,
					email,
					phone,
					setName,
					setEmail,
					setPhone,
					nameError,
					phoneError,
					emailError,
					setNameError,
					setPhoneError,
					setEmailError,
					gender,
					setGender,
					setGenderError,
					genderError,
					// dob,
					// dobError,
					// setDOB,
					// setDOBError,
					// age,
					// setAge,
					// setAgeError,
					// ageError,
					stylist,
					setStylist,
					setStylistError,
					stylistIdError,
					stylistList,
					selectUpdateModelUser,
					setSelectUpdateModelUser,
					notes,
					setNotes,
					notesError
				}}
			/>
			<DeleteUser data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
			<LogOutUser data={{ modalLogOutUserState, onLogOutUserClose, onLogOutUserHandler }} />

			<AddNotes data={{ addNotesModal, handleAddNotesModalClose, notes, setNotes, notesError, handleNotesSubmit }} />
			<SendMessage data={{ messageHead, setMessageHead, messageTitle, setMessageTitle, messageError, messageTitleError, handleMessageClose, handleMessageSubmit, sendMessageModal, setSendMessageModal }} />
		</Content>
	);
};

export default UsersScreen;
