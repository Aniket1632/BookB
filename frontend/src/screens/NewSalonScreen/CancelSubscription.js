import React from "react";
import Modal from "../../components/Modal";
import InputsSectionColumn from "../../components/Modal/InputsSectionColumn";
import ModalButton from "../../components/Modal/ModalButton";
import ModalForm from "../../components/Modal/ModalForm";
import ModalHeading from "../../components/Modal/ModalHeading";

const CancelSubscription = ({ data }) => {
  const {
    modalCancelSubscription,
    onCancelSubscriptionModalClose,
    onCancelSubscriptionHandler,
  } = data;

  return (
    <Modal show={modalCancelSubscription}>
      <ModalHeading
        heading="Cancel Subscription"
        onClose={onCancelSubscriptionModalClose}
      />
      <ModalForm>
        <InputsSectionColumn
          style={{
            color: "white",
            fontSize: "1.4rem",
            textAlign: "start",
          }}
        >
          Are you sure you want to cancel your subscription? <br /> Remember you
          will not be able to use any of the features on this platform.
        </InputsSectionColumn>
        <ModalButton
          varient="danger"
          label="Cancel"
          icon="delete"
          onClick={onCancelSubscriptionHandler}
        />
      </ModalForm>
    </Modal>
  );
};

export default CancelSubscription;
