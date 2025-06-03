import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import './Header.css';
import Button from '../../../components/formInputs/Button';
import { useHistory, useParams } from 'react-router-dom';
import CartSidebar from '../CartSidebar/CartSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/userActions';

const WebHeader = ({style}) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const cartProducts = useSelector((state) => state.cartProducts.cart);
	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const [color, setColor] = useState("")

	useEffect(() => {
		if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status) {
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
		}
	}, [])

	const userLogin = useSelector((state) => state.userLogin);
	const [click, setClick] = useState(false);

	const [cartItem, setCartItem] = useState(0)
	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	const toggleMenu_website = () => {
		history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/login`);
	};

	const toggle_viewCart = () => {
		let navigation = document.querySelector('.navigationbar');
		navigation.classList.toggle('active');
	};

	useEffect(() => {
		let count = 0;
		cartProducts && cartProducts.forEach((item) => {
			count += item.quantity
		})
		setCartItem(count)
	}, [cartProducts, cartItem])

	return (
		<>
			<header className="website_header">
				<img src={getPublicWebsite &&
					getPublicWebsite.websiteInfo &&
					getPublicWebsite.websiteInfo.data &&
					getPublicWebsite.websiteInfo.data.websiteLogoImageURL}
					alt="Logo" className="logo_website" />

				<nav className="navigation_website">
					<div>

						<ul className={click ? ' navigation__links nav-options active' : 'navigation__links nav-options'}>
							<li onClick={closeMobileMenu}>
								<HashLink to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}#banner`} activeClassName="navigation__active" className="navigation__link">
									Home
								</HashLink>
							</li>
							<li onClick={closeMobileMenu}>
								<HashLink
									smooth
									to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}/products-list`}
									activeClassName="navigation__active"
									className="navigation__link"
								>
									Shop
								</HashLink>
							</li>
							<li onClick={closeMobileMenu}>
								<HashLink
									smooth
									to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}#services_our`}
									activeClassName="navigation__active"
									className="navigation__link"
								>
									Services
								</HashLink>
							</li>
							{/* <li onClick={closeMobileMenu}>
								<HashLink
									smooth
									to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/discounts`}
									activeClassName="navigation__active"
									className="navigation__link"
								>
									Discounts
								</HashLink>
							</li> */}
							<li onClick={closeMobileMenu}>
								<HashLink
									smooth
									to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}#hoursOfOperation`}
									activeClassName="navigation__active"
									className="navigation__link"
								>
									Hours of Operation
								</HashLink>
							</li>
							<li onClick={closeMobileMenu}>
								<HashLink
									smooth
									to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}#contactus`}
									activeClassName="navigation__active"
									className="navigation__link"
								>
									Contact Us
								</HashLink>
							</li>

							{/* <li className="mobile-menu">
							<div className="navigation__link header-right-side">
								<li >
									<div className="navigation__link header-right-side" onClick={toggle_viewCart}>
										<svg className="header-icon-in menu-icon">
											<use xlinkHref="assets/sprite.svg#icon-cart" />
										</svg>
										<div style={{color: 'var(--gold)'}}>{cartItem}</div>
									</div>
								</li>
							</div>
						</li> */}
							<li className="mobile-menu">
								<div className="navigation__link header-right-side">
									<Button
										style={{
											width: '10rem',
											justifyContent: 'center',
											padding: '0.5rem 1rem',
											backgroundColor: color,
										}}
										label="Login"
										icon="arrow_right"
										onClick={toggleMenu_website}

									/>
								</div>
							</li>
						</ul>
					</div>
					<ul className="navigation__links navigation__links--contact">
						<li >
							<div className="navigation__link header-right-side" onClick={toggle_viewCart}>
								<svg className="header-icon-in menu-icon">
									<use xlinkHref="assets/sprite.svg#icon-cart" />
								</svg>
								<div style={{ color: 'var(--gold)' }}>{cartItem}</div>
							</div>
						</li>
						{userLogin && userLogin.userInfo && <li >
							<HashLink
								smooth
								to={`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/order-history`}
								activeClassName="navigation__active"
								className="navigation__link"
							>
								Order History
							</HashLink>
						</li>}
						<li>
							<div className="navigation__link header-right-side">
								{userLogin && !userLogin.userInfo ?
									<Button
										style={{
											width: '10rem',
											justifyContent: 'center',
											padding: '0.5rem 1rem',
											backgroundColor: color,
										}}
										label="Login"
										icon="arrow_right"
										onClick={toggleMenu_website}
									/> :
									<Button
										varient='danger'
										style={{
											width: '10rem',
											justifyContent: 'center',
											padding: '0.5rem 1rem',
											backgroundColor:color
										}}
										label="Logout"
										icon="arrow_right"
										onClick={() => {
											dispatch(logout())

										}}
									/>}
							</div>
						</li>
					</ul>
					<div className="mobile-menu" >
						<div className="icon-box" onClick={toggle_viewCart}>
							<svg className="menu-icon2">
								<use xlinkHref="assets/sprite.svg#icon-cart" />
							</svg>
							<div style={{ color: 'var(--gold)', fontSize: '15px' }}>{cartItem}</div>
						</div>
						<div onClick={handleClick}>
							{click ? (
								<svg className="header-icon-in menu-icon">
									<use xlinkHref="assets/sprite.svg#CloseMenu" />
								</svg>
							) : (
								<svg className="header-icon-in menu-icon">
									<use xlinkHref="assets/sprite.svg#MenuIcon" />
								</svg>
							)}
						</div>


					</div>

				</nav>
				<CartSidebar data={{ toggle_viewCart, cartProducts }} />

			</header>

		</>
	);
};

export default WebHeader;
