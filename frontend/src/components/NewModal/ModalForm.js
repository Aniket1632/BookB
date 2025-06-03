import React from 'react';

const ModalForm = ({ onSubmit, children, style, className }) => {
	return (
		<form className={`${className && className}  modalContainer__form`} style={style} onSubmit={onSubmit}>
			{children}
		</form>
	);
};

export default ModalForm;
