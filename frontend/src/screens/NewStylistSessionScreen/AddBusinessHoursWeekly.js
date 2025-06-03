import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import AvailabilityStyle from './StylistAvailability.module.css';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch } from 'react-redux';
import { addBulkAvailabilityAction } from '../../redux/actions/availabilityActions';
import { WeekDaysArray } from './calendarData';
import SelectBox from '../../components/formInputs/SelectBox';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import RangeDatePickerModal from './RangeDatePickerModal';

const AddBusinessHoursWeekly = ({ data }) => {
	const dispatch = useDispatch();
	const {
		weekDays,
		getList,
		setWeekDays,
		stylistId,
		handleRefresh,
		setGetlatestData,
		addBuinessHoursModal,
		setAddBuinessHoursModal,
		businessHourDetail,
		addBulkAvailabilitys,
		setresetHandler,
		resetHandler,
		setresetslot,
		handleResetSlot,
		recurringType,
		setRecurringType
	} = data;

	const [error, setError] = useState(false)
	const [showSpinner, setShowSpinner] = useState(false);
	const [fromDate, setFromDate] = useState(
		moment().startOf("month").format("MM/DD/YYYY")
	  );
	  const [toDate, setToDate] = useState(
		moment().endOf("month").format("MM/DD/YYYY")
	  );
	const history = useHistory();



	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}

	const handleChange = (e, mainIndex, index, item) => {
		e.preventDefault()
		let newFormValues = [...weekDays];
		weekDays[mainIndex].slot[index][e.target.name] = e.target.value;
		item[e.target.name] = e.target.value;
		setWeekDays([...newFormValues]);
	}

	const addFormFields = (slot) => {
		if (slot) {
			slot.push({
				startTime: "",
				endTime: ""
			})
		}
		setWeekDays([...weekDays])
	}


	const removeFormFields = (i, mainIndex, day) => {
		const newFormValues = [...weekDays];
		newFormValues[mainIndex].slot.splice(i, 1);
		setWeekDays(newFormValues);
		day.slot.splice(i, 1);
	}

	const copyToAllHandler = (e, slot) => {

		e.preventDefault();
		// const newFormValues = [...weekDays];
		// const dataArray = weekDays[i].slot;
		let tmpArray = [];
		WeekDaysArray.forEach(element => {
			tmpArray.push({ day: element.day, slot: slot },);
		});


		setWeekDays(tmpArray);

		setresetHandler(false);
	}


	const addBulkAvailabilityHandler = (e) => {
		e.preventDefault();
		setShowSpinner(true);
	
		const availabilityPayload = {
			slots: businessHourDetail ? businessHourDetail.slots : weekDays,
			id: businessHourDetail && businessHourDetail._id,
			recurringType: recurringType.value, 
		};
	
		if (recurringType.value === 'custom') {
			availabilityPayload.customStartDate = convert(fromDate);
			availabilityPayload.customEndDate = convert(toDate);
		}
	
		dispatch(addBulkAvailabilityAction(availabilityPayload, stylistId));
	
		setTimeout(() => {
			getList();
			setShowSpinner(false);
			setAddBuinessHoursModal(false);
			setRecurringType({ value: 'custom', error: '' })
			handleRefresh();
		}, 7000);
	};


	function errorMessageHandler(item, index, day) {
		if (item < (index > 0 && day[index - 1].endTime)) {
			setError(true);
			return "End Time should be greater than Start Time"
		} else {
			setError(false);
			return ""
		}
	}

	const handleAddModalClose = useCallback(() =>{
		setAddBuinessHoursModal(false);
		setRecurringType({ value: 'custom', error: '' })
	},[])

	return (
		<Modal show={addBuinessHoursModal} className={AvailabilityStyle.modal}>
			<ModalHeading heading={'Weekly Business Hours'} onClose={handleAddModalClose} />
			<ModalForm onSubmit={(e) => addBulkAvailabilityHandler(e)} style={{ marginBottom: '2.5rem' }}>
				{showSpinner ? <div className={AvailabilityStyle.slotLoading} >
					<Spinner />
					<div className={AvailabilityStyle.slotLoadingTxt}>Unblocking slot. Please wait it may take a while.</div>
				</div> : null}
				<div style={{ overflow: 'auto', marginBottom: '2rem' }} className={AvailabilityStyle.businessHoursForm}>
					<div style={{ display: "flex", justifyContent: "flex-start", alignItems: 'center' }} >
						
						<div>
							{recurringType.value === 'custom' && <RangeDatePickerModal
								data={{
									fromDate,
									toDate,
									setFromDate,
									setToDate,
									//   datePickerHandler,
								}}
							/>}
						</div>
						<div style={{ background: 'none', display: "flex", justifyContent: "center", alignItems: 'center', padding: '20px', marginBottom: '1rem', borderRadius: '1rem' }} >
							<SelectBox style={{ marginTop: '1rem' }}
								label="Select Recurring Type"
								icon='stopwatch'
								value={recurringType.value}
								errorMessage={recurringType.error}
								onChange={(e) => setRecurringType({ value: e.target.value, error: '' })}
							>
								{/* <option value="week">
									Week
								</option> */}
								<option value="custom">
									Custom
								</option>
								<option value="month">
									Month
								</option>
								{/* <option value="year">
									Year
								</option> */}
							</SelectBox>
						</div>
					</div>
					<InputsSection style={{ flexDirection: 'column' }}>
						{/* {!resetHandler &&<div className={AvailabilityStyle.undoButtonslot}>
					 <button className={AvailabilityStyle.addButtonslot}
												onClick={(e) => {
													handleResetSlot(e)
												}}>Undo</button>

					</div>} */}
						{
							weekDays &&
							weekDays.length > 0 &&
							weekDays.map((day, mainIndex) => (
								<Fragment key={mainIndex}>
									<div className={AvailabilityStyle.dayContainer} style={{ alignItems: 'end' }} >
										<div className={AvailabilityStyle.day}>
											{day.day}
										</div>
										<InputsSectionColumn style={{ padding: '0rem', margin: '0rem' }}>
											{
												day.slot.length > 0 ? (
													day.slot.map((item, index) => (
														<div key={mainIndex + index} className={AvailabilityStyle.slotRow}>
															<InputBox
																label={index == 0 ? 'Start Time' : false}
																icon='stopwatch'
																placeholder='eg, 1:00 PM'
																value={item.startTime}
																name='startTime'
																type='time'
																step="3600000"
																onChange={e => handleChange(e, mainIndex, index, item)}
																min={index > 0 ? day.slot[index - 1].endTime : ""}
																required={true}
																errorMessage={item.startTime < (index > 0 && day.slot[index - 1].endTime) ? "Start time should be greater than previous End Time" : ""}
															/>
															<h6 style={{ color: "white", margin: "1rem", paddingTop: "1rem" }}>:</h6>
															<InputBox
																label={index == 0 ? 'End Time' : false}
																icon='stopwatch'
																placeholder='eg, 2:00 PM'
																value={item.endTime}
																name='endTime'
																type='time'
																step="3600000"
																required={true}
																onChange={e => handleChange(e, mainIndex, index, item)}
																min={index > 0 ? day.slot[index - 1].endTime : ""}
																errorMessage={item.endTime < (index > 0 && day.slot[index - 1].endTime) ? "End Time should be greater than Start Time" : ""}
															/>

															<button style={{ marginTop: index == 0 ? '2rem' : '0rem' }}
																className='table__button table__button--delete'
																onClick={(e) => {
																	e.preventDefault();
																	removeFormFields(index, mainIndex, day)
																}}>
																<svg className='table__button--icon-red'>
																	<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
																</svg>
																<span>Remove</span>
															</button>
														</div>
													))
												) : (
													<div className={AvailabilityStyle.slotRow}>
														<button className={AvailabilityStyle.addButtonslot}
															onClick={(e) => {
																e.preventDefault();
																addFormFields(day.slot)
															}}>Add Hours</button>
													</div>
												)
											}
										</InputsSectionColumn>
										{
											day.slot.length > 0 &&
											<div className={AvailabilityStyle.busBtn}>
												<button className={AvailabilityStyle.addButtonslot}
													onClick={(e) => {
														e.preventDefault();
														addFormFields(day.slot)
													}}>Add Hours</button>
												{/* <button className={AvailabilityStyle.copySlot}
												onClick={(e) => {
												

													copyToAllHandler(e,day.slot);
												}}>Copy to All</button> */}
											</div>
										}
									</div>
								</Fragment>
							))}

					</InputsSection>
				</div>

				<div style={{ display: 'flex', gap: '2rem' }}>
					<ModalButton
						label={addBulkAvailabilitys.loading ? "Please wait..." : businessHourDetail == null ? "Add time slot" : "Update Business Hours"}
						disabled={addBulkAvailabilitys.loading ? true : error ? true : false}
						icon={addBulkAvailabilitys.loading ? "" : businessHourDetail == null ? 'plus' : 'edit'}
					/>
				</div>
			</ModalForm>
		</Modal>
	);
};

export default AddBusinessHoursWeekly;
