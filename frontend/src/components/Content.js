import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LogOut from './LogoutModal';
import { logout } from '../redux/actions/userActions';
import AppointmentList from './AppointmentList';
import { getActivityListAction } from '../redux/actions/appointmentAction';
import moment from "moment";
import ActivitySkeleton from './Skeletons/Activityskeleton';
import { getRecentAppointmentReportAction, getUpcomingAppointmentReportAction } from '../redux/actions/reportActions';
import AppointmentSection from '../screens/DashboardScreen/AppointmentSection';


const Content = ({
	children,
	headerTitle,
	currentMenu,
	addBtn,
	addBtnText,
	addBtnIcon,
	addBtnClick,
	search,
	searchIcon,
	searchPlaceholder,
	searchvalue,
	searchOnChange,
	showAppointment = false,
	stylistId,
	addAppointment,
	updateAppointment,
	deleteAppointment,
	handleAppointmentModal,
	handleAppointmentModalClose,
	appointmentModal,
	handleSubscriptionModal,
	handleSubscriptionModalClose,
	subscriptionModal,
	listFilter,
	listType,
	getTypeList,
	onTypeListChange,
}) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [sideBar, setSideBar] = useState(true);
	const [modalLogOutState, setModalLogOutState] = useState(false);
	const [activeToggle, setActiveToggle] = useState(true)

	const toggleMenu = () => {
		let navigation = document.querySelector('.navigation');
		let mainContent = document.querySelector('.mainContent');
		let sidebarnav__button = document.querySelector('.sidebarnav__button');
		navigation.classList.toggle('active');
		mainContent.classList.toggle('mainContent__active');
		sidebarnav__button.classList.toggle('sidebarnav__button_active');
		setSideBar(!sideBar);
	};

	const userLogin = useSelector((state) => state.userLogin);
	const getActivity = useSelector((state) => state.getActivity);
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const getRecentAppointment = useSelector((state) => state.getRecentAppointment);
	const getUpcomingAppointment = useSelector((state) => state.getUpcomingAppointment);

	useEffect(() => {
		let timer = '';
		let split = history.location.pathname.split('/');
		if (getUserInfo &&
			getUserInfo.userInfo &&
			getUserInfo.userInfo.data &&
			split[1] === 'stylist-sessions' &&
			(getUserInfo.userInfo.data.role === 'salon' || getUserInfo.userInfo.data.role === 'stylist')) {

			let timer = setInterval(() => {
				dispatch(getActivityListAction({
					stylistId: stylistId,
					fromDate: moment().toISOString()
				}))
				dispatch(getUpcomingAppointmentReportAction())
				dispatch(getRecentAppointmentReportAction())
			}, 25000);

			return () => clearTimeout(timer);
		} else {
			clearTimeout(timer);
			clearInterval(timer)
		}
	}, [stylistId, dispatch, history, getUserInfo])

	useEffect(() => {
		dispatch(getActivityListAction({
			stylistId: stylistId,
			fromDate: moment().toISOString()
		}))
		dispatch(getUpcomingAppointmentReportAction())
		dispatch(getRecentAppointmentReportAction())
	}, [addAppointment,
		updateAppointment,
		deleteAppointment,
		stylistId,
		dispatch,])

	useEffect(
		() => {
			if (userLogin && !userLogin.userInfo) {
				history.push('/login');
			}
		},
		[userLogin, history]
	);

	const onLogOutModalClose = () => {
		setModalLogOutState(false);
	};

	const onLogOutHandler = () => {
		setModalLogOutState(false);
		dispatch(logout());
	};

	return (
		<main className='container'>
			<Sidebar current={currentMenu} setModalLogOutState={setModalLogOutState} />
			<div className='mainContent'>
				<div className='content_box1'>
					<button className='sidebarnav__button' onClick={toggleMenu}>
						<svg className='sidebarnav__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-${sideBar ? 'chevron-left' : 'chevron-right'}`} />
						</svg>
					</button>
					{headerTitle && (
						<Header
							title={headerTitle}
							addBtn={addBtn}
							addBtnText={addBtnText}
							addBtnIcon={addBtnIcon}
							addBtnClick={addBtnClick}
							search={search}
							searchIcon={searchIcon}
							searchPlaceholder={searchPlaceholder}
							searchvalue={searchvalue}
							searchOnChange={searchOnChange}

							listFilter={listFilter}
							listType={listType}
							getTypeList={getTypeList}
							onTypeListChange={onTypeListChange}
						/>
					)}
					<div className='content' >
						<div className='content_box' >
							{children}
						</div>
						{showAppointment && <div className='appointment_main'>
							{currentMenu !== 'dashboard' && <button className={activeToggle ? 'appointment__button' : 'appointment__button1'} onClick={() => setActiveToggle(!activeToggle)}>
								<svg className='sidebarnav__icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-${activeToggle ? 'chevron-right' : 'chevron-left'}`} />
								</svg>
							</button>}
							<div className={activeToggle ? 'appointment_box' : 'appointment_box1'}>
								{currentMenu === 'dashboard' ?
									<AppointmentSection
										getUpcomingAppointment={getUpcomingAppointment}
										getRecentAppointment={getRecentAppointment}
										activeToggle={activeToggle}
										getActivity={getActivity}
										handleAppointmentModal={handleAppointmentModal}
										handleSubscriptionModal={handleSubscriptionModal}
									/> :
									<AppointmentList activeToggle={activeToggle} getActivity={getActivity} />}
							</div>

						</div>}

						<LogOut data={{ modalLogOutState, onLogOutModalClose, onLogOutHandler }} />
					</div>
				</div>
			</div>
		</main>
	);
};

export default Content;

