import React, { useState, useEffect } from 'react';
import { inputPhoneMasking, unMasking, validateEmail, validatePassword, validatePhone } from '../../utils/validators';
import BaseInput from '../../components/BaseInputNew/BaseInput';
import ReactCountryFlag from 'react-country-flag';
import { countryCodeList } from '../../utils/CountryCodesList';

const SalonInfo = ({ nextStep, state, setState, navigateLogin }) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodeList[0]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleCountryCodeSelect = (country) => {
    setSelectedCountry(country);
    setState(prevVal => ({
      ...prevVal,
      step1: {
        ...prevVal.step1,
        countryCode: {
          value: country.dialCode,
          error: ''
        }
      }
    }));
    setDropdownVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCountryList = countryCodeList.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!state.step1.countryCode.value) { 
      setState(prevVal => ({
        ...prevVal,
        step1: {
          ...prevVal.step1,
          countryCode: {
            value: countryCodeList[0].dialCode,
            error: ''
          }
        }
      }));
      setSelectedCountry(countryCodeList[0]); 
    }
  }, []);

  useEffect(() => {
    const currentCountry = countryCodeList.find(country => country.dialCode === state.step1.countryCode.value);
    if (currentCountry) {
      setSelectedCountry(currentCountry);
    }
  }, [state.step1.countryCode.value]);

  const handleNextStep = () => {
    if (state.step1.name.value === '') {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, name: { ...prevVal.step1.name, error: 'Please enter name.' } } }));
    }
    if (state.step1.address.value === '') {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, address: { ...prevVal.step1.address, error: 'Please enter address' } } }));
    }
    if (state.step1.email.value === '') {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, email: { ...prevVal.step1.email, error: 'Please enter email' } } }));
    }
    if (!validateEmail(state.step1.email.value)) {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, email: { ...prevVal.step1.email, error: 'Please enter valid email' } } }));
    }
    if (!validatePhone(unMasking(state.step1.phone.value))) {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, phone: { ...prevVal.step1.phone, error: 'Please enter valid phone no.' } } }));
    }
    if (state.step1.countryCode.value === '') {
      setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, countryCode: { ...prevVal.step1.countryCode, error: 'Please enter country code' } } }));
    }
    if (!validatePassword(state.step1.password.value)) {
      setState(prevVal => ({
        ...prevVal,
        step1: { ...prevVal.step1, password: { ...prevVal.step1.password, error: 'Password should have uppercase, lowercase, symbol and 8 characters long.' } },
      }));
    }
    if (state.step1.password.value !== state.step1.passwordConfirm.value) {
      setState(prevVal => ({
        ...prevVal,
        step1: { ...prevVal.step1, passwordConfirm: { ...prevVal.step1.passwordConfirm, error: 'Password does not match' } },
      }));
    }

    if (
      state.step1.name.value &&
      state.step1.email.value &&
      validateEmail(state.step1.email.value) &&
      state.step1.address.value &&
      state.step1.phone.value &&
      validatePassword(state.step1.password.value) &&
      state.step1.password.value === state.step1.passwordConfirm.value
    ) {
      nextStep();
    }
  };

  return (
    <div className='onboard_form'>
      <div className='onboard_form_input'>
        <div>
          <BaseInput
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem' }}
            style={{ background: 'none' }}
            placeholder={'Enter the name'}
            title={'Salon Name'}
            icon={'icon-new-salon'}
            value={state.step1.name.value}
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, name: { value: e.target.value, error: '' } } }));
            }}
          />
          <p className='onboard_error'>{state.step1.name.error}</p>
        </div>
        <div>
          <BaseInput
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem' }}
            style={{ background: 'none' }}
            placeholder={'Enter the email'}
            title={'Email'}
            icon={'icon-new-email'}
            value={state.step1.email.value}
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, email: { value: e.target.value, error: '' } } }));
            }}
          />
          <p className='onboard_error'>{state.step1.email.error}</p>
        </div>
      </div>
      <div className='onboard_form_input'>
        <div>
          <BaseInput
            style={{ background: 'none' }}
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem', position: 'relative' }}
            placeholder={'Enter the phone no.'}
            title={'Phone'}
            icon={'icon-down'}
            value={state.step1.phone.value}
            onIconClick={handleDropdownToggle} 
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, phone: { value: inputPhoneMasking(e.target.value), error: '' } } }));
            }}
            customIcon={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ReactCountryFlag countryCode={selectedCountry.code} svg style={{ width: '15px', height: '15px' }} />
              </div>
            }
          />
          {isDropdownVisible && (
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={handleSearchChange}

                style={{
                  width: '100%',
                  padding: '1.5rem',
                  color: '#fff', 
                  maxWidth: 200,
                  border: '1px solid #000', 
                  outline: 'none', 
                  backgroundColor: "#3D3D3D",
                  marginLeft: '20px'
                }}
              />
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 20,
                backgroundColor: '#3D3D3D',
                zIndex: 1,
                width: '100%',
                listStyle: 'none',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: 200,
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                {filteredCountryList.map(country => (
                  <li key={country.code} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleCountryCodeSelect(country)}>
                    <ReactCountryFlag countryCode={country.code} svg />
                    <span style={{ marginLeft: 10, color: '#fff' }}>{country.name} ({country.dialCode})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className='onboard_error'>{state.step1.phone.error}</p>
        </div>
        <div>
          <BaseInput
            style={{ background: 'none' }}
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem' }}
            placeholder={'Enter the address'}
            title={'Address'}
            icon={'icon-new-location'}
            value={state.step1.address.value}
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, address: { value: e.target.value, error: '' } } }));
            }}
          />
          <p className='onboard_error'>{state.step1.address.error}</p>
        </div>
      </div>
      <div className='onboard_form_input'>
        <div>
          <BaseInput
            style={{ background: 'none' }}
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem' }}
            placeholder={'Enter the password'}
            title={'Password'}
            icon={'icon-new-key'}
            value={state.step1.password.value}
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, password: { value: e.target.value, error: '' } } }));
            }}
            type='password'
          />
          <p className='onboard_error'>{state.step1.password.error}</p>
        </div>
        <div>
          <BaseInput
            style={{ background: 'none' }}
            containerStyle={{ background: '#3D3D3D', borderRadius: '1rem' }}
            placeholder={'Re-enter password'}
            title={'Re-enter password'}
            icon={'icon-new-key'}
            value={state.step1.passwordConfirm.value}
            onChange={e => {
              setState(prevVal => ({ ...prevVal, step1: { ...prevVal.step1, passwordConfirm: { value: e.target.value, error: '' } } }));
            }}
            type='password'
          />
          <p className='onboard_error'>{state.step1.passwordConfirm.error}</p>
        </div>
      </div>
      <div className='onboard_down'>
      <div className='onboard_down1'>
      <span onClick={navigateLogin}>Back to login</span>
        </div>
        <div className='onboard_button'>
          <button onClick={handleNextStep}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default SalonInfo;
