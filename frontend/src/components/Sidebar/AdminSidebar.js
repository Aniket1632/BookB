import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ current }) => {
	return (
		<Fragment>
			<div className={`${current === 'dashboard' ? 'currentNav ' : ''}`}>
				<li className='navigation__list--item'>
					<Link to='/' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-dashboard`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/' className='navigation__list--link'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-dashboard`} />
							</svg>
							<span>Dashboard</span>
						</span>
					</Link>
				</li>
				{current === 'dashboard' && <div className='activeNav' />}
			</div>
			<div className={`${current === 'users' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/users' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-users`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/users' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-users`} />
						</svg>
						<span>Users</span>
					</Link>
				</li>
				{current === 'users' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'salon' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/salon' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/salon' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						<span>Salon</span>
					</Link>
				</li>
				{current === 'salon' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'salonstaff' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/salon-role-manger' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/salon-role-manger' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						<span>Salon Staff</span>
					</Link>
				</li>
				{current === 'salonstaff' && <div className='activeNav' />}
			</div>
			<div className={`${current === 'coupon' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/coupon-bookb' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/coupon-bookb' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-ticket`} />
						</svg>
						<span>Coupons</span>
					</Link>
				</li>
				{current === 'coupon' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'promo-code' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/promo-codes' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/promo-codes' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-ticket`} />
						</svg>
						<span>Promo Codes</span>
					</Link>
				</li>
				{current === 'promo-code' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'subscription' && 'currentNav'}`}>
				{/* <li className='navigation__list--item'>
					<Link to='/salon-role-manger' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li> */}
				<li className='navigation__list--itemHover'>
					<Link to='/subscription' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-subscribe`} />
						</svg>
						<span>Subscription</span>
					</Link>
				</li>
				{current === 'subscription' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'appversion' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/appversion' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-phone`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/appversion' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-phone`} />
						</svg>
						<span>App Versions</span>
					</Link>
				</li>
				{current === 'appversion' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'notification' ? 'currentNav' : ''}`}>
				<li className='navigation__list--item'>
					<Link to='/notification' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-notification`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='notification' className='navigation__list--link'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-notification`} />
							</svg>
							<span>Notifications</span>
						</span>
					</Link>
				</li>
				{current === 'notification' && <div className='activeNav' />}
			</div>
		</Fragment>
	);
};

export default AdminSidebar;
