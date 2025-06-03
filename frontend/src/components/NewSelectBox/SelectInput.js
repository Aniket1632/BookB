import React, { useState } from 'react';
import './SelectBox.css';

const SelectInput = ({ children, icon, name, label, value, onChange, errorMessage, disabled, multiple }) => {
	return (
		<div className='form_input'>
			<div className='textBox__input' style={{width: '10rem'}}>
				<select multiple={multiple} disabled={disabled} value={value} name={name} id={name} style={{ marginLeft: '0rem'  }} className='textBox__input--box' onChange={onChange}>
					{children}
				</select>
			</div> 
		</div>
	);
};

export default SelectInput;
