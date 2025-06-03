import React from 'react';
import './Banner.css';

const Banner = ({ backgroundImage, title, subTitle, height }) => {
	return (
		<div
			className='banner'
			style={{
				backgroundImage, height: height ? height : '30rem'
			}}>
			<div className='banner_sub'>
				<h3 className='banner__heading heading_1'>{title}</h3>
				<h1 className='banner__text heading_2'>{subTitle}</h1>
				<div className="dash"></div>
			</div>
		</div>
	);
};

export default Banner;
