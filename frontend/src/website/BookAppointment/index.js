import React, { useEffect, useState } from 'react';
import DownloadButton from './DownloadButton';
import ServiceCard from './Services/ServiceCard';
import Content from '../components/WebsiteContent/Content';
import BookAnAppointmentModal from './BookAnAppointmentModal';
import { Calendar, DateObject } from 'react-multi-date-picker';
import './BookAppointment.css';
import moment from 'moment';
import { addPublicAppointmentAction, getPublicAppointmentAction, getSylistAppointmentAction } from '../../redux/actions/appointmentAction';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ADD_PUBLIC_APPOINTMENT_RESET } from '../../redux/constants/appointmentConstants';
import PublicAppointmentSkeleton from '../../components/Skeletons/PublicAppointmentSkeleton';
import { unMasking, validateEmail, validatePhone } from '../../utils/validators';
import salonProfile from '../../components/assets/favicon.png';
import { GET_USER_BY_TOKEN_RESET } from '../../redux/constants/userConstants';
import { getUserByTokenAction } from '../../redux/actions/userActions';
import { getWebsiteSettingAction } from '../../redux/actions/websiteSettingAction';
import { useParams } from 'react-router-dom';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant'; 

const BookAppointment = () => {
	const dispatch = useDispatch();
	const { salonId } = useParams();
	const [modalState, setModalState] = useState(false);
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const publicAddAppointment = useSelector((state) => state.publicAddAppointment);
	const getPublicAppointment = useSelector((state) => state.getPublicAppointment);
	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const getStylistAppointment = useSelector((state) => state.getStylistAppointment);
	const [stylistName, setStylistName] = useState("");

	const [name, setName] = useState({ value: '', error: '' });
	const [email, setEmail] = useState({ value: '', error: '' });
	const [phone, setPhone] = useState({ value: '', error: '' });
	const [gender, setGender] = useState({ value: '', error: '' })
	const [comments, setComments] = useState({ value: '', error: '' });
	const [value, setValue] = useState(new DateObject());
	const [info, setInfo] = useState();
	const userLogin = useSelector((state) => state.userLogin);

	useEffect(() => {
		dispatch(getUserByTokenAction());
	}, [dispatch])

	const onClose = () => {
		setName({ value: '', error: '' });
		setEmail({ value: '', error: '' });
		setPhone({ value: '', error: '' });
		setComments({ value: '', error: '' })
		setGender({ value: '', error: '' })
		setModalState(false);
	};


	useEffect(() => {
		dispatch(getWebsiteSettingAction(salonId));
	}, [salonId])


	useEffect(() => {
		if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data) {
			dispatch(getSylistAppointmentAction())
		} else if (getPublicWebsite && getPublicWebsite.websiteInfo && !getPublicWebsite.websiteInfo.status) {
			toast.error(getPublicWebsite.websiteInfo.message);
			// setTimeout(() => {
			// 	window.location.replace('https://bookb.io');
			// }, 2500)
			dispatch({ type: GET_WEBSITE_SETTING_RESET });
		}
	}, [getPublicWebsite, dispatch])


	useEffect(() => {
		if (getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.status) {
			setName({ value: getUserInfo.userInfo.data.name });
			setEmail({ value: getUserInfo.userInfo.data.email });
			setPhone({ value: getUserInfo.userInfo.data.phone });
			setGender({ value: getUserInfo.userInfo.data.gender });
		} else {
			dispatch({ type: GET_USER_BY_TOKEN_RESET })
		}
	}, [userLogin, modalState])

	useEffect(() => {
		if (
			publicAddAppointment &&
			publicAddAppointment.session &&
			publicAddAppointment.session.status
		) {
			toast.success(publicAddAppointment.session.message);
			setModalState(false)
			dispatch({ type: ADD_PUBLIC_APPOINTMENT_RESET });
			onClose();
		} else if (
			publicAddAppointment &&
			publicAddAppointment.session &&
			!publicAddAppointment.session.status
		) {
			toast.error(publicAddAppointment.session.message);
			dispatch({ type: ADD_PUBLIC_APPOINTMENT_RESET });
			onClose();
		}
	}, [publicAddAppointment]);

	const dateHour = (date, hour) => {
		let datetimeA = moment(date + " " + hour);
		return datetimeA.toISOString()
	}



	useEffect(() => {
		if (getPublicWebsite) {
			let formData = {
				"requestDate": value.format('MM-DD-YYYY'),
				"salon": getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id,
				stylistId: stylistName ? stylistName : null,
			}
			dispatch(getPublicAppointmentAction(formData))
		} else {

		}
	}, [dispatch, value, publicAddAppointment, getPublicWebsite, stylistName])


	const handleBookAppointment = (e) => {
		e.preventDefault();

		if (name.value === "") {
			setName({ error: "Please enter your Name" })
		} else if (email.value === "") {
			setEmail({ error: "Please enter your Email" })
		} else if (!validateEmail(email.value)) {
			setEmail({ error: "Invalid Email" })
		} else if (phone.value === "") {
			setPhone({ error: "Please enter your phone number." })
		} else if (!validatePhone(unMasking(phone.value))) {
			setPhone({ error: "Phone number must be of 10 digits." })
		} else if (gender.value === "") {
			setGender({ error: "Please select your gender" })
		}
		else {
			const appointmentData = {
				name: name.value,
				email: email.value,
				mobile: unMasking(phone.value),
				comment: comments.value,
				gender: gender.value,
				availability: info.availableTime,
				// appointmentDate:info.dateAsAString,
				appointmentDate: dateHour(info.dateAsAString, info.timeAsADate),
				requiredDuration: info.requiredTime,
				isNewUser: true,
				mainService: info.serviceId,
				subService: info.subServiceId,
				salon: info.salon,
				stylistId: info.stylist,
				timeData: {
					id: info._id,
					timeAsAString: info.timeAsAString,
					timeAsADate: info.timeAsADate,
				},
			}
			dispatch(addPublicAppointmentAction(appointmentData))
		}
	}

	const clearData = () => {
		setName({ value: '', error: '' });
		setEmail({ value: '', error: '' });
		setPhone({ value: '', error: '' });
		setComments({ value: '', error: '' })
		setGender({ value: '', error: '' })
		setModalState(false)
	}
	return (
		<Content getPublicWebsite={getPublicWebsite}>
			<div className="grid-container">
				<div className="item1">
					<Calendar value={value} onChange={setValue} minDate={moment().format()} />
				</div>
				<div className="item2">
					<div className="appointment-box1">
						<img src={
							getPublicWebsite &&
								getPublicWebsite.websiteInfo &&
								getPublicWebsite.websiteInfo.data &&
								getPublicWebsite.websiteInfo.data.salon &&
								getPublicWebsite.websiteInfo.data.salon.photo ?
								getPublicWebsite.websiteInfo.data.salon.photo : salonProfile
						} className="barber_image1" />
						<div className="salon_info_name">
							<h1 className="salon_heading2">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}</h1>
							{/* <p className="appointment_subheading1">This is a description about salon</p> */}

						</div>
					</div>

					<div className="appointment-box3">
						<div className="stylist-detail-icon">
							<svg className="appointment-icon">
								<use xlinkHref={`/assets/sprite.svg#icon-email`} />
							</svg>
							<a type='email' className="appointment_subheading1">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.email}</a>
						</div>
					</div>

					<div className="appointment-box3">

						<div className="stylist-detail-icon">
							<svg className="appointment-icon">
								<use xlinkHref={`/assets/sprite.svg#icon-call`} />
							</svg>
							<a type='phone' className="appointment_subheading1">{getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.phone}</a>
						</div>
					</div>
					<div className="appointment-box2">
						<div className="stylist-detail-icon">
							<p style={{ textAlign: 'center' }} className="appointment_subheading1">
								<svg className="appointment-icon">
									<use xlinkHref={`/assets/sprite.svg#icon-location`} />
								</svg>
								&nbsp;&nbsp; {getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.address}</p>
						</div>
					</div>
				</div>

				{/* <div className="item3">
					<OfferCard
						offerTitle="New year offer on haircut, color services"
						offerSubTitle="lorem ipsum dolor sit amet, consectetur adispiscing elit, sed do lorem ipsum dolor sit amet, consectetur
				adispiscing elit, sed do"
					/>
				</div> */}
				<div className="item4">
					<div className="download_options">
						<h1 className="appointment_heading3" style={{ textAlign: 'center' }}>Track your booking and more on our app</h1>
						<div className="download_options_inner"> 
							<img src='./assets/play.png' alt='play store' style={{ height: '6vh' }} onClick={() => window.open(`https://play.google.com/store/apps/details?id=${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.packageName}`)} />
							<img src='./assets/ios-icon.png' alt='apple store' style={{ height: '6vh' }} onClick={() => window.open(`https://apps.apple.com/tt/app/bookb/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.appID}`)} />

							{/* <DownloadButton
								buttonTitle="Download on the"
								buttonSubTitle="App Store"
								buttonIcon="apple"
							/>
							<DownloadButton
								buttonTitle="Get it on"
								buttonSubTitle="Play Store"
								buttonIcon="play-store"
							/> */}
						</div>
					</div>
				</div>
				<div className="item5">
					<div className="servies_top">
						<h1 className="appointment_header1">Services</h1>
						<div className='legend-container'>
							<div className='box-legend'>
								<div className='box-available'></div>
								<p>Available</p>
							</div>
							<div className='box-legend'>
								<div className='box-confirmed'></div>
								<p>Confirmed</p>
							</div>
							<div className='box-legend'>
								<div className='box-waiting'></div>
								<p>Waiting</p>
							</div>
							{/* <div className='box-legend'>
								<div className='box-canceled'></div>
								<p>Canceled</p>
							</div> */}

						</div>
						<div className='appointment_select'>
							<p className="appointment_subheading1">Filter by stylist</p>
							<select value={stylistName} onChange={(e) => setStylistName(e.target.value)}>
								<option value="">All</option>
								{
									getStylistAppointment &&
									getStylistAppointment.session &&
									getStylistAppointment.session.data &&
									getStylistAppointment.session.data.result &&
									getStylistAppointment.session.data.result.map((item, index) => (
										<option value={item._id} key={index}>{item.name}</option>
									))
								}
							</select>

						</div>

					</div>
					<div className="services_outer">
						{getPublicAppointment &&
							getPublicAppointment.loading ?
							<PublicAppointmentSkeleton /> :
							getPublicAppointment.session && getPublicAppointment.session.data
							&& getPublicAppointment.session.data.result &&
							getPublicAppointment.session.data.result.map((d) =>
								<ServiceCard key={d._id} data={d} setInfo={setInfo} setModalState={setModalState} />)}
					</div>
				</div>
			</div>
			<BookAnAppointmentModal
				data={{
					modalState,
					setModalState,
					name,
					setName,
					email,
					setEmail,
					phone,
					setPhone,
					comments,
					setComments,
					info,
					gender,
					setGender,
					handleBookAppointment,
					publicAddAppointment,
					dateHour,
					getUserInfo,
					userLogin
				}}
			/>
		</Content>
	);
};

export default BookAppointment;
