import React from 'react'
import Modal from '../../components/Modal'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import InputsSection from '../../components/Modal/InputsSection'
import DragDrop from '../../components/DragDropImg'

const LogoModal = ({ data }) => {
  const {
    logoModal,
    setLogoModal
  } = data
  return (
    <Modal show={logoModal}>
      <ModalHeading heading={"Add Logo"} onClose={() => setLogoModal(false)} />
      <ModalForm style={{ marginBottom: '2.5rem' }}>
        <InputsSection>
          <DragDrop />
        </InputsSection>
      </ModalForm>
    </Modal>
  )
}

export default LogoModal