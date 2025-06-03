import React, { Fragment, useEffect, useState } from 'react'
import Button from '../../components/formInputs/Button';
import InputBox from '../../components/formInputs/InputBox';
import Modal from '../../components/Modal'
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading'
import AvailabilityStyle from '../StylistSessionScreen/StylistAvailability.module.css';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn'

const WorkHourModal = ({ data }) => {
	const { appointmentModal, setAppointmentModal, weekDays, setWeekDays, handleWorkHourSubmit } = data;

	const handleStatusChange = (e, main, mainIndex, day) => {
		const newFormValues = [...weekDays];
		newFormValues[mainIndex].isAvailable = e.target.checked;
		setWeekDays(newFormValues);
	}

	const handleChange = (e, mainIndex) => {
		const newFormValues = [...weekDays];
		newFormValues[mainIndex].slot[e.target.name] = e.target.value;
		setWeekDays(newFormValues);
	}

	return (
		<Modal show={appointmentModal}>
			<ModalHeading heading="Add Work Hours" onClose={() => setAppointmentModal(false)} />

			<ModalForm style={{ marginBottom: '2.5rem' }}>
				<div style={{ height: '60vh', overflow: 'auto',color:'white' }}>
					{
						weekDays &&
						weekDays.length > 0 &&
						weekDays.map((day, mainIndex, main) => {


							return <div key={mainIndex}>
								<InputsSectionColumn style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
									<h1>{day.day}</h1>
									<label className='switch'>
										<input
											checked={day.isAvailable}
											onChange={(e) => handleStatusChange(e, main, mainIndex, day)}
											type='checkbox'
											className='checkbox'
											name='active'
										/>
										<span className='slider round' />
									</label>

									{
										day.isAvailable ? <>
											<InputBox
												label='Start time'
												icon='clock'
												type='time'
												onChange={(e) => handleChange(e, mainIndex)}
												value={day.slot.startTime}
												// onChange={(e) => setProductName({ value: e.target.value })}
												// errorMessage={productName.error}
												name="startTime"
											/>
											<InputBox
												label='End time'
												icon='clock'
												type='time'
												onChange={(e) => handleChange(e, mainIndex)}
												value={day.slot.endTime}
												name="endTime"
											// value={productName.value}
											// onChange={(e) => setProductName({ value: e.target.value })}
											// errorMessage={productName.error}
											/></> : "Closed"}
								</InputsSectionColumn>
							</div>

						}
						)}
				</div>

				<div className='form-button'>
					<Button label='Update' onClick={handleWorkHourSubmit} >
					</Button>
				</div>
			</ModalForm>

		</Modal>
	)
}

export default WorkHourModal