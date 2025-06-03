import moment from 'moment';
import React from 'react';
import TextBox from './TextBox.module.css';

const Input = ({ type, placeholder, value, onChange, errorMessage, label, name, icon, style, disabled, defaultValue, min }) => {
	const disableDate = () => {
		var today, dd, mm, yyyy;
		today = new Date();
		dd = today.getDate() + 1;
		mm = today.getMonth() + 1;
		yyyy = today.getFullYear();
		return yyyy + "-" + "mm" + "-" + dd
	}
	return (
		<div className={TextBox.form_input}>
			{label && (
				<label htmlFor={label} className={TextBox.form_input__label}>
					{label}
				</label>
			)}
			<div className={TextBox.form_input__container} style={style}>
				{icon &&
					<svg className={TextBox.form_input__icon}>
						<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
					</svg>}
				<input
					type={type ? type : 'text'}
					id={name}
					name={name}
					min={type === 'date' && moment().format('YYYY-MM-DD') || type === 'time' && min}
					disabled={disabled ? disabled : false}
					placeholder={placeholder}
					value={value}
					defaultValue={defaultValue}
					onChange={onChange}
					className={TextBox.form_input__box}

				/>
			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default Input;
