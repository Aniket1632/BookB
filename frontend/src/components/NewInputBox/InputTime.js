import React from 'react';
import SelectInput from '../NewSelectBox/SelectInput';
import TextBox from './TextBox.module.css';

const InputTime = ({ type, placeholder, className, value, onChange, errorMessage, label, icon, style, disabled, defaultValue, typeTime, onChangeType }) => {
	return (
		<div className={className ? className : TextBox.form_input} >
			{label && (
				<label htmlFor={label} className={TextBox.form_input__label}>
					{label}
				</label>
			)}
			<div className={TextBox.form_input__container} style={style}>
				<svg className={TextBox.form_input__icon} style={{ width: '6rem' }}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg>
				<input
					min="1"
					type={type ? type : 'text'}
					id={label}
					disabled={disabled ? disabled : false}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={TextBox.form_input__box}
				/>


				<SelectInput
					icon={false}
					name='Minutes'
					defaultValue='Mins'
					value={typeTime}
					onChange={onChangeType}
				>
					<option value='Mins'>  Mins </option>
					<option value='Hours'>  Hours </option>
				</SelectInput>

			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default InputTime;