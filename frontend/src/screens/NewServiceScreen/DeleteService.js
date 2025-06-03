import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const DeleteService = ({ data }) => {
	const [text, setText] = useState('Service');
	const { selectUpdateModel, modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;
	useEffect(
		() => {
			if (selectUpdateModel.isMainService) {
				setText('Sevice');
			} else {
				setText('Category');
			}
		}
	);

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading={'Delete ' + text} onClose={onDeleteModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure you want to delete this {text}?</p>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteService;
