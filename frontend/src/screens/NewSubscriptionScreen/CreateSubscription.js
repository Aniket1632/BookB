import React, { Fragment } from "react";
import InputBox from "../../components/NewInputBox";
import Modal from "../../components/NewModal";
import InputsSection from "../../components/NewModal/InputsSection";
import Textareabox from "../../components/NewTextareaBox";
import ModalForm from "../../components/NewModal/ModalForm";
import ModalHeading from "../../components/NewModal/ModalHeading";
import ModalButton from "../../components/NewModal/ModalButton";
import SelectBox from "../../components/NewSelectBox/SelectBox";
import Styles from "./Packages.module.css";

const CreateSubscription = ({ addPackageModal, data }) => {
  const {
    editPackageModal,
    handleSubsModalClose,

    name,
    setName,
    nameError,
    setNameError,

    description,
    setDescription,
    descriptionError,
    setDescriptionError,

    monthlyPrice,
    setMonthlyPrice,
    monthlyPriceError,
    setMonthlyPriceError,

    annualPrice,
    setAnnualPrice,
    annualPriceError,
    setAnnualPriceError,

    maxCalendar,
    setMaxCalendar,
    maxCalendarError,
    setMaxCalendarError,

    handleSubmit,
  } = data;
  return (
    <Modal show={addPackageModal}>
      <ModalHeading
        heading={
          editPackageModal.status ? "Update Subscription" : "Add Subscription"
        }
        onClose={handleSubsModalClose}
      />
      <ModalForm>
        <InputsSection>
          <InputBox
            className={Styles.input}
            label="Name"
            icon="user"
            placeholder="Enter name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
            }}
            errorMessage={nameError}
          />

          <Textareabox
            className={Styles.textArea}
            style={{ padding: "2rem 0rem 0rem 0rem" }}
            label="Description"
            icon="user"
            placeholder="Enter Description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setDescriptionError("");
            }}
            errorMessage={descriptionError}
          />
        </InputsSection>
        <InputsSection>
          <SelectBox
            className={Styles.selects}
            style={{ margintop: "2.5rem" }}
            name="Maximum Calendars"
            label="Maximum Calendars"
            icon="calendar"
            value={maxCalendar}
            onChange={(e) => setMaxCalendar(e.target.value)}
            errorMessage={maxCalendarError}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </SelectBox>

          {!editPackageModal.status && (
            <Fragment>
              <InputBox
                className={Styles.input}
                label="Monthly Price (in $)"
                icon="dollar"
                placeholder="eg 250"
                value={monthlyPrice}
                onChange={(event) => {
                  setMonthlyPrice(event.target.value);
                  setMonthlyPriceError("");
                }}
                errorMessage={monthlyPriceError}
              />

              <InputBox
                className={Styles.input}
                label="Annual Price (in $)"
                icon="dollar"
                placeholder="eg 250"
                value={annualPrice}
                onChange={(event) => {
                  setAnnualPrice(event.target.value);
                  setAnnualPriceError("");
                }}
                errorMessage={annualPriceError}
              />
            </Fragment>
          )}
        </InputsSection>
        <ModalButton
          label={editPackageModal.status ? "Update" : "Add New"}
          icon={editPackageModal.status ? "edit" : "plus"}
          onClick={handleSubmit}
        />
      </ModalForm>
    </Modal>
  );
};

export default CreateSubscription;
