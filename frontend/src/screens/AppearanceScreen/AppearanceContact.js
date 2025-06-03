import React from 'react'

const AppearanceContact = ({ data }) => {
    const {
        clickContactText,
        setClickContactText,
        clickContactPara,
        setClickContactPara,
        contactText,
        setContactText,
        contactPara,
        setContactPara,
        handleContactTextClick,
        handleContactParaClick,
        contactTitle,
        contactSubTitle,
        color
    } = data;
    return (
        <>
            <div className="chat_section" id="contactus">
                <div className="appearance_our_services_subheading1">
                    <div className='appearnce-button-container'>
                        <button className='appearance-btn' onClick={() => setClickContactText(!clickContactText)}>
                            <svg className="table__button--icon">
                                <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                            </svg>
                        </button>
                        {clickContactText && <button className='appearance-btn' onClick={() => handleContactTextClick()}>
                            SUBMIT
                        </button>}
                    </div>
                    <h1 contentEditable={clickContactText ? true : false} onInput={(e) => { setContactText(e.target.innerText) }} >
                        {contactTitle ? contactTitle : "Contact Us"}</h1>
                </div>

                <div className="apperance_chat_subheading">
                    <div className='appearnce-button-container'>
                        <button className='appearance-btn' onClick={() => setClickContactPara(!clickContactPara)}>
                            <svg className="table__button--icon">
                                <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                            </svg>
                        </button>
                        {clickContactPara && <button className='appearance-btn' onClick={() => handleContactParaClick()}>
                            SUBMIT
                        </button>}
                    </div>
                    <p style={{color: color ? color : 'black' }} contentEditable={clickContactPara ? true : false} onInput={(e) => { setContactPara(e.target.innerText) }}>{contactSubTitle ? contactSubTitle : "Please leave a message and I will return your call when I am not with a client. Call 'Your Number' for immediate assistance/directions."}</p>
                </div>

            </div>
            <div className='contact-container'>
                <div className='contact_input_container'>
                    <div className='contact_input'>
                        <label>Your Name</label>
                        <input type='text' placeholder='Name'
                        // value={name} onChange={(e) => { setName(e.target.value); setNameError("") }} 
                        ></input>
                        {/* <p className='onboard_error'>{nameError}</p> */}
                    </div>
                    <div className='contact_input'>
                        <label>Your Email</label>
                        <input type='email' placeholder='Email'
                        // value={email} onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                        ></input>
                        {/* <p className='onboard_error'>{emailError}</p> */}
                    </div>
                </div>
                <div className='contact_input_container'>
                    <div className='contact_input'>
                        <label>Your Phone No.</label>
                        <input placeholder='Phone No.'
                        // value={inputPhoneMasking(phone)} onChange={(e) => { setPhone(e.target.value); setPhoneError("") }}
                        ></input>
                        {/* <p className='onboard_error'>{phoneError}</p> */}
                    </div>
                    <div className='contact_input'>
                        <label>Subject</label>
                        <input type='text' placeholder='Subject'
                        //  value={subject} onChange={(e) => { setSubject(e.target.value); setSubjectError("") }}
                        ></input>
                        {/* <p className='onboard_error'>{subjectError}</p> */}
                    </div>
                </div>
                <div className='contact_input_container'>
                    <div className='contact_input'>
                        <label>Your Message</label>
                        <textarea type='text' placeholder='Message'
                        // value={message} onChange={(e) => { setMessage(e.target.value); setMessageError("") }} 
                        />
                        {/* <p className='onboard_error'>{messageError}</p> */}
                    </div>
                </div>
                <div className='contact_button_container'>

                    <button style={{ backgroundColor: color }}>Submit</button>

                </div>
            </div>
        </>
    )
}

export default AppearanceContact