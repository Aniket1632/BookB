import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const StylistSidebar = ({ current, stylistId }) => {
	return (
		<Fragment>
			<div className={`${current === 'dashboard' ? 'currentNav ' : ''}`}>
				<Link to='/' className='navigation__list--link'>
					<li className='navigation__list--item'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-dashboard`} />
						</svg>
						&nbsp;
					</li>
				</Link>
				<Link to='/' className='navigation__list--link'>
					<li className='navigation__list--itemHover'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-dashboard`} />
							</svg>
							<span>Dashboard</span>
						</span>
					</li>
				</Link>
				{current === 'dashboard' && <div className='activeNav' />}
			</div>
			<div className={`${current === 'users' && 'currentNav'}`}>
				<Link to='/users' className='navigation__list--link'>
					<li className='navigation__list--item'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-users`} />
						</svg>
						&nbsp;
					</li>
				</Link>
				<Link to='/users' className='navigation__list--link'>
					<li className='navigation__list--itemHover'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'  >
								<use xlinkHref={`/assets/sprite.svg#icon-users`} />
							</svg>
							<span>Users</span>
						</span>
					</li>
				</Link>
				{current === 'users' && <div className='activeNav' />}
			</div>
			
			<div className={`${current === 'stylist' && 'currentNav'}`}>
				<Link to='/stylist-sessions' className='navigation__list--link'>
					<li className='navigation__list--item'>
						<svg className='navigation__icon	'>
							<use xlinkHref={`/assets/sprite.svg#icon-stylist`} />
						</svg>
						&nbsp;
					</li>
				</Link>

				<Link to={`/stylist-sessions/${stylistId}`} className='navigation__list--link'>
					<li className='navigation__list--itemHover'>
						<span className='navigation__list--link--span'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-stylist`} />
						</svg>
							<span>My Availability</span>
						</span>
					</li>
				</Link>

				{current === 'stylist' && <div className='activeNav' />}
			</div>

			{/* <div className={`${current === 'reports' ? 'currentNav ' : ''}`}>
				<li className='navigation__list--item'>
					<Link to='/session-report' className='navigation__list--link'>
						<svg className='navigation__icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-report`} />
						</svg>
						&nbsp;
					</Link>
				</li>
				<li className='navigation__list--itemHover hasChildren'>
					<div className='navigation__list--link'>
						<span className='navigation__list--link--span'>
							<svg className='navigation__icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-report`} />
							</svg>
							<span>Reports</span>
						</span>
					</div>
					<ul>
						<li>
							<NavLink to='/session-report' activeClassName='navigation__sub__active'>
								<svg>
									<use xlinkHref={`/assets/sprite.svg#icon-report`} />
								</svg>
								<span>Stylist Sessions</span>
							</NavLink>
						</li>
						<li>
							<NavLink to='/session-report-by-month' activeClassName='navigation__sub__active'>
								<svg>
									<use xlinkHref={`/assets/sprite.svg#icon-report`} />
								</svg>
								<span>Session Report by Month</span>
							</NavLink>
						</li>
						<li>
							<NavLink to='/earning-report-by-month' activeClassName='navigation__sub__active'>
								<svg>
									<use xlinkHref={`/assets/sprite.svg#icon-report`} />
								</svg>
								<span>Earning Report</span>
							</NavLink>
						</li>
					</ul>
				</li>
				{current === 'reports' && <div className='activeNav' />}
			</div> */}
		</Fragment>
	);
};

export default StylistSidebar;
