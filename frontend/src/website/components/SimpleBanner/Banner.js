import React from 'react';
import './Banner.css';

const Banner = ({ backgroundImage, title, subTitle, height }) => {
	return (
		<div
			className='bookppointment_banner main-content-padding'
			style={{
				backgroundImage, height: height ? height : '60vh'
			}}>
			<h3 className='bookppointment_banner__heading'>{title}</h3>
			<h1 className='bookppointment_banner__text'>{subTitle}</h1>
		</div>
	);
};

export default Banner;
