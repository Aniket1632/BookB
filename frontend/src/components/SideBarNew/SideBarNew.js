import React, { useState, useEffect, useReducer } from 'react'
import StylistSidebar from '../Sidebar/StylistSidebar';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Styles from './SideBarNew.module.css'
import { useDispatch, useSelector } from 'react-redux';
import SalonSidebar from './SalonSidebar';
import AdminSidebar from './AdminSidebar';
import { logout } from '../../redux/actions/userActions';
import SessionTimeoutModal from '../SessionTimeoutModal';

const SideBarNew = ({ current = 'none', setModalLogOutState }) => {

    const [userRole, setUserRole] = useState('');
    // const [logo, setLogo] = useState('/assets/logo-dark.png');
    const userData = useSelector((state) => state.getUserInfo);
    const dispatch = useDispatch()

    useEffect(
        () => {
            if (userData && userData.error && userData.error.status === false) {
                dispatch(logout());
            }
        },
        [userData, dispatch]
    );

    useEffect(
        () => {
            if (userData && !userData.loading && userData.userInfo && userData.userInfo.data) {
                setUserRole(userData.userInfo.data.role);
            }
            // if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data.role === 'salon') {
            // 	setLogo(userData.userInfo.data.photo);
            // 	setLogoAlt(userData.userInfo.data.name);
            // }
            // if (
            // 	userData &&
            // 	userData.userInfo &&
            // 	userData.userInfo.status &&
            // 	userData.userInfo.data.role === 'stylist' &&
            // 	userData.userInfo.data.salon &&
            // 	userData.userInfo.data.salon.photo
            // ) {
            // 	setLogo(userData.userInfo.data.salon.photo);
            // 	setLogoAlt(userData.userInfo.data.salon.name);
            // }
        },
        [userData]
    );

    useEffect(
        () => {
            if (userData && userData.userInfo && userData.userInfo.data && userRole !== '') {
                let subMenu = document.getElementsByClassName('hasChildren');
                let navSub = document.querySelector('.navigation__sub__active');
                if (navSub) {
                    const parentNavSub = navSub.parentElement.parentElement.parentElement;
                    parentNavSub.classList.toggle('subMenuActive');
                }

                for (let i = 0; i < subMenu.length; i++) {
                    subMenu[i].addEventListener('click', function () {
                        this.classList.toggle('subMenuActive');
                    });
                }
            }
        },
        [userData, userRole]
    );


    return (
        <nav className={Styles.navigation}>
            <Fragment>
                <div>
                    <div className='.navigation__logo'>
                    <img src='./assets/favicon.png' alt='logo' className={Styles.navigation__logo} />
                    <img src='./assets/favicon.png' alt='logo' className={Styles.navigation__logo2} />
                    </div>

                    <ul className='navigation__list'>
                        {userRole === 'superadmin' ? (
                            <SalonSidebar current={current} />
                        ) : userRole === 'salon' ? (
                            <SalonSidebar current={current} />
                        ) : userRole === 'manager' ? (
                            <SalonSidebar current={current} />
                        ) : userRole === 'admin' ? (
                            <AdminSidebar current={current} />
                        ) : (
                            userRole === 'stylist' && <StylistSidebar current={current} stylistId={userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data._id} />
                        )}
                    </ul>
                </div>

                <ul className='navigation__list'>
                {/* {userRole === 'stylist' &&(
                <div className={`${current === 'Rewards' ? 'currentNav' : ''}`}>
                        <li className='navigation__list--item'>
                            <Link to='/rewards' className='navigation__list--link'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-reward`} />
                                </svg>
                                &nbsp;
                            </Link>
                        </li>
                        <li className='navigation__list--itemHover'>
                            <Link to='/rewards' className='navigation__list--link2'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#sideBar-reward-coins`} />
                                </svg>
                                <span>Rewards</span>
                            </Link>
                            {current === 'Rewards' && <div className='activeNav' />}
                        </li>
                </div>)} */}
                    <div  className={`${current === 'My-Profile' ? 'currentNav ' : ''}`}>
                        <li className='navigation__list--item'>
                            <Link to='/my-profile' className='navigation__list--link'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                </svg>
                                &nbsp;
                            </Link>
                        </li>
                        <li className='navigation__list--itemHover'>
                            <Link to='/my-profile' className='navigation__list--link2'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                </svg>
                                <span>My Profile</span>
                            </Link>
                            {current === 'My-Profile' && <div className='activeNav' />}
                        </li>

                    </div>
                    <div>
                        <li className='navigation__list--item' onClick={() => {
                                setModalLogOutState(true);
                            }}>
                            <Link to='/' className='navigation__list--link'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-logout`} />
                                </svg>
                                &nbsp;
                            </Link>
                        </li>
                        <li
                            className='navigation__list--itemHover'
                            onClick={() => {
                                setModalLogOutState(true);
                            }}>
                            <button className='navigation__list--link2 navigation__list--link2--logout'>
                                <svg className='navigation__icon2'>
                                    <use xlinkHref={`/assets/sprite.svg#icon-logout`} />
                                </svg>
                                <span>Log Out</span>
                            </button>
                        </li>
                    </div>
                    <div className='navigation__list--copyrightHidden'>
                        <span>
                            &nbsp;<br />&nbsp;
                        </span>
                    </div>
                    <div className='navigation__list--copyright'>
                        &copy; {new Date().getFullYear()} BookB <br />
                        <span>
                            Powered By {' '}
                            <a target='_blank' href='https://www.the-algo.com/' >
                                The Algorithm
                            </a>
                        </span>
                    </div>
                </ul>
            </Fragment>
        </nav>
    )
}

export default SideBarNew
