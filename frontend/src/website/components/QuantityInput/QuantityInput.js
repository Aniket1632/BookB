import moment from 'moment';
import React, { useState } from 'react'; 
import TextBox from './QuantityInput.module.css';

const QuantityInput = ({ type, placeholder, onChange, errorMessage, label, style, disabled, min, required = false, quantity, setQuantity, stock }) => {

	const minusQty = () => { 
		if (quantity > 1) {
			setQuantity(quantity - 1)
		}
	}


	const plusQty = () => {
		if (quantity <= stock) {
			setQuantity(quantity + 1)
		}
	}


	return (
		<div className={TextBox.form_input}>
			<div style={style}>
				<div className="qty-box">
					<div className="input-group">
						<span className="input-group-prepend">
							<button type="button" className="btn quantity-left-minus"
								onClick={minusQty}
								data-type="minus" data-field="">
								<svg className={TextBox.form_input__icon}>
									<use xlinkHref={`/assets/sprite.svg#icon-minus`} />
								</svg>
							</button>
						</span>
						<input
							type={type}
							name={label}
							min={min}
							className="form-control input-number"
							value={quantity}
							disabled={disabled}
							required={required}
							onChange={onChange}
						/>
						<span className="input-group-prepend">
							<button type="button" className="btn quantity-right-plus"
								onClick={plusQty}
								data-type="plus" data-field="">
								<svg className={TextBox.form_input__icon}>
									<use xlinkHref={`/assets/sprite.svg#icon-plus`} />
								</svg>
							</button>
						</span>
					</div>
				</div>
			</div>
			{errorMessage && <p className={TextBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default QuantityInput;
