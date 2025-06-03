import React from 'react';
import TextBox from './TextBox.module.css';

const TextareaBox = ({ placeholder, value, onChange, errorMessage, label, icon, rows, style, textBoxStyle }) => {
	return (
		<div className={TextBox.form_input}>
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
					textBoxStyle={textBoxStyle}
					style={textBoxStyle}
					className={TextBox.form_input__box}
				/>
			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default TextareaBox;
