import React, { useEffect, useState } from 'react'
import Styles from './Content.module.css'
import SideBarNew from '../SideBarNew/SideBarNew'
import HeaderNew from '../HeaderNew/HeaderNew';
import AppointmentList from '../AppointmentList';
import AppointmentSectionNew from '../AppointmentSectionNew/AppointmentSectionNew';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../redux/actions/userActions';
import { getActivityListAction } from '../../redux/actions/appointmentAction';
import LogOut from '../LogoutModal';
import moment from "moment";
import { getRecentAppointmentReportAction, getUpcomingAppointmentReportAction } from '../../redux/actions/reportActions';
import SessionTimeoutModal from '../SessionTimeoutModal';

const Content = ({
    children,
    headerTitle,
    switchView,
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
    showHeader = true,
    websiteSettings = false,
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
    containerStyle,
    listFilter,
    listType,
    getTypeList,
    onTypeListChange }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [sideBar, setSideBar] = useState(true);
    const [modalLogOutState, setModalLogOutState] = useState(false);
    const [activeToggle, setActiveToggle] = useState(true);
    const [logoutModal, setLogoutModal] = useState();

    const userData = useSelector((state) => state.getUserInfo);

    React.useEffect(() => {
     const checkToken = async () => {
           if (userData && userData.error) {
             setLogoutModal(true);
           }
         };
         checkToken();
      }, [dispatch, userData]);

      React.useEffect(() => {
        const checkToken = async () => {
              if (userData && userData.userInfo && userData.userInfo.status === false) {
                setLogoutModal(true);
              }
            };
            checkToken();
         }, [dispatch, userData]);

    const toggleMenu = () => {
        // let navigation = document.querySelector(Styles.navigation);
        let navigation = document.querySelector('.navigation');
        let mainContent = document.querySelector('.mainContent');
        let sidebarnav__button = document.querySelector('.sidebarnav__button');
        let logo = document.querySelector('.navigation__logos');
        navigation.classList.toggle('active');
        mainContent.classList.toggle('mainContent__active');
        sidebarnav__button.classList.toggle('sidebarnav__button_active');
        logo.classList.toggle('active_logos');
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
    }, [stylistId, dispatch, history])

    useEffect(() => {
        dispatch(getActivityListAction({
            stylistId: stylistId,
            fromDate: moment().toISOString()
        }))
        dispatch(getUpcomingAppointmentReportAction())
        dispatch(getRecentAppointmentReportAction())
    }, [addAppointment,
        updateAppointment,
        deleteAppointment])

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
        <div className={Styles.container}>
            <div className='navigation'>
                <div className='navigation__logos' >
                    {/* <img src='./assets/favicon.png' alt='logo' style={{height:'7rem' , paddingLeft:'1rem' ,paddingTop:'1rem', position:'static' }} /> */}
                </div>
                <SideBarNew current={currentMenu} setModalLogOutState={setModalLogOutState} />
                <button className='sidebarnav__button' onClick={toggleMenu}>
                    <svg className='sidebarnav__icon'>
                        <use xlinkHref={`/assets/sprite.svg#icon-${sideBar ? 'chevron-left' : 'chevron-right'}`} />
                    </svg>
                </button>
            </div>
            <div className="mainContent" style={{ background: websiteSettings ? 'white' : '#000000', padding: websiteSettings ? '1rem' : 'inherit'}}>
                <div className='contentBox1'>
                    {/* <button className='sidebarnav__button' onClick={toggleMenu}>
                        <svg className='sidebarnav__icon'>
                            <use xlinkHref={`/assets/sprite.svg#icon-${sideBar ? 'chevron-left' : 'chevron-right'}`} />
                        </svg>
                    </button>               */}
                    {showHeader&&<HeaderNew
                    switchView={switchView}
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
                        onTypeListChange={onTypeListChange} />}

                    <div className={showAppointment ? Styles.content_dashboard : Styles.content} style={containerStyle}>
                        <div className={Styles.content_box_dashboard} >
                            {children}
                        </div>
                        {showAppointment && <div className='appointment_main' style={{
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        }}>
                            {currentMenu !== 'dashboard' && <button className={activeToggle ? 'appointment__button' : 'appointment__button1'} onClick={() => setActiveToggle(!activeToggle)}>
                                <svg className='sidebarnav__icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-${activeToggle ? 'chevron-right' : 'chevron-left'}`} />
                                </svg>
                            </button>}
                            <div className={Styles.appointmentBox}>
                                <AppointmentSectionNew
                                    getUpcomingAppointment={getUpcomingAppointment}
                                    getRecentAppointment={getRecentAppointment}
                                    handleAppointmentModal={handleAppointmentModal}
                                    handleSubscriptionModal={handleSubscriptionModal}
                                    activeToggle={activeToggle}
                                    getActivity={getActivity}
                                /> :
                                {/* <AppointmentList activeToggle={activeToggle} getActivity={getActivity} /> */}
                            </div>
                        </div>}
                        <LogOut data={{ modalLogOutState, onLogOutModalClose, onLogOutHandler }} />
                        <SessionTimeoutModal data={{logoutModal, onLogOutHandler}}/>

                    </div>

                </div>
            </div>
        </div>

    )
}

export default Content
