import React from 'react';

const ModalForm = ({ onSubmit, children, style }) => {
	return (
		<form className='modalContainer__form' style={style} onSubmit={onSubmit}>
			{children}
		</form>
	);
};

export default ModalForm;
