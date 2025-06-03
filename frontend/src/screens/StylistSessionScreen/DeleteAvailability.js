import React from "react";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import ModalButton from "../../components/Modal/ModalButton";
import ModalForm from "../../components/Modal/ModalForm";
import ModalHeading from "../../components/Modal/ModalHeading";
import { deleteAppointmentAction, deleteSlotAction } from "../../redux/actions/appointmentAction";
import moment from "moment";

const deleteAvailability = ({ data }) => {
  const {
    deleteModalActive,
    setDeleteModalActive,
    handleAddModalClose,
    appointmentId,
    userLogin,
    dispatch,
    appointmentTime
  } = data;

  const handleDelelteSubmit = () => {
    //dispatch(deleteAppointmentAction(appointmentId));
    dispatch(deleteSlotAction(appointmentId));
    setDeleteModalActive(false);
  };
  return (
    <>
      <Modal show={deleteModalActive}>
        <ModalHeading
          heading={"Delete Slot"}
          onClose={handleAddModalClose}
        />
        <ModalForm style={{ marginBottom: "2.5rem" }}>
          <p className="modal__text">
            Are you sure you want to delete the slot on <span style={{ fontStyle: 'bold' }}>{moment(appointmentTime).format("MM-DD-YY")}</span> &nbsp; at &nbsp;
            <span style={{ fontStyle: 'bold' }}>{moment(appointmentTime).format('hh:mm A')}</span>
            {" "}??
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <ModalButton
              label="Delete"
              icon={"delete"}
              onClick={handleDelelteSubmit}
            />
            <ModalButton
              varient="danger"
              label="Cancel"
              onClick={handleAddModalClose}
            />
          </div>
        </ModalForm>
      </Modal>
    </>
  );
};

export default deleteAvailability;
