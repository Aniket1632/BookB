import moment from 'moment';
import React, { useState } from 'react';
import TextBox from './TextBox.module.css';

const InputCoupon = ({ type, placeholder, value, onChange, errorMessage, label, name, icon, style, disabled, defaultValue, min, required = false, handler }) => {

	return (
		<div className={[TextBox.form_input]}>
			{label && (
				<label  style={{ color: '#000', fontSize: '2rem', margin: '0.5rem' }} htmlFor={label} className={TextBox.form_input__label}>
					{label}
				</label>
			)}
			<div className={TextBox.form_input__container} style={{ backgroundColor: '#fff', border: '1px solid #0000003d' ,width: '100%', margin: '0', marginBottom: '2rem' }}>
				<svg className={TextBox.form_input__icon} style={{fill: '#b7b2b2'}}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg>

				<input
					style={{ backgroundColor: '#fff', width:'35%', marginRight: '2rem' }}
					type={type}
					id={name}
					name={name}
					min={type === 'date' && (moment().format('YYYY-MM-DD') || type === 'time') && min}
					disabled={disabled ? disabled : false}
					placeholder={placeholder}
					value={value}
					defaultValue={defaultValue}
					onChange={onChange}
					className={TextBox.form_input_coupon_box}
					required={required}
				/>

				<label style={{ cursor: 'pointer',color: 'black', marginTop: '-0.1rem'}} className={TextBox.form_input__label} onClick={handler}>
					Apply
				</label>  


			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default InputCoupon;
