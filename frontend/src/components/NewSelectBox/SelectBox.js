import React, { useState } from "react";
// import Styles  from './SelectBox.css';

const SelectBox = ({
  children,
  icon,
  name,
  textBoxStyle,
  label,
  className,
  value,
  onChange,
  errorMessage,
  disabled,
  multiple,
  style,
}) => {
  return (
    <div className={className ? className : "form_input"}>
      {label && (
        <label htmlFor={label} className="form_input__label">
          {label}
        </label>
      )}
      <div className="textBox" style={textBoxStyle}>
        {icon && (
          <label className="textBox__label">
            <svg className="textBox__label--icon">
              <use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
            </svg>
          </label>
        )}
        <div className="textBox__input1" style={style}>
          <select
            multiple={multiple}
            style={style}
            disabled={disabled}
            value={value}
            name={name}
            id={name}
            className="textBox__input--box"
            onChange={onChange}
          >
            {children}
          </select>
        </div>
      </div>

      {errorMessage && <p className="form_input__error">{errorMessage}</p>}
    </div>
  );
};

export default SelectBox;
