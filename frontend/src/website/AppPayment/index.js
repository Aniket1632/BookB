import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addAppOrderAction, addOrderAction, addPaymentAction, getOrderByIdAction } from '../../redux/actions/productActions';
import { getWebsiteSettingAction } from '../../redux/actions/websiteSettingAction';
import CheckoutButton from '../components/Button/CheckoutButton';
import Content from '../components/WebsiteContent/Content';
import imgGif from "../../components/assets/check-green.gif";
//const stripePromise = loadStripe('pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq');
import { stripePublicKey } from '../../redux/actions/ip';

const stripePromise = loadStripe(stripePublicKey);

const AppPayment = ({ paymentData }) => {
  const { transactionId } = useParams();
  const dispatch = useDispatch();
  const getOrderById = useSelector((state) => state.getOrderById);
  const addAPayment = useSelector((state) => state.addAPayment);
 
  useEffect(() => {
    if (addAPayment && addAPayment.categories && addAPayment.categories.status) {
      window.ReactNativeWebView.postMessage(JSON.stringify(addAPayment.categories))
    }
  }, [addAPayment])

  let formData = {}

  useEffect(() => {
    dispatch(getOrderByIdAction(transactionId))
  }, [addAPayment, transactionId])

  const handleCheckout = () => {
    dispatch(addPaymentAction(formData))
  }
  return (
    <Elements stripe={stripePromise}>
      <Payment paymentData={paymentData} getOrderById={getOrderById} formData={formData} handleCheckout={handleCheckout} transactionId={transactionId} addAPayment={addAPayment} />
    </Elements>
  )
}
export default AppPayment

const Payment = ({ getOrderById, formData, handleCheckout, transactionId, addAPayment }) => { 

  const { salonName } = useParams();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements(); 
  const getPublicWebsite = useSelector((state) => state.getPublicWebsite);




  useEffect(() => {
    if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
      dispatch(getWebsiteSettingAction(salonName));
    }
  }, [dispatch])

  const handlePaymentSubmit = async (e) => {
    const cardElement = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })

    if (!error) {
      const { id } = paymentMethod;
      // handleCheckout(id)
      // const formdata = {
      //   orderId:'#10073',
      //   transactionId: id,
      // }

      formData.orderID = transactionId;
      formData.transactionId = id;
      if (formData.transactionId !== "") {
        handleCheckout()
      }
    }
  }

  return (
    <Content getPublicWebsite={getPublicWebsite}>

      <div className='main--containers' style={{ marginTop: '5rem', alignItems: 'center', justifyContent: 'center' }}>
        <div className='all--address--container'>
          <div className='checkOut-container'>
            <div className='shpping--address'>
              {addAPayment && addAPayment.categories && addAPayment.categories.status ?
                <div className='card--container'>
                  <div className='shpping--address' style={{ marginTop: "0rem" }}>
                    <div className='successfull-payment'>
                      <img className='thankyou-img' src={imgGif} />
                      <h1>Thank You!</h1>
                      <h2>{addAPayment && addAPayment.categories && addAPayment.categories.message}</h2>
                    </div>
                  </div>
                </div>
                :
                <div className='card--container'>
                  <div className='filter--content'>
                    <p className='shipping--header'>Add Payment Card Details</p>
                  </div>


                  <div className='input--box' style={{ marginTop: '1rem' }}>
                    <label className='label--card'>Enter Card Number</label>
                    <div className='cardInput'>
                      <CardNumberElement
                        options={{
                          showIcon: true,
                          style: {
                            base: {
                              iconColor: 'black',
                              //color: '#ff0',
                              fontWeight: '500',
                              fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                              fontSize: '16px',
                              fontSmoothing: 'antialiased',
                              width: '100%',
                              '::placeholder': {
                                color: 'grey',
                              },
                            }
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className='checkout--flex-inputs'>
                    <div className='input--box' style={{ marginTop: '1rem', width: '100%' }}>
                      <label className='label--card'>Card Expiry</label>
                      <div className='cardInput'>
                        <CardExpiryElement
                          options={{
                            showIcon: true,
                            style: {
                              base: {
                                iconColor: 'black',
                                //color: '#ff0',
                                fontWeight: '500',
                                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                fontSize: '16px',
                                fontSmoothing: 'antialiased',
                                width: '100%',
                                '::placeholder': {
                                  color: 'grey',
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className='input--box' style={{ marginTop: '1rem', width: '100%' }}>
                      <label className='label--card'>Card Security Number</label>
                      <div className='cardInput'>
                        <CardCvcElement
                          options={{
                            showIcon: true,
                            style: {
                              base: {
                                iconColor: 'black',
                                //color: '#ff0',
                                fontWeight: '500',
                                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                fontSize: '16px',
                                fontSmoothing: 'antialiased',
                                width: '100%',
                                '::placeholder': {
                                  color: 'grey',
                                },
                              },
                              invalid: {
                                iconColor: '#FFC7EE',
                                color: '#FFC7EE',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='address__button-container' style={{ display: 'flex', justifyContent: 'center' }}>
                    <CheckoutButton
                      varient='secondary'
                      label='Place Order'
                      style={{
                        letterSpacing: '0.2rem',
                        fontWeight: '600',
                        fontSize: '1.2rem',
                        marginTop: '1rem',
                        justifyContent: 'center',
                        padding: '1rem'
                      }}
                      onClick={handlePaymentSubmit}
                    />
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}
