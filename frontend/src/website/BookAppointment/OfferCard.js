import React from 'react';

const OfferCard = ({ offerTitle, offerSubTitle }) => {
	return (
		<div className='appointment_top_box'>
			<h1 className='appointment_header1'>{offerTitle}</h1>
			<p className='appointment_subheading1'>{offerSubTitle}</p>
		</div>
	);
};

export default OfferCard;
