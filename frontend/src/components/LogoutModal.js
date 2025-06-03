import React from 'react';
import Modal from './Modal';
import ModalButton from './Modal/ModalButton';
import ModalForm from './Modal/ModalForm';
import ModalHeading from './Modal/ModalHeading';

const LogoutModal = ({ data }) => {
	const { modalLogOutState, onLogOutModalClose, onLogOutHandler } = data;

	return (
		<Modal show={modalLogOutState}>
			<ModalHeading heading='Log Out' onClose={onLogOutModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure you want to log out?</p>
				<ModalButton varient='danger' label='Log Out' icon='logout' onClick={onLogOutHandler} />
			</ModalForm>
		</Modal>
	);
};

export default LogoutModal;
