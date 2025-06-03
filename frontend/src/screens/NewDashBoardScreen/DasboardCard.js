import React, { useEffect, useState } from 'react'
import { getRetentionStats } from '../../redux/actions/userActions'
import { getAppointmentConersionRate } from '../../redux/actions/userActions'
import { getAverageTicketValue } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { formatNumber } from '../../utils/validators'

const DasboardCard = ({ data, role }) => {
    const dispatch = useDispatch();
    const [ticketAmount, setTicketAmount] = useState(null);
    const [conversionRate, setConversionRate] = useState(null);
    const [customerRetentionRate, setCustomerRetentionRate] = useState(null);
    const userData = useSelector((state) => state.getUserInfo);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const data1 = await dispatch(getRetentionStats());
                setCustomerRetentionRate(data1[0].percent === 0 ? '-' : data1[0].percent);
            } catch (error) {
                console.error('Error fetching retention stats:', error);
            }
        };

        fetchDataFromAPI();
    }, [dispatch])

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const data2 = await dispatch(getAppointmentConersionRate());
                setConversionRate(data2[0].percent);

            } catch (error) {
                console.error('Error fetching retention stats:', error);
            }
        };

        fetchDataFromAPI();
    }, [dispatch])

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const data3 = await dispatch(getAverageTicketValue());
                setTicketAmount(data3[0].amount);
            } catch (error) {
                console.error('Error fetching retention stats:', error);
            }
        };

        fetchDataFromAPI();
    }, [dispatch])

    return (

        <>

            {
                role === "admin" ?
                    <div className='dashboard_cards1'>
                        <div className='dashboard_card1'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-growth`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.salons === 0 ? '-' : data.salons}</span>
                                <p>Salons</p>
                            </div>

                        </div>
                        <div className='dashboard_card1'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-calendar`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.appointments === 0 ? '-' : data.appointments}</span>
                                <p>Appointments</p>
                            </div>

                        </div>

                        <div className='dashboard_card1'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-briefcase`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.stylists === 0 ? '-' : data.stylists}</span>
                                <p>Stylists</p>
                            </div>
                        </div>

                        <div className='dashboard_card1'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-users`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.users === 0 ? '-' : data.users}</span>
                                <p>Users</p>
                            </div>
                        </div>


                    </div>
                    :
                    <div className='dashboard_cards'>
                        <div className='dashboard_small_cards'>
                            <div className='dashboard_card_new'>
                                <div className='card_details' style={{ textAlign: 'center' }}>
                                    <span>{formatNumber(data && data.appointment === 0 ? '-' : data.appointment)}</span>
                                    <div className='card_black_new'>
                                        <svg className='dashboard_icon'>
                                            <use xlinkHref={`/assets/sprite.svg#icon-new-calendar`} />
                                        </svg>
                                        <p>Appointments</p>
                                    </div>
                                </div>

                            </div>
                            <div className='dashboard_card_new'>
                                <div className='card_details' style={{ textAlign: 'center' }}>
                                    <span>
                                        {formatNumber(
                                            data?.sales?.length > 0
                                                ? data.sales[0].totalSales === 0
                                                    ? '-'
                                                    : <>
                                                        <span className='currency_stat'>{userData?.userInfo?.data?.currency}</span> {data.sales[0].totalSales}
                                                    </>
                                                : '-'
                                        )}
                                    </span>
                                    <div className='card_black_new'>
                                        <svg className='dashboard_icon' style={{ marginTop: '0.5rem' }}>
                                            <use xlinkHref={`/assets/sprite.svg#icon-sales`} />
                                        </svg>
                                        <p>Total Sales</p>
                                    </div>
                                </div>

                            </div>
                            <div className='dashboard_card_new'>

                                <div className='card_details' style={{ textAlign: 'center' }}>
                                    <span style={{ display: 'block', paddingTop: '1.5rem' }}>{customerRetentionRate && customerRetentionRate.length !== 0 ? `${Math.floor(customerRetentionRate)}%` : '-'}<span style={{ fontSize: '3rem' }}></span></span>
                                    <div className='card_black_new'>
                                        {/* <svg className='dashboard_icon'>
                        <use xlinkHref={`/assets/sprite.svg#icon-users`} />
                    </svg> */}
                                        <p >Customer Retention Rate</p>
                                    </div>
                                </div>
                            </div>
                            <div className='dashboard_card_new'>
                                <div className='card_details' style={{ textAlign: 'center' }}>
                                    <span>{formatNumber(data && data.users === 0 ? '-' : data.users)}</span>
                                    <div className='card_black_new'>
                                        <svg className='dashboard_icon'>
                                            <use xlinkHref={`/assets/sprite.svg#icon-users`} />
                                        </svg>
                                        <p>Users</p>
                                    </div>
                                </div>

                            </div>
                            <div className='dashboard_card_new'>
                                <div className='card_details' style={{ textAlign: 'center' }}>
                                    <span>{formatNumber(data && data.services === 0 ? '-' : data.services)}</span>
                                    <div className='card_black_new' >
                                        <svg className='dashboard_icon' >
                                            <use xlinkHref={`/assets/sprite.svg#icon-services`} />
                                        </svg>
                                        <p >Services</p>
                                    </div>
                                </div>

                            </div>
                            <div className='dashboard_card_new'>
                                <div className='card_details'>
                                    <span>
                                    {ticketAmount && ticketAmount.length === 0 ? <span className='currency_stat'>{userData?.userInfo?.data?.currency} </span>: null}
                                        {ticketAmount && ticketAmount.length === 0 ? `
                                         ${formatNumber(Math.floor(ticketAmount))}` : '-'}
                                    </span>
                                    <div className='card_black_new' style={{ textAlign: 'center' }}>
                                        {/* <svg className='dashboard_icon' style={{marginTop: '0.3rem'}}>
                        <use xlinkHref={`/assets/sprite.svg#icon-services`} />
                    </svg> */}
                                        <p>Average ticket value </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='dashboard_big_card'>
                            <div className='dashboard_card_new1'>
                                <div className='card_details1' style={{ textAlign: 'center' }}>
                                    <span>{conversionRate && conversionRate.length !== 0 ? Math.floor(conversionRate) + '%' : '-'}</span>
                                    {/* <span>{conversionRate === 0 ? '%' : ''}</span> */}
                                    <div className='card_black_new' >
                                        {/* <svg className='dashboard_icon' >
                        <use xlinkHref={`/assets/sprite.svg#icon-users`} style={{marginRight:'1rem'}}/>
                    </svg> */}
                                        <p style={{ fontSize: '2rem' }}>Appointments Conversion Rate</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
            }

        </>
    )
}

export default DasboardCard