import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminCouponsAction, verifyCouponAction } from '../../redux/actions/couponActions';
import { toast } from 'react-toastify';
import { VERIFY_COUPON_RESET } from '../../redux/constants/couponConstants';
import moment from "moment";
import { completeOnboardAction } from '../../redux/actions/onboardingActions';
import { CREATE_NEW_ONBOARD_USER_RESET } from '../../redux/constants/onboardingConstants';
import Spinner from '../../components/Spinner/Spinner';
import InputCoupon from '../../components/formInputs/InputBox/InputCoupon';
//const stripePromise = loadStripe('pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq'); 
import { stripePublicKey } from '../../redux/actions/ip';

const stripePromise = loadStripe(stripePublicKey);

// const useOptions = paymentRequest => {
//   const options = useMemo(
//     () => ({
//       paymentRequest,
//       style: {
//         // paymentRequestButton: {
//         //   theme: "dark",
//         //   height: "48px",
//         //   type: "donate"
//         // }
//       }
//     }),
//     [paymentRequest]
//   );

//   return options;
// };

// const usePaymentRequest = ({ options, onPaymentMethod }) => {
//   const stripe = useStripe();
//   const [paymentRequest, setPaymentRequest] = useState(null);
//   const [canMakePayment, setCanMakePayment] = useState(false);

//   useEffect(() => {
//     if (stripe && paymentRequest === null) {
//       const pr = stripe.paymentRequest(options);
//       setPaymentRequest(pr);
//     }
//   }, [stripe, options, paymentRequest]);

//   useEffect(() => {
//     let subscribed = true;
//     if (paymentRequest) {
//       paymentRequest.canMakePayment().then(res => {
//         if (res && subscribed) {
//           setCanMakePayment(true);
//         }
//       });
//     }

//     return () => {
//       subscribed = false;
//     };
//   }, [paymentRequest]);

//   useEffect(() => {
//     if (paymentRequest) {
//       paymentRequest.on("paymentmethod", onPaymentMethod);
//     }
//     return () => {
//       if (paymentRequest) {
//         paymentRequest.off("paymentmethod", onPaymentMethod);
//       }
//     };
//   }, [paymentRequest, onPaymentMethod]);

//   return canMakePayment ? paymentRequest : null;
// };


// const CheckOutGpay = () => {
//   const [paymentRequest, setPaymentRequest] = useState(false);
//   const stripe = useStripe();

//   useEffect(() => {
//     const paymentRequest = stripe.paymentRequest({
//       country: "US",
//       currency: "usd",
//       total: {
//         label: "Demo total",
//         amount: 1000
//       }
//     });
//     paymentRequest.on("token", ({ complete, token, ...data }) => {
//       console.log("Received Stripe token: ", token);
//       console.log("Received customer information: ", data);
//       complete("success");
//     });
//     paymentRequest.canMakePayment().then(canMakePayment => {
//       if (canMakePayment) {
//         setPaymentRequest(paymentRequest);
//       }
//     });
//   }, [stripe]);

//   if (!paymentRequest) {
//     return null;
//   }

//   return (
//     <div className="DemoWrapper">
//       <h2>PaymentRequestButtonElement</h2>
//       <PaymentRequestButtonElement
//         className="PaymentRequestButton"
//         onBlur={handleBlur}
//         onClick={handleClick}
//         onFocus={handleFocus}
//         onReady={handleReady}
//         options={{
//           paymentRequest,
//           style: {
//             paymentRequestButton: {
//               theme: "dark",
//               height: "64px",
//               type: "donate"
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

const CheckOut = ({ subscriptionData, paymentData, handleSubmit, prevStep, couponData, clientData, navigateLogin }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const onBoardRegister = useSelector((state) => state.onBoardRegister);

  useEffect(
    () => {
      if (onBoardRegister && onBoardRegister.data && onBoardRegister.data.status) {
        dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
        confirmCardPayment(onBoardRegister.data.data);
      } else if (onBoardRegister && onBoardRegister.data && !onBoardRegister.data.status) {
        dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
        toast.error(onBoardRegister.data.message);
      }
    },
    [onBoardRegister, dispatch]
  );


  const confirmCardPayment = async (formData) => {
    const { clientId, client_secret, status } = formData;
    if (status === 'requires_action') {
      stripe.confirmCardPayment(client_secret).then(async function (result) {
        if (result.error) {
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          toast.error(result.error);
        } else {
          await dispatch(completeOnboardAction({ clientId, plan: subscriptionData.plans[0].id }));
          toast.success('Your payment is successful');
          // if (Number(subscriptionData.metadata.users) === 1) {
          //   setStep(5);
          // } else {
          //   setStep(4);
          // }
        }
      });
    } else if (status === 'fail') {
      toast.error(formData.msg);
    } else {
      await dispatch(completeOnboardAction({ clientId, plan: subscriptionData.plans[0].id }));
      toast.success('Your payment is successful');
      // if (Number(subscriptionData.metadata.users) === 1) {
      //   setStep(5);
      // } else {
      //   setStep(4);
      // }
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: clientData && clientData.salon && clientData.salon.name,
        email: clientData && clientData.salon && clientData.salon.email,
      }
    })

    if (!error) {
      const { id } = paymentMethod;
      paymentData.id = id;
      paymentData.promotion_code = couponData.promotionCode[0].id;

      if (paymentData.id) {
        handleSubmit();
      }
    }
  }


  return (
    <>
      {/* <CardElement /> */}
      <div className='onboard_card_input'>
        <CardNumberElement
          options={{
            showIcon: true,
            style: {
              base: {
                iconColor: '#000000',
                color: '#000000',
                fontWeight: '500',
                fontFamily:
                  "Poppins, sans-serif",
                fontSize: '14px',
                fontSmoothing: 'antialiased',
                padding: '25px',
                ':-webkit-autofill': {
                  color: '#aa9999',
                },
                '::placeholder': {
                  color: '#aa9999',
                  fontWeight: '500',
                },
              },
            },
          }}
        />
      </div>
      <div className='form_section'>
        <div className='onboard_card_input'>
          <CardExpiryElement
            options={{
              showIcon: true,
              style: {
                base: {
                  iconColor: '#000000',
                  color: '#000000',
                  fontWeight: '500',
                  textAlign: 'center',
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: '14px',
                  fontSmoothing: 'antialiased',
                  padding: '25px',
                  ':-webkit-autofill': {
                    color: '#aa9999',
                  },
                  '::placeholder': {
                    color: '#aa9999',
                    fontWeight: '500',
                  },
                },
              },
            }}
          />
        </div>
        <div className='onboard_card_input'>
          <CardCvcElement
            options={{
              showIcon: true,
              style: {
                base: {
                  iconColor: '#000000',
                  color: '#000000',
                  fontWeight: '500',
                  textAlign: 'center',
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: '14px',
                  fontSmoothing: 'antialiased',
                  padding: '25px',
                  ':-webkit-autofill': {
                    color: '#aa9999',
                  },
                  '::placeholder': {
                    color: '#aa9999',
                    fontWeight: '500',
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

      {onBoardRegister && onBoardRegister.loading ?
        <div className='onboard_button'>
          <button disabled>Processing...</button>
        </div>
        :
        <div className='onboard_button'>
          <button onClick={prevStep} className='prev'>Previous</button>
          <button disabled={!stripe} onClick={handlePaymentSubmit}>Pay</button>
        </div>}
    </>
  )

}

const Payment = ({ prevStep, handleSubmit, paymentData, subscriptionData, navigateLogin, clientData, couponData, setCouponData }) => {
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [active, setActive] = useState(false);
  const verfifyCoupon = useSelector((state) => state.verfifyCoupon);
  const getAdminCoupon = useSelector((state) => state.getAdminCoupon);

  useEffect(() => {
    dispatch(getAdminCouponsAction())
  }, [active])

  useEffect(() => {
    if (verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status) {
      toast.success(verfifyCoupon.data.message);
      setCouponError("");
      setCouponData(verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.data);
    } else {
      toast.error(verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.message);
      setCouponError(verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.message);
    }
  }, [verfifyCoupon])


  const handleClick = () => {
    if (coupon === "") {
      setCouponError("Please enter coupon");
      setCouponData("");
    } else {
      dispatch(verifyCouponAction(coupon));
    }
  }

  const handleClickCoupon = (d) => {
    dispatch(verifyCouponAction(d && d.code));
    setActive(false);
    setCoupon(d && d.code)
  }


  return (
    <Elements stripe={stripePromise}>
      <div className='coupon-container'>
        <div className='payment-coupon-container'>
          {/* <CheckOutGpay /> */}
          {verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status ?
            <div style={{ display: 'flex', gap: '1rem', cursor: 'pointer', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className='payment_btn_list'>
                  <h1>
                    {subscriptionData.name} - &nbsp;&nbsp;
                    <span style={{ fontWeight: '600', textDecoration: Object.keys(couponData).length > 0 ? 'line-through' : 'none' }}>
                      $ {subscriptionData.plans[0].amount / 100} per {subscriptionData.plans[0].interval}
                    </span>&nbsp;&nbsp;
                    <span>
                      {Object.keys(couponData).length > 0 &&
                        couponData &&
                        couponData.promotionCode &&
                        couponData.promotionCode.length > 0 &&
                        couponData.promotionCode[0].coupon && (
                          <Fragment>
                            {couponData.promotionCode[0].coupon.amount_off ? (
                              ' $' +
                              Number(subscriptionData.plans[0].amount / 100 - couponData.promotionCode[0].coupon.amount_off) +
                              ' per ' +
                              subscriptionData.plans[0].interval
                            ) : (
                              ' $' +
                              Number(
                                subscriptionData.plans[0].amount / 100 -
                                couponData.promotionCode[0].coupon.percent_off *
                                (subscriptionData.plans[0].amount / 100) /
                                100
                              ) +
                              ' per ' +
                              subscriptionData.plans[0].interval
                            )}
                          </Fragment>
                        )}
                    </span>
                  </h1>
                </div>
                {couponData &&
                  couponData.promotionCode &&
                  couponData.promotionCode.length > 0 &&
                  <h1 style={{ textTransform: 'uppercase', margin: '0.8rem', color: 'var(--primary-color)' }}>{couponData.promotionCode[0].code}</h1>}
                <p style={{ color: '#000', fontSize: '1.2rem', margin: '0.5rem' }} > Coupon Applied Successfully </p>
              </div>
              <button
                style={{ height: '3rem' }}
                className='table__button table__button--delete'
                onClick={() => { dispatch({ type: VERIFY_COUPON_RESET }); setCouponData("") }}>
                <svg className='table__button--icon-red'>
                  <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
                </svg>
                <span>Remove coupon</span>
              </button>
            </div>
            :
            <div className='onboard_input'>
              <InputCoupon
                type='text'
                placeholder='Enter Coupon Code'
                value={coupon}
                onFocus={(e) => {
                  setActive(!active)
                }}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponError("")
                }}
                errorMessage={couponError}
                label='Apply Coupon'
                icon='ticket'
                handler={handleClick}
              />
              <div style={{ height: '10rem', overflow: 'auto', border: '1px solid #0000003d' }}>
                {
                  getAdminCoupon &&
                    getAdminCoupon.data &&
                    getAdminCoupon.data.data ?
                    getAdminCoupon.data.data.map((item, index) => {
                      return (<div className='counpon-detail' key={index}>
                        <div className='counpon-name'>
                          <h2 style={{ textTransform: 'uppercase' }}>{item.code}</h2>
                        </div>
                        <div className='onboard_button' style={{ marginTop: '0' }}>
                          <button onClick={() => handleClickCoupon(item)}>Apply</button>
                        </div>
                      </div>)
                    }) :
                    <div className='counpon-detail'>
                      <Spinner />
                    </div>
                }
              </div>
            </div>}
        </div>
        {/* <div className={active ? 'couponlist-container-active' : 'couponlist-container'}>
          {
            getAdminCoupon &&
              getAdminCoupon.data &&
              getAdminCoupon.data.data ?
              getAdminCoupon.data.data.map((item, index) => {
                return (<div className='counpon-detail' key={index}>
                  <div className='counpon-name'>
                    <h2 style={{ textTransform: 'uppercase' }}>{item.code}</h2>
                  </div>
                  <div className='onboard_button' style={{ marginTop: '0' }}>
                    <button onClick={() => handleClickCoupon(item)}>Apply</button>
                  </div>
                </div>)
              }) :
              <div className='counpon-detail'>
                <Spinner />
              </div>
          }
        </div> */}

      </div>


      <CheckOut
        prevStep={prevStep}
        subscriptionData={subscriptionData}
        paymentData={paymentData}
        handleSubmit={handleSubmit}
        couponData={couponData}
        clientData={clientData}
        navigateLogin={navigateLogin}
      />


    </Elements>
  )
}

export default Payment