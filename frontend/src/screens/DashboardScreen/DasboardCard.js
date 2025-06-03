import React from 'react'

const DasboardCard = ({ data, role }) => {
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
                                <span>{data && data.salons}</span>
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
                                <span>{data && data.appointments}</span>
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
                                <span>{data && data.stylists}</span>
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
                                <span>{data && data.users}</span>
                                <p>Users</p>
                            </div>
                        </div>


                    </div>
                    :
                    <div className='dashboard_cards'>
                        <div className='dashboard_card'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-calendar`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.appointment}</span>
                                <p>Appointments</p>
                            </div>

                        </div>
                        <div className='dashboard_card'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-growth`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.sales}</span>
                                <p>Total Sales</p>
                            </div>

                        </div>
                        <div className='dashboard_card'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-users`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.users}</span>
                                <p>Users</p>
                            </div>
                        </div>
                        <div className='dashboard_card'>
                            <div className='card_black'>
                                <svg className='dashboard_icon'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-briefcase`} />
                                </svg>
                            </div>
                            <div className='card_details'>
                                <span>{data && data.services}</span>
                                <p>Services</p>
                            </div>

                        </div>

                    </div>
            }

        </>
    )
}

export default DasboardCard