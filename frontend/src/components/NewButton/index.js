import React from 'react';
import ButtonStyles from './Button.module.css';

const Button = ({ varient = 'primary', label, icon, onClick, style, disabled, contentEditable }) => {
	return (
		<button
			className={ButtonStyles.button__delete}
			style={style}
			disabled={disabled}
			contentEditable={contentEditable}
			onClick={onClick}>
			{label}
			<svg className={ButtonStyles.button__icon}>
				<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
			</svg>
		</button>
	);
};

export default Button;
