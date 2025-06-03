import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js'
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import imgGif from "../../components/assets/check-green.gif";
import moment from "moment"

import CheckoutButton from '../components/Button/CheckoutButton'
import Input from '../components/Inputs/Input'
import './Checkout.css'

import { addOrderAction, deleteAllItemCartAction } from '../../redux/actions/productActions';
import { ADD_ORDER_RESET, CART_RESET, CHECKOUT_RESET } from '../../redux/constants/productConstants';
import Content from '../components/WebsiteContent/Content';
import { zipcodeMask } from '../../utils/validators';
import CheckOutForm from '../components/CheckOutForm';
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import CreateAccountModal from './CreateAccountModal';
import { getWebsiteSettingAction, getWebsiteSettingActionById } from '../../redux/actions/websiteSettingAction';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';
//const stripePromise = loadStripe('pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq');
import { stripePublicKey } from '../../redux/actions/ip';

const stripePromise = loadStripe(stripePublicKey);


const Index = ({ paymentData }) => {
    return (
        <Elements stripe={stripePromise}>
            <Payment paymentData={paymentData} />
        </Elements>
    )
}
export default Index


export const Payment = ({ paymentData }) => {
    const { salonId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const userData = useSelector((state) => state.getUserInfo);
    const elements = useElements();
    const userLogin = useSelector((state) => state.userLogin.userInfo);
    const addOrder = useSelector((state) => state.addOrder);
    const checkout = useSelector((state) => state.checkout.cart);
    const cartProducts = useSelector((state) => state.cartProducts.cart);
    const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
    const [shippingSame, setShippingSame] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [modalChangePasswordState, setModalChangePasswordState] = useState(false);
    const [modalCreateAccount, setModalCreateAccount] = useState(false)
    const [color, setColor] = useState("")

    useEffect(() => {
        if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status) {
            setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
        }
    }, [])

    const [shipping, setShipping] = useState({
        firstName: '',
        lastName: '',
        address: '',
        state: '',
        zipcode: ''
    })
    const [shippingError, setShippingError] = useState({
        firstName: '',
        lastName: '',
        address: '',
        state: '',
        zipcode: ''
    })
    const [billingError, setBillingError] = useState({
        firstName: '',
        lastName: '',
        address: '',
        state: '',
        zipcode: ''
    })

    const [billing, setBilling] = useState({
        firstName: '',
        lastName: '',
        address: '',
        state: '',
        zipcode: ''
    });

    const [totalPrice, setTotalPrice] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [markedPrice, setMarkedPrice] = useState(0)
    const [discountPrice, setDiscountPrice] = useState(0)
    const [step, setStep] = useState(1)

    // useEffect(() => { 
    //     if (salonId === 'undefined') {
    //         history.push(`/404`)
    //     }
    // }, [salonId])



    useEffect(() => {
        if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
            dispatch(getWebsiteSettingActionById(salonId));
        }

        // return () => {
        //     dispatch({ type: GET_WEBSITE_SETTING_RESET })
        // }
    }, [dispatch])


    //to next screen
    const nextStep = () => {
        setStep((count) => count + 1)
    }

    //to previous screen
    const prevStep = () => {
        setStep((count) => count - 1)
    }

    useEffect(() => {
        if (addOrder && addOrder.categories && addOrder.categories.status) {
            toast.success(addOrder.categories.message);
            setTotalItems(0)
            setTotalPrice(0)
            setMarkedPrice(0)
            setDiscountPrice(0)
            localStorage.removeItem('cart');
            localStorage.removeItem('checkout');
            localStorage.removeItem('products');
            dispatch(deleteAllItemCartAction())
        } else if (addOrder && addOrder.categories && !addOrder.categories.status) {
            toast.error(addOrder.categories.message)
        }
    }, [addOrder])

    useEffect(() => {
        if (shippingSame) {
            setShipping({ ...billing })
            setShippingError('')
        }
    }, [shippingSame])

    useEffect(() => {
        let items = 0;
        let price = 0;
        let MRP = 0;
        let disc = 0;

        checkout && checkout.forEach((item) => {
            items += item.quantity;
            price += item.quantity * item.productPrice;
            MRP += item.quantity * item.actualPrice;
            disc = MRP - price
        })
        setTotalItems(items)
        setTotalPrice(price)
        setMarkedPrice(MRP)
        setDiscountPrice(disc)
    }, [checkout, totalPrice, totalItems, setTotalItems, setTotalPrice])

    // const handleShipping = (e) => {
    //     e.preventDefault();
    //     if (shipping.firstName === '' || shipping.firstName && shipping.firstName.trim() === '' || shipping.firstName === null) {
    //         setShippingError({ ...shippingError, firstName: 'Please enter first name' });
    //     } else if (shipping.lastName === '' || shipping.lastName && shipping.lastName.trim() === '' || shipping.lastName === null) {
    //         setShippingError({ ...shippingError, lastName: 'Please enter last name' });
    //     } else if (shipping.address === '' || shipping.address && shipping.address.trim() === '' || shipping.address === null) {
    //         setShippingError({ ...shippingError, address: 'Please enter an address' });
    //     } else if (shipping.state === '' || shipping.state && shipping.state.trim() === '' || shipping.state === null) {
    //         setShippingError({ ...shippingError, state: 'Please enter a state' });
    //     } else if (shipping.zipcode === '' || shipping.zipcode && shipping.zipcode.trim() === '' || shipping.zipcode === null) {

    //         setShippingError({ ...shippingError, zipcode: 'Please enter a zip code' });
    //     }
    //     else {
    //         nextStep()
    //     }
    // }

    // const handleBilling = (e) => {
    //     e.preventDefault();
    //     if (billing.firstName === '' || billing.firstName && billing.firstName.trim() === '' || billing.firstName === null) {
    //         setBillingError({ ...billingError, firstName: 'Please enter first name' });
    //     } else if (billing.lastName === '' || billing.lastName && billing.lastName.trim() === '' || billing.lastName === null) {
    //         setBillingError({ ...billingError, lastName: 'Please enter last name' });
    //     } else if (billing.address === '' || billing.address && billing.address.trim() === '' || billing.address === null) {
    //         setBillingError({ ...billingError, address: 'Please enter an address' });
    //     } else if (billing.state === '' || billing.state && billing.state.trim() === '' || billing.state === null) {
    //         setBillingError({ ...billingError, state: 'Please enter a state' });
    //     } else if (billing.zipcode === '' || billing.zipcode && billing.zipcode.trim() === '' || billing.zipcode === null) {
    //         setBillingError({ ...shippingError, zipcode: 'Please enter a zip code' });
    //     } else {
    //         nextStep()
    //     }
    // }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        debugger
        if (userLogin && userLogin.status === true) {
            if (shipping.firstName === '' || shipping.firstName && shipping.firstName.trim() === '' || shipping.firstName === null) {
                setShippingError({ ...shippingError, firstName: 'Please enter first name' });
            } else if (shipping.lastName === '' || shipping.lastName && shipping.lastName.trim() === '' || shipping.lastName === null) {
                setShippingError({ ...shippingError, lastName: 'Please enter last name' });
            } else if (shipping.address === '' || shipping.address && shipping.address.trim() === '' || shipping.address === null) {
                setShippingError({ ...shippingError, address: 'Please enter an address' });
            } else if (shipping.state === '' || shipping.state && shipping.state.trim() === '' || shipping.state === null) {
                setShippingError({ ...shippingError, state: 'Please enter a state' });
            } else if (shipping.zipcode === '' || shipping.zipcode && shipping.zipcode.trim() === '' || shipping.zipcode === null) {
                setShippingError({ ...shippingError, zipcode: 'Please enter a zip code' });
            }
            // else if (billing.firstName === '' || billing.firstName && billing.firstName.trim() === '' || billing.firstName === null) {
            //     setBillingError({ ...billingError, firstName: 'Please enter first name' });
            // } else if (billing.lastName === '' || billing.lastName && billing.lastName.trim() === '' || billing.lastName === null) {
            //     setBillingError({ ...billingError, lastName: 'Please enter last name' });
            // } else if (billing.address === '' || billing.address && billing.address.trim() === '' || billing.address === null) {
            //     setBillingError({ ...billingError, address: 'Please enter an address' });
            // } else if (billing.state === '' || billing.state && billing.state.trim() === '' || billing.state === null) {
            //     setBillingError({ ...billingError, state: 'Please enter a state' });
            // } else if (billing.zipcode === '' || billing.zipcode && billing.zipcode.trim() === '' || billing.zipcode === null) {
            //     setBillingError({ ...shippingError, zipcode: 'Please enter a zip code' });
            // }
            else {
                // const cardElement = elements.getElement(CardNumberElement);
                // const { error, paymentMethod } = await stripe.createPaymentMethod({
                //     type: 'card',
                //     card: cardElement
                // })
                nextStep()
                handleCheckout()

                // if (!error) {
                //     const { id } = paymentMethod;
                //     handleCheckout(id)
                // } else {
                //     toast.error(error.message)
                // }
            }
        } else {
            toast.error('Please Login First');
            setLoginModal(true)
        }
    }


    const handleCheckout = () => {
        const formdata = {
            totalAmount: totalPrice,
            amount: 10,
            otherAmount: 0,
            items: checkout,
            orderType: 'by cash',
            shippingAddress: {
                firstName: shipping.firstName,
                lastName: shipping.lastName,
                address: shipping.address,
                state: shipping.state,
                zipcode: shipping.zipcode,
            },
            // billingAddress: {
            //     firstName: billing.firstName,
            //     lastName: billing.lastName,
            //     address: billing.address,
            //     state: billing.state,
            //     zipcode: billing.zipcode,
            // },
            // payment: {
            //     transactionId: id,
            //     amount: totalPrice
            // }
        }
        dispatch(addOrderAction(formdata))

    }

    const contShoppingHandler = (e) => {
        e.preventDefault();
        history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/products-list`)
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


    const multiForm = () => {
        switch (step) {
            case 1:
                return (
                    <div className='shpping--address'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p className='shipping--header' >
                                {/* <input
                                    type='checkbox'
                                    id="shippingAdd"
                                    value={shippingSame}
                                    onChange={() => {
                                        setShippingSame(!shippingSame)
                                    }}
                                />
                                <label htmlFor="shippingAdd">Same as Billing Address</label> */}
                            </p>
                            <svg className="edit--icon--checkout">
                                <use xlinkHref="assets/sprite.svg#icon-edit" />
                            </svg>
                        </div>
                        <p></p>
                        <div className='input--container'>
                            <div className='checkout--flex-inputs'>
                                <Input
                                    type='text'
                                    placeholder='Eric'
                                    label='First Name'
                                    style={{ width: '100%' }}
                                    value={shipping.firstName}
                                    onChange={(e) => {
                                        setShipping({ ...shipping, firstName: e.target.value })
                                        setShippingError('')
                                    }}
                                    errorMessage={shippingError.firstName}
                                />
                                <Input
                                    type='text'
                                    placeholder='Vondaniken'
                                    label='Last Name'
                                    style={{ width: '100%' }}
                                    value={shipping.lastName}
                                    onChange={(e) => {
                                        setShipping({ ...shipping, lastName: e.target.value })
                                        setShippingError('')
                                    }}
                                    errorMessage={shippingError.lastName}
                                />
                            </div>
                            <div>
                                <Input
                                    type='text'
                                    placeholder='221 Baker Avenue'
                                    label='Shipping Address'
                                    style={{ width: '100%' }}
                                    value={shipping.address}
                                    onChange={(e) => {
                                        setShipping({ ...shipping, address: e.target.value })
                                        setShippingError('')
                                    }}
                                    errorMessage={shippingError.address}
                                />
                            </div>
                            <div className='checkout--flex-inputs'>
                                <Input
                                    type='text'
                                    placeholder='Colorado'
                                    label='State'
                                    style={{ width: '100%' }}
                                    value={shipping.state}
                                    onChange={(e) => {
                                        setShipping({ ...shipping, state: e.target.value })
                                        setShippingError('')
                                    }}
                                    errorMessage={shippingError.state}
                                />
                                <Input
                                    type='text'
                                    placeholder='80081'
                                    label='ZipCode'
                                    style={{ width: '100%' }}
                                    value={shipping.zipcode}
                                    onChange={(e) => {
                                        setShipping({ ...shipping, zipcode: zipcodeMask(e.target.value) })
                                        setShippingError('')
                                    }}
                                    errorMessage={shippingError.zipcode}
                                />
                            </div>
                            <div className='address__button-container' style={{ display: 'flex', justifyContent: 'space-between' }}>

                                <CheckoutButton
                                    varient='secondary'
                                    label='continue shopping'
                                    style={{
                                        letterSpacing: '0.2rem',
                                        fontWeight: '600',
                                        fontSize: '1.2rem',
                                        backgroundColor: color
                                    }}
                                    onClick={contShoppingHandler}

                                />

                                <CheckoutButton
                                    varient='secondary'
                                    label='Place Order'
                                    style={{
                                        letterSpacing: '0.2rem',
                                        fontWeight: '600',
                                        fontSize: '1.2rem',
                                        marginTop: '1rem',
                                        justifyContent: 'center',
                                        padding: '1rem',
                                        backgroundColor: color
                                    }}
                                    onClick={handlePaymentSubmit}
                                />

                                {/* <CheckoutButton
                                    varient='secondary'
                                    label='Next'
                                    style={{
                                        letterSpacing: '0.2rem',
                                        fontWeight: '600',
                                        fontSize: '1.2rem',
                                    }}
                                    onClick={handleShipping} /> */}
                            </div>
                        </div>
                    </div>
                )
            // case 2:
            //     return (
            //         <div className='shpping--address'>
            //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            //                 <p className='shipping--header' ></p>
            //                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            //                     <svg className="edit--icon--checkout">
            //                         <use xlinkHref="assets/sprite.svg#icon-edit" />
            //                     </svg>
            //                 </div>
            //             </div>
            //             <div className='input--container'>
            //                 <div className='checkout--flex-inputs'>
            //                     <Input
            //                         type='text'
            //                         placeholder='Eric'
            //                         label='First Name'
            //                         style={{ width: '100%' }}
            //                         value={billing.firstName}
            //                         onChange={(e) => {
            //                             setBilling({ ...billing, firstName: e.target.value })
            //                             setBillingError('')
            //                         }}
            //                         errorMessage={billingError.firstName}
            //                     />
            //                     <Input
            //                         type='text'
            //                         placeholder='Vondaniken'
            //                         label='Last Name'
            //                         style={{ width: '100%' }}
            //                         value={billing.lastName}
            //                         onChange={(e) => {
            //                             setBilling({ ...billing, lastName: e.target.value })
            //                             setBillingError('')
            //                         }}
            //                         errorMessage={billingError.lastName}
            //                     />
            //                 </div>
            //                 <div>
            //                     <Input
            //                         type='text'
            //                         placeholder='221 Baker Avenue'
            //                         label='Billing Address'
            //                         style={{ width: '100%' }}
            //                         value={billing.address}
            //                         onChange={(e) => {
            //                             setBilling({ ...billing, address: e.target.value })
            //                             setBillingError('')
            //                         }}
            //                         errorMessage={billingError.address}
            //                     />
            //                 </div>
            //                 <div className='checkout--flex-inputs'>
            //                     <Input
            //                         type='text'
            //                         placeholder='Colorado'
            //                         label='State'
            //                         style={{ width: '100%' }}
            //                         value={billing.state}
            //                         onChange={(e) => {
            //                             setBilling({ ...billing, state: e.target.value })
            //                             setBillingError('')
            //                         }}
            //                         errorMessage={billingError.state}
            //                     />
            //                     <Input
            //                         type='text'
            //                         placeholder='80081'
            //                         label='ZipCode'
            //                         style={{ width: '100%' }}
            //                         value={billing.zipcode}
            //                         onChange={(e) => {
            //                             setBilling({ ...billing, zipcode: zipcodeMask(e.target.value) })
            //                             setBillingError('')
            //                         }}
            //                         errorMessage={billingError.zipcode}
            //                     />
            //                 </div>
            //                 <div className='address__button-container' style={{ display: 'flex', justifyContent: 'space-between' }}> 
            //     <CheckoutButton
            //     varient='secondary'
            //     label='Previous'
            //     style={{
            //         letterSpacing: '0.2rem',
            //         fontWeight: '600',
            //         fontSize: '1.2rem',
            //     }}
            //     onClick={prevStep}
            // />


            //                     {/* <CheckoutButton
            //                         varient='secondary'
            //                         label='Next'
            //                         style={{
            //                             letterSpacing: '0.2rem',
            //                             fontWeight: '600',
            //                             fontSize: '1.2rem',
            //                         }}
            //                         onClick={handleBilling} /> */}
            //                 </div>
            //             </div>
            //         </div>
            //     )
            // case 3:
            //     return (
            //         <div className='shpping--address'>
            //             <div className='card--container'>
            //                 <div className='filter--content'>
            //                     <p className='shipping--header'>Add Payment Card Details</p>
            //                 </div>

            //                 <div className='input--box' style={{ marginTop: '1rem' }}>
            //                     <label className='label--card'>Enter Card Number</label>
            //                     <div className='cardInput'>
            //                         <CardNumberElement
            //                             options={{
            //                                 showIcon: true,
            //                                 style: {
            //                                     base: {
            //                                         iconColor: 'black',
            //                                         //color: '#ff0',
            //                                         fontWeight: '500',
            //                                         fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            //                                         fontSize: '16px',
            //                                         fontSmoothing: 'antialiased',
            //                                         width: '100%',
            //                                         '::placeholder': {
            //                                             color: 'grey',
            //                                         },
            //                                     }
            //                                 },
            //                             }}
            //                         />
            //                     </div>
            //                 </div>

            //                 <div className='checkout--flex-inputs'>
            //                     <div className='input--box' style={{ marginTop: '1rem', width: '100%' }}>
            //                         <label className='label--card'>Card Expiry</label>
            //                         <div className='cardInput'>
            //                             <CardExpiryElement
            //                                 options={{
            //                                     showIcon: true,
            //                                     style: {
            //                                         base: {
            //                                             iconColor: 'black',
            //                                             //color: '#ff0',
            //                                             fontWeight: '500',
            //                                             fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            //                                             fontSize: '16px',
            //                                             fontSmoothing: 'antialiased',
            //                                             width: '100%',
            //                                             '::placeholder': {
            //                                                 color: 'grey',
            //                                             },
            //                                         },
            //                                     },
            //                                 }}
            //                             />
            //                         </div>
            //                     </div>

            //                     <div className='input--box' style={{ marginTop: '1rem', width: '100%' }}>
            //                         <label className='label--card'>Card Security Number</label>
            //                         <div className='cardInput'>
            //                             <CardCvcElement
            //                                 options={{
            //                                     showIcon: true,
            //                                     style: {
            //                                         base: {
            //                                             iconColor: 'black',
            //                                             //color: '#ff0',
            //                                             fontWeight: '500',
            //                                             fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            //                                             fontSize: '16px',
            //                                             fontSmoothing: 'antialiased',
            //                                             width: '100%',
            //                                             '::placeholder': {
            //                                                 color: 'grey',
            //                                             },
            //                                         },
            //                                         invalid: {
            //                                             iconColor: '#FFC7EE',
            //                                             color: '#FFC7EE',
            //                                         },
            //                                     },
            //                                 }}
            //                             />
            //                         </div>
            //                     </div>

            //                 </div>
            //                 <div className='address__button-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
            //                     <CheckoutButton
            //                         varient='secondary'
            //                         label='Previous'
            //                         style={{
            //                             letterSpacing: '0.2rem',
            //                             fontWeight: '600',
            //                             fontSize: '1.2rem',
            //                         }}
            //                         onClick={prevStep}
            //                     />

            //                     <CheckoutButton
            //                         varient='secondary'
            //                         label='Place Order'
            //                         style={{
            //                             letterSpacing: '0.2rem',
            //                             fontWeight: '600',
            //                             fontSize: '1.2rem',
            //                             marginTop: '1rem',
            //                             justifyContent: 'center',
            //                             padding: '1rem'
            //                         }}
            //                         onClick={handlePaymentSubmit}
            //                     />
            //                 </div>
            //             </div>
            //         </div>
            //     )
            default:
                break
        }
    }

    return (
        <Content getPublicWebsite={getPublicWebsite}>
            <SubHeadingContent
                title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
                subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
                style={{ backgroundColor: color }}
            />
            {addOrder && addOrder.categories && addOrder.categories.status === true ?
                <div className='main--containers' style={{ marginTop: '5rem', alignItems: 'center', justifyContent: 'center' }}>
                    <div className='all--address--container'>
                        <div className='checkOut-container'>
                            <div className='shpping--address' style={{ marginTop: "0rem" }}>
                                <div className='successfull-payment'>
                                    <img className='thankyou-img' src={imgGif} />
                                    <h1>Thank You!</h1>
                                    <h2>Order Id : {addOrder.categories.orderDetails.orderId}</h2>
                                    <p className="item-price" style={{ textAlign: 'center' }}>{addOrder.categories.message}</p>
                                    {/* <div className='shipping_detail'>
                                        <div className='ship1'>
                                            <span className='shipping--header'>Summery</span>
                                            <div className='sub_span'>
                                                <span className='item-name_new1'>Order Date:</span>
                                                <p className='item-name_new1'>{moment().format("MMM Do YY")}</p>
                                            </div>
                                            <div className='sub_span'>
                                                <span className='item-name_new1'>Order Total:</span>
                                                <p className='item-name_new1'>${totalPrice ? totalPrice : "NA"}</p>
                                            </div>
                                        </div>
                                        <div className='ship1'>
                                             <span className='shipping--header'>Shipping Address</span>
                                            <div className='sub_span'>
                                                <span className='item-name_new1'>{billing.address ? billing.address : "NA"}</span>

                                            </div>
                                            <div className='sub_span'>
                                                <span className='item-name_new1'>{billing.state ? billing.state : "NA"}</span>

                                            </div>
                                            <div className='sub_span'>
                                                <span className='item-name_new1'>{billing.zipcode ? billing.zipcode : "NA"}</span>
                                            </div> 
                                        </div>
                                    </div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    {cartProducts && cartProducts && cartProducts.length > 0 &&
                        <div className='order--summary--container'>
                            <p className='shipping--header'>Order Summary</p>
                            <div style={{ height: '40rem', overflow: 'auto' }}>
                                {cartProducts && cartProducts.map((item, i) => (
                                    <div className="cart__product-listContainer" key={i + 1}>
                                        <div className='cart--productDetail__container' style={{ gap: '0.2rem', padding: '0' }}>
                                            <div className='cart__product--nameContainer'>
                                                <p className="item-name_new">  {i + 1}. {item.productName}</p>
                                            </div>
                                            <div className='cart__product--countContainer'>
                                                <span className="item-price">{item.quantity}  &#215; ${item.productPrice}</span>
                                                <span className="item-price">{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {item.quantity * item.productPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='summary-items'>
                                <div className='summary--content'>
                                    <p>Items ({totalItems})</p>
                                    <p> {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {markedPrice}</p>
                                </div>
                                <div className='summary--content'>
                                    <p>Discount</p>
                                    <p>- {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {discountPrice}</p>
                                </div>
                                <div className='summary--content'>
                                    <p>Shipping</p>
                                    <p>Free</p>
                                </div>
                            </div>
                            <div className='total--price'>
                                <p>Total</p>
                                <p> {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {totalPrice}</p>
                            </div>
                            <div className='button--checkout'>

                            </div>
                        </div>}
                </div>
                :
                <div className='main--containers' style={{ marginTop: '10rem', }}>
                    <div className='all--address--container'>
                        <div className='checkOut-container'>
                            <CheckOutForm step={step} />
                            {multiForm()}
                        </div>
                    </div>
                    <div className='order--summary--container' style={{ minHeight: '60rem' }}>
                        <p className='shipping--header'>Order Summary</p>
                        {cartProducts &&
                            cartProducts &&
                            cartProducts.length > 0 ?
                            <>
                                <div style={{ height: '40rem', overflow: 'auto' }}>
                                    {cartProducts && cartProducts.map((item, i) => (
                                        <div className="cart__product-listContainer" key={i + 1}>
                                            <div className='cart--productDetail__container' style={{ gap: '0.2rem', padding: '0' }}>
                                                <div className='cart__product--nameContainer'>
                                                    {/* <img className="cart-product_image" src={item.productImageURL} alt={item.productImageKey} /> */}
                                                    <p className="item-name_new">  {i + 1}. {item.productName}</p>
                                                </div>
                                                <div className='cart__product--countContainer'>
                                                    <span className="item-price">{item.quantity}  &#215; ${item.productPrice}</span>
                                                    <span className="item-price">{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}  {item.quantity * item.productPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='summary-items'>
                                    <div className='summary--content'>
                                        <p>Items ({totalItems})</p>
                                        <p>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {markedPrice.toFixed(2)}</p>
                                    </div>
                                    <div className='summary--content'>
                                        <p>Discount</p>
                                        <p>-{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {discountPrice.toFixed(2)}</p>
                                    </div>
                                    <div className='summary--content'>
                                        <p>Shipping</p>
                                        <p>Free</p>
                                    </div>
                                </div>
                                <div className='total--price'>
                                    <p>Total</p>
                                    <p>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {totalPrice.toFixed(2)}</p>
                                </div>
                            </> :
                            <div className='shipping--header' style={{ marginTop: '5rem', flexDirection: 'column' }}>
                                <p>We could not find any product.</p>
                                <CheckoutButton
                                    varient='secondary'
                                    label='continue shopping'
                                    style={{
                                        letterSpacing: '0.2rem',
                                        fontWeight: '600',
                                        fontSize: '1.2rem',
                                    }}
                                    onClick={contShoppingHandler}
                                />
                            </div>
                        }
                        <div className='button--checkout'>

                        </div>
                    </div>
                </div>
            }

            <LoginModal data={{ handleLoginModalClose, loginModal, setLoginModal, setModalChangePasswordState, setModalCreateAccount }} />
            <ForgotPasswordModal data={{ modalChangePasswordState, onChangePwdModalClose, setLoginModal }} />
            <CreateAccountModal data={{ modalCreateAccount, handleCreateAccountModalClose, handleLoginModalClose }} />
        </Content>
    )
}

