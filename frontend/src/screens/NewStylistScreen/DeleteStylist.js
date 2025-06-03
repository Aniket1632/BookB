import React from 'react';
import Modal from '../../components/NewModal';
import ModalButton from '../../components/NewModal/ModalButton';
import ModalForm from '../../components/NewModal/ModalForm';
import ModalHeading from '../../components/NewModal/ModalHeading';

const DeleteStylist = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete Stylist' onClose={onDeleteModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure you want to delete this Stylist?</p>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteStylist;
