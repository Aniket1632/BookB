import React from 'react';

const ModalHeading = ({ heading, onClose, showClose = true, style }) => {
	return (
		<div className='modal__heading--container'>
			<h2 className='modal__heading2' style={style}>{heading}</h2>
			{showClose && <button onClick={onClose} className='modal__heading--btn'>
				<svg className='modal__heading--icon'>
					<use xlinkHref={`/assets/sprite.svg#icon-cancel`} />
				</svg>
			</button>}
		</div>
	);
};

export default ModalHeading;
