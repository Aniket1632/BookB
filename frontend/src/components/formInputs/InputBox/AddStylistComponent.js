import React, { useState, useEffect } from "react";
import moment from "moment";
import TextBox from "./TextBox.module.css";
import Modal from "../../Modal";
import ModalHeading from "../../Modal/ModalHeading";
import { getTotalPriceAction } from "../../../redux/actions/subscriptionAction";
import { useDispatch } from "react-redux";

const AddStylistComponent = ({
  data,
  type,
  label1,
  quantity,
  setQuantity,
  required = false,
  coupon,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const priceId = quantity ? quantity : 1;

  useEffect(() => {
    if (data && data.length > 0) {
      setTotalPrice(data[0].unit_amount);
    }
  }, [data]);

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
    setError("");
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleQuantityChange = (e) => {
    const quantityValue = e.target.value;
    setQuantity(quantityValue);
    calculateTotalPrice(quantityValue);
  };

  const handleUpdateClick = async () => {
    if (!quantity) {
      setError("Please fill in the number of stylists.");
    } else {
      setLoading(true);
      setError("");
      try {
        await dispatch(getTotalPriceAction(priceId, coupon));
      } catch (error) {
        console.error("Error fetching total price:", error);
      } finally {
        setLoading(false);
        setDropdownVisible(false);
      }
    }
  };

  const calculateTotalPrice = (quantityValue) => {
    const quantityNumber = parseInt(quantityValue, 10);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setTotalPrice(data[0]?.unit_amount || 0);
      return;
    }

    const selectedTier = data.find(
      (tier) =>
        quantityNumber >= tier.from &&
        (tier.to === Infinity || quantityNumber <= tier.to)
    );

    if (selectedTier) {
      setTotalPrice(selectedTier.unit_amount * quantityNumber);
    } else {
      setTotalPrice(data[data.length - 1]?.unit_amount * quantityNumber || 0);
    }
  };

  return (
    <div className={TextBox.form_input1}>
      {label1 && (
        <label htmlFor={label1} className={TextBox.form_input__label1}>
          {label1}
        </label>
      )}
      <div className={TextBox.dropDown_Handle} onClick={handleDropdownToggle}>
        {quantity || 1}
        <svg className={TextBox.form_input__icon} style={{ fill: "#b7b2b2" }}>
          <use xlinkHref={`/assets/sprite.svg#icon-down`} />
        </svg>
      </div>

      {isDropdownVisible && (
        <Modal show={isDropdownVisible}>
          <ModalHeading
            heading={"Update Quantity"}
            onClose={() => setDropdownVisible(false)}
          />
          <div className={TextBox.update_modal_container}>
            {loading ? (
              <div className={TextBox.loader_Quantity}>
                <div className={TextBox.loading_spinner}></div>
                <span className={TextBox.apply_Coupon_Text}>
                  Updating Quantity...
                </span>
              </div>
            ) : (
              <>
                <input
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    color: "#fff",
                    borderBottom: "1px solid #555",
                    width: "100%",
                    borderRadius: "0",
                    padding: "0",
                    margin: "0",
                    lineHeight: "1",
                  }}
                  type="text"
                  placeholder="Enter the number of stylist"
                  value={quantity}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === "" || Number(newValue) > 0) {
                      handleQuantityChange(e);
                    }
                  }}
                  required={required}
                  min="1"
                />
                <style>
                  {`
                            input::placeholder {
                            color: grey;
                            }
                           `}
                </style>
                {error && <p className={TextBox.errorText}>{error}</p>}
                <div className={TextBox.stylist_Container}>
                  <span>Number of Stylists</span>
                  <span className={TextBox.price_Label}>Pricing(in USD)</span>
                </div>
                <div className={TextBox.price_Container}>
                  <ul className={TextBox.price_Box}>
                    {data?.map((tier, index) => {
                      let rangeText;
                      if (tier.from === tier.to) {
                        rangeText = `${tier.from}`;
                      } else if (tier.to === "∞") {
                        rangeText = `More than ${tier.from - 1}`;
                      } else {
                        rangeText = `${tier.from}-${tier.to}`;
                      }

                      return (
                        <li
                          key={index}
                          className={TextBox.list_Price}
                          onClick={() =>
                            handleOptionSelect(
                              `${rangeText}: $${tier.unit_amount}`
                            )
                          }
                        >
                          <div className={TextBox.amount_Container}>
                            <span className={TextBox.unit_Amount_Label}>
                              {rangeText}
                            </span>
                            <span className={TextBox.unit_Amount_Label}>
                              ${tier.unit_amount} per Stylist
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
            <button
              className={TextBox.update_Button}
              onClick={handleUpdateClick}
            >
              Update
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddStylistComponent;
