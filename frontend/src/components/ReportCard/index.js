import React from 'react';
import UserDetailsStyle from './userCard.module.css'

const UserCard = ({ item, index }) => {
    return (
        <div className={UserDetailsStyle.userCard} key={item._id}>
            <div className={UserDetailsStyle.userDetails}>
                <img src={item.stylist.photo} className={UserDetailsStyle.user_detail_screen_main_image} />
                <h2 className={UserDetailsStyle.stylistTitle} style={{ color: '#ff9000' }}>
                    {item.stylist.name}
                </h2>
            </div>
            <div className={UserDetailsStyle.userDetails}>
                <div className={UserDetailsStyle.user_detail_screen_main_right}>

                </div>
                <div className={UserDetailsStyle.user_detail_screen_main_left}>
                    <div>

                    </div>
                    <div>
                        <h2 className={UserDetailsStyle.stylistTitle}>Session : {item.session}   </h2>
                        <h2 className={UserDetailsStyle.stylistTitle}> Earning : $  {item.earning}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard;