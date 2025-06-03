import React from 'react';
import Modal from './Modal';
import ModalButton from './Modal/ModalButton';
import ModalForm from './Modal/ModalForm';
import ModalHeading from './Modal/ModalHeading';

const SessionTimeoutModal = ({ data }) => {
	const { logoutModal, onLogOutModalClose, onLogOutHandler } = data;

	return (
		<Modal show={logoutModal}>
			<ModalHeading heading='Session Timeout' onClose={onLogOutModalClose} showClose={false}/>
			<ModalForm>
				<p className='modal__text'>Your session has been expired. Please login again to continue.</p>
				<ModalButton varient='danger' label='Log Out' icon='logout' onClick={onLogOutHandler} />
			</ModalForm>
		</Modal>
	);
};

export default SessionTimeoutModal;
