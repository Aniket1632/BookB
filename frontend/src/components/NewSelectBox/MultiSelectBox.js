import React, { useState } from 'react';
import Styles from './SelectBox.css';
import Select, { components } from 'react-select';

const MultiSelectBox = ({ className, children, icon, name, label, value, onChange, errorMessage, multiple, inputValue, onInputChange }) => {
	const colourStyles = {
		menuList: (styles) => ({
			...styles,
			backgroundColor: '#eaeaea !important',
			zIndex: 999,
			width: '100%'
		}),
		option: (styles, { isFocused, isSelected }) => ({
			...styles,
			color: isSelected ? '#000' : '#000',
			backgroundColor: isSelected ? '#FFF' : '#FFF',
			zIndex: 1
		}),
		menu: (base) => ({
			...base,
			zIndex: 999,
		})
	};
	const NoOptionsMessage = (props) => {
		return (
			<components.NoOptionsMessage {...props}>
				<span>No users found with name</span>
			</components.NoOptionsMessage>
		);
	};
	return (
		<div className={className ? className : Styles.form_input}>
			{label && (
				<label htmlFor={label} className="form_input__label">
					{label}
				</label>
			)}
			<div className="textBox">
				{icon && (
					<label className="textBox__label" style={{ top: '0rem' }}>
						<svg className="textBox__label--icon">
							<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
						</svg>
					</label>
				)}
				<div className='textBox__input' >
					<Select
						value={value}
						isMulti={multiple}
						options={children}
						inputValue={inputValue}
						onChange={onChange}
						styles={colourStyles}
						placeholder={label}
						className='textBox__input--box'
						onInputChange={onInputChange}
					// menuIsOpen={true}
					/>
				</div>
			</div>

			{errorMessage && <p className="form_input__error">{errorMessage}</p>}
		</div>
	);
};

export default MultiSelectBox;





{/*
					<Select
						isMulti={multiple}
						id={name}
						className='react-select'
						className='textBox__input--box'
						isClearable={false}
						options={children}
						styles={colourStyles}
						// components={{ NoOptionsMessage }}
						placeholder={label}
						onChange={onChange}


						// inputValue={value}
						// onInputChange={onInputChange}
						onInputChange={(value, action) => {
							// only set the input when the action that caused the
							// change equals to "input-change" and ignore the other
							// ones like: "set-value", "input-blur", and "menu-close"
							if (action.action === "input-change") setInput(value); // <---
						}}
					/> */}