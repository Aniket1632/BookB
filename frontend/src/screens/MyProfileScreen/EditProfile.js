import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import TextareaBox from '../../components/formInputs/TextareaBox';
import MultiSelectBox from '../../components/formInputs/SelectBox/MultiSelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEnableSubServiceAction } from '../../redux/actions/serviceActions';
import { GET_ALL_ENABLE_SUB_SERVICE_RESET } from '../../redux/constants/serviceConstants';
import { inputPhoneMasking } from '../../utils/validators';

const EditProfile = ({ props }) => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.getUserInfo);
	const enableSubServiceList = useSelector((state) => state.enableSubServiceList);
	const [data, setData] = useState([]);



	const {
		name,
		email,
		address,
		phone,
		setName,
		setEmail,
		setPhone,
		setAddress,

		serviceArray,
		setServiceArray,
		serviceArrayError,
		setServiceArrayError,

		nameError,
		addressError,
		phoneError,
		emailError,

		setNameError,
		setAddressError,
		setPhoneError,
		setEmailError,

		startTime,
		startTimeError,
		setStartTime,
		setStartTimeError,

		endTime,
		endTimeError,
		setEndTime,
		setEndTimeError,


		imageSrc,
		setImageSrc,
		imageSrcError,
		setImageSrcError,
		setUploadFileData,
		uploadFileDataError,
		setUploadFileDataError,

		handleEditModalClose,
		handleSubmit,
		showEditModal,
		setShowEditModal,
		selectUpdateModel,
		setSelectUpdateModel,


	} = props;



	useEffect(
		() => {
			dispatch(getAllEnableSubServiceAction({ pageNumber: 1, pageSize: 1000, filter: '' }));

			return () => {
				dispatch({ type: GET_ALL_ENABLE_SUB_SERVICE_RESET });
			}
		},
		[dispatch]
	);


	useEffect(
		() => {
			if (!data.length) {
				if (enableSubServiceList &&
					enableSubServiceList.categories &&
					enableSubServiceList.categories.data &&
					enableSubServiceList.categories.data.result.length > 0) {
					enableSubServiceList.categories.data.result.map((item) => {
						item.label = item.title;
						item.value = item._id;
					});
					setData(enableSubServiceList.categories.data.result);
				}
			}
		},
		[enableSubServiceList, data]
	);




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

	const onSelectChange = (e) => {
		let value = Array.from(e.target.selectedOptions, option => option.value);
		setServiceArray(value);
		setServiceArrayError('');
	}



	return (
		<Modal show={showEditModal}>
			<ModalHeading heading='Update Profile' onClose={handleEditModalClose} />
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Name'
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

				<Fragment>
					<InputsSection>
						{
							userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data && userData.userInfo.data.role === 'stylist' &&
							<>
								<InputBox
									label='Start Time'
									icon='stopwatch'
									placeholder='eg, DD/MM/YYYY'
									value={startTime}
									type='time'
									step="3600000"
									onChange={(event) => {
										setStartTime(event.target.value);
										setStartTimeError('');
									}}
									errorMessage={startTimeError}
								/>

								<InputBox
									label='End Time'
									icon='stopwatch'
									placeholder='eg, DD/MM/YYYY'
									value={endTime}
									type='time'
									step="3600000"
									onChange={(event) => {
										setEndTime(event.target.value);
										setEndTimeError('');
									}}
									errorMessage={endTimeError}
								/>

								<MultiSelectBox
									multiple={true}
									label='Select Services'
									icon={false}//'archive'
									errorMessage={serviceArrayError}
									value={serviceArray.length ? [...serviceArray] : null}
									onChange={(event) => {
										setServiceArray(event);
										setServiceArrayError('');
									}}
									children={data}
								>

								</MultiSelectBox>
							</>
						}
						<div className='flex' style={{ gap: '2rem' }}>
							<TextareaBox
								rows={4}
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
						</div>
					</InputsSection>

				</Fragment>
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
				<ModalButton label='Update Profile' icon='edit' onClick={handleSubmit} />
			</ModalForm>
		</Modal>
	);
};

export default EditProfile;
