import React from 'react'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalButton from '../../components/Modal/ModalButton'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'

const DeleteService = ({ serviceModal, setServiceModal, isUpdate }) => {
  return (
    <Modal show={serviceModal}>
      <ModalHeading heading="Delete" onClose={() => setServiceModal(false)} />
      <ModalForm style={{ marginBottom: '2.5rem' }}>
        <p className="modal__text">
          Are you sure? You want to to Delete Serive</p>

        <div style={{ display: "flex", gap: "2rem" }}>
          <ModalButton
            label="Delete Service"

          />
          <ModalButton
            varient="danger"
            label="Cancel"
          />
        </div>
      </ModalForm>
    </Modal>
  )
}

export default DeleteService