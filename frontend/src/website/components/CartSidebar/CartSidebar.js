import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkOutAction, deleteItemCartAction } from '../../../redux/actions/productActions';
import './CartSidebar.css'
import CheckoutButton from '../Button/CheckoutButton';
import QuantityInputSidebar from '../QuantityInput/QuantityInputSidebar';
import '../CartDropdown/CartDropdown.css'
import LoginModal from '../../Checkout/LoginModal';
import ForgotPasswordModal from '../../Checkout/ForgotPasswordModal';
import CreateAccountModal from '../../Checkout/CreateAccountModal';
import { toast } from 'react-toastify';

const CartSidebar = ({ data }) => {

    const { toggle_viewCart, cartProducts } = data;
    const dispatch = useDispatch();
    const history = useHistory();
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [markedPrice, setMarkedPrice] = useState(0)
    const [discountPrice, setDiscountPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
    const userLogin = useSelector((state) => state.userLogin.userInfo);
    const userData = useSelector((state) => state.getUserInfo);
    const [loginModal, setLoginModal] = useState(false)
    const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
    const [modalCreateAccount, setModalCreateAccount] = useState(false)

    useEffect(() => {
        let items = 0;
        let price = 0;
        let MRP = 0;
        let disc = 0;

        cartProducts && cartProducts.forEach((item) => {
            items += item.quantity;
            price += item.quantity * item.productPrice;
            MRP += item.quantity * item.actualPrice;
            disc = MRP - price
        })
        setTotalItems(items)
        setTotalPrice(price)
        setMarkedPrice(MRP)
        setDiscountPrice(disc)
    }, [cartProducts, totalPrice, totalItems, setTotalItems, setTotalPrice])

    const handleCheckout = () => {
        if (userLogin && userLogin.status === true) {
            dispatch(checkOutAction(cartProducts))
            localStorage.setItem('checkout', JSON.stringify(cartProducts))
            history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/checkout`)
        } else {
            toast.error('Please Login First');
            setLoginModal(true)
        }
    }


    const handleLoginModalClose = () => {
        setLoginModal(false)
    }

    const handleCreateAccountModalClose = () => {
        setModalCreateAccount(false)
    }

    const onChangePwdModalClose = () => {
        setModalChangePasswordState(false);
    };


    return (
        <Fragment>
            <main className='navigationbar active' style={{ zIndex: 500 }}>
                <div className='cart--main__container'>
                    <div className='cart--header'>
                        <h1 style={{
                            display: 'flex',
                            gap: '2rem',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: '500'
                        }}>
                            <svg className='form_input__icon'>
                                <use xlinkHref={`/assets/sprite.svg#icon-checkout`} />
                            </svg> {totalItems > 0 ? totalItems : 0} Item{totalItems > 1 ? 's' : ''}</h1>
                        <div className="navigation__link header-right-side" onClick={toggle_viewCart}>
                            <svg className="modal__heading--icon menu-icon3" style={{ cursor: 'pointer' }} >
                                <use xlinkHref="assets/sprite.svg#icon-cancel" />
                            </svg>
                        </div>
                    </div>
                    <div style={{ height: '70rem', overflow: 'auto' }}>
                        {cartProducts && cartProducts.map((item, i) => (
                            <div className="cart__product-listContainer" key={i + 1}>
                                <img className="cart-product_image" src={item.productImageURL} alt={item.productImageKey} />
                                <div className='cart--productDetail__container'>
                                    <div className='cart__product--nameContainer'>
                                        <p className="item-name_new">{item.productName}</p>
                                        <div className="navigation__link header-right-side" onClick={() => dispatch(deleteItemCartAction(item._id))}>
                                            <svg className="header-icon-in menu-icon3" style={{ fill: 'var(--red)', cursor: 'pointer' }}>
                                                <use xlinkHref="assets/sprite.svg#icon-delete" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='cart__product--countContainer'>
                                        <QuantityInputSidebar
                                            type="text"
                                            errorMessage=""
                                            label="Quantity"
                                            style={{ marginTop: '0', padding: '0' }}
                                            disabled={true}
                                            min={0}
                                            id={item._id}
                                            quantity={item.quantity}
                                            stock={item.stock > 0 ? item.stock : 0}
                                        />
                                        <span className="item-price">{item.quantity}  &#215; {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {item.productPrice}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='cart--footer'>
                        <div className='cart--total'>
                            <div>
                                Subtotal :
                            </div>
                            <div>
                            {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}  { totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <CheckoutButton
                            disabled={totalItems === 0}
                            varient='secondary'
                            style={{
                                width: '100%',
                                height: '4rem',
                                justifyContent: 'center',
                                padding: '0.5rem 1rem',
                                marginTop: '1rem',
                                borderRadius: '0.5rem',
                                fontSize: '1.3rem',
                                padding: '1rem 3rem',
                                color: 'var(--dark-grey)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: '2px solid rgb(255 76 20 / 48%)',
                                letterSpacing: '0.05em',
                                fontWeight: '600',
                                backgroundImage: 'linear-gradient(195deg, #ffb100c9, rgb(255 82 0 / 72%))'
                            }}
                            label="Proceed to Checkout"
                            icon="arrow_right"
                            onClick={handleCheckout}
                        />
                    </div>
                </div>

                <LoginModal data={{ handleLoginModalClose, loginModal, setLoginModal, setModalChangePasswordState, setModalCreateAccount }} />
                <ForgotPasswordModal data={{ modalChangePasswordState, onChangePwdModalClose, setLoginModal }} />
                <CreateAccountModal data={{ modalCreateAccount, handleCreateAccountModalClose, handleLoginModalClose }} />
            </main>

        </Fragment>
    );
};

export default CartSidebar;
