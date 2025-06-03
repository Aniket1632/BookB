import React from 'react'
import { toast } from 'react-toastify'
import InputBox from '../../components/formInputs/InputBox'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalButton from '../../components/Modal/ModalButton'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'

const CreateSlot = ({ data }) => {

	const {
		createSlotModal,
		handleCreateSlot,
		handleAddModalClose,
		date, setDate,
		startTime, setStartTime,
		dateError, setDateError,
		startTimeError, setStartTimeError,
		isUpdate,
		handleUpdateSlot
	} = data;

	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}


	return (
		<>
			<Modal show={createSlotModal}>
				<ModalHeading heading={isUpdate ? 'Update Slot' : 'Create Slot'} onClose={handleAddModalClose} />
				<ModalForm style={{ marginBottom: '2.5rem' }}>

					<InputsSection>
						<InputBox
							label='Select Date'
							icon='calendar'
							placeholder='Appointment Date'
							type='date'
							value={convert(date)}
							onChange={(event) => {
								setDate(event.target.value);
								setDateError('');
							}}
							errorMessage={dateError}
						/>
						<InputBox
							label='Start Time'
							icon='stopwatch'
							placeholder='eg, 12:00 PM'
							value={startTime}
							type='time'
							step="3600000"
							onChange={(event) => {
								setStartTime(event.target.value);
								setStartTimeError('');
							}}
							errorMessage={startTimeError}
						/>
					</InputsSection>
					<div style={{ display: 'flex', gap: '2rem' }}>
						<ModalButton label={isUpdate ? 'Update Slot' : ' Confirm Slot'} icon={isUpdate ? 'edit' : 'plus'} onClick={(e) => { isUpdate ? handleUpdateSlot(e) : handleCreateSlot(e) }} />
						<ModalButton varient='danger' label='Cancel' icon='delete' onClick={handleAddModalClose} />
					</div>
				</ModalForm>
			</Modal>
		</>
	)
}

export default CreateSlot