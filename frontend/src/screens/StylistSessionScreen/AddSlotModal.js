import React from "react";
import Modal from "../../components/Modal";
import ModalButton from "../../components/Modal/ModalButton";
import ModalForm from "../../components/Modal/ModalForm";
import ModalHeading from "../../components/Modal/ModalHeading";
import moment from "moment";

const AddSlotModal = ({ data }) => {
  const {
    addSlotModal,
    setAddSlotModal,
    handleAddModalClose,
    appointmentTime,
    setUserId,
    appointmentId,
    convertMinutes,
    unBlockHandler,
    userLogin,
    dispatch,
  } = data;

  var dd = String(appointmentTime && appointmentTime.getDate()).padStart(2, '0');
  var mm = String(appointmentTime && appointmentTime.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = appointmentTime && appointmentTime.getFullYear();

  let apt = mm + '/' + dd + '/' + yyyy;
  return (
    <>
      <Modal show={addSlotModal}>
        <ModalHeading heading={"Unblock Slot"} onClose={handleAddModalClose} />
        <ModalForm style={{ marginBottom: "2.5rem" }}>
          <p className="modal__text">
            Unblock slot on {" "}
            {/* <span style={{fontStyle: 'bold'}}>{moment(appointmentTime).calendar()}</span> */}

            <span style={{ fontStyle: 'bold' }}>{moment(appointmentTime).format("MM-DD-YY")}</span> &nbsp; at &nbsp;
            <span style={{ fontStyle: 'bold' }}>{moment(appointmentTime).format('hh:mm A')}</span>
            {" "}?
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <ModalButton
              label="Unblock"
              onClick={() => {
                unBlockHandler(appointmentTime);
                handleAddModalClose();
              }}
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

export default AddSlotModal;
