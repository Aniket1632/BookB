import React, { useState } from 'react';
import styles from './SelectBox.css';

const SelectBox = ({ children, icon, name, label, value, onChange, errorMessage, disabled, multiple, style }) => {
	return (
		// <div className="form_input">
		// 	{/* {label && (
		// 		<span>ab</span>
		// 	)} */}
		// 	{label && (
		// 		<label htmlFor={label} className={styles.form_input__label}>
		// 			{label}
		// 		</label>
		// 	)}
		<div style={{maxWidthwidth:"9rem"}}>
			 	{label && (
			<label htmlFor={label} style={{color:"#eee", fontSize:"1.2rem"}}>
		 			{label}
			</label>
		 	)}
			<div className="textBox" >
				{icon && (
					<label className="textBox__labels">
						<svg className="textBox__label--icon">
							<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
						</svg>
					</label>
				)}
				<div className="textBox__input" >
					<select disabled={disabled} value={value} name={name} id={name} className='textBox__input--box' onChange={onChange} style={style} >
						{children}
					</select>
				</div>
			</div>

			{errorMessage && <p className="form_input__error">{errorMessage}</p>}
			</div>
		// </div>
	);
};

export default SelectBox;
