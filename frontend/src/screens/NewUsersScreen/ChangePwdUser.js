import React from 'react';
import Modal from '../../components/Modal';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const ChangePwdUser = ({ data }) => {
	const { modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler } = data;

	return (
		<Modal show={modalChangePasswordState}>
			<ModalHeading heading='Reset User Password' onClose={onChangePwdModalClose} />
			<ModalForm>
				<p className='modal__text' style={{ marginBottom: '0' }}>
					{' '}
					Are you sure you want to reset password of this user?{' '}
				</p>
				<p className='modal__text2'>We'll send the auto genrated password to user email address.</p>
				<ModalButton varient='danger' label='Reset Password' icon='key' onClick={onChangePwdUserHandler} />
			</ModalForm>
		</Modal>
	);
};

export default ChangePwdUser;
