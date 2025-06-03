import React from 'react';
import './Modal.css';

const Modal = (props) => {
	if (!props.show) {
		return null;
	}

	return (
		<div className='modalContainer' style={props.style} >
			<div className='modal' id='modal' style={props.style}>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
