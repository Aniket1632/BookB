import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import TextareaBox from '../../components/formInputs/TextareaBox';
import { inputPhoneMasking } from '../../utils/validators';

const CreateEditSalon = ({ data }) => {
	const {
		showAddModal,
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

		password,
		setPassword,
		passwordError,
		setPasswordError,


		imageSrc,
		setImageSrc,

		setUploadFileData,
		uploadFileDataError,
		setUploadFileDataError,
	} = data;


	const handleChangeImage = (e) => {
		var file = e.target.files[0];
		var reader = new FileReader();
		if (e.target.files[0]) {
			var url = reader.readAsDataURL(file);
			reader.onloadend = () => {
				setImageSrc(reader.result);
			};
		}
	}


	return (
		<Modal show={showAddModal}>
			<ModalHeading heading={selectUpdateModel._id ? 'Update Salon' : 'Add New Salon'} onClose={handleAddModalClose} />
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Salon Name'
						icon='salon'
						placeholder='eg, BookB Salon'
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
					<InputBox
						label='Phone'
						icon='phone'
						placeholder='eg, 123 456 7890'
						value={phone}
						onChange={(event) => {
							setPhone(inputPhoneMasking(event.target.value));
							setPhoneError('');
						}}
						errorMessage={phoneError}

					/>
				</InputsSection>
				<InputsSectionColumn>
					<div className='flex' style={{ gap: '2rem' }}>
						<TextareaBox
							label='Address'
							icon='pin'
							placeholder='eg, Devar, USA'
							value={address}
							onChange={(event) => {
								setAddress(event.target.value);
								setAddressError('');
							}}
							errorMessage={addressError}

						/>

						{
							!selectUpdateModel._id &&
							<InputBox
								label='Password'
								icon='key'
								placeholder='**********'
								type='password'
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									setPasswordError('');
								}}
								errorMessage={passwordError}
							/>}
					</div>
				</InputsSectionColumn>
				<FileUpload
					label='Upload Salon Logo'
					icon='upload'
					image={imageSrc}
					onChange={(e) => {
						handleChangeImage(e);
						setUploadFileData(e.target.files);
						setUploadFileDataError('');
					}}
					errorMessage={uploadFileDataError}
				/>
				<ModalButton label={selectUpdateModel._id ? 'Update Salon' : 'Add New'} icon={selectUpdateModel._id ? 'edit' : 'plus'} onClick={handleSubmit} />
			</ModalForm>
		</Modal>
	);
};

export default CreateEditSalon;
