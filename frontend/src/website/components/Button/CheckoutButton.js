import React from 'react';
import ButtonStyles from './Button.module.css';

const CheckoutButton = ({ varient = 'primary', label, icon, onClick, style, disabled }) => {
	return (
		<button
			className={varient === 'primary' ? ButtonStyles.button : varient === 'secondary' && ButtonStyles.button__delete}
			style={style}
			disabled={disabled}
			onClick={onClick}>
			{label}
			{icon ?
				<svg className={ButtonStyles.button__icon}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg>
				: null
			}
		</button>
	);
};

export default CheckoutButton;
