import React, { useState } from 'react'
import Button from '../../components/formInputs/Button';
import InputBox from '../../components/formInputs/InputBox';
import Content from '../components/WebsiteContent/Content';
import './ViewCart.css'

const ViewCart = () => {
    const [count, setCount] = useState(1)

  return (
    <Content>
        <div style={{marginTop: '8rem'}} className='viewCart--main'>
            <div className='cart--items__container'>
                <div className='cart--items__header'>
                   <h2>View Cart</h2>
                   <h2>2 Items</h2>
                </div>

                <table className='table'>
                <thead>
					<tr>
						<th>Product Details</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Total</th>
					</tr>
				</thead>
                <tbody>
                    <tr>
                        <td className='cart--item--detail'>
                            <img className="cart-product_image" src="./assets/instyler.png" alt="product image" />
                            <div>
                                <span className="item-name">Black Blade Brush</span>
                            </div>
                        </td>
                        <td >
                            <div className="cart--item--quantity">
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count-1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
								<div>{count}</div>
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count+1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
							</div>
                        </td>
                        <td>$45</td>
                        <td>$90</td>
                    </tr>
                    <tr>
                        <td className='cart--item--detail'>
                            <img className="cart-product_image" src="./assets/scissor.jpg" alt="product image" />
                            <div>
                                <span className="item-name">Black Blade Brush</span>
                            </div>
                        </td>
                        <td >
                            <div className="cart--item--quantity">
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count-1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
								<div>{count}</div>
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count+1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
							</div>
                        </td>
                        <td>$45</td>
                        <td>$90</td>
                    </tr>
                    <tr>
                        <td className='cart--item--detail'>
                            <img className="cart-product_image" src="./assets/instyler.png" alt="product image" />
                            <div>
                                <span className="item-name">Black Blade Brush</span>
                            </div>
                        </td>
                        <td >
                            <div className="cart--item--quantity">
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count-1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
								<div>{count}</div>
								<svg className="header-icon-in menu-icon" onClick={()=>setCount(count+1)}>
									<use xlinkHref="assets/sprite.svg#icon-plus" />
								</svg>
							</div>
                        </td>
                        <td>$45</td>
                        <td>$90</td>
                    </tr>
                </tbody>
                </table>
                <div style={{fontWeight: 'bold', marginTop: '2rem'}}>Continue Shopping</div>
            </div>

            <div className='order--summary__container'>
                <div>
                   <div className='cart--items__header'>
                        <h2>Order Summary</h2>
                        <h2>2 Items</h2>
                    </div>
                    <div className='cart--items__price--summary'>
                        <div className='pincode--container'>
                           <InputBox
                        placeholder='Search Pincode'
                        icon='search'
                        //value={searchvalue}
                        //onChange={searchOnChange}
                        style={{ backgroundColor: 'var(--pure-white)', border: '1px solid #d9d9d9' }}
                        />
                        <Button
                            varient='primary'
                            style={{
                                //width: '100%',
                                height: '4rem',
                                justifyContent: 'center',
                                padding: '0.5rem 1rem',
                            }}
                            label="Check Pincode"
                            //icon="arrow_right"
                            //onClick={toggleMenu_website}
                            />
                        </div>

                        <div className= 'cart--items__charges'>
                            <div>Total MRP</div>
                            <div>$90</div>
                        </div>
                        <div className= 'cart--items__charges'>
                            <div>Total Discount</div>
                            <div>-$10</div>
                        </div>
                        <div className= 'cart--items__charges'>
                            <div>Shipping Charges</div>
                            <div>Free</div>
                        </div>
                    </div>
                    <div className= 'cart--items__charges'>
                        <div>Final Ammount</div>
                        <div>$80</div>
                    </div>
                    <Button
                    varient='danger'
                    style={{
                        width: '100%',
                        height: '4rem',
                        justifyContent: 'center',
                        padding: '0.5rem 1rem',
                        marginTop: '1rem'
                    }}
                    label="Proceed to Checkout"
                    icon="arrow_right"
                    //onClick={toggleMenu_website}
                    />
                </div>
                <div style={{marginTop: '1rem'}}>
                   <div className='cart--items__header2'>
                        <h3>Apply Coupon</h3>
                    </div>
                    <div className='pincode--container'>
                            <InputBox
                            placeholder='Enter Coupon'
                            //icon='search'
                            //value={searchvalue}
                            //onChange={searchOnChange}
                            style={{ backgroundColor: 'var(--pure-white)', border: '1px solid #d9d9d9' }}
                            />
                            <Button
                            varient='primary'
                            style={{
                                //width: '100%',
                                height: '4rem',
                                justifyContent: 'center',
                                padding: '0.5rem 1rem',
                            }}
                            label="Apply Coupon"
                            //icon="arrow_right"
                            //onClick={toggleMenu_website}
                            />
                        </div>
                    <div className='cart--items__couponContainer'>
                        <div className= 'cart--items__coupons'>
                            <div>
                                <div style={{fontWeight: 'bold'}}>FREEBEE</div>
                                <p>Get a coupon worth $10</p>
                            </div>

                            <div>Apply</div>
                        </div>
                        <div className= 'cart--items__coupons'>
                            <div>
                                <div style={{fontWeight: 'bold'}}>FIRSTBUY</div>
                                <p>Discount of $10</p>
                            </div>

                            <div>Apply</div>
                        </div>
                        <div className= 'cart--items__coupons'>
                            <div>
                                <div style={{fontWeight: 'bold'}}>FLAT10</div>
                                <p>10% off on first order</p>
                            </div>

                            <div>Apply</div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </Content>
  )
}

export default ViewCart