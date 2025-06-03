import React from "react";
import Modal from "../../components/NewModal";
import ModalHeading from "../../components/NewModal/ModalHeading";
import ModalForm from "../../components/NewModal/ModalForm";
import InputsSection from "../../components/NewModal/InputsSection";
import InputsSectionColumn from "../../components/NewModal/InputsSectionColumn";
import InputBox from "../../components/NewInputBox";
import ModalButton from "../../components/NewModal/ModalButton";
import FileUpload from "../../components/NewFileUpload";
import TextareaBox from "../../components/NewTextareaBox";
import { inputPhoneMasking } from "../../utils/validators";
import Styles from "./Salon.module.css";

const CreateEditSalon = ({ data }) => {
  const {
    showAddModal,
    handleAddModalClose,
    handleSubmit,
    selectUpdateModel,

    name,
    email,
    address,
    phone,

    setName,
    setEmail,
    setPhone,
    setAddress,

    nameError,
    addressError,
    phoneError,
    emailError,

    setNameError,
    setAddressError,
    setPhoneError,
    setEmailError,

    password,
    setPassword,
    passwordError,
    setPasswordError,

    imageSrc,
    setImageSrc,

    setUploadFileData,
    uploadFileDataError,
    setUploadFileDataError,
  } = data;

  const handleChangeImage = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    if (e.target.files[0]) {
      var url = reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
    }
  };

  return (
    <Modal show={showAddModal}>
      <ModalHeading
        heading={selectUpdateModel._id ? "Update Salon" : "Add New Salon"}
        onClose={handleAddModalClose}
      />
      <ModalForm onSubmit={handleSubmit}>
        <InputsSection>
          <InputBox
            className={Styles.input}
            label="Salon Name"
            icon="salon"
            placeholder="eg, BookB Salon"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
            }}
            errorMessage={nameError}
          />
          <InputBox
            className={Styles.input}
            label="Email"
            icon="email"
            placeholder="eg, johndoe@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
            }}
            errorMessage={emailError}
          />
          <InputBox
            className={Styles.input}
            style={{ paddingBottom: "1rem" }}
            label="Phone"
            icon="phone"
            placeholder="eg, 123 456 7890"
            value={phone}
            onChange={(event) => {
              setPhone(inputPhoneMasking(event.target.value));
              setPhoneError("");
            }}
            errorMessage={phoneError}
          />
        </InputsSection>
        <InputsSectionColumn>
          <div className="flex" style={{ gap: "2rem" }}>
            <TextareaBox
              className={Styles.textArea}
              style={{ padding: "1.5rem 0rem 0rem 0rem", paddingLeft: "1rem" }}
              label="Address"
              icon="pin"
              placeholder="eg, Devar, USA"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setAddressError("");
              }}
              errorMessage={addressError}
            />

            {!selectUpdateModel._id && (
              <InputBox
                className={Styles.input}
                label="Password"
                icon="key"
                placeholder="**********"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                errorMessage={passwordError}
              />
            )}
          </div>
        </InputsSectionColumn>
        <FileUpload
          className={Styles.fileUpload}
          label="Upload Salon Logo"
          icon="upload"
          image={imageSrc}
          onChange={(e) => {
            handleChangeImage(e);
            setUploadFileData(e.target.files);
            setUploadFileDataError("");
          }}
          errorMessage={uploadFileDataError}
        />
        <ModalButton
          label={selectUpdateModel._id ? "Update Salon" : "Add New"}
          icon={selectUpdateModel._id ? "edit" : "plus"}
          onClick={handleSubmit}
        />
      </ModalForm>
    </Modal>
  );
};

export default CreateEditSalon;
