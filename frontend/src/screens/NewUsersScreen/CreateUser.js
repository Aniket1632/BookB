import React from 'react';
import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputsSectionColumn from '../../components/NewModal/InputsSectionColumn';
import InputBox from '../../components/NewInputBox';
import ModalButton from '../../components/NewModal/ModalButton';
import RadioButtons from '../../components/NewRadioButton/RadioButtons';
import SelectBox from '../../components/NewSelectBox';
import { inputPhoneMasking } from '../../utils/validators';
import TextareaBox from '../../components/NewTextareaBox';
import { useSelector } from 'react-redux';
import Styles from './Users.module.css'

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

	const userRole = useSelector((state) => state.getUserInfo);
	// console.log(userRole , "userRole");

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
			<ModalForm onSubmit={handleSubmit} >
				<InputsSection>
					<InputBox
						className={Styles.input}
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
						className={Styles.input}
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
						className={Styles.input}
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
						<RadioButtons style={{ marginTop: "5rem" }}
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

						{/* <SelectBox
						// style={{paddingTop:"2rem"}}
							value={stylist}
							onChange={(e) => setStylist(e.target.value)}
							label="Select Stylist name"
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
						</SelectBox> */}
						{/* {userRole?.userInfo?.data.role === 'salon' && (
							< TextareaBox
								label="Notes"
								style={{ height: '8rem', backgroundColor: "#353434b5", marginTop: "0rem" }}
								onChange={(e) => setNotes(e.target.value)}
								value={notes}
								errorMessage={notesError}
								placeholder='notes..'
							/>
						)} */}
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
