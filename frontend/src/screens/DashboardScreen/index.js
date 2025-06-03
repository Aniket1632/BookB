import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Content from '../../components/Content/Content'
import DashboardCard from '../../components/Skeletons/DashboardCard'
import { geCurrentAppointmentAction, geCurrentYearAction, getAdminDashboardReportAction, getAdminSalonAppointmentReportAction, getDahboardCountAction } from '../../redux/actions/reportActions'
import BarChar from './BarChar'
import DasboardCard from './DasboardCard'
import "./Dashboard.css"
import LineChart from './LineChart'
import PieChart from './PieChart'
import RangeDatePickerModal from './RangeDatePickerModal'
import Stylist from './Stylist'
import moment from "moment"
import AppointmentDetail from './AppointmentDetail'
import SubscriptionDetail from './SubscriptionDetail'


const Dashboard = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.getUserInfo);
    const getDahboardCount = useSelector((state) => state.getDahboardCount);
    const getCurrentYear = useSelector((state) => state.getCurrentYear);
    const getCurrentAppointment = useSelector((state) => state.getCurrentAppointment);
    const getAdminDashboardReport = useSelector((state) => state.getAdminDashboardReport);
    const getSalonAppointmentReport = useSelector((state) => state.getSalonAppointmentReport);

    const [fromDate, setFromDate] = useState(moment().startOf('month').format('MM/DD/YYYY'));
    const [toDate, setToDate] = useState(moment().endOf('month').format('MM/DD/YYYY'));
    const [appointmentModal, setAppointmentModal] = useState(false)
    const [appointmentInfo, setAppointmentInfo] = useState("")
    const [subscriptionModal, setSubscriptionModal] = useState(false)
    const [subscriptionInfo, setSubscriptionInfo] = useState("")


    useEffect(
        () => {
            if (userData && userData?.userInfo && userData?.userInfo?.data?.role === "admin") {
                dispatch(getAdminDashboardReportAction())
                dispatch(getAdminSalonAppointmentReportAction())
            } else {
                dispatch(getDahboardCountAction({
                    "fromDate": fromDate,
                    "toDate": toDate
                }))
                dispatch(geCurrentYearAction())
                dispatch(geCurrentAppointmentAction({
                    "fromDate": fromDate,
                    "toDate": toDate
                }))
            }
        },
        [userData, fromDate, toDate, dispatch]
    );

    const datePickerHandler = (startDate, endDate) => {
        setFromDate(startDate)
        setToDate(endDate)
        dispatch(getDahboardCountAction({
            "fromDate": startDate,
            "toDate": endDate
        }))
        dispatch(geCurrentYearAction())
        dispatch(geCurrentAppointmentAction({
            "fromDate": startDate,
            "toDate": endDate
        }))
    }

    const handleAppointmentModal = (item) => {
        setAppointmentInfo(item)
        setAppointmentModal(true)
    }

    const handleAppointmentModalClose = () => {
        setAppointmentModal(false)
        setAppointmentInfo("")
    }

    const handleSubscriptionModal = (item) => {
        setSubscriptionInfo(item)
        setSubscriptionModal(true)
    }

    const handleSubscriptionModalClose = () => {
        setSubscriptionModal(false)
        setSubscriptionInfo("")
    }




    return (

        <Content
            containerStyle={{ height: '88vh' }}
            currentMenu='dashboard'
            headerTitle='Dashboard'
            showAppointment={true}
            stylistId="6299b92c3eae091c59206854"
            handleAppointmentModal={handleAppointmentModal}
            handleAppointmentModalClose={handleAppointmentModalClose}
            appointmentModal={appointmentModal}
            handleSubscriptionModal={handleSubscriptionModal}
            handleSubscriptionModalClose={handleSubscriptionModalClose}
            subscriptionModal={subscriptionModal}
        >
            <RangeDatePickerModal data={{
                fromDate,
                toDate,
                setFromDate,
                setToDate,
                datePickerHandler
            }} />
            {
                userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role === "admin" ?
                    <>
                        {
                            getAdminDashboardReport && getAdminDashboardReport.report && getAdminDashboardReport.report.status ?
                                <div className='dashboard'>
                                    <div className='dashboard_section_1' style={{ height: 'fit-content' }}>
                                        <DasboardCard data={getAdminDashboardReport && getAdminDashboardReport.report && getAdminDashboardReport.report.data} role={userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role} />
                                        {/* <PieChart userPieData={getDahboardCount && getDahboardCount.report && getDahboardCount.report.data} /> */}
                                    </div>
                                    <BarChar appointmentData={getSalonAppointmentReport && getSalonAppointmentReport.report && getSalonAppointmentReport.report.data} role={userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role} />
                                    {/* <div className='dashboard_section_3'>
                            <Stylist data={getCurrentAppointment && getCurrentAppointment.report && getCurrentAppointment.report.data} />
                            <LineChart currentData={getCurrentYear && getCurrentYear.report && getCurrentYear.report.data} />
                        </div> */}
                                </div>
                                :
                                <DashboardCard />
                        }
                    </>
                    :
                    <>
                        {
                            getDahboardCount && getDahboardCount.report && getDahboardCount.report.data ?
                                <div className='dashboard'>
                                    <div className='dashboard_section_1' >
                                        <DasboardCard data={getDahboardCount && getDahboardCount.report && getDahboardCount.report.data} role={userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role} />
                                        <PieChart userPieData={getDahboardCount && getDahboardCount.report && getDahboardCount.report.data} />
                                    </div>
                                    <BarChar appointmentData={getDahboardCount && getDahboardCount.report && getDahboardCount.report.data} />
                                    {
                                        userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role === "salon" &&
                                        <div className='dashboard_section_3'>
                                            <Stylist data={getCurrentAppointment && getCurrentAppointment.report && getCurrentAppointment.report.data} />
                                            <LineChart currentData={getCurrentYear && getCurrentYear.report && getCurrentYear.report.data} />
                                        </div>
                                    }
                                    {
                                        userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data.role === "stylist" &&
                                        <div className='dashboard_section_3'>
                                            {/* <Stylist data={getCurrentAppointment && getCurrentAppointment.report && getCurrentAppointment.report.data} /> */}
                                            <LineChart currentData={getCurrentYear && getCurrentYear.report && getCurrentYear.report.data} style={{ width: '100%' }} />
                                        </div>
                                    }

                                </div>
                                :
                                <DashboardCard />
                        }
                    </>
            }

            <AppointmentDetail
                data={{
                    handleAppointmentModal,
                    handleAppointmentModalClose,
                    appointmentModal,
                    appointmentInfo
                }}
            />
            <SubscriptionDetail
                data={{
                    handleSubscriptionModal,
                    handleSubscriptionModalClose,
                    subscriptionModal,
                    subscriptionInfo
                }}
            />



        </Content>
    )
}

export default Dashboard