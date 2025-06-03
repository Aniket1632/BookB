import React from 'react';
import UserDetailsStyle from './userCard.module.css'

const EarningCard = ({ item, index }) => {

    const monthList = [
        { name: 'January', id: 1 },
        { name: 'February', id: 2 },
        { name: 'March', id: 3 },
        { name: 'April', id: 4 },
        { name: 'May', id: 5 },
        { name: 'June', id: 6 },
        { name: 'July', id: 7 },
        { name: 'August', id: 8 },
        { name: 'September', id: 9 },
        { name: 'October', id: 10 },
        { name: 'November', id: 11 },
        { name: 'December', id: 12 }
    ];
    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', height: '20rem' }} className={UserDetailsStyle.userCard} key={item._id}>
            <div className={UserDetailsStyle.userDetails}>
                <div className={UserDetailsStyle.user_detail_screen_main_right} style={{ flexDirection: 'column' }}>
                    <h2 className={UserDetailsStyle.stylistTitle}>
                        <span style={{ color: '#ff9000', fontSize: '2rem' }}>{monthList[item.month - 1].name}, <br /> {new Date().getFullYear()}  
                        </span>
                    </h2>
                </div>
                <div className={UserDetailsStyle.monthDate}>
                    <h1 className={UserDetailsStyle.stylistTitle}> {item.total_session}   <span style={{ fontSize: '1.2rem' }}> Session</span> </h1>
                    <h1 className={UserDetailsStyle.stylistTitle}>$  {item.earning}   <span style={{ fontSize: '1.2rem' }}>Earning by Stylist</span> </h1>
                    <h1 className={UserDetailsStyle.stylistTitle}>$  {item.utilities}   <span style={{ fontSize: '1.2rem' }}>Utilities</span> </h1>
                </div>
            </div>

            <div className={UserDetailsStyle.userDetails}>
                <h2 className={UserDetailsStyle.stylistTitle} style={{ fontSize: '3rem' }}>$  {item.total}</h2>
            </div>
        </div>
    )
}

export default EarningCard;