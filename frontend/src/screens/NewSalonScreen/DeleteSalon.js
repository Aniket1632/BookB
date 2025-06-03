import React from 'react';
import Modal from '../../components/NewModal';
import InputsSectionColumn from '../../components/NewModal/InputsSectionColumn';
import ModalButton from '../../components/NewModal/ModalButton';
import ModalForm from '../../components/NewModal/ModalForm';
import ModalHeading from '../../components/NewModal/ModalHeading';

const DeleteSalon = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete Salon' onClose={onDeleteModalClose} />
			<ModalForm>
				<InputsSectionColumn style={{ color: '#ffffff', fontSize: '1.2rem', }} >
					Are you sure you want to delete this Salon?
				</InputsSectionColumn>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteSalon;
