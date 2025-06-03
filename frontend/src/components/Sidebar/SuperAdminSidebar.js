import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';

const SuperAdminSidebar = ({ current }) => {
	return (
		<Fragment>
			{/* <div className={`${current === 'dashboard' ? 'currentNav ' : ''}`}>
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
			</div> */}
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


			<div className={`${current === 'stylist' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/stylist' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/stylist' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-stylist`} />
						</svg>
						<span>Stylist</span>
					</Link>
				</li>
				{current === 'stylist' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'coupon' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/coupon' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-salon`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/coupon' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-ticket`} />
						</svg>
						<span>Coupons</span>
					</Link>
				</li>
				{current === 'coupon' && <div className='activeNav' />}
			</div>
			<div className={`${current === 'products' ? 'currentNav' : ''}`}>
				<li className='navigation__list--item'>
					<Link to='/products' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-shopping-bag`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover hasChildren'>
					<div className='navigation__list--link navigation__list-parent--link'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-shopping-bag`} />
							</svg>
							<span>Products</span>
						</span>
					</div>
					<ul>
						<li>
							<NavLink to='/products' activeClassName='navigation__sub__active'>
								<svg className='navigation__icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-shopping-bag`} />
								</svg>
								All Products
							</NavLink>
						</li>
						<li>
							<NavLink to='/product-categories' activeClassName='navigation__sub__active'>
								<svg className='navigation__icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-shopping-basket`} />
								</svg>
								Product Categories
							</NavLink>
						</li>
					</ul>
				</li>
				{current === 'products' && <div className='activeNav' />}
			</div>
			<div className={`${current === 'website-setting' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/website-setting' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/website-setting' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
						</svg>
						<span>Website Settings</span>
					</Link>
				</li>
				{current === 'website-setting' && <div className='activeNav' />}
			</div>

			<div className={`${current === 'app-setting' && 'currentNav'}`}>
				<li className='navigation__list--item'>
					<Link to='/app-setting' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover'>
					<Link to='/app-setting' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
						</svg>
						<span>App Settings</span>
					</Link>
				</li>
				{current === 'app-setting' && <div className='activeNav' />}
			</div>
		</Fragment>
	);
};

export default SuperAdminSidebar;
