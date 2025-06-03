import React from 'react'
import Styles from './MyProfileInputComponent.module.css'


const MyProfileInputComponent = ({ type, title, placeholder, value, onChange, errorMessage = false, countryCode,customClasses = {}, }) => {
    
    const {
        containerClass = '',
        titleClass = '',
        textareaClass = '',
        inputWrapperClass = '',
        inputClass = '',
    } = customClasses;

    return (
        <>
            {type === 'textarea' ?
                <div className={`${Styles.textarea_content} ${containerClass}`}>
                    <span className={`${Styles.title} ${titleClass}`}>{title}</span>
                    <span className={Styles.title} style={{ fontWeight: 300, fontSize: '1rem' }}> ( Optional* )</span>
                    <textarea
                          className={`${Styles.textarea_box} ${textareaClass}`}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange} />
                </div >
                :
                <div className={`${Styles.content} ${containerClass}`}>
                    <span className={`${Styles.title} ${titleClass}`}>{title}</span>
                    <div className={`${Styles.input_wrapper} ${inputWrapperClass}`}>
                        {countryCode && <span className={Styles.country_code}>{countryCode}</span>}
                        <input
                            className={`${Styles.input_box} ${inputClass}`}
                            type={type}
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange} />
                    </div>
                </div>}
            {errorMessage && <p className={Styles.errorMessage} >{errorMessage}</p>}
        </>
    )
}

export default MyProfileInputComponent
