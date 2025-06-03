import React from "react";
import Modal from "../../components/Modal";
import ModalButton from "../../components/Modal/ModalButton";
import ModalForm from "../../components/Modal/ModalForm";
import ModalHeading from "../../components/Modal/ModalHeading";
import { deleteAppointmentAction, deleteSlotAction } from "../../redux/actions/appointmentAction";
import moment from "moment";

const DeleteAppointmentModal = ({ data }) => {
  const {
    deleteAptModal,
    setDeleteAptModal,
    handleAddModalClose,
    appointmentId,
    userLogin,
    dispatch,
    appointmentTime
  } = data;

  const handleDelelteSubmit = () => {
    dispatch(deleteAppointmentAction(appointmentId));
    setDeleteAptModal(false)
  };
  return (
    <>
      <Modal show={deleteAptModal}>
        <ModalHeading
          heading={"Delete Appointment"}
          onClose={() => setDeleteAptModal(false)}
        />
        <ModalForm style={{ marginBottom: "2.5rem" }}>
          <p className="modal__text">
            Are you sure you want to delete the Appointment?
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
              onClick={() => setDeleteAptModal(false)}
            />
          </div>
        </ModalForm>
      </Modal>
    </>
  );
};

export default DeleteAppointmentModal;
