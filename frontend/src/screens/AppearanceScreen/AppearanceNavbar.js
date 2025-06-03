import React, { useState } from 'react'
import './Appearance.css'
import { HashLink } from 'react-router-hash-link';
import Button from '../../components/formInputs/Button'
import FileUpload from '../../components/formInputs/FileUpload';
import imgFile from "../../components/assets/favicon.png"

const Navbar = ({ click, closeMobileMenu, toggleMenu_website, handleCartClick, cartView, handleClick,data }) => {
    const {logoModal,
         setLogoModal,
         imageSrc,
         setImageSrc,
         imageSrcError,
         setImageSrcError,
         uploadFileData,
         setUploadFileData,
         uploadFileDataError,
         setUploadFileDataError,
         handleChangeImage,
         logo,
         color,
        } = data


         
    return (


        <header className="screen_header">
            <div className='logo_website_screen'>
                {/* <button
                    className="appearance-btn"
                >
                    <svg className="table__button--icon">
                        <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                    </svg>
                </button> */}
                <div className='appearnce-button-container'>
                {/* <button className='appearance-btn' onClick={()=>setLogoModal(!logoModal)}>
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-plus`} />
                  </svg>
                </button> */}
                 <div className='appearance-btn2'>
                 <svg className="table__button--icon2">
                    <use xlinkHref={`/assets/sprite.svg#icon-plus`} />
                  </svg>
                <input type='file' name='uploadFiles' id='uploadFiles'  accept='image/*' onChange={(e) => {
                    handleChangeImage(e);
                }} >
                    
                    </input>
                </div>
                </div>
                <img src={logo} alt="Logo" />
               
            
            </div>
            <nav className="navigation_website">
                <div>
                    <ul className={click ? ' navigation__links nav-options active' : 'navigation__links nav-options'}>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink to="#banner" activeClassName="navigation__active" className="navigation__link">
                                Home
                            </HashLink>
                        </li>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink
                                smooth
                                to="#products"
                                activeClassName="navigation__active"
                                className="navigation__link"
                            >
                                Shop
                            </HashLink>
                        </li>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink
                                smooth
                                to="#services_our"
                                activeClassName="navigation__active"
                                className="navigation__link"
                            >
                                Services
                            </HashLink>
                        </li>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink
                                smooth
                                to="#"
                                activeClassName="navigation__active"
                                className="navigation__link"
                            >
                                Discounts
                            </HashLink>
                        </li>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink
                                smooth
                                to="#hoursOfOperation"
                                activeClassName="navigation__active"
                                className="navigation__link"
                            >
                                Hours of Operation
                            </HashLink>
                        </li>
                        <li onClick={closeMobileMenu} className="appearance-list">
                            {/* <button
                                className="appearance-btn"
                            >
                                <svg className="table__button--icon">
                                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                </svg>
                            </button> */}
                            <HashLink
                                smooth
                                to="#contactus"
                                activeClassName="navigation__active"
                                className="navigation__link"
                            >
                                Contact Us
                            </HashLink>
                        </li>

                        <li className="mobile-menu">
                            <div className="navigation__link header-right-side">
                                <Button
                                    style={{
                                        width: '10rem',
                                        justifyContent: 'center',
                                        padding: '0.5rem 1rem',
                                        backgroundColor:color
                                        
                                    }}
                                    varient="primary"
                                    label="Login"
                                    icon="arrow_right"
                                    onClick={toggleMenu_website}
                                />
                                 
                            </div>
                        </li>
                    </ul>
                </div>
                <ul className="navigation__links navigation__links--contact">
                    <li>
                        <div className="navigation__link header-right-side">
                            <svg className="header-icon-in menu-icon">
                                <use xlinkHref="assets/sprite.svg#icon-search" />
                            </svg>
                        </div>
                    </li>

                    <li onClick={handleCartClick}>
                        <div className="navigation__link header-right-side">
                            <svg className="header-icon-in menu-icon">
                                <use xlinkHref="assets/sprite.svg#icon-cart" />
                            </svg>
                            <div>0</div>
                        </div>

                        <div className='cartContainer'>
                            <div class={cartView ? "shopping-cart-active" : "shopping-cart "}>
                                <div class="shopping-cart-header">
                                    <div class="shopping-cart-total">
                                        <span class="lighter-text">Total: &nbsp;</span>
                                        <span class="main-color-text">$45</span>
                                    </div>
                                </div>

                                <ul class="shopping-cart-items">
                                    <li class="clearfix">
                                        {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/cart-item1.jpg" alt="item1" /> */}
                                        <img className="cart-product_image" src="./assets/instyler.png" alt="product image" />
                                        <span class="item-name">Black Blade Brush</span>
                                        <span class="item-price">$45</span>
                                        <span class="item-quantity">Quantity: 01</span>
                                    </li>
                                </ul>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                    varient='primary'
                                        style={{
                                            width: '10rem',
                                            justifyContent: 'center',
                                            padding: '0.5rem 1rem',
                                            
                                        }}
                                        label="Checkout"
                                        icon="arrow_right"
                                        onClick={toggleMenu_website}
                                    />
                                </div>

                            </div>
                        </div>


                    </li>
                    <li>
                        <div className="navigation__link header-right-side">
                            <Button
                                style={{
                                    width: '10rem',
                                    justifyContent: 'center',
                                    padding: '0.5rem 1rem',
                                    backgroundColor:color
                                }}
                                label="Login"
                                icon="arrow_right"
                                onClick={toggleMenu_website}
                            />
                             
                        </div>
                    </li>
                </ul>
                <div className="mobile-menu" onClick={handleClick}>
                    {click ? (
                        <svg className="header-icon-in menu-icon">
                            <use xlinkHref="assets/sprite.svg#CloseMenu" />
                        </svg>
                    ) : (
                        <svg className="header-icon-in menu-icon">
                            <use xlinkHref="assets/sprite.svg#MenuIcon" />
                        </svg>
                    )}
                </div>
            </nav>
        </header>

    )
}

export default Navbar