import React, { useState } from 'react';
import InputBox from '../../components/formInputs/InputBox';
import SelectBox from '../../components/formInputs/SelectBox';
import Modal from '../../components/Modal';
import InputsSection from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import { inputPhoneMasking, unMasking, validateEmail, validatePassword } from '../../utils/validators';

const AddAdminModal = ({ props }) => {
  const { showAdminAddModal, handleAdminAddModalClose, state, setState } = props;

  const [name, setName] = useState();
  const [nameError, setNameError] = useState('');
  const [multiRole, setMultiRole] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState('');

  const addStylisthandler = e => {
    e.preventDefault();
    let result = state.step3.admin.filter(function (o) {
      return o.email == email;
    });
    let resultphone = state.step3.admin.filter(function (o) {
      return o.phone == unMasking(phone);
    });
    if (name === '') {
      setNameError('Please enter name');
    } else if (email === '') {
      setEmailError('Please enter email');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter valid email');
    } else if (result.length > 0) {
      setEmailError('A stylist with this email address already exists. Please enter different email address.');
    } else if (phone === '') {
      setPhoneError('Please enter phone no.');
    } else if (resultphone.length > 0) {
      setPhoneError('A stylist with this phone already exists. Please enter different phone number.');
    } else if (gender === '') {
      setGenderError('Please enter gender');
    } else {
      const admin =  state?.step3?.admin;
      admin.push({
        name: name,
        email: email,
        phone: unMasking(phone),
        gender: gender,
        multiRole: multiRole
      });
      setState(prevVal => ({
        ...prevVal,
        step3: { ...prevVal.step3, admin: admin },
      }));
      handleClearState();
    }
  };

  const handleClearState = () => {
    setName('');
    setEmail('');
    setPhone('');
    setGender('');

    setNameError('');
    setEmailError('');
    setPhoneError('');
    setGenderError('');
    handleAdminAddModalClose(false);
  };

  return (
    <Modal show={showAdminAddModal}>
      <ModalHeading heading={'Add New Admin'} onClose={handleClearState} />
      <ModalForm>
        <InputsSection style={{ display: 'flex', flexDirection: 'row' }}>
          <InputBox
            label='Name'
            icon='stylist'
            placeholder='eg, BookB Salon-Stylist'
            value={name}
            onChange={event => {
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
            onChange={event => {
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
            onChange={event => {
              setPhone(inputPhoneMasking(event.target.value));
              setPhoneError('');
            }}
            errorMessage={phoneError}
          />
          <SelectBox 
            label='Gender'
            value={gender}
            onChange={event => {
              setGender(event.target.value);
              setGenderError('');
            }}
            icon='user'
            name='Service'
            errorMessage={genderError}
            style={{marginBottom: "1rem"  }}
          >
            <option className='optionBox' value='' >
              --Select Gender--
            </option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'> Other</option>
          </SelectBox>
        </InputsSection>
        <InputsSection style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{gap: '1rem', display: 'flex'}}>
          <input type='checkbox' onChange={(e) => setMultiRole(e.target.checked)}/>
          <span style={{color: 'white'}}>Also register as stylist</span>
          </div>
        </InputsSection>

        <ModalButton label={'Add New'} icon={'plus'} onClick={e => addStylisthandler(e)} />
      </ModalForm>
    </Modal>
  );
};

export default AddAdminModal;
