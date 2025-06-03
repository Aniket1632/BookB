import React, { Fragment, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminCouponsAction, verifyCouponAction } from '../../redux/actions/couponActions';
import { toast } from 'react-toastify';
import { VERIFY_COUPON_RESET } from '../../redux/constants/couponConstants';
import { completeOnboardAction } from '../../redux/actions/onboardingActions';
import { CREATE_NEW_ONBOARD_USER_RESET } from '../../redux/constants/onboardingConstants';
import './StripePricingTable.css';
import Spinner from '../../components/Spinner/Spinner';
import InputCoupon from '../../components/formInputs/InputBox/InputCoupon';
//const stripePromise = loadStripe('pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq');
import { stripePublicKey } from '../../redux/actions/ip';
const stripePromise = loadStripe(stripePublicKey);


const CheckOut = ({ state, setState, handleSubmit, prevStep, couponData }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const onBoardRegister = useSelector(state => state.onBoardRegister);

  useEffect(() => {
    if (onBoardRegister && onBoardRegister.data && onBoardRegister.data.status) {
      dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
      confirmCardPayment(onBoardRegister.data.data);
    } else if (onBoardRegister && onBoardRegister.data && !onBoardRegister.data.status) {
      dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
      toast.error(onBoardRegister.data.message);
    }
  }, [onBoardRegister, dispatch]);

  const confirmCardPayment = async formData => {
    const { clientId, client_secret, status } = formData;
    if (status === 'requires_action') {
      stripe.confirmCardPayment(client_secret).then(async function (result) {
        if (result.error) {
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          toast.error(result.error);
        } else {
          await dispatch(completeOnboardAction({ clientId, plan: state.step2.selectedPackage.value.plans[0].id }));
          toast.success('Your payment is successful.');
        }
      });
    } else if (status === 'fail') {
      toast.error(formData.msg);
    } else {
      await dispatch(completeOnboardAction({ clientId, plan: state.step2.selectedPackage.value.plans[0].id }));
      toast.success('Your payment is successful.');
    }
  };

  const handlePaymentSubmit = async e => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: state.step1.name.value,
        email: state.step1.email.value,
      },
    });

    if (!error) {
      const { id } = paymentMethod;
      const paymentData = { id, promotion_code: couponData.promotionCode && couponData.promotionCode.length ? couponData.promotionCode[0].id : '' };

      // setState(prevVal => ({ ...prevVal, step5: {  paymentData } }));

      if (paymentData.id) {
        handleSubmit(paymentData);
      }
    }
  };

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
                fontFamily: 'Poppins, sans-serif',
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
                  fontFamily: 'Poppins, sans-serif',
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
                  fontFamily: 'Poppins, sans-serif',
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

      {onBoardRegister && onBoardRegister.loading ? (
        <div className='onboard_button'>
          <button disabled>Processing...</button>
        </div>
      ) : (
        <div className='onboard_button'>
          <button onClick={prevStep} className='prev'>
            Previous
          </button>
          <button disabled={!stripe} onClick={handlePaymentSubmit}>
            Pay
          </button>
        </div>
      )}
    </>
  );
};

const Payment = ({ prevStep, handleSubmit, state, setState, navigateLogin, couponData, setCouponData }) => {
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [active, setActive] = useState(false);
  const verfifyCoupon = useSelector(state => state.verfifyCoupon);
  const getAdminCoupon = useSelector(state => state.getAdminCoupon);

 useEffect(() => {
    // Create a script element to load the Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      const pricingTable = document.createElement('stripe-pricing-table');
      pricingTable.setAttribute('class', 'stripe-pricing-table');
      pricingTable.setAttribute('pricing-table-id', 'prctbl_1PkWlsI86JiV4rb9SgKKg9hb');
      pricingTable.setAttribute('publishable-key', 'pk_live_ijQEYHuZLIsFjwukDmAkn3Hb00GyT5mUjL');
      
      document.getElementById('stripe-pricing-table-container').appendChild(pricingTable);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="stripe-pricing-table-container" className="custom-pricing-table" />
  );
};

export default Payment;
