import React from 'react';
import Modal from '.';
import ModalButton from './ModalButton';
import ModalForm from './ModalForm';
import ModalHeading from './ModalHeading';

const DeleteModal = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete' onClose={onDeleteModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure that you want to delete?</p>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteModal;
