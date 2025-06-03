import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ActivitySkeleton from '../Skeletons/Activityskeleton';
import ActivitySkeletonSmall from '../Skeletons/ActivitySkeletonSmall';
import { getAdminSalonSubscriptionReportAction } from '../../redux/actions/reportActions';
import moment from "moment"
import { inputPhoneMasking } from '../../utils/validators';
import Styles from './AppointmentSectionNew.module.css'
import Content from '../Content/Content';


const AppointmentSectionNew = ({
    getActivity,
    activeToggle,
    getRecentAppointment,
    getUpcomingAppointment,
    handleAppointmentModal,
    handleSubscriptionModal }) => {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.getUserInfo);
    const getSalonSubscriptionReport = useSelector((state) => state.getSalonSubscriptionReport);

    // getSalonSubscriptionReport
    useEffect(() => {
        dispatch(getAdminSalonSubscriptionReportAction())
    }, [])


    return (
        <>
            {userData && userData?.userInfo && userData?.userInfo?.data?.role === "admin" ?
                <>
                    <div className='current_appointment'>
                        <h2 className='appointment_upcoming'>Salon Subscription</h2>
                        {
                            getSalonSubscriptionReport &&
                            getSalonSubscriptionReport.report &&
                            getSalonSubscriptionReport.report.data &&
                            getSalonSubscriptionReport.report.data.map(item => (

                                <div className='appointment_card' onClick={() => handleSubscriptionModal(item)}>
                                    <div className='stylist_box'>
                                        <img src={item && item.photo}
                                            className='stylist_img'></img>
                                        <div className='stylist_text'>
                                            <span>{item && item.name}</span>
                                            <div className='stylist-section' style={{ gap: '0.5rem' }}>
                                                <span className={item && item.subscription && item.subscription[0] && item.subscription[0].active ? "colorGreen" : "colorRed"}>•</span> <p style={{ fontWeight: 499 }}>{item && item.subscription && item.subscription[0] && item.subscription[0].active ? "Active" : "Expired"}</p>
                                            </div>

                                            <p style={{ fontWeight: 499 }}>{item && item.email}</p>
                                            <p style={{ fontWeight: 499 }}>{inputPhoneMasking(item && item.phone)}</p>
                                            <p>expires {moment(item && item.subscription && item.subscription[0] && item.subscription[0].packageExpiry).startOf('day').fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </>
                :
                <>
                    {getRecentAppointment.loading ? <ActivitySkeleton /> :
                        <>
                            <div className='current_appointment'>
                                <h2 className='appointment_upcoming'>Current Appointments</h2>

                                {getRecentAppointment && getRecentAppointment.report && getRecentAppointment.report.data && getRecentAppointment.report.data.length > 0
                                    ? getRecentAppointment.report.data.map((item, id) => {
                                        return (
                                            <div className='appointment_card' key={id} style={{ cursor: 'pointer' }} onClick={() => handleAppointmentModal(item)}>
                                                <div className='appointment_time'>
                                                    <div className='time_circle'></div>
                                                    <p style={{ fontSize: '1.2rem' }}> {item.timeAsAString} | {item && item.subServiceData && item.subServiceData.title}</p>
                                                </div>
                                                <div className='appointment_name'>
                                                    <div className='stylist-section'>
                                                        <svg className='navigation__icon1'>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                                        </svg>
                                                        <h1>{item.userName}</h1>
                                                    </div>
                                                    <div className='stylist-section'>
                                                        <svg className='navigation__icon1'>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-stylist`} />
                                                        </svg>
                                                        <p style={{ fontSize: '1.5rem' }}>{item.stylistData && item.stylistData.name} </p>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }) :
                                    <div style={{ background: '#040404' }} className='appointment_card'>
                                        <p style={{ fontSize: '1.4rem' }}>No Appointment Available</p>
                                    </div>
                                }
                            </div>
                            <div className='current_appointment'>
                                <h2 className='appointment_upcoming'>Upcoming Appointments</h2>

                                {getUpcomingAppointment && getUpcomingAppointment.report && getUpcomingAppointment.report.data && getUpcomingAppointment.report.data.length > 0
                                    ? getUpcomingAppointment.report.data.map((item, id) => {
                                        return (
                                            <div className='appointment_card' key={id} style={{ cursor: 'pointer' }} onClick={() => handleAppointmentModal(item)}>
                                                <div className='appointment_time'>
                                                    <div className='time_circle'></div>
                                                    <p style={{ fontSize: '1.2rem' }}> {item.timeAsAString} | {item && item.subServiceData && item.subServiceData.title}</p>
                                                </div>
                                                <div className='appointment_name'>
                                                    <div className='stylist-section'>
                                                        <svg className='navigation__icon1'>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                                        </svg>
                                                        <h1>{item.userName}</h1>
                                                    </div>
                                                    <div className='stylist-section'>
                                                        <svg className='navigation__icon1'>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-stylist`} />
                                                        </svg>
                                                        <p style={{ fontSize: '1.5rem' }}>{item.stylistData && item.stylistData.name} </p>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }) :
                                    <div style={{ background: '#040404' }} className='appointment_card'>
                                        <p style={{ fontSize: '1.4rem' }}>No Appointment Available</p>
                                    </div>
                                }
                            </div>
                        </>}
                </>
            }

        </>
    )
}


export default AppointmentSectionNew

