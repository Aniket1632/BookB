import React from 'react'
import Modal from '../../components/Modal'
import ModalButton from '../../components/Modal/ModalButton'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'

const DeleteSubscription = ({ data }) => {
  const { deletePackageModal, handleDeleteModalClose, onDeleteHandler } = data;
  return (
    <Modal show={deletePackageModal}>
      <ModalHeading heading='Delete' onClose={handleDeleteModalClose} />
      <ModalForm>
        <p className='modal__text'>Are you sure you want to delete?</p>
        <ModalButton varient='danger' label='Delete' icon='delete'
          onClick={onDeleteHandler}
        />
      </ModalForm>
    </Modal>
  )
}

export default DeleteSubscription