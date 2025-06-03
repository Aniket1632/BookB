import React from 'react';
import RadioButtonsStyle from './RadioButtons.module.css';

const RadioButtons = ({ label, radioButtons, checked, onChange, error, style }) => {
	return (
		<div className={RadioButtonsStyle.modal_input}>

			<label className={RadioButtonsStyle.form_input__label}>{label}</label>
			<div className='modal__radioButtons' style={style}>
				{radioButtons &&
					radioButtons.map((radioButton, index) => (
						<div key={index} className='modal__radioButton'>
							<input
								type='radio'
								id={radioButton.label}
								name={label}
								value={radioButton.value}
								checked={checked === radioButton.value}
								onChange={(e) => onChange(e)}
								className='modal__radioButton--input'
							/>
							<span className='modal__radioButton--radio' />
							<label htmlFor={radioButton.label} className='modal__radioButton--label'>
								{radioButton.label}
							</label>
						</div>
					))}
			</div>
			<br/>
			{error && <p className={RadioButtonsStyle.form_input__error}>{error}</p>}
		</div>
	);
};

export default RadioButtons;
