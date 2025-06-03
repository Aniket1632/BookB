import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../../components/Content';
import Button from '../../components/formInputs/Button';
import Spinner from '../../components/Spinner/Spinner';
import ChangePassword from './ChangePassword';
import MyProfileStyle from './MyProfile.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import EditProfile from './EditProfile';
import { getUserByTokenAction } from '../../redux/actions/userActions';
import { inputPhoneMasking, unMasking, validateEmail, validatePhone } from '../../utils/validators';
import { createNewStylistAction } from '../../redux/actions/stylistActions';
import { createNewSalonAction, getSalonListAction } from '../../redux/actions/salonActions';
import { createNewStaffSalonAction } from '../../redux/actions/salonStaffActions';
import { CREATE_NEW_STYLER_RESET } from '../../redux/constants/stylistConstants';
import { CREATE_NEW_SALON_STAFF_RESET } from '../../redux/constants/salonStaffConstants';
import { CREATE_NEW_SALON_RESET } from '../../redux/constants/salonConstants';
import { cancelSubscriptionAction, getSubscriptionDetailsAction } from '../../redux/actions/subscriptionAction';
import CancelSubscription from './CancelSubscription';
import { GET_CANCEL_SUBSCRIPTION_RESET } from '../../redux/constants/SubscriptionConstants';
import moment from "moment";
import "./profile.css"

