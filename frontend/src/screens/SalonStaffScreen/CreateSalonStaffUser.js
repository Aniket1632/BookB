import React from 'react';
import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputsSectionColumn from '../../components/NewModal/InputsSectionColumn';
import InputBox from '../../components/NewInputBox';
import ModalButton from '../../components/NewModal/ModalButton';
import SelectBox from '../../components/NewSelectBox';
import { useSelector } from 'react-redux';
import TextareaBox from '../../components/NewTextareaBox';
import { inputPhoneMasking } from '../../utils/validators';
import Styles from './SalonStaff.module.css'

const CreateSalonStaffUser = ({ data }) => {
	const userData = useSelector((state) => state.getUserInfo);

	const {
		showAddModal,
		handleAddModalClose,
		handleSubmit,
		name,
		email,
		phone,
		address,
		role,

		setName,
		setEmail,
		setPhone,
		setRole,
		setAddress,

		nameError,
		phoneError,
		emailError,
		addressError,
		roleError,

		setRoleError,
		setNameError,
		setPhoneError,
		setEmailError,
		setAddressError,

		password,
		setPassword,
		passwordError,
		setPasswordError,

		salonId,
		setSalonId,
		salonError,
		setSalonIdError,

		salonList,
		roleList,
		selectUpdateModel
	} = data;
	return (
		<Modal show={showAddModal}>
			<ModalHeading heading={selectUpdateModel._id ? 'Update Staff' : 'Add New Staff'} onClose={handleAddModalClose} />
			<ModalForm
				className={Styles.form}
				onSubmit={handleSubmit}
				style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						className={Styles.input}
						label='User Name'
						icon='user'
						placeholder='eg, John Doe'
						value={name}
						onChange={(event) => {
							setName(event.target.value);
							setNameError('');
						}}
						errorMessage={nameError}
					/>
					<InputBox
						className={Styles.input}
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
						className={Styles.input}
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
					<div className='flex' style={{ gap: '2rem', alignItems: 'flex-start' }}>
						{userData &&
							userData.userInfo &&
							userData.userInfo.data &&
							userData.userInfo.data.role === 'admin' && (
								<SelectBox
									className={Styles.selectBox}
									disabled={selectUpdateModel._id ? true : false}
									value={salonId}
									onChange={(e) => setSalonId(e.target.value)}
									errorMessage={salonError}
									label='Select Salon'
									icon='salon'
									name='salon-name'>
									<option className='optionBox' value=''>
										Select Salon
									</option>
									{salonList &&
										salonList.userInfo &&
										salonList.userInfo.data &&
										salonList.userInfo.data.result.map((salon, index) => (
											<option value={salon._id} key={salon._id}>
												{salon.name}
											</option>
										))}
								</SelectBox>
							)}

						<SelectBox
							className={Styles.selectBox}
							value={role}
							disabled={selectUpdateModel._id ? true : false}
							onChange={(e) => setRole(e.target.value)}
							errorMessage={roleError}
							label='Select Role'
							icon='stylist'
							name='role-name'>
							<option className='optionBox' value=''>
								Select Role
							</option>
							{roleList &&
								roleList.map((role) => (
									<option value={role.value} key={role._id}>
										{role.name}
									</option>
								))}
						</SelectBox>

						{!selectUpdateModel._id && (
							<InputBox
								className={Styles.input}
								label='Password'
								icon='key'
								placeholder='••••••••••••••••'
								type='password'
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									setPasswordError('');
								}}
								errorMessage={passwordError}
							/>
						)}
					</div>
				</InputsSectionColumn>
				<InputsSectionColumn>
					<TextareaBox
						className={Styles.textArea}
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
				</InputsSectionColumn>

				<ModalButton
					label={selectUpdateModel._id ? 'Update Staff' : 'Add New'}
					icon={selectUpdateModel._id ? 'edit' : 'plus'}
					onClick={handleSubmit}
				/>
			</ModalForm>
		</Modal>
	);
};

export default CreateSalonStaffUser;
