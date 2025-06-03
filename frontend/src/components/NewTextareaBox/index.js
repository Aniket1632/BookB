import React from 'react';
import TextBox from './TextBox.module.css';

const TextareaBox = ({ placeholder, value, className, onChange, errorMessage, label, icon, rows, style }) => {
	return (
		<div className={className ? className : TextBox.form_input}>
			{label && (
				<label htmlFor={label} className={TextBox.form_input__label}>
					{label}
				</label>
			)}
			<div className={TextBox.form_input__container} style={style}>
				{/* <svg className={TextBox.form_input__icon}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg> */}
				<textarea
					rows={rows ? rows : 2}
					id={label}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					style={{resize: 'none'}}
					className={TextBox.form_input__box}
				/>
			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default TextareaBox;
