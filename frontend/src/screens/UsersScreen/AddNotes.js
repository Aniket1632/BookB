import React from 'react'
import InputBox from '../../components/formInputs/InputBox'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import TextareaBox from '../../components/formInputs/TextareaBox'
import ModalButton from '../../components/Modal/ModalButton'

const AddNotes = ({ data }) => {
  const { addNotesModal, handleAddNotesModalClose, notes, setNotes, notesError, handleNotesSubmit } = data
  return (
    <Modal show={true}>
      <ModalHeading heading='Add Notes' onClose={handleAddNotesModalClose} />
      <ModalForm>
        <InputsSection>
          <TextareaBox
            label="Notes"
            style={{ height: '10rem' }}
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
            errorMessage={notesError}
          />
        </InputsSection>
        <ModalButton
          label='Add Notes'
          icon='plus'
          onClick={handleNotesSubmit}
        />

      </ModalForm>
    </Modal>
  )
}

export default AddNotes