import React, { useState } from 'react'
import InputBox from '../../components/formInputs/InputBox';
import SelectBox from '../../components/formInputs/SelectBox';
import Modal from '../../components/Modal';
import InputsSection from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import { inputPhoneMasking, unMasking, validateEmail, validatePassword } from '../../utils/validators';

const AddStylistModal = ({ props }) => {
    const {
        showAddModal,
        handleAddModalClose,
        data,
        setData
    } = props;

    const [name, setName] = useState();
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [gender, setGender] = useState("");
    const [genderError, setGenderError] = useState("")

    const addStylisthandler = (e) => {
        e.preventDefault();
        let result = data && data.stylist.filter(function (o) { return o.email == email; });
        let resultphone = data && data.stylist.filter(function (o) { return o.phone == unMasking(phone); });
        if (name === "") {
            setNameError("Please enter name")
        } else if (email === "") {
            setEmailError("Please enter email")
        } else if (!validateEmail(email)) {
            setEmailError("Please enter valid email")
        } else if (result.length > 0) {
            setEmailError("A stylist with this email address already exists. Please enter different email address.");
        } else if (phone === "") {
            setPhoneError("Please enter phone no.")
        } else if (resultphone.length > 0) {
            setPhoneError("A stylist with this phone already exists. Please enter different phone number.");
        } else if (gender === "") {
            setGenderError("Please enter gender")
        } else {
            debugger
            let newFormValues = data;
            newFormValues.stylist.push({
                name: name,
                email: email,
                phone: unMasking(phone),
                gender: gender,
            })
            setData({ ...newFormValues });

            setName("");
            setEmail("");
            setPhone("");
            setGender("");

            setNameError("");
            setEmailError("");
            setPhoneError("");
            setGenderError("");
            handleAddModalClose(false);
        }
    }

    return (
        <Modal show={showAddModal}>
            <ModalHeading
                heading={'Add New Stylist'}
                onClose={() => {
                    setName("");
                    setEmail("");
                    setPhone("");
                    setGender("");
                    setPhone("");
                    setNameError("");
                    setEmailError("");
                    setPhoneError("");
                    setGenderError("");
                    handleAddModalClose(false)
                }}
            />
            <ModalForm>
                <InputsSection style={{ display: 'flex', flexDirection: 'row' }}>
                    <InputBox
                        label='Stylist Name'
                        icon='stylist'
                        placeholder='eg, BookB Salon-Stylist'
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setNameError('');
                        }}
                        errorMessage={nameError}
                    />
                    <InputBox
                        label='Email'
                        icon='email'
                        placeholder='eg, johndoe@example.com'
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setEmailError('');
                        }}
                        errorMessage={emailError}
                    />
                </InputsSection>
                <InputsSection style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <InputBox
                        label='Phone'
                        icon='phone'
                        placeholder='eg, 123 456 7890'
                        value={phone}
                        onChange={(event) => {
                            setPhone(inputPhoneMasking(event.target.value));
                            setPhoneError('');
                        }}
                        errorMessage={phoneError}
                    />
                    <SelectBox
                        label='Gender'
                        value={gender}
                        onChange={(event) => {
                            setGender(event.target.value)
                            setGenderError('')
                        }}
                        icon='user'
                        name='Service'
                        errorMessage={genderError}
                    >
                        <option className='optionBox' value="">--Select Gender--</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='other'> Other</option>
                    </SelectBox>
                </InputsSection>

                <ModalButton
                    label={'Add New'}
                    icon={'plus'}
                    onClick={(e) => addStylisthandler(e)}
                />
            </ModalForm>
        </Modal>
    )
}

export default AddStylistModal