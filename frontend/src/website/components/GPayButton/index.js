

import React, { useEffect, useState } from 'react';
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
//const stripePromise = loadStripe('pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq');
import { stripePublicKey } from '../../../redux/actions/ip';

const stripePromise = loadStripe(stripePublicKey);

const CheckoutForm = () => {
    const stripe = useStripe();
    const [paymentRequest, setPaymentRequest] = useState(null);

    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: {
                    label: 'Demo total',
                    amount: 1999,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            // Check the availability of the Payment Request API.
            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });
        }
    }, [stripe]);



    if (paymentRequest) {
        return <PaymentRequestButtonElement
            className="PaymentRequestButton"
            options={{ paymentRequest }}
            onReady={() => {
                console.log("PaymentRequestButton [ready]");
            }}
            onClick={(event) => {
                console.log("PaymentRequestButton [click]", event);
            }}
            onBlur={() => {
                console.log("PaymentRequestButton [blur]");
            }}
            onFocus={() => {
                console.log("PaymentRequestButton [focus]");
            }}
        />
    }

    // Use a traditional checkout form.
    return 'Insert your form or button component here.';
}


const GPayButton = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}



export default GPayButton;