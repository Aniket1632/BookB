import React, { Fragment } from 'react';
import { inputPhoneMasking } from '../../../utils/validators';
import '../../ProductsList/ProductsList.css';
import FooterStyles from './Footer.module.css';

const Footer = ({ phone, address, email, salonName, color }) => {
	return (
		<Fragment>
			<div className={FooterStyles.footor_content}>
				<div className="calling">
					<div className="our_services_logo">
						<svg className="filter__input--icon1" style={{ fill: color, color: color }}>
							<use xlinkHref={`/assets/sprite.svg#icon-phone`} />
						</svg>
					</div>
					<h1 className="our_services_subheading">
						Call us at <br />
						{inputPhoneMasking(phone)}
					</h1>
				</div>
				<div className="calling">
					<div className="our_services_logo">
						<svg className="filter__input--icon1" style={{ fill: color, color: color }}>
							<use xlinkHref={`/assets/sprite.svg#icon-pin`} />
						</svg>
					</div>
					<h1 className="our_services_subheading">
						{address}
					</h1>
				</div>
				<div className="calling">
					<div className="our_services_logo">
						<svg className="filter__input--icon1" style={{ fill: color, color: color }}>
							<use xlinkHref={`/assets/sprite.svg#icon-email`} />
						</svg>
					</div>
					<h1 className="our_services_subheading">
						Email us at <br />
						{email}
					</h1>
				</div>
			</div>
			<div className='footer_container' style={{ backgorundColor: color }}><p>©{new Date().getFullYear()} {salonName}. Website Developed By</p> <a href='https://www.the-algo.com/' target='_blank'>
				The Algorithm
			</a></div>
		</Fragment>
	);
};

export default Footer;
