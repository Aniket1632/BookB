import React from 'react'
import Modal from '../../components/Modal'
import InputsSection from '../../components/Modal/InputsSection'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import { inputPhoneMasking } from '../../utils/validators'

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
        <h2>User Information</h2>
        <InputsSection style={{ padding: '3rem 2rem', justifyContent: 'space-between' }}>
          <div>
            <span>Name: {appointmentInfo && appointmentInfo.userName}</span>
          </div>
          <div>
            <span>Email: {appointmentInfo && appointmentInfo.userEmail}</span>
          </div>
          <div>
            <span>Phone: {inputPhoneMasking(appointmentInfo && appointmentInfo.userMobile)}</span>
          </div>
        </InputsSection>
        <h2>Stylist Information</h2>
        <InputsSection style={{ padding: '3rem 2rem' }}>
          {/* <img src={appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.photo
								} className='stylist_img'></img> */}
          <div className='stylist_box'>
            <img src={appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.photo
            } className='stylist_img'></img>
            <div className='stylist_text'>
              <span style={{ color: '#000' }}>{appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.name}</span>
              <p style={{ color: '#000', fontWeight: 499 }}>{appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.email} | {inputPhoneMasking(appointmentInfo && appointmentInfo.stylistData && appointmentInfo.stylistData.phone)}</p>
            </div>
          </div>
        </InputsSection>
        <h2>Appointment Details</h2>
        <InputsSection style={{ padding: '3rem 2rem' }}>
          <div>
            <span>Appointment Time: {appointmentInfo && appointmentInfo.timeAsAString}</span>
          </div>
          <div>
            <span>Service: Cut and Shave</span>
          </div>
          <div>
            <span>Subservice: {appointmentInfo && appointmentInfo.subServiceData && appointmentInfo.subServiceData.title}</span>
          </div>
        </InputsSection>

      </ModalForm>
    </Modal>
  )
}

export default AppointmentDetail