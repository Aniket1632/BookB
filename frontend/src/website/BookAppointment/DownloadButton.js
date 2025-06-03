import React from 'react';

const DownloadButton = ({ buttonTitle, buttonSubTitle, buttonIcon }) => {
	return (
		<div className='download_options_store'>
			<svg className='filter__input--icon'>
				<use xlinkHref={`/assets/sprite.svg#icon-${buttonIcon}`} />
			</svg>
			<div className='download_option'>
				<h1 className='appointment_heading4'>{buttonTitle}</h1>
				<p className='appointment_subheading4'>{buttonSubTitle}</p>
			</div>
		</div>
	);
};

export default DownloadButton;
