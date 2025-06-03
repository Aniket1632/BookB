import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import InputTime from '../../components/formInputs/InputBox/InputTime';
import MultiSelectBox from '../../components/formInputs/SelectBox/MultiSelectBox';
import SelectBox from '../../components/formInputs/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEnableSubServiceAction } from '../../redux/actions/serviceActions';
import { GET_ALL_ENABLE_SUB_SERVICE_RESET } from '../../redux/constants/serviceConstants';
import { getStylistSettingsAction } from '../../redux/actions/stylistActions';
import { GET_STYLIST_SETTINGS_RESET } from '../../redux/constants/stylistConstants';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
// import AddBusinessHoursWeekly from "../StylistSessionScreen/AddBusinessHoursWeekly";

const StylistSettings = ({ data }) => {
	const dispatch = useDispatch();
	const enableSubServiceList = useSelector((state) => state.enableSubServiceList);
	const getStylistSettings = useSelector((state) => state.getStylistSettings);
	const [enableSubServiceListData, setEnableSubServiceListData] = useState([]);

	const {
		startTime, setStartTime,
		endTime, setEndTime,
		recurringType, setRecurringType,
		intervalTime, setIntervalTime,
		serviceArray, setServiceArray,
		stylistSettingsModal,
		handleSettingsModalClose,
		settingsSubmitHandler,
		selectUpdateModel,
		isCompulsory,
		setIsCompulsory,
		isCompulsoryError,
		setIsCompulsoryError,
	} = data;


	useEffect(
		() => {
			if (selectUpdateModel && selectUpdateModel._id) {
				dispatch(getStylistSettingsAction(selectUpdateModel._id));
				dispatch(getAllEnableSubServiceAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
				return () => {
					dispatch({ type: GET_ALL_ENABLE_SUB_SERVICE_RESET });
					dispatch({ type: GET_STYLIST_SETTINGS_RESET });
				}
			}
		},
		[selectUpdateModel, dispatch]
	);

	useEffect(
		() => {
			if (
				getStylistSettings &&
				getStylistSettings.userInfo &&
				getStylistSettings.userInfo.data &&
				getStylistSettings.userInfo.data.result
			) {
				let settingsData = getStylistSettings.userInfo.data.result;
				setStartTime({ value: settingsData.startTime, error: '' })
				setEndTime({ value: settingsData.endTime, error: '' })
				setRecurringType({ value: settingsData.recurringType, error: '' })
				setIntervalTime({ value: settingsData.intervalTime, error: '' })
				settingsData.services.map((item) => {
					item.label = item.title;
					item.value = item._id;
				});
				setIsCompulsory(settingsData.isBreakTimeCompulsory);
				setServiceArray({ value: settingsData.services, error: '' })
			}
		},
		[getStylistSettings]
	);


	useEffect(
		() => {
			if (!enableSubServiceListData.length) {
				if (enableSubServiceList &&
					enableSubServiceList.categories &&
					enableSubServiceList.categories.data &&
					enableSubServiceList.categories.data.result &&
					enableSubServiceList.categories.data.result.length > 0) {
					enableSubServiceList.categories.data.result.map((item) => {
						item.label = item.title;
						item.value = item._id;
					});
					setEnableSubServiceListData(enableSubServiceList.categories.data.result);
				}
			}
		},
		[enableSubServiceList, enableSubServiceListData]
	);

	return (
		<Modal show={stylistSettingsModal}>
			<ModalHeading
				heading={selectUpdateModel && selectUpdateModel._id ? 'Update Stylist Settings' : 'Add New Stylist Settings'}
				onClose={handleSettingsModalClose}
			/>
			<ModalForm onSubmit={settingsSubmitHandler} style={{ marginBottom: '2.5rem' }}>
				<InputsSection >
					<MultiSelectBox
						multiple={true}
						label='Select Services'
						icon={false}//'archive'
						errorMessage={serviceArray.error}
						value={serviceArray.value.length ? [...serviceArray.value] : null}
						onChange={(event) => {
							setServiceArray({ value: event, error: '' });
						}}
						children={enableSubServiceListData}
					>
					</MultiSelectBox>

					<InputTime
						label='Booking Interval'
						icon='stopwatch'
						placeholder='Time'
						defaultValue="1"
						type='Number'
						style={{ padding: '0.9rem 1rem' }}
						value={intervalTime.value}
						onChange={(event) => {
							setIntervalTime({ value: event.target.value, error: '' });
						}}
						errorMessage={intervalTime.error}
					/>
					<SelectBox
						label="Select Recurring Type"
						icon='stopwatch'
						value={recurringType.value}
						errorMessage={recurringType.error}
						onChange={(e) => setRecurringType({ value: e.target.value, error: '' })}
					>
						<option value="week">
							Week
						</option>
						<option value="month">
							Month
						</option>
						<option value="year">
							Year
						</option>
					</SelectBox>

				</InputsSection>

				<InputsSection>
					<InputsSectionColumn style={{ gap: '0.5rem', padding: '0rem', margin: '0rem' }}>
						<label style={{ fontSize: '1.2rem' }}>Break Time</label>
						<div style={{ display: 'flex', gap: '2rem' }}>
							<InputBox
								label='Start Time'
								icon='stopwatch'
								placeholder='eg, DD/MM/YYYY'
								type='time'
								step="3600000"
								value={startTime.value}
								onChange={(event) => {
									setStartTime({ value: event.target.value, error: '' });
								}}
								errorMessage={startTime.error}
							/>

							<InputBox
								label='End Time'
								icon='stopwatch'
								placeholder='eg, DD/MM/YYYY'
								type='time'
								step="3600000"
								value={endTime.value}
								onChange={(event) => {
									setEndTime({ value: event.target.value, error: '' });
								}}
								errorMessage={endTime.error}
							/>
						</div>
					</InputsSectionColumn>
					<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
						<label className='switch'>
							<input
								id='isBreakTimeCompulsory'
								checked={isCompulsory}
								onChange={() => {
									setIsCompulsory(!isCompulsory);
								}}
								type='checkbox'
								className='checkbox'
								name='active' />
							<span className='slider round' />
						</label>
						<label htmlFor='active' className='inputBox__toggle--label'>
							Compulsory
						</label>
					</div>
				</InputsSection>
				<div style={{ display: 'flex', gap: '1.5rem', padding: '0rem', margin: '0rem' }}>
					<ModalButton
						label={selectUpdateModel && selectUpdateModel._id ? 'Update Settings' : 'Add Settings'}
						icon={selectUpdateModel && selectUpdateModel._id ? 'edit' : 'plus'}
						onClick={settingsSubmitHandler}
					/>
					{/* <ModalButton
						label={'Add Business Hour'}
						icon={'stopwatch'}
						onClick={settingsSubmitHandler}
					/> */}
				</div>
			</ModalForm>

			{/* <AddBusinessHoursWeekly
				data={{
					businessHourDetail,
					weekDays,
					setWeekDays,
					stylistId:selectUpdateModel._id,
					addBuinessHoursModal,
					setAddBuinessHoursModal,
					addBulkAvailabilitys,
					setresetHandler,
					resetHandler,
					setresetslot,
					handleResetSlot
				}}
			/> */}

		</Modal>
	);
};

export default StylistSettings;
