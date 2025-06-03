import React, { useEffect, useState } from 'react';
import InputBox from '../../components/formInputs/InputBox'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import TextareaBox from '../../components/formInputs/TextareaBox'
import ModalButton from '../../components/Modal/ModalButton'
import { useSelector } from 'react-redux';

const AddNotes = ({ data, id }) => {
  const { _id, addNotesModal, handleAddNotesModalClose, notes, setNotes, notesError, handleNotesSubmit } = data
  const getUserInfo = useSelector((state) => state.getUserInfo);

  return (
    <Modal show={addNotesModal}>
      <ModalHeading heading='Add Notes' onClose={handleAddNotesModalClose} />
      <ModalForm>
        <InputsSection>
          <TextareaBox
            label="Notes"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
            errorMessage={notesError}
          />

        </InputsSection>
        <ModalButton
          label='Add Notes'
          icon='plus'
          onClick={() => handleNotesSubmit(_id)}
        />

      </ModalForm>
    </Modal>
  )
}

export default AddNotes