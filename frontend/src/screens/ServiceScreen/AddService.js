import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import TextareaBox from '../../components/formInputs/TextareaBox';
import SelectBox from '../../components/formInputs/SelectBox';
import SelectInput from '../../components/formInputs/SelectBox/SelectInput';
import MultiSelectBox from '../../components/formInputs/SelectBox/MultiSelectBox';
import ServiceStyle from './Service.module.css'
import { getEnableStylistListAction } from '../../redux/actions/stylistActions';
import InputTime from '../../components/formInputs/InputBox/InputTime';
import { GET_ENABLE_STYLER_LIST_RESET } from '../../redux/constants/stylistConstants';

const AddService = ({ data }) => {
	const dispatch = useDispatch();
	const createService = useSelector((state) => state.createService);
	const enableStylistList = useSelector((state) => state.enableStylistList);
	const [stylistList, setStylistList] = useState([]);
	const [text, setText] = useState('Service Category');

	const hoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const minutesArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

	const {
		addModalActive,
		handleAddModalClose,
		handleSubmit,
		selectUpdateModel,
		enableServiceList,

		title,
		description,
		isMainService,
		setIsMainService,
		charges,

		setTitle,
		setDescription,
		setCharges,

		titleError,
		chargesError,
		descriptionError,

		setTitleError,
		setChargesError,
		setDescriptionError,

		service,
		setService,
		serviceError,
		setServiceError,

		minutes,
		setMinutes,

		hours,
		setHours,
		hoursError,
		setHoursError,

		stylistArray,
		setStylistArray,
		stylistArrayError,
		setStylistArrayError,


		leadTime,
		setLeadTime,
		leadTimeError,
		setLeadTimeError,

		breakTime,
		setBreakTime,
		breakTimeError,
		setBreakTimeError,
	} = data;


	useEffect(
		() => {
			dispatch(getEnableStylistListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
			return () => {
				dispatch({ type: GET_ENABLE_STYLER_LIST_RESET });
			}
		},
		[dispatch]
	);

	useEffect(
		() => {
			if (isMainService) {
				setText('Service Category');
			} else {
				setText('Service');
			}
		}
	);


	useEffect(
		() => {
			if (!stylistList.length) {
				if (enableStylistList &&
					enableStylistList.userInfo &&
					enableStylistList.userInfo.data &&
					enableStylistList.userInfo.data.result.length > 0) {
					enableStylistList.userInfo.data.result.map((item) => {
						item.label = item.name;
						item.value = item._id;
					});
					setStylistList(enableStylistList.userInfo.data.result);
				}
			}
		},
		[enableStylistList, stylistList]
	);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading={selectUpdateModel._id ? 'Update ' + text : 'Create New ' + text} onClose={handleAddModalClose} />
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label={text + ' Name'}
						icon='archive'
						placeholder='eg, hair cut'
						value={title}
						onChange={(event) => {
							setTitle(event.target.value);
							setTitleError('');
						}}
						errorMessage={titleError}
					/>
					<InputsSectionColumn style={{ gap: '1rem', padding: '0rem', margin: '0rem', alignItems: 'center', justifyContent: 'center' }}>
						<label className={ServiceStyle.form_input__label}>
							Category/Service
						</label>
						<InputsSectionColumn style={{ flexDirection: 'row', padding: '0rem', alignItems: 'center' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
								<label className='switch'>
									<input
										id='isVideo'
										checked={isMainService}
										onChange={() => {
											setIsMainService(!isMainService);
										}}
										type='checkbox'
										className='checkbox'
										name='active' />
									<span className='slider round' />
								</label>
							</div>
						</InputsSectionColumn>
					</InputsSectionColumn>

					{
						!isMainService &&
						<SelectBox
							value={service}
							onChange={(e) => {
								setService(e.target.value)
								setServiceError('');
							}}
							label='Select Service Category'
							icon='archive'
							name='Service'
							errorMessage={serviceError}
						>
							<option className='optionBox' value=''>
								Select Service
							</option>
							{enableServiceList &&
								enableServiceList.categories &&
								enableServiceList.categories.data &&
								enableServiceList.categories.data.map((res) => (
									<option value={res._id} key={res._id}>
										{res.title}
									</option>
								))}
						</SelectBox>
					}
				</InputsSection>
				{
					!isMainService &&
					<Fragment>
						<InputsSection>
							<InputsSectionColumn style={{ gap: '0.5rem', padding: '0rem', margin: '0rem' }}>
								<label className={ServiceStyle.form_input__label}>
									Select Required Time
								</label>
								<InputsSectionColumn style={{ flexDirection: 'row', padding: '0rem', alignItems: 'center', flexDirection: 'unset', display: 'flex' }}>
									<SelectInput
										value={hours}
										onChange={(e) => { setHours(e.target.value); setHoursError('') }}
										label='Hours'
										icon='archive'
										name='Hours'
										errorMessage={hoursError}
									>
										{hoursArray &&
											hoursArray.length > 0 &&
											hoursArray.map((res) => (
												<option value={res} key={res}>
													{res} H
												</option>
											))}
									</SelectInput>
									<h1>:</h1>
									<SelectInput
										value={minutes}
										onChange={(e) => setMinutes(e.target.value)}
										label='Minutes'
										icon={false}
										name='Minutes'
										errorMessage={false}
									>
										{minutesArray &&
											minutesArray.length > 0 &&
											minutesArray.map((res) => (
												<option value={res} key={res}>
													{res} M
												</option>
											))}
									</SelectInput>
								</InputsSectionColumn>
								{hoursError && <p className="form_input__error">{hoursError}</p>}
							</InputsSectionColumn>
							<InputsSectionColumn style={{ padding: '0rem', margin: '0rem' }}>
								<InputBox
									label='Charges'
									icon='cash'
									placeholder='eg, $ 00.00'
									value={charges}
									onChange={(event) => {
										setCharges(event.target.value);
										setChargesError('');
									}}
									errorMessage={chargesError}
								/>
							</InputsSectionColumn>
						</InputsSection>

						<InputsSection>
							<InputsSectionColumn style={{ gap: '0.5rem', padding: '0rem', margin: '0rem' }}>
								<InputTime
									label='Break Time'
									icon='stopwatch'
									placeholder='Time'
									defaultValue="1"
									value={breakTime.value}
									type='number'
									style={{ padding: '0.9rem 1rem' }}
									typeTime={breakTime.type}
									onChangeType={(event) => {
										setBreakTime({ ...breakTime, type: event.target.value });
									}}
									onChange={(event) => {
										setBreakTime({ ...breakTime, value: event.target.value });
										setBreakTimeError('');
									}}
									errorMessage={breakTimeError}
								/>
							</InputsSectionColumn>
							<InputsSectionColumn style={{ gap: '0.5rem', padding: '0rem', margin: '0rem' }}>
								<InputTime
									label='Lead Time'
									icon='stopwatch'
									placeholder='Time'
									defaultValue="1"
									value={leadTime.value}
									type='number'
									style={{ padding: '0.9rem 1rem' }}
									typeTime={leadTime.type}
									onChangeType={(event) => {
										setLeadTime({ ...leadTime, type: event.target.value });
									}}
									onChange={(event) => {
										setLeadTime({ ...leadTime, value: event.target.value });
										setLeadTimeError('');
									}}
									errorMessage={leadTimeError}
								/>
							</InputsSectionColumn>
						</InputsSection>

						<InputsSection>
							{/* <MultiSelectBox
								multiple={true}
								label='Select Stylist'
								icon={false}
								errorMessage={stylistArrayError}
								value={stylistArray.length ? [...stylistArray] : null}
								onChange={(event) => {
									setStylistArray(event);
									setStylistArrayError('');
								}}
								children={stylistList}
							>
							</MultiSelectBox> */}

							<TextareaBox
								label='Description'
								icon='info'
								placeholder='Enter Description'
								value={description}
								onChange={(event) => {
									setDescription(event.target.value);
									setDescriptionError('');
								}}
								errorMessage={descriptionError}
							/>
						</InputsSection>
					</Fragment>
				}
				{createService && createService.loading ? (
					<ModalButton label={'Please wait'} icon={'plus'} />
				) : (
					<ModalButton label={selectUpdateModel._id ? 'Update ' + text : 'Add New'} icon={selectUpdateModel._id ? 'edit' : 'plus'} onClick={handleSubmit} />
				)}
			</ModalForm>
		</Modal>
	);
};

export default AddService;

