import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import TextBox from "./TextBox.module.css";
import { VERIFY_COUPON_RESET } from "../../../redux/constants/couponConstants";
import { useDispatch } from "react-redux";
import ModalHeading from "../../Modal/ModalHeading";
import Modal from "../../Modal";
import { getTotalPriceAction } from "../../../redux/actions/subscriptionAction";

const InputCoupon = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
  label,
  name,
  icon,
  style,
  disabled,
  defaultValue,
  min,
  required = false,
  handler,
  verfifyCoupon,
  couponData,
  setCouponData,
  setCoupon,
  priceId,
  coupon,
  applyCoupenLoading,
  isModalVisible1,
  setModalVisible1,
}) => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleRemoveClick = useCallback(() => {
    dispatch({ type: VERIFY_COUPON_RESET });
    setCouponData("");
    setCoupon("");
    setModalVisible(true);
  }, []);

  const getTotalPriceCall = useCallback(async () => {
    const data = await dispatch(getTotalPriceAction(priceId));
    if (data && data.status) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!coupon) {
      setLoading(true);
      getTotalPriceCall();
    }
  }, [coupon]);

  return (
    <div className={TextBox.form_input1}>
      <style>
        {`
        input::placeholder {
        color: #ffffff; 
        }
        input{
        color: #ffffff; 
        }
       `}
      </style>

      <div className={TextBox.input_Coupon}>
        {label && (
          <label htmlFor={label} className={TextBox.form_input__label1}>
            {label}
          </label>
        )}
        {/* Show 'Remove Coupon' button if coupon is applied */}
        {verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status ? (
          <button className={TextBox.remove_Coupon} onClick={handleRemoveClick}>
            Remove Coupon
          </button>
        ) : null}
      </div>

      <div className={TextBox.input_Coupon}>
        <div className={TextBox.input_Coupon_Container}>
          <svg className={TextBox.form_input__icon}>
            <use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
          </svg>

          <input
            style={{
              backgroundColor: '#3d3d3d',
              width: '65%',
              marginRight: '1rem',
              borderRadius: '5px',
            }}
            type={type}
            id={name}
            name={name}
            min={
              type === "date" &&
              (moment().format("YYYY-MM-DD") || type === "time") &&
              min
            }
            disabled={verfifyCoupon && verfifyCoupon.data && verfifyCoupon.data.status}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
          />

          {!verfifyCoupon?.data?.status && (
            <label className={TextBox.form_input__label1} onClick={handler}>
              Apply
            </label>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className={TextBox.form_input__error}>{errorMessage}</p>
      )}
      
      {loading ? (
        <Modal show={isModalVisible}>
          <div className={TextBox.modal_Container}>
            <div className={TextBox.loading_spinner}></div>
            <span className={TextBox.apply_Coupon_Text}>
              Updating Quantity...
            </span>
          </div>
        </Modal>
      ) : null}

      {applyCoupenLoading ? (
        <Modal show={isModalVisible1}>
          <div className={TextBox.modal_Container}>
            <div className={TextBox.loading_spinner}></div>
            <span className={TextBox.apply_Coupon_Text}>Apply Coupon...</span>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default InputCoupon;
