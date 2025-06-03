import React from 'react'
import Modal from '../../components/NewModal'
import InputsSection from '../../components/NewModal/InputsSection'
import ModalForm from '../../components/NewModal/ModalForm'
import ModalHeading from '../../components/NewModal/ModalHeading'
import { inputPhoneMasking } from '../../utils/validators'
import styles from "./Dashboard.css"

const AppointmentDetail = ({ data }) => {
  const {
    handleAppointmentModal,
    handleAppointmentModalClose,
    appointmentModal,
    appointmentInfo
  } = data;

  return (
    <Modal show={appointmentModal}>
      <ModalHeading heading={`Appointment ${appointmentInfo && appointmentInfo.appointmentId}`} onClose={handleAppointmentModalClose} />
      <ModalForm style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: "white", marginLeft: '1rem', marginBottom: '1rem', fontWeight: 500 }}>User Information</h2>
        <InputsSection style={{ padding: '3rem 2rem', justifyContent: 'space-between', color: "white" }}>
          <div>
            <span>Name: {appointmentInfo && appointmentInfo.userName}</span>
          </div>
          <div>
            <span>Email: {appointmentInfo && appointmentInfo.userEmail}</span>
          </div>
          <div>
            <span>Phone: {inputPhoneMasking(appointmentInfo && appointmentInfo?.userData && appointmentInfo.userData.phone)}</span>
          </div>
        </InputsSection>
        <h2 style={{ color: "white", marginLeft: '1rem', marginBottom: '1rem', fontWeight: 500 }}>Stylist Information</h2>
        <InputsSection style={{ padding: '3rem 2rem' }}>
          {/* <img src={appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.photo
								} className='stylist_img'></img> */}
          <div className='stylist_box'>
            <img src={appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.photo
            } className='stylist_img'></img>
            <div className='stylist_text'>
              <span style={{ color: 'white', fontSize: '1.3rem', fontWeight: 500 }}>{appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.name}</span>
             <div style={{display: 'flex', gap: '2rem'}}>
              <p style={{ color: 'white', fontWeight: 500 }}>
                {appointmentInfo &&
                  appointmentInfo.stylistData &&
                  appointmentInfo.stylistData.email}  
                </p>
              <p style={{ color: 'white', fontWeight: 500 }}>
              {inputPhoneMasking(appointmentInfo &&
                  appointmentInfo.stylistData &&
                  appointmentInfo.stylistData.phone
                )} 
                </p>
                </div>
            </div>
          </div>
        </InputsSection>
        <h2 style={{ color: "white", marginLeft: '1rem', marginBottom: '1rem', fontWeight: 500 }}>Appointment Details</h2>
        <InputsSection style={{ padding: '3rem 2rem', color: "white" }}>
          <div>
            <span>Appointment Time: {appointmentInfo && appointmentInfo.timeAsAString}</span>
          </div>
          <div>
            <span>Service: Cut and Shave</span>
          </div>
          <div>
            <span>Category: {appointmentInfo &&
              appointmentInfo.subServiceData &&
              appointmentInfo.subServiceData.title}
            </span>
          </div>
        </InputsSection>

      </ModalForm>
    </Modal>
  )
}

export default AppointmentDetail