import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import RadioButtons from '../../components/formInputs/RadioButtons/RadioButtons';
import SelectBox from '../../components/formInputs/SelectBox';
import { inputPhoneMasking } from '../../utils/validators';
import TextareaBox from '../../components/formInputs/TextareaBox';

const CreateUser = ({ data }) => {
	const {
		showAddModal,
		handleAddModalClose,
		handleSubmit,
		name,
		email,
		phone,
		gender,
		setGender,
		setGenderError,
		genderError,
		// dob,
		// dobError,
		// setDOB,
		// setDOBError,
		// age,
		// setAge,
		// setAgeError,
		// ageError,
		stylist,
		setStylist,
		setStylistNameError,
		stylistNameError,
		setName,
		setEmail,
		setPhone,
		nameError,
		phoneError,
		emailError,
		setNameError,
		setPhoneError,
		setEmailError,

		stylistList,
		selectUpdateModelUser,
		setSelectUpdateModelUser,
		notes, setNotes, notesError
	} = data;

	const onChangeContentType = (e) => {
		setGenderError('');
		setGender(e.target.value);
	};

	const getAge = (birthDateString) => {
		const today = new Date();
		const birthDate = new Date(birthDateString);

		const yearsDifference = today.getFullYear() - birthDate.getFullYear();

		if (
			today.getMonth() < birthDate.getMonth() ||
			(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
		) {
			return yearsDifference - 1;
		}

		return yearsDifference;
	};

	return (
		<Modal show={showAddModal}>
			<ModalHeading
				heading={selectUpdateModelUser._id ? 'Update User' : 'Add New User'}
				onClose={handleAddModalClose}
			/>
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label="User Name"
						icon="user"
						placeholder="eg, John Doe"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
							setNameError('');
						}}
						errorMessage={nameError}
					/>
					<InputBox
						label="Email"
						icon="email"
						placeholder="eg, johndoe@example.com"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setEmailError('');
						}}
						errorMessage={emailError}
					/>
					<InputBox
						label="Phone"
						icon="phone"
						placeholder="eg, 123 456 7890"
						value={phone}
						onChange={(event) => {
							setPhone(inputPhoneMasking(event.target.value));
							setPhoneError('');
						}}
						errorMessage={phoneError}
					/>
				</InputsSection>

				<InputsSectionColumn>
					<div className="flex" style={{ gap: '2rem' }}>
						<RadioButtons
							label="Gender"
							placeholder="Gender"
							radioButtons={[
								{
									label: 'Male',
									value: 'male'
								},
								{
									label: 'Female',
									value: 'female'
								}
							]}
							checked={gender}
							onChange={onChangeContentType}
							error={genderError}
						/>

						{/*
						
						<InputBox
							label='Date of Birth'
							icon='birthday-cake'
							placeholder='Age'
							value={dob}
							type='date'
							onChange={(event) => {
								setAge(getAge(dob));
								setDOB(event.target.value);
								setDOBError('');
							}}
							errorMessage={dobError}
						/>
						 <SelectBox
							label='Salon Name'
							icon='salon'
							name='salon-name'
							value={salon_name}
							onChange={(e) => setSalonName(e.target.value)}>
							<option value=''>Select Salon</option>
							{salonList &&
								salonList.data &&
								salonList.data.map((salon) => (
									<option value={salon._id} key={salon._id}>
										{salon.name}
									</option>
								))}
						</SelectBox> */}

						<SelectBox
							value={stylist}
							onChange={(e) => setStylist(e.target.value)}
							label="Select Stylist"
							icon="stylist"
							name="stylist-name"
						>
							<option className="optionBox" value="">
								Select Stylist
							</option>
							{stylistList &&
								stylistList.userInfo &&
								stylistList.userInfo.status &&
								stylistList.userInfo.data.result.length > 0 &&
								stylistList.userInfo.data.result.map((stylist) => (
									<option value={stylist._id} key={stylist._id}>
										{stylist.name}
									</option>
								))}
						</SelectBox>
						<TextareaBox
							label="Notes"
							style={{ height: '10rem' }}
							onChange={(e) => setNotes(e.target.value)}
							value={notes}
							errorMessage={notesError}
							placeholder='notes..'
						/>
					</div>
				</InputsSectionColumn>

				<ModalButton
					label={selectUpdateModelUser._id ? 'Update User' : 'Add New'}
					icon={selectUpdateModelUser._id ? 'edit' : 'plus'}
					onClick={handleSubmit}
				/>
			</ModalForm>
		</Modal>
	);
};

export default CreateUser;
