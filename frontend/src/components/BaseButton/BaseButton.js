import React from 'react'
import Styles from './BaseButton.module.css'

const BaseButton = ({ type, style, title, className, disabled, contentEditable, onClick, value }) => {
    return (
        <button
            className={className ? className : Styles.baseButton}
            style={style ? style : null}
            type={type}
            disabled={disabled}
            contentEditable={contentEditable}
            onClick={onClick}
            value={value}
        >
            {title}
        </button>
    )
}

export default BaseButton
