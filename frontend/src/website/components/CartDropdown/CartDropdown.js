import React, { useState } from 'react'
import Button from '../../../components/formInputs/Button';
import './CartDropdown.css'

const CartDropdown = ({data}) => {
    const {cartView, setCartView, toggleMenu_website, toggle_viewCart} = data;
	const [count, setCount] = useState(1)

  return (
    <div className='cartContainer'>
		<div className={cartView? "shopping-cart-active" : "shopping-cart " }>
			<div className='cart--header'>
				<h3>Your Cart</h3>
				<div className="navigation__link header-right-side" onClick={()=> setCartView(false)}>
					<svg className="modal__heading--icon menu-icon">
						<use xlinkHref="assets/sprite.svg#icon-cancel" />
					</svg>
				</div>
			</div>

			<ul class="shopping-cart-items">
    			<li className="cart__product-listContainer">

					<img className="cart-product_image" src="./assets/instyler.png" alt="product image" />

					<div className='cart--productDetail__container'>
						<div className='cart__product--nameContainer'>
							<span className="item-name">Black Blade Brush</span>
							<div className="navigation__link header-right-side">
								<svg className="header-icon-in menu-icon">
									<use xlinkHref="assets/sprite.svg#icon-delete" />
								</svg>
							</div>
						</div>
						<div className='cart__product--countContainer'>
							<div className="navigation__link header-right-side">
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count-1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
								<div>{count}</div>
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count+1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
							</div>
							<span className="item-price">$45</span>
						</div>
					</div>
				</li>
			</ul>

            <div className="shopping-cart-header">
				<div className="shopping-cart-total">
					<span className="item-price__total">Total: &nbsp;</span>
					<span className="item-price__total">$45</span>
				</div>
			</div>

			<div style={{display:'flex', justifyContent: 'center', gap: '2rem'}}>
				<Button
				varient='danger'
				style={{
					// width: '10rem',
					justifyContent: 'center',
					padding: '0.5rem 1rem'
				}}
				label="View Cart"
				icon="arrow_right"
				onClick={toggle_viewCart}
				/>
				<Button
				style={{
					// width: '10rem',
					justifyContent: 'center',
					padding: '0.5rem 1rem'
				}}
				label="Checkout"
				icon="arrow_right"
				onClick={toggleMenu_website}
				/>
			</div>
		</div>
    </div>
  )
}

export default CartDropdown