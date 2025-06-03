import React from 'react';
// import InputsSection from '../../components/Modal/InputsSection';
import './Picker.css';
import TemplateAssignStyles from './TemplateAssign.module.css';

import {
	RangeDatePicker,
	SingleDatePicker
} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";

import moment from "moment";

const RangeDatePickerModal = ({ data }) => {

	const {
		fromDate,
		toDate,
		setFromDate,
		setToDate,
		datePickerHandler
	} = data;

	return (
		<div className='flex' style={{marginTop: '2.2rem'}}>
			<div style={{ borderRadius:'1rem',marginBottom:'1rem' }}>
				<div className={TemplateAssignStyles.muscleType}>
					<RangeDatePicker
						startDate={moment(fromDate).format('MM/DD/YYYY')}
						endDate={moment(toDate).format('MM/DD/YYYY')}
						minDate={new Date(2022, 0, 1)}
						startDatePlaceholder="From"
						endDatePlaceholder="To"
						dateFormat="MM/DD/YYYY"
						monthFormat="MMM YYYY"
						disabled={false}
						singleCalendar={true}
						onChange={(startDate, endDate) => {
							setFromDate(moment(startDate).format('MM/DD/YYYY'));
							setToDate(moment(endDate).format('MM/DD/YYYY'));  
							// datePickerHandler(moment(startDate).format('MM/DD/YYYY'), moment(endDate).format('MM/DD/YYYY'));
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default RangeDatePickerModal;
