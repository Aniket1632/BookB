import React, { useState } from 'react'
import { inputPhoneMasking, validateEmail, validatePassword, validatePhone } from '../../utils/validators'
import Styles from './onboarding.css'
import BaseInput from '../../components/BaseInput/BaseInput';


const SalonInfo = ({ nextStep, data, update, navigateLogin }) => {
    const [salon, setSalon] = useState({ ...data });
    const [nameError, setNameError] = useState(" ");
    const [emailError, setEmailError] = useState(" ");
    const [phoneError, setPhoneError] = useState(" ");
    const [addressError, setAddressError] = useState(" ");
    const [passwordError, setPasswordError] = useState(" ");
    const [rePassword, setRePassword] = useState("");
    const [rePasswordError, setRePasswordError] = useState(" ");
    const [inputType, setInputType] = useState("password")
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
      };
    
    const handleChange = (input, e) => {
        setSalon({ ...salon, [input]: e.target.value })
    }

    const roleList = [
        {
            _id: 1,
            name: 'Super Admin',
            value: 'superadmin'
        },
        {
            _id: 2,
            name: 'Manager',
            value: 'manager'
        }
    ]

    const next = () => {
        if (salon.name === "") {
            setNameError("Please enter name.")
        }
        if (salon.address === "") {
            setAddressError("Please enter address");
        }
        if (salon.email === "") {
            setEmailError("Please enter email")
        }
        if (!validateEmail(salon.email)) {
            setEmailError("Please enter valid email")
        }
        if (salon.phone === "") {
            setPhoneError("Please enter phone no.")
        }
        if (salon.password === "") {
            setPasswordError("Please enter password")
        }
        if (!validatePassword(salon.password)) {
            setPasswordError("Password should have uppercase, lowercase, symbol and 8 characters long.")
        }
        if (rePassword === "") {
            setRePasswordError("Please re-enter password")
        }
        if (rePassword !== salon.password) {
            setRePasswordError("Password does not match")
        }

        if (salon.name && salon.address && salon.email && validateEmail(salon.email) && salon.phone && salon.password && validatePassword(salon.password) && rePassword && rePassword == salon.password) {
            update('salon', salon);
            nextStep()
        }
    }

    const handlePasswordView = () => {
        if (inputType === 'password') {
            setInputType('text');
        }
        if (inputType === 'text') setInputType('password');
    };
    return (
        <div className='onboard_form'>

            {/* <div className='form_container'>
                <div className='form_section'>
                    <h1>Register Salon</h1>
                </div>
                <div className='form_section'>
                    <div className='onboard_input'>
                        <label>Salon name</label>
                        <input type='text' placeholder='Enter salon name' value={salon.name}
                            onChange={(e) => { handleChange('name', e); setNameError("") }} />
                        <p className='onboard_error'>{nameError}</p>
                    </div>
                    <div className='onboard_input'>
                        <label>Email</label>
                        <input type='email' placeholder='Enter salon email' value={salon.email}
                            onChange={(e) => { handleChange('email', e); setEmailError("") }} />
                        <p className='onboard_error'>{emailError}</p>
                    </div>

                </div>
                <div className='form_section'>
                    <div className='onboard_input'>
                        <label>Phone</label>
                        <input type='phone' placeholder='Enter salon phone no.' value={inputPhoneMasking(salon.phone)}
                            onChange={(e) => { handleChange('phone', e); setPhoneError("") }} />
                        <p className='onboard_error'>{phoneError}</p>
                    </div>
                    <div className='onboard_input'>
                        <label>Address</label>
                        <input placeholder='Enter Address' value={salon.address}
                            onChange={(e) => { handleChange('address', e); setAddressError("") }} />
                        <p className='onboard_error'>{addressError}</p>
                    </div>
                </div>

                <div className='form_section'>
                    <div className='onboard_input'>
                        <label>Password</label>
                        <div className='onboard-password'>
                            <input type={inputType} placeholder='Enter password' value={salon.password}
                                onChange={(e) => { handleChange('password', e); setPasswordError("") }} /> */}
            {/* <svg onClick={handlePasswordView} className='onboard-password-icon' >
                                <use xlinkHref={`/assets/sprite.svg#icon-${inputType === 'text' ? 'visibility_off' : 'visibility'}`} />
                            </svg> */}
            {/* </div> */}

            {/* <p className='onboard_error'>{passwordError}</p>
                    </div>
                    <div className='onboard_input'>
                        <label>Re-enter password</label>

                        <input type='password' placeholder='Re-enter password' value={rePassword}
                            onChange={(e) => { setRePassword(e.target.value); setRePasswordError("") }} />
                        <p className='onboard_error'>{rePasswordError}</p>
                    </div>
                </div> */}
            {/* <div className='form_section'>
                    <div className='onboard_input'>
                        <label>Address</label>
                        <textarea placeholder='Enter Address' value={salon.address}
                        onChange={(e)=>{handleChange('address',e);setAddressError("")}} />
                        <p className='onboard_error'>{addressError}</p>
                    </div>
                </div> */}
            {/* </div> */}
            <div className='onboard_form_input' >
                <div>
                    <BaseInput placeholder={' Enter the name'} title={'Salon Name'} icon={'icon-new-salon'} value={salon.name}
                        onChange={(e) => { handleChange('name', e); setNameError("") }} />
                    <p className='onboard_error'>{nameError}</p>
                </div>
                <div>
                    <BaseInput placeholder={'Enter the email'} title={'Email'} icon={'icon-new-email'} value={salon.email}
                        onChange={(e) => { handleChange('email', e); setEmailError("") }} />
                    <p className='onboard_error'>{emailError}</p>
                </div>
            </div>
            <div className='onboard_form_input' >
                <div>
                    <BaseInput placeholder={'Enter the phone no.'} title={'Phone'} icon={'icon-new-phone'} value={inputPhoneMasking(salon.phone)}
                        onChange={(e) => { handleChange('phone', e); setPhoneError("") }} />
                    <p className='onboard_error'>{phoneError}</p>
                </div>
                <div>
                    <BaseInput placeholder={'Enter the address'} title={'Address'} icon={'icon-new-location'} value={salon.address}
                        onChange={(e) => { handleChange('address', e); setAddressError("") }} />
                    <p className='onboard_error'>{addressError}</p>
                </div>
            </div>
            <div className='onboard_form_input' >
                <div>
                    <BaseInput placeholder={'Enter the password'} title={'Password'} icon={'icon-new-key'} value={salon.password} 
                        onChange={(e) => { handleChange('password', e); setPasswordError("") }} type={showPassword ? 'text' : 'password'}/>
                    <p className='onboard_error'>{passwordError}</p>
                    
                </div>
                <div>
                    <BaseInput placeholder={'Re-enter password'} title={'Re-enter password'} icon={'icon-new-key'}
                        onChange={(e) => { setRePassword(e.target.value); setRePasswordError("") }} type={showPassword ? 'text' : 'password'}/>
                    <p className='onboard_error'>{rePasswordError}</p>
                </div>
            </div>
            <div className='onboard_down'>
                <p onClick={navigateLogin}>Back to login</p>
                <div className='onboard_button'>
                    <button onClick={next}>Next</button>
                </div>
            </div>

        </div>
    )
}

export default SalonInfo