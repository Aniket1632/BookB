import React from 'react';
import Modal from '../../components/Modal';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const DeleteSalon = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete Salon' onClose={onDeleteModalClose} />
			<ModalForm>
				<InputsSectionColumn>
					Are you sure you want to delete this Salon?
				</InputsSectionColumn>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteSalon;
