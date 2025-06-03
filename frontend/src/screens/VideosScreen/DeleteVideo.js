import React from 'react';
import Modal from '../../components/Modal';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const DeleteVideo = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete Video' onClose={onDeleteModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure you want to delete this video?</p>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteVideo;
