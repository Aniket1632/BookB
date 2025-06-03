import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import MultiSelectBox from '../../components/formInputs/SelectBox/MultiSelectBox';
import { getAllEnableSubServiceAction } from '../../redux/actions/serviceActions';
import { GET_ALL_ENABLE_SUB_SERVICE_RESET } from '../../redux/constants/serviceConstants';
import InputTime from '../../components/formInputs/InputBox/InputTime';
import { USER_LIST_RESET } from '../../redux/constants/userConstants';
import { getUserListAction } from '../../redux/actions/userActions';
import { inputPhoneMasking } from '../../utils/validators';
import SelectBox from '../../components/formInputs/SelectBox';
import StylistSessionStyles from './StylistAvailability.module.css';
const AddAvailability = ({ data }) => {
	const dispatch = useDispatch();
	const enableSubServiceList = useSelector((state) => state.enableSubServiceList);
	const userList = useSelector((state) => state.userList);
	const [serviceList, setServiceList] = useState([]);
	const [userDataList, setUserDataList] = useState([]);
	const [input, setInput] = useState("");

	const {
		addModalActive,
		handleAddModalClose,
		handleSubmit,
		selectUpdateModel,
		setSelectUpdateModel,

		name,
		email,
		phone,

		setName,
		setEmail,
		setPhone,

		nameError,
		phoneError,
		emailError,
		setUserId,

		setNameError,
		setPhoneError,
		setEmailError,

		date,
		setDate,
		dateError,
		setDateError,

		gender,
		setGender,

		startTime,
		startTimeError,
		setStartTime,
		setStartTimeError,

		requiredTime,
		setRequiredTime,
		requiredTimeError,
		setRequiredTimeError,

		service,
		setService,
		serviceError,
		setServiceError,
		isUpdate,
		handleUpdateSubmit,
		serviceIds,
		setServiceIds,
		genderError, setGenderError
	} = data;

	useEffect(
		() => {
			dispatch(getUserListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));

			return () => {
				dispatch({ type: USER_LIST_RESET });
			}
		},
		[dispatch]
	);

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
			if (!serviceList.length) {
				if (enableSubServiceList &&
					enableSubServiceList.categories &&
					enableSubServiceList.categories.data &&
					enableSubServiceList.categories.data.result.length > 0) {
					enableSubServiceList.categories.data.result.map((item) => {
						item.label = item.title;
						item.value = item._id;
					});
					setServiceList(enableSubServiceList.categories.data.result);
				}
			}
		},
		[enableSubServiceList, serviceList]
	);

	// useEffect(() => {
	// 	if (enableSubServiceList &&
	// 		enableSubServiceList.categories &&
	// 		enableSubServiceList.categories.data &&
	// 		enableSubServiceList.categories.data.result.length > 0) {
	// 		const updatedServiceList = enableSubServiceList.categories.data.result.map(item => ({
	// 			label: item.title,
	// 			value: item._id
	// 		}));
	// 		setServiceList(updatedServiceList);
	// 	}
	// }, [enableSubServiceList, serviceList]);

	useEffect(
		() => {
			if (!userDataList.length) {
				if (userList &&
					userList.userInfo &&
					userList.userInfo.data &&
					userList.userInfo.data.result.length > 0) {
					userList.userInfo.data.result.map((item) => {
						item.label = item.name;
						item.value = item._id;
					});
					setUserDataList(userList.userInfo.data.result);
				}
			}
		},
		[userList, userDataList]
	);

	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}

	return (
		<Modal show={addModalActive} className={StylistSessionStyles.container}>
			<ModalHeading heading={isUpdate ? 'Update Appointment' : 'Book Appointment'} onClose={handleAddModalClose} />
			<ModalForm style={isUpdate ? { marginBottom: '2.5rem', height: '40rem', overflow: 'auto' } : { marginBottom: '2.5rem', height: '40rem', overflow: 'auto' }}>
				<InputsSection style={{ alignItems: "center" }}>
					{
						isUpdate ?
							<InputBox style={{ paddingLeft: "1rem" }}
								label='Select Date'
								icon='calendar'
								disabled
								placeholder='Appointment Date'
								type='date'
								value={convert(date)}
								onChange={(event) => {
									setDate(event.target.value);
									setDateError('');
								}}
								errorMessage={dateError}
							/>
							:
							<InputBox className={StylistSessionStyles.inputs}
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
					}
					{
						isUpdate ?
							<InputBox
								disabled
								style={{ fill: "white", paddingLeft: '1rem' }}
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
							:
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
					}


				</InputsSection>

				<InputsSection style={{ alignItems: "center" }}>
					<MultiSelectBox style={{ paddingLeft: "0rem" }}
						label='Select Service'
						icon={false}
						multiple={false}
						errorMessage={serviceError}
						inputValue={service}
						children={serviceList}
						onChange={(event) => {
							setRequiredTime(event.requiredTime);
							setService(event.title)
							setServiceIds({ ...serviceIds, mainServiceId: event._id, subServiceId: event.service._id })
							setServiceError('');
						}}
						onInputChange={(value, action) => {
							if (action.action === "input-change") {
								//setInput(value);
								setService(value);
							}
						}}
					>
					</MultiSelectBox>
					<InputsSectionColumn style={{ gap: '1rem', padding: '0rem', margin: '0rem' }}>
						<InputTime
							label='Required Time'
							icon='stopwatch'
							placeholder='Time'
							defaultValue="1"
							value={requiredTime}
							type='Number'
							style={{ padding: '0.2rem 0.5rem', gap: "1rem" }}
							onChange={(event) => {
								setRequiredTime(event.target.value);
								setRequiredTimeError('');
							}}
							errorMessage={requiredTimeError}
						/>
					</InputsSectionColumn>
				</InputsSection>
				
			

				<InputsSection style={{ alignItems: "center" }}>
					<MultiSelectBox style={{ paddingLeft: "0rem" }}
						multiple={false}
						label='Client Name'
						icon={false}
						errorMessage={nameError}
						value={name}
						onChange={(event) => {
							setName(event.name);
							setUserId(event._id)
							setGender(event.gender)
							setEmail(event.email);
							setPhone(inputPhoneMasking(event.phone));
							setNameError('');
						}}
						children={userDataList}
						inputValue={name}
						onInputChange={(value, action) => {
							if (action.action === "input-change") {
								//setInput(value);
								setName(value)
							}
						}}
					>
					</MultiSelectBox>
						{/* <SelectBox className={StylistSessionStyles.input} style={{ marginTop: "1.4rem", marginRight: "0rem", marginLeft: '0rem' }}
						label='Client'
						value={gender}
						onChange={(event) => {
							setName(event.name);
							setUserId(event._id)
							setGender(event.gender)
							setEmail(event.email);
							setPhone(inputPhoneMasking(event.phone));
							setNameError('');
						}}

						// icon='users'
						name='Service'
						errorMessage={genderError}
					>
						<option className='optionBox' value="">--Select Client--</option>
						{userDataList.map((item) =><option value='male'>{item.name}</option>)}
					</SelectBox> */}
					{/* <InputBox
						label='Client Name'
						icon='user'
						placeholder='Jon Doe'
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setEmailError('');
						}}
						errorMessage={emailError}
					/> */}

					{/* <InputBox 
						label='Email'
						icon='email'
						placeholder='eg, johndoe@example.com'
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setEmailError('');
						}}
						errorMessage={emailError}
					/> */}
					<SelectBox className={StylistSessionStyles.input} style={{ marginTop: "1.4rem", marginRight: "0rem" }}
						label='Gender'
						value={gender}
						onChange={(event) => {
							setGender(event.target.value)
							setGenderError('')
						}}

						icon='users'
						name='Service'
						errorMessage={genderError}
					>
						<option className='optionBox' value="">--Select Gender--</option>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='other'> Other</option>
					</SelectBox>

				</InputsSection>

				<InputsSection style={{ alignItems: "center" }}>
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

					{/* <SelectBox 
						label='Gender'
						value={gender}
						onChange={(event) => {
							setGender(event.target.value)
							setGenderError('')
						}}
						
						icon='user'
						name='Service'
						errorMessage={genderError}
					>
						<option className='optionBox' value="">--Select Gender--</option>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='other'> Other</option>
					</SelectBox> */}

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

			</ModalForm>
			<div style={{ display: 'flex', gap: '2rem' }}>
				<ModalButton label={isUpdate ? 'Update Appointment' : 'Book Now'} icon={isUpdate ? 'edit' : 'plus'} onClick={isUpdate ? handleUpdateSubmit : handleSubmit} />
				<ModalButton varient='danger' label='Cancel' icon='delete' onClick={handleAddModalClose} />
			</div>
		</Modal>
	);
};

export default AddAvailability;
