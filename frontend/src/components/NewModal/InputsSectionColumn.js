import React from 'react';

const InputsSection = ({ children, style }) => {
	return (
		<div className='modalContainer__form--section-column' style={style}>
			{children}
		</div>
	);
};

export default InputsSection;
