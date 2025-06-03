import React from "react";
import Modal from "../../components/NewModal";
import ModalHeading from "../../components/NewModal/ModalHeading";
import ModalForm from "../../components/NewModal/ModalForm";
import InputsSection from "../../components/NewModal/InputsSection";
import InputsSectionColumn from "../../components/NewModal/InputsSectionColumn";
import InputBox from "../../components/NewInputBox/index";
import ModalButton from "../../components/NewModal/ModalButton";
import FileUpload from "../../components/formInputs/FileUpload";
// import SelectBox from '../../components/formInputs/SelectBox';
import TextareaBox from "../../components/NewTextareaBox";
import { inputPhoneMasking } from "../../utils/validators";
import Styles from "./Stylist.module.css";
import { useSelector } from "react-redux";

const CreateStylist = ({ data }) => {
  const {
    showAddModal,
    handleAddModalClose,
    handleSubmit,
    selectUpdateModel,
    imageSrc,
    setImageSrc,

    name,
    email,
    password,
    address,
    phone,

    setName,
    setEmail,
    setPhone,
    setAddress,
    setPassword,

    nameError,
    addressError,
    phoneError,
    emailError,
    passwordError,

    setNameError,
    setAddressError,
    setPhoneError,
    setEmailError,
    setPasswordError,

    setUploadFileData,
    uploadFileDataError,
    setUploadFileDataError,

    notes,
    setNotes,
    notesError,

    // companyList,
    // company,
    // setCompany,
    // companyError
  } = data;

  const userRole = useSelector((state) => state.getUserInfo);

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
        heading={selectUpdateModel._id ? "Update Stylist" : "Add New Stylist"}
        onClose={handleAddModalClose}
      />
      <ModalForm className={Styles.form} onSubmit={handleSubmit}>
        <InputsSection>
          <InputBox
            className={Styles.input}
            label="Stylist Name"
            icon="stylist"
            placeholder="eg, BookB Salon-Stylist"
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
            {/* <SelectBox
							value={company}
							onChange={(e) => setCompany(e.target.value)}
							errorMessage={companyError}
							label='Select Company'
							icon='archive'
							name='company-name'>
							<option className='optionBox' value=''>
								Select Company
							</option>
							{companyList &&
								companyList.categories &&
								companyList.categories.data &&
								companyList.categories.data.result &&
								companyList.categories.data.result.map((company) => (
									<option value={company._id} key={company._id}>
										{company.name}
									</option>
								))}
						</SelectBox> */}
            {!selectUpdateModel._id && (
              <InputBox
                className={Styles.input}
                label="Password"
                icon="key"
                placeholder="••••••••••••••"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                errorMessage={passwordError}
              />
            )}
            <TextareaBox
              // style={{ backgroundColor: 'transparent', border: '1px solid #585858' }}
              className={Styles.textArea}
              label="Address"
              icon="pin"
              placeholder="Enter Address"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setAddressError("");
              }}
              errorMessage={addressError}
            />
            {/* {userRole?.userInfo?.data.role === 'salon' && (
							< TextareaBox
								label="Notes"
								style={{ height: '8rem', backgroundColor: "#353434b5", marginTop: "0rem" }}
								onChange={(e) => setNotes(e.target.value)}
								value={notes}
								errorMessage={notesError}
								placeholder='notes..'
							/>
						)} */}
          </div>
        </InputsSectionColumn>

        <FileUpload
          className={Styles.fileUpload}
          label="Upload Stylist Photo"
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
          label={selectUpdateModel._id ? "Update Stylist" : "Add New"}
          icon={selectUpdateModel._id ? "edit" : "plus"}
          onClick={handleSubmit}
        />
      </ModalForm>
    </Modal>
  );
};

export default CreateStylist;
