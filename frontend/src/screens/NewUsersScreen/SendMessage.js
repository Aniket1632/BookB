import React from 'react'
import InputBox from '../../components/formInputs/InputBox'
import Modal from '../../components/NewModal'
import InputsSection from '../../components/NewModal/InputsSection'
import ModalForm from '../../components/NewModal/ModalForm'
import ModalHeading from '../../components/NewModal/ModalHeading'
import TextareaBox from '../../components/formInputs/TextareaBox'
import ModalButton from '../../components/NewModal/ModalButton'

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
        <InputsSection style={{
          display: 'block',
          backgroundColor: '#353434b5'
        }}>
          <TextareaBox
            textBoxStyle={{ resize: 'none', overflowY: 'hidden', paddingRight: '1rem' }}
            style={{
              width: '90%',
              height: '10rem',
              backgroundColor: 'transparent',
            }}
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
        />/
      </ModalForm>
    </Modal>
  )
}

export default SendMessage