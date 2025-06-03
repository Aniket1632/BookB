import React from 'react';
import UserDetailsStyle from './userCard.module.css'

const MonthCard = ({ item, index }) => {

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
        <div className={UserDetailsStyle.monthCardCSS} key={item._id}>
            <div className={UserDetailsStyle.userDetails} style={{ gap: '1rem' }}>
                <div className={UserDetailsStyle.user_detail_screen_main_right}>
                    <h2 className={UserDetailsStyle.monthSessionTag}> {item.total} </h2>
                </div>
                <div className={UserDetailsStyle.monthDate}>
                    <div className={UserDetailsStyle.monthDate}>
                        <h2 className={UserDetailsStyle.stylistTitle}>
                            <span style={{ color: '#ff9000', fontSize: '1.5rem' }}>{monthList[item.month - 1].name}, {new Date().getFullYear()}</span>
                        </h2>
                    </div>
                    <div>
                        <h2 className={UserDetailsStyle.monthSessions}>Session </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthCard;