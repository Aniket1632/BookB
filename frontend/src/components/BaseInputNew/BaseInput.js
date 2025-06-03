import React, { useState } from 'react';
import Styles from './BaseInput.module.css';
import moment from 'moment';

const BaseInput = ({ title, errorStyle, containerStyle, type, placeholder, className, style, icon, value, onChange, errorMessage, label, name, disabled, defaultValue, min, required = false, onIconClick, customIcon }) => {
  const [inputType, setInputType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordView = () => {
    setInputType(prevType => (prevType === 'password' ? 'text' : 'password'));
  };

  const disableDate = () => {
    var today, dd, mm, yyyy;
    today = new Date();
    dd = today.getDate() + 1;
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();
    return yyyy + '-' + 'mm' + '-' + dd;
  };

  return (
    <>
      <span className={Styles.title}>{title}</span>
      <div style={containerStyle} className={className ? className : Styles.inputContent}>
      {customIcon && (
          <div style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
            {customIcon}
          </div>
        )}
      <svg
          className='navigation__icon'
          style={{ marginLeft: '1.4rem', marginTop: '0.5rem', cursor: onIconClick ? 'pointer' : 'default' }}
          onClick={onIconClick} 
        >
          <use xlinkHref={`/assets/sprite.svg#${icon}`} />
        </svg>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            data-testid='text-input'
            className={Styles.baseInput}
            type={inputType}
            style={{
              ...style,
              // border:"0px solid #ccc",
              marginTop:5,
              color: "#fff"
            }}
            placeholder={placeholder}
            name={name}
            min={type === 'date' && (moment().format('YYYY-MM-DD') || type === 'time') && min}
            disabled={disabled ? disabled : false}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
          />
          {type === 'password' && (
            <button
              className='toggle-password-button'
              onClick={handlePasswordView}
              style={{
                position: 'absolute',
                right: '-28px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {inputType === 'password' ? (
                <svg className={Styles.navigation__icons}>
                  <use xlinkHref={`/assets/sprite.svg#icon-visibility_off`} />
                </svg>
              ) : (
                <svg className={Styles.navigation__icons} >
                  <use xlinkHref={`/assets/sprite.svg#icon-visibility`} />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {errorMessage && <p style={errorStyle} className={Styles.errorMessage}>{errorMessage}</p>}
    </>
  )
}

export default BaseInput;
