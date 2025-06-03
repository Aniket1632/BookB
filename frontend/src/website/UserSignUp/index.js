import React from 'react'
import Button from '../../components/formInputs/Button'
import "./userSignUp.css"

const UserSignUp = () => {
  return (
    <div className='usersignup-container' style={{ backgroundImage: "url('./assets/39084.png')" }}>
        <div className='userSP_box'>
        <div className='form_container' >
        <div className='form_section' style={{justifyContent:"center"}}>
        <img src="./assets/logo.png" style={{width:"60px"}}/>
        </div>
            <div className='form_section' style={{justifyContent:"center"}}>
            <h1>Set a new password</h1>
            </div>
                <div className='form_section'>
                    <div className='onboard_input'>
                        <label>New Password</label>
                        <input type='text' placeholder='•••••••••••••' 
                        // value={salon.name}
                        // onChange={(e)=>{handleChange('name',e);setNameError("")}}
                        />
                        {/* <p className='onboard_error'>{nameError}</p> */}
                    </div>
                </div>
                <div className='form_section'>
                    <div className='onboard_input'>
                        <label>Re-enter Password</label>
                        <input placeholder='•••••••••••••' 
                        // value={salon.address}
                        // onChange={(e)=>{handleChange('address',e);setAddressError("")}} 
                        />
                        {/* <p className='onboard_error'>{addressError}</p> */}
                    </div>
                </div>
                <Button style={{
								width: '100%',
                                marginTop:'1rem',
								justifyContent: 'center'
							}} 
                            // onClick={handleSubmit} 
                            label='Sign Up' 
                            icon='arrow_right' />
       
        </div>

        </div>
    </div>

  )
}

export default UserSignUp