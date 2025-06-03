import React from 'react';
import TextBox from './TextBox.module.css';
import DatePicker, { Calendar } from "react-multi-date-picker"; 

const MultiDatePicker = ({ type, placeholder, value, onChange, errorMessage, label, icon, style, disabled }) => {
	return (
		<div className={TextBox.form_input}>
			{label && (
				<label htmlFor={label} className={TextBox.form_input__label}>
					{label}
				</label>
			)}
			<div className={TextBox.form_input__container} style={style}>
				<svg className={TextBox.form_input__icon}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg>
				<Calendar
					className={TextBox.form_input__box}
					placeholder="dd-mm-yyyy"
					Type="calendar"
					Layout="Default" 
					Mode="multiple"
					multiple
					value={value}
					onChange={onChange}
				/>
			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default MultiDatePicker;
