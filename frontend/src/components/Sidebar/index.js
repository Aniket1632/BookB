import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/userActions';

import AdminSidebar from './AdminSidebar';
import SalonSidebar from './SalonSidebar';
import StylistSidebar from './StylistSidebar';

import './Sidebar.css';
import SidebarSkeleton from '../Skeletons/SidebarSkeleton';

const Sidebar = ({ current = 'none', setModalLogOutState }) => {
	const dispatch = useDispatch();
	const [userRole, setUserRole] = useState('');
	// const [logo, setLogo] = useState('/assets/logo-dark.png');
	// const [logoAlt, setLogoAlt] = useState('Salon logo');
	const userData = useSelector((state) => state.getUserInfo);

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
		<nav className='navigation' style={{ zIndex: 500 }}>
			{userData && userData.loading ? (
				<SidebarSkeleton />
			) : (
				<Fragment>
					<div>
						<img src='./assets/favicon.png' alt='logo' className='navigation__logo' />
						<img src='./assets/favicon.png' alt='logo' className='navigation__logo2' />

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
								userRole === 'stylist' && <StylistSidebar current={current} stylistId={userData && userData.userInfo  && userData.userInfo.data  && userData.userInfo.data._id }/>
								// userRole === 'stylist' && <StylistSidebar current={current}/>
							)}
						</ul>
					</div>

					<ul className='navigation__list' style={{ marginTop: '0', marginBottom: '3rem' }}>
						<div className={`${current === 'my-profile' && 'currentNav'}`}>
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
							</li>
							{current === 'my-profile' && <div className='activeNav' />}
						</div>
						<div>
							<li className='navigation__list--item'>
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
				</Fragment>)
			}
		</nav>
	);
};

export default Sidebar;
