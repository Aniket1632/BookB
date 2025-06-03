import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import TextareaBox from '../../components/formInputs/TextareaBox';

const AddCompany = ({ data }) => {
	const {
		addModalActive,
		handleAddModalClose,
		handleSubmit,
		selectUpdateModel,

		name,
		email,
		address,
		phone,

		setName,
		setEmail,
		setPhone,
		setAddress,

		nameError,
		addressError,
		phoneError,
		emailError,

		setNameError,
		setAddressError,
		setPhoneError,
		setEmailError,
	} = data;
	const createCompany = useSelector((state) => state.createCompany);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading={selectUpdateModel._id ? 'Update Company' : 'Create New Company'} onClose={handleAddModalClose} />


			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Company Name'
						icon='archive'
						placeholder='eg, Barberly Salon-Company'
						value={name}
						onChange={(event) => {
							setName(event.target.value);
							setNameError('');
						}}
						errorMessage={nameError}
					/>
					<InputBox
						label='Email'
						icon='email'
						placeholder='eg, johndoe@example.com'
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setEmailError('');
						}}
						errorMessage={emailError}
					/>

				</InputsSection>
				<InputsSection>
					<InputBox
						label='Phone'
						icon='phone'
						placeholder='eg, 123 456 7890'
						value={phone}
						onChange={(event) => {
							setPhone(event.target.value);
							setPhoneError('');
						}}
						errorMessage={phoneError}

					/>
					<TextareaBox
						label='Address'
						icon='pin'
						placeholder='Enter Address'
						value={address}
						onChange={(event) => {
							setAddress(event.target.value);
							setAddressError('');
						}}
						errorMessage={addressError}
					/>
				</InputsSection>
				{createCompany && createCompany.loading ? (
					<ModalButton label={'Please wait'} icon={'plus'} />
				) : (
					<ModalButton label={selectUpdateModel._id ? 'Update Company' : 'Add New'} icon={selectUpdateModel._id ? 'edit' : 'plus'} onClick={handleSubmit} />
				)}
			</ModalForm>
		</Modal>
	);
};

export default AddCompany;
