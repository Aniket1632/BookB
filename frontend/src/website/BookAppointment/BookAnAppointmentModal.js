import React, { useState, Fragment } from 'react';
import Modal from '../../components/Modal';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import moment from 'moment';
import SelectBox from '../../components/formInputs/SelectBox';
import TextareaBox from '../../components/formInputs/TextareaBox'
import { inputPhoneMasking } from '../../utils/validators';
import imgGif from '../../components/assets/check-green.gif'

const BookAnAppointmentModal = ({ data }) => {
	const { modalState, setModalState, name, setName, email, setEmail, phone, setPhone, comments, setComments, info, gender, setGender, handleBookAppointment, dateHour, publicAddAppointment, getUserInfo, userLogin } = data;
	const onClose = () => {
		setName({ value: '', error: '' });
		setEmail({ value: '', error: '' });
		setPhone({ value: '', error: '' });
		setComments({ value: '', error: '' })
		setGender({ value: '', error: '' })
		setModalState(false);
	};

	return (
		<Modal show={modalState} style={{background: 'white'}}>
			<Fragment>
				<ModalHeading onClose={onClose} />
				{
					publicAddAppointment &&
						publicAddAppointment.session &&
						publicAddAppointment.session.status ?
						<div className='thankyou'>
							<img className='thankyou-img' src={imgGif} />
							<h1>Thank You!</h1>
							<p>You booked {info && info.subServiceName} session on {moment(info && info.dateAsAString).format('MMM DD')} at {info && info.timeAsAString}</p>
						</div> :
						<>
							<div className="popup_heading">
								<h1 className="appointment_header1">Book an appointment</h1>
								<p className="appointment_subheading1">{`${info && info.subServiceName} at ${moment(info && info.dateAsAString).format('MMM DD')} ${info && info.timeAsAString}`}</p>
							</div>

							{
								userLogin && !userLogin.userInfo &&
								<>
									<ModalForm
										style={{ marginBottom: '2.5rem', gap: '2rem', display: 'flex' }}
									>
										<InputBox
											icon="user"
											placeholder="Full name"
											value={name.value}
											onChange={(event) => {
												setName({ value: event.target.value });
											}}
											errorMessage={name.error}
											style={{ backgroundColor: 'var(--pure-white)' }}
										/>
										<InputBox
											icon="email"
											placeholder="johndoe@example.com"
											value={email.value}
											onChange={(event) => {
												setEmail({ value: event.target.value });
											}}
											errorMessage={email.error}
											style={{ backgroundColor: 'var(--pure-white)' }}
										/>
									</ModalForm>
									<ModalForm style={{ marginBottom: '2.5rem', gap: '2rem', display: 'flex' }}>
										<InputBox
											icon="phone"
											placeholder="123 456 7890"
											value={phone.value}
											onChange={(event) => {
												setPhone(({ value: inputPhoneMasking(event.target.value) }));
											}}
											errorMessage={phone.error}
											style={{ backgroundColor: 'var(--pure-white)' }}
										/>
										<SelectBox
											value={gender.value}
											onChange={(event) => {
												setGender({ value: event.target.value })
											}}
											icon='user'
											name='Service'
											errorMessage={gender.error}
											style={{ backgroundColor: 'var(--pure-white)' }}
										>
											<option disabled value="">--Select Gender--</option>
											<option value='male'>Male</option>
											<option value='female'>Female</option>
											<option value='other'> Other</option>
										</SelectBox>
									</ModalForm>
								</>}
							<ModalForm style={{ marginBottom: '2.5rem', gap: '2rem' }}>
								<TextareaBox
									// icon="phone"
									placeholder="additional comments"
									value={comments.value}

									onChange={(event) => {
										setComments({ value: event.target.value });
									}}
									errorMessage={comments.error}
									textBoxStyle={{ color: 'black' }}
									style={{ backgroundColor: 'var(--pure-white)', width: '100%', marginBottom: '2rem' }}
								/>
								{/* <InputsSectionColumn>
						<div className="flex" style={{ gap: '2rem' }}>
							<TextareaBox

								placeholder="Additional comments"
								value={comments.value}
								onChange={(event) => {
									setComments({ value: event.target.value });
								}}
								errorMessage={comments.error}

							/>
						</div>
					</InputsSectionColumn> */}
								<h3 style={{ fontWeight: '600', fontSize: '1.5rem' }}>Your current waitlist is &nbsp;<span style={{ color: 'green' }} >{info && info.availableList && info.availableList.length}</span></h3>
								<div className="popup_total_outer">
									<div className="popup_total">
										<h1 className="appointment_header1">Total</h1>
										{/* <p className="appointment_subheading1">Hair cut</p> */}
									</div>

									<h1 className="appointment_header1">${info && info.charges}</h1>
								</div>

								<ModalButton label="Book an appointment" icon="edit" onClick={handleBookAppointment} />
							</ModalForm>
						</>}

			</Fragment>
		</Modal>
	);
};

export default BookAnAppointmentModal;
