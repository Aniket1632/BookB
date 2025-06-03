import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
// import SelectBox from '../../components/formInputs/SelectBox';
import TextareaBox from '../../components/formInputs/TextareaBox';
import { inputPhoneMasking } from '../../utils/validators';

const CreateStylist = ({ data }) => {
	const {
		showAddModal,
		handleAddModalClose,
		handleSubmit,
		selectUpdateModel,
		imageSrc,
		setImageSrc,

		name,
		email,
		password,
		address,
		phone,

		setName,
		setEmail,
		setPhone,
		setAddress,
		setPassword,

		nameError,
		addressError,
		phoneError,
		emailError,
		passwordError,

		setNameError,
		setAddressError,
		setPhoneError,
		setEmailError,
		setPasswordError,

		setUploadFileData,
		uploadFileDataError,
		setUploadFileDataError,

		// companyList,
		// company,
		// setCompany,
		// companyError
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
	};

	return (
		<Modal show={showAddModal}>
			<ModalHeading
				heading={selectUpdateModel._id ? 'Update Stylist' : 'Add New Stylist'}
				onClose={handleAddModalClose}
			/>
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Stylist Name'
						icon='stylist'
						placeholder='eg, BookB Salon-Stylist'
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
						{/* <SelectBox
							value={company}
							onChange={(e) => setCompany(e.target.value)}
							errorMessage={companyError}
							label='Select Company'
							icon='archive'
							name='company-name'>
							<option className='optionBox' value=''>
								Select Company
							</option>
							{companyList &&
								companyList.categories &&
								companyList.categories.data &&
								companyList.categories.data.result &&
								companyList.categories.data.result.map((company) => (
									<option value={company._id} key={company._id}>
										{company.name}
									</option>
								))}
						</SelectBox> */}
						{!selectUpdateModel._id && (
							<InputBox
								label='Password'
								icon='key'
								placeholder='••••••••••••••'
								type='password'
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									setPasswordError('');
								}}
								errorMessage={passwordError}
							/>
						)}
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
					</div>
				</InputsSectionColumn>

				<FileUpload
					label='Upload Stylist Photo'
					icon='upload'
					image={imageSrc}
					onChange={(e) => {
						handleChangeImage(e);
						setUploadFileData(e.target.files);
						setUploadFileDataError('');
					}}
					errorMessage={uploadFileDataError}
				/>

				<ModalButton
					label={selectUpdateModel._id ? 'Update Stylist' : 'Add New'}
					icon={selectUpdateModel._id ? 'edit' : 'plus'}
					onClick={handleSubmit}
				/>
			</ModalForm>
		</Modal>
	);
};

export default CreateStylist;