const MyProfileScreen = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.getUserInfo);
	const [showEditModal, setShowEditModal] = useState(false);
	const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});

	const createStylist = useSelector((state) => state.createStylist);
	const createSalon = useSelector((state) => state.createSalon);
	const createSalonStaff = useSelector((state) => state.createSalonStaff);
	const cancelSubscription = useSelector((state) => state.cancelSubscription);
	const [modalCancelSubscription, setModalCancelSubscription] = useState(false);
	const subscriptionDetail = useSelector((state) => state.getSubscriptionDetail);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [imageSrc, setImageSrc] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [addressError, setAddressError] = useState('');
	const [phone, setPhone] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [imageSrcError, setImageSrcError] = useState('');
	const [uploadFileData, setUploadFileData] = useState('');
	const [uploadFileDataError, setUploadFileDataError] = useState('');
	const [id, setId] = useState('');

	const [serviceArray, setServiceArray] = useState('');
	const [serviceArrayError, setServiceArrayError] = useState('');
	const [startTime, setStartTime] = useState('');
	const [startTimeError, setStartTimeError] = useState('');
	const [endTime, setEndTime] = useState('');
	const [endTimeError, setEndTimeError] = useState('');

	useEffect(
		() => {
			if (userData && userData.userInfo && userData.userInfo.data) {
				setSelectUpdateModel(userData.userInfo.data);
				dispatch(getSubscriptionDetailsAction())
			}
		},
		[userData]
	);


	useEffect(
		() => {
			if (createStylist && createStylist.userInfo && createStylist.userInfo.status) {
				clearData();
				setShowEditModal(false);
				dispatch({ type: CREATE_NEW_STYLER_RESET });
				toast.success(createStylist.userInfo.message);
				dispatch(getUserByTokenAction());
			} else if (createStylist && createStylist.userInfo && !createStylist.userInfo.status) {
				dispatch({ type: CREATE_NEW_STYLER_RESET });
				toast.error(createStylist.userInfo.message);
			}
		},
		[createStylist, dispatch]
	);


	useEffect(
		() => {
			if (createSalon && createSalon.userInfo && createSalon.userInfo.status) {
				clearData();
				setShowEditModal(false);
				toast.success(createSalon.userInfo.message);
				dispatch({ type: CREATE_NEW_SALON_RESET });
				dispatch(getUserByTokenAction());
			} else if (createSalon && createSalon.userInfo && !createSalon.userInfo.status) {
				dispatch({ type: CREATE_NEW_SALON_RESET });
				toast.error(createSalon.userInfo.message);
			}
		},
		[createSalon, dispatch]
	);


	useEffect(
		() => {
			if (createSalonStaff && createSalonStaff.userInfo && createSalonStaff.userInfo.status) {
				clearData();
				setShowEditModal(false);
				toast.success(createSalonStaff.userInfo.message);
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET });
				dispatch(getUserByTokenAction());
			} else if (createSalonStaff && createSalonStaff.userInfo && !createSalonStaff.userInfo.status) {
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET })
				toast.error(createSalonStaff.userInfo.message);
			}
		},
		[createSalonStaff, dispatch]
	);

	useEffect(
		() => {
			if (createSalonStaff && createSalonStaff.userInfo && createSalonStaff.userInfo.status) {
				clearData();
				setShowEditModal(false);
				toast.success(createSalonStaff.userInfo.message);
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET });
				dispatch(getUserByTokenAction());
			} else if (createSalonStaff && createSalonStaff.userInfo && !createSalonStaff.userInfo.status) {
				dispatch({ type: CREATE_NEW_SALON_STAFF_RESET })
				toast.error(createSalonStaff.userInfo.message);
			}
		},
		[createSalonStaff, dispatch]
	);

	useEffect(
		() => {
			if (cancelSubscription && cancelSubscription.data && cancelSubscription.data.status) {
				toast.success(cancelSubscription.data.message);
				setSelectUpdateModel({});
				setModalCancelSubscription(false);
				dispatch(getSubscriptionDetailsAction())
				dispatch({ type: GET_CANCEL_SUBSCRIPTION_RESET });
			} else if (cancelSubscription && cancelSubscription.data && !cancelSubscription.data.status) {
				toast.error(cancelSubscription.data.message);
				dispatch({ type: GET_CANCEL_SUBSCRIPTION_RESET });
			}
		},
		[cancelSubscription, dispatch]
	);

	const onEditHandler = () => {

		let d = selectUpdateModel;
		setId(d._id);
		setEmail(d.email);
		setPhone(inputPhoneMasking(d.phone));
		setName(d.name);
		setAddress(d.address);
		setImageSrc(d.photo);
		setStartTime(d.startTime);
		setEndTime(d.endTime);
		d && d.services.map((item) => {
			item.label = item.title;
			item.value = item._id;
		});
		setServiceArray({ value: d.services, error: '' })
		setShowEditModal(true);
	}


	const clearData = () => {
		setId('');
		setEmail('');
		setPhone('');
		setAddress('');
		setName('');
		setEmailError('');
		setPhoneError('');
		setAddressError('');
		setNameError('');
		setImageSrc('');
		setImageSrcError('');
	}

	const handleEditModalClose = () => {
		clearData();
		setShowEditModal(false);
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
		} else {
			let fileData = new FormData();
			if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data && userData.userInfo.data.role === 'manager') {
				dispatch(createNewStaffSalonAction({ id, name, email, address, phone: unMasking(phone) }));
			} else if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data && userData.userInfo.data.role === 'stylist') {
				if (serviceArray === '' && !serviceArray.length) {
					setServiceArrayError('Please select services');
				} else {
					let serviceArrayTmp = [];
					for (let i = 0; i < serviceArray.length; i++) {
						serviceArrayTmp.push(serviceArray[i]._id);
					}

					fileData.append('id', id);
					fileData.append('name', name);
					fileData.append('email', email);
					fileData.append('address', address);
					fileData.append('phone', unMasking(phone));
					fileData.append('services', serviceArrayTmp);
					fileData.append('startTime', startTime);
					fileData.append('endTime', endTime);
					for (let i = 0; i < uploadFileData.length; i++) {
						fileData.append('image', uploadFileData[i]);
					}
					dispatch(createNewStylistAction(fileData));
				}
			} else if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data && userData.userInfo.data.role === 'salon') {
				fileData.append('id', id);
				fileData.append('name', name);
				fileData.append('email', email);
				fileData.append('address', address);
				fileData.append('phone', unMasking(phone));
				for (let i = 0; i < uploadFileData.length; i++) {
					fileData.append('image', uploadFileData[i]);
				}
				dispatch(createNewSalonAction(fileData));
			} else {
				fileData.append('id', id);
				fileData.append('name', name);
				fileData.append('email', email);
				fileData.append('address', address);
				fileData.append('phone', unMasking(phone));
				for (let i = 0; i < uploadFileData.length; i++) {
					fileData.append('image', uploadFileData[i]);
				}
				dispatch(createNewSalonAction(fileData));
			}

		}
	};


	const onCancelSubscriptionHandler = () => {
		let d = selectUpdateModel;
		dispatch(cancelSubscriptionAction(d._id));
	};

	const onCancelSubscriptionModalClose = () => {
		setSelectUpdateModel({});
		setModalCancelSubscription(false);
	};

	const dateConvert = (epoch) => {
		return moment(epoch * 1000).format('LLLL');
	}

	return (
		<Content currentMenu='my-profile' headerTitle='My Profile'>
			{
				subscriptionDetail &&
					subscriptionDetail.loading ? (
					<Spinner />
				) : (
					<div className='profile-container'>
						{
							subscriptionDetail &&
							subscriptionDetail.data &&
							subscriptionDetail.data.data &&
							subscriptionDetail.data.data.plan && userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data &&
							<div className='main-profile'>
								{userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data ? (
									<img
										src={userData.userInfo.data.photo}
										alt={userData.userInfo.data.name}
										className={MyProfileStyle.profileLogo}
									/>
								) : (
									<img src='/assets/logo.png' alt='logo' className={MyProfileStyle.profileLogo} />
								)}

								<p className={MyProfileStyle.profileName}> {userData.userInfo.data.name} </p>
								<h1>PERSONAL INFORMATION</h1>
								<div className={MyProfileStyle.logindecs}>
									Your are logged in with {userData.userInfo.data.role} account.
								</div>
								<h6 className={MyProfileStyle.profileContactHeading}>CONTACT INFORMATION</h6>
								<div className='personal-address'>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Phone:{" " + inputPhoneMasking(userData.userInfo.data.phone)}
										</div>
									</div>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Email:{" " + userData.userInfo.data.email}
										</div>
									</div>
									{userData.userInfo.data.address &&
										<div className={MyProfileStyle.profileContact}>
											<div>
												Address:{" " + userData.userInfo.data.address}
											</div>
										</div>}
								</div>
								{
									userData &&
									userData.userInfo &&
									userData.userInfo.data &&
									userData.userInfo.data.role !== 'admin' &&
									<div style={{ display: 'flex', gap: '4rem', marginTop: '2rem' }}>
										<Button label='Edit Profile' icon='edit' onClick={onEditHandler} />

										<Button label='Change Password' icon='key' onClick={() => {
											setModalChangePasswordState(true)
											setSelectUpdateModel(userData.userInfo.data);
										}} />

									</div>
								}
							</div>
						}



						{userData &&
							userData.userInfo &&
							userData.userInfo.data &&
							userData.userInfo.data.role === 'salon' &&
							subscriptionDetail &&
							subscriptionDetail.data &&
							subscriptionDetail.data.data &&
							subscriptionDetail.data.data.plan &&
							subscriptionDetail.data.data.plan.metadata &&
							<div className='main-subscription'>
								<h1>YOUR PLAN INFORMATION</h1>
								<p className={MyProfileStyle.profileName}> {subscriptionDetail.data.product.name} </p>
								<div className={MyProfileStyle.logindecs}>
									{subscriptionDetail.data.product.description}
								</div>
								<br />
								<div className='personal-address'>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Amount: $ {subscriptionDetail.data.data.plan.amount} per {subscriptionDetail.data.data.plan.interval}
										</div>
									</div>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Max Users: {subscriptionDetail.data.data.plan.metadata.users}
										</div>
									</div>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Subscribed on: {dateConvert(subscriptionDetail.data.data.current_period_start)}
										</div>
									</div>
									<div className={MyProfileStyle.profileContact}>
										<div>
											Expire on: {dateConvert(subscriptionDetail.data.data.current_period_end)}
										</div>
									</div>
									<div className={MyProfileStyle.profileContact}>
										<div>
											{subscriptionDetail.data.data.cancel_at_period_end ? (
												<p className='table__status' style={{ border: 'none', fontSize: '1.5rem', width: '100%' }}>
													Cancel at period end: <span>•</span> Active
												</p>
											) : (
												<p className='table__status_deactive' style={{ border: 'none', fontSize: '1.5rem', width: '100%' }}>
													Cancel at period end: <span>•</span> Deactive
												</p>
											)}
										</div>
									</div>

								</div>
								{userData &&
									userData.userInfo &&
									userData.userInfo.data &&
									userData.userInfo.data.role === 'salon' &&
									subscriptionDetail &&
									subscriptionDetail.data &&
									subscriptionDetail.data.data &&
									subscriptionDetail.data.data.plan &&
									subscriptionDetail.data.data.plan.metadata &&
									<div style={{ marginTop: '2rem' }}>
										<Button label='Cancel Subscription' icon='delete' onClick={() => {
											setModalCancelSubscription(true)
											setSelectUpdateModel(userData.userInfo.data);
										}} />
									</div>}

							</div>

						}

					</div>
				)
			}



			<ChangePassword data={{
				selectUpdateModel,
				setSelectUpdateModel,
				modalChangePasswordState,
				setModalChangePasswordState,
			}} />



			<EditProfile props={{
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


				serviceArray,
				setServiceArray,
				serviceArrayError,
				setServiceArrayError,
				startTime,
				startTimeError,
				setStartTime,
				setStartTimeError,

				endTime,
				endTimeError,
				setEndTime,
				setEndTimeError,

				imageSrc,
				setImageSrc,
				imageSrcError,
				setImageSrcError,
				setUploadFileData,
				uploadFileDataError,
				setUploadFileDataError,

				handleEditModalClose,
				handleSubmit,
				showEditModal,
				setShowEditModal,
				selectUpdateModel,
				setSelectUpdateModel
			}} />

			<CancelSubscription data={{ modalCancelSubscription, onCancelSubscriptionModalClose, onCancelSubscriptionHandler }} />

		</Content >
	);
};

export default MyProfileScreen;










