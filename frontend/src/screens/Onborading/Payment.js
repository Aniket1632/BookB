import React, { Fragment, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminCouponsAction,
  verifyCouponAction,
} from "../../redux/actions/couponActions";
import { toast } from "react-toastify";
import { VERIFY_COUPON_RESET } from "../../redux/constants/couponConstants";
import { completeOnboardAction } from "../../redux/actions/onboardingActions";
import { CREATE_NEW_ONBOARD_USER_RESET } from "../../redux/constants/onboardingConstants";
import Spinner from "../../components/Spinner/Spinner";
import InputCoupon from "../../components/formInputs/InputBox/InputCoupon";
import {
  getEnableSubscriptionAction,
  getTotalPriceAction,
} from "../../redux/actions/subscriptionAction";
import Modal from "../../components/Modal";
import payment from "./Payment.module.css";
import AddStylistComponent from "../../components/formInputs/InputBox/AddStylistComponent";

// import { getEnableSubscriptionAction, getTotalPriceAction } from "../../redux/actions/subscriptionAction";
//const stripePromise = loadStripe("pk_test_HLKSK1hyuVsxEIZxIsEivNEj00RsqCdrBq");
import { stripePublicKey } from '../../redux/actions/ip';
const stripePromise = loadStripe(stripePublicKey);

const CheckOut = ({
  state,
  setState,
  coupon,
  handleSubmit,
  prevStep,
  couponData,
  getTotalPrice,
  verfifyCoupon,
}) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const onBoardRegister = useSelector((state) => state.onBoardRegister);

  useEffect(() => {
    if (
      onBoardRegister &&
      onBoardRegister.data &&
      onBoardRegister.data.status
    ) {
      dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
      confirmCardPayment(onBoardRegister.data.data);
    } else if (
      onBoardRegister &&
      onBoardRegister.data &&
      !onBoardRegister.data.status
    ) {
      dispatch({ type: CREATE_NEW_ONBOARD_USER_RESET });
      toast.error(onBoardRegister.data.message);
    }
  }, [onBoardRegister, dispatch]);

  const confirmCardPayment = async (formData) => {
    const { clientId, client_secret, status } = formData;
    if (status === "requires_action") {
      stripe.confirmCardPayment(client_secret).then(async function (result) {
        if (result.error) {
          toast.error(result.error);
        } else {
          await dispatch(
            completeOnboardAction({
              clientId,
              plan: state.step2.selectedPackage.value.plans[0].id,
            })
          );
          toast.success("Your payment is successful.");
        }
      });
    } else if (status === "fail") {
      toast.error(formData.msg);
    } else {
      await dispatch(
        completeOnboardAction({
          clientId,
          plan: state.step2.selectedPackage.value.plans[0].id,
        })
      );
      toast.success("Your payment is successful.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: state.step1.name.value,
        email: state.step1.email.value,
      },
    });

    if (!error) {
      const { id } = paymentMethod;
      const paymentData = {
        id,
        promotion_code:
          couponData.promotionCode && couponData.promotionCode.length
            ? couponData.promotionCode[0].id
            : "",
      };

      // setState(prevVal => ({ ...prevVal, step5: {  paymentData } }));

      if (paymentData.id) {
        handleSubmit(paymentData);
      }
    }
  };

  return (
    <>
      {/* <CardElement /> */}
      <div className="onboard_card_input">
        <CardNumberElement
          options={{
            showIcon: true,
            style: {
              base: {
                iconColor: "#ffff",
                color: "#fff",
                fontWeight: "500",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontSmoothing: "antialiased",
                padding: "25px",
                ":-webkit-autofill": {
                  color: "#aa9999",
                },
                "::placeholder": {
                  color: "#aa9999",
                  fontWeight: "500",
                },
              },
            },
          }}
        />
      </div>
      <div className="form_section">
        <div className="onboard_card_input">
          <CardExpiryElement
            options={{
              showIcon: true,
              style: {
                base: {
                  iconColor: "#000000",
                  color: "#fff",
                  fontWeight: "500",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontSmoothing: "antialiased",
                  padding: "25px",
                  ":-webkit-autofill": {
                    color: "#aa9999",
                  },
                  "::placeholder": {
                    color: "#aa9999",
                    fontWeight: "500",
                  },
                },
              },
            }}
          />
        </div>
        <div className="onboard_card_input">
          <CardCvcElement
            options={{
              showIcon: true,
              style: {
                base: {
                  iconColor: "#000000",
                  color: "#fff",
                  fontWeight: "500",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontSmoothing: "antialiased",
                  padding: "25px",
                  ":-webkit-autofill": {
                    color: "#aa9999",
                  },
                  "::placeholder": {
                    color: "#aa9999",
                    fontWeight: "500",
                  },
                },
                invalid: {
                  iconColor: "#FFC7EE",
                  color: "#FFC7EE",
                },
              },
            }}
          />
        </div>
      </div>

      <div>
        <div className={payment.onboarding_price}>
          <span className={payment.priceText}>Price :</span>
          {getTotalPrice &&
            getTotalPrice?.data &&
            getTotalPrice?.data?.price && (
              <span className={payment.finalPrice}>
                ${getTotalPrice?.data?.price}
              </span>
            )}
        </div>
        {verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status ? (
          <div className={payment.onboarding_price}>
            <span className={payment.priceText}>
              Coupon{" "}
              <span className={payment.testing}>
                ({coupon} {getTotalPrice?.data?.discountPercentage}% off applied) :
              </span>
            </span>
            <div className={payment.total_Price}>
              {getTotalPrice &&
                getTotalPrice?.data &&
                getTotalPrice?.data?.price && (
                  <span className={payment.discountedPrice}>
                    ${getTotalPrice?.data?.price}{" "}
                  </span>
                )}
              {getTotalPrice &&
                getTotalPrice?.data &&
                getTotalPrice?.data?.discountAmount && (
                  <span className={payment.finalPrice}>
                    ${(
                      getTotalPrice?.data?.price -
                      getTotalPrice?.data?.discountAmount
                    ).toFixed(2)}
                    
                  </span>
                )}
            </div>
          </div>
        ) : null}
        <div className={payment.onboarding_price}>
          {getTotalPrice &&
            getTotalPrice?.data &&
            getTotalPrice?.data?.subtotal && (
              <span className={payment.subTotal}>
                Subtotal{" "}
                <span className={payment.fees}>
                  (Including {getTotalPrice?.data?.taxPercentage}% transaction
                  fees)
                </span>{" "}
                :
              </span>
            )}
          {getTotalPrice &&
            getTotalPrice?.data &&
            getTotalPrice?.data?.subtotal && (
              <span className={payment.finalPrice}>
                ${getTotalPrice?.data?.total}
              </span>
            )}
        </div>
        <div className={payment.divider} />
        <div className={payment.totalRow}>
          <span className={payment.totalText}>Total</span>
          {getTotalPrice &&
            getTotalPrice?.data &&
            getTotalPrice?.data?.total && (
              <span className={payment.totalAmount}>
                ${getTotalPrice?.data?.total}
              </span>
            )}
        </div>
      </div>

      {onBoardRegister && onBoardRegister.loading ? (
        <div className="onboard_button">
          <button disabled>Processing...</button>
        </div>
      ) : (
        <div className="onboard_button">
          <button onClick={prevStep} className="prev">
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

const Payment = ({
  prevStep,
  handleSubmit,
  state,
  setState,
  navigateLogin,
  couponData,
  setCouponData,
}) => {
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [active, setActive] = useState(false);
  const verfifyCoupon = useSelector((state) => state.verfifyCoupon);
  const getAdminCoupon = useSelector((state) => state.getAdminCoupon);

  const getEnableSubscription = useSelector(
    (state) => state.getEnableSubscription
  );
  const getTotalPrice = useSelector((state) => state.getTotalPrice);
  const [quantity, setQuantity] = useState("1");

  const trData = getEnableSubscription?.data?.data?.formattedTiers;
  const packageId = getEnableSubscription?.data?.data?.id;
  const product = getEnableSubscription?.data?.data?.product;
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [applyCoupenLoading, setApplyCoupenLoading] = useState(false);

  const priceId = quantity ? quantity : 1;

  useEffect(() => {
    dispatch(getEnableSubscriptionAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotalPriceAction(priceId));
  }, [dispatch]);

  useEffect(() => {
    setState({
      ...state,
      step4: { quantity: priceId, package: product, plan: packageId },
    });
  }, [trData, quantity]);

  useEffect(() => {
    dispatch(getAdminCouponsAction());
  }, [active]);

  useEffect(() => {
    if (verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status) {
      toast.success(verfifyCoupon.data.message);
      setCouponError("");
      setCouponData(
        verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.data
      );
    } else {
      toast.error(
        verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.message
      );
      setCouponError(
        verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.message
      );
    }
  }, [verfifyCoupon]);

  const handleClick = async () => {
    if (coupon === "") {
      setCouponError("Please enter coupon");
      setCouponData("");
      setCoupon("");
    } else {
      setModalVisible1(true);
      dispatch(verifyCouponAction(coupon));
      setApplyCoupenLoading(true);
      try {
        await dispatch(getTotalPriceAction(priceId, coupon));
      } catch (error) {
        console.error("Error fetching total price:", error);
      } finally {
        setApplyCoupenLoading(false);
      }
    }
  };

  const handleClickCoupon = (d) => {
    dispatch(verifyCouponAction(d && d.code));
    setActive(false);
    setCoupon(d && d.code);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className={payment.flexRowContainer}>
        <div className={`onboard_inputView ${payment.onboardInputView}`}>
          <div className="onboard_input">
            <InputCoupon
              type="text"
              placeholder="Enter Coupon Code"
              value={coupon}
              onFocus={(e) => {
                setActive(!active);
              }}
              onChange={(e) => {
                setCoupon(e.target.value);
                setCouponError("");
              }}
              errorMessage={couponError}
              label="Apply Coupon"
              icon="ticket"
              handler={handleClick}
              verfifyCoupon={verfifyCoupon}
              couponData={couponData}
              setCouponData={setCouponData}
              setCoupon={setCoupon}
              priceId={priceId}
              coupon={coupon}
              applyCoupenLoading={applyCoupenLoading}
              isModalVisible1
              setModalVisible1
            />
          </div>
        </div>

        <AddStylistComponent
          data={trData}
          quantity={quantity}
          setQuantity={setQuantity}
          type="text"
          label1="No. Of Stylist"
          coupon={coupon}
        />
      </div>

      <CheckOut
        prevStep={prevStep}
        setState={setState}
        coupon={coupon}
        state={state}
        handleSubmit={handleSubmit}
        couponData={couponData}
        navigateLogin={navigateLogin}
        getTotalPrice={getTotalPrice}
        verfifyCoupon={verfifyCoupon}
      />
    </Elements>
  );
};

export default Payment;
