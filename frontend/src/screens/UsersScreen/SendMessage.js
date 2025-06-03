import React from 'react'
import InputBox from '../../components/formInputs/InputBox'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import TextareaBox from '../../components/formInputs/TextareaBox'
import ModalButton from '../../components/Modal/ModalButton'

const SendMessage = ({ data }) => {
  const { messageHead, setMessageHead, messageTitle, setMessageTitle, messageError, messageTitleError, handleMessageClose, sendMessageModal, setSendMessageModal, handleMessageSubmit } = data
  return (
    <Modal show={sendMessageModal}>
      <ModalHeading heading='Send Message' onClose={handleMessageClose} />
      <ModalForm>
        {/* <InputsSection>
        <InputBox
        label="Title"
        onChange={(e)=>setMessageTitle(e.target.value)}
        value={messageTitle}
        errorMessage={messageTitleError}
        />
    </InputsSection> */}
        <InputsSection style={{ display: 'block' }}>
          <TextareaBox
            label="Notes"
            style={{ width: '100%', height: '10rem' }}
            onChange={(e) => setMessageHead(e.target.value)}
            value={messageHead}
            errorMessage={messageError}
            placeholder="Type message"
          />
        </InputsSection>
        <ModalButton
          label='Send Message'
          icon='message'
          onClick={handleMessageSubmit}
        />

      </ModalForm>
    </Modal>
  )
}

export default SendMessage