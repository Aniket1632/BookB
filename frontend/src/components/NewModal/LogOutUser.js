import React from 'react'
import Modal from '.'
import ModalButton from './ModalButton'
import ModalForm from './ModalForm'
import ModalHeading from './ModalHeading'

const LogOutUser = ({ data }) => {
  const {
    modalLogOutUserState,
    onLogOutUserClose,
    onLogOutUserHandler
  } = data

  return (
    <Modal show={modalLogOutUserState}>
      <ModalHeading
        heading='Log Out Of All Sessions'
        onClose={onLogOutUserClose}
      />
      <ModalForm>
        <p className='modal__text' style={{ marginBottom: '0' }}>
          {' '}
          Are you sure you want to Log Out of this user for mobile app?
          <br /><br />
          {' '}
        </p>
        <ModalButton
          varient='danger'
          label='Log Out'
          icon='logout'
          onClick={onLogOutUserHandler}
        />
      </ModalForm>
    </Modal>
  )
}

export default LogOutUser
