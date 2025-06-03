import React from "react";
import Modal from "../../components/Modal";
import InputsSection from "../../components/Modal/InputsSection";
import ModalForm from "../../components/Modal/ModalForm";
import ModalHeading from "../../components/Modal/ModalHeading";
import { inputPhoneMasking } from "../../utils/validators";
import "./Dashboard.css";
import moment from "moment";
import Styles from "./Dashboard.css";

const SubscriptionDetail = ({ data }) => {
  const {
    handleSubscriptionModal,
    handleSubscriptionModalClose,
    subscriptionModal,
    subscriptionInfo,
  } = data;

  return (
    <Modal show={subscriptionModal}>
      <ModalHeading
        heading="Salon Subscription"
        onClose={handleSubscriptionModalClose}
      />
      <ModalForm style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            color: "#ffffff",
            fontWeight: "500",
            marginBottom: "1rem",
          }}
        >
          Salon Information
        </h2>

        <InputsSection
          style={{ padding: "3rem 2rem", flexDirection: "column" }}
        >
          <div
            className="salon_status"
            style={{ color: "white ", alignItems: "flex-start" }}
          >
            Subscription Status:{" "}
            {subscriptionInfo &&
            subscriptionInfo.subscription &&
            subscriptionInfo.subscription[0] &&
            subscriptionInfo.subscription[0].active ? (
              <p className="table__status" style={{ width: "8rem" }}>
                <span>•</span> Active
              </p>
            ) : (
              <p
                className="table__status_deactive"
                style={{ width: "8rem", color: "#ffffff" }}
              >
                <span>•</span> Deactive
              </p>
            )}
          </div>
          <div className="stylist_box">
            <img
              src={subscriptionInfo && subscriptionInfo.photo}
              className="stylist_img"
            ></img>
            <div className="stylist_text">
              <span>{subscriptionInfo && subscriptionInfo.name}</span>
              <p style={{ fontWeight: 499 }}>
                {subscriptionInfo && subscriptionInfo.email} |{" "}
                {inputPhoneMasking(subscriptionInfo && subscriptionInfo.phone)}
              </p>
            </div>
          </div>
        </InputsSection>

        <h2
          style={{ color: "#ffffff", fontWeight: "500", marginBottom: "1rem" }}
        >
          Subscription Details
        </h2>
        <InputsSection style={{ padding: "3rem 2rem" }}>
          <div>
            <span style={{ color: "#ffffff" }}>
              Start Date:{" "}
              {subscriptionInfo &&
                subscriptionInfo.subscription &&
                subscriptionInfo.subscription[0] &&
                moment(subscriptionInfo.subscription[0].startDate).format(
                  "DD-MM-YYYY"
                )}
            </span>
          </div>
          <div>
            <span style={{ color: "#ffffff" }}>
              End Date:{" "}
              {subscriptionInfo &&
                subscriptionInfo.subscription &&
                subscriptionInfo.subscription[0] &&
                moment(subscriptionInfo.subscription[0].packageExpiry).format(
                  "DD-MM-YYYY"
                )}
            </span>
          </div>
        </InputsSection>
      </ModalForm>
    </Modal>
  );
};

export default SubscriptionDetail;
