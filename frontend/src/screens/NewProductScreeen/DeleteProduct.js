import React from 'react';
import Modal from '../../components/Modal';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const DeleteProduct = ({ data }) => {
	const { modalDeleteState, onDeleteModalClose, onDeleteHandler } = data;

	return (
		<Modal show={modalDeleteState}>
			<ModalHeading heading='Delete Product' onClose={onDeleteModalClose} />
			<ModalForm>
				<p className='modal__text'>Are you sure you want to delete this product?</p>
				<ModalButton varient='danger' label='Delete' icon='delete' onClick={onDeleteHandler} />
			</ModalForm>
		</Modal>
	);
};

export default DeleteProduct;
