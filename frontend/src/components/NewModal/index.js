import React from 'react';
import './NewModal.css';

const Modal = (props) => {
	if (!props.show) {
		return null;
	}

	return (
		<div className='modalContainer' >
			<div className='modal' id='modal' style={props.style}>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
