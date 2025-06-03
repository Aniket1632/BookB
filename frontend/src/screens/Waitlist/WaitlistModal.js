import React, { useEffect } from 'react'
import Modal from '../../components/Modal'
import ModalHeading from '../../components/Modal/ModalHeading'
import { appointmentStatusListAction, availabilityAppointmentAction, changeAppointmentAction } from '../../redux/actions/appointmentAction'
import WaitlistTable from './WaitlistTable'

const WaitlistModal = ({ data }) => {

  const { modalWaitlist, WaitlistModalClose, slotId, availabilityAppointment, appointmentStatusList, dispatch,
    setDeleteAptModal, setDate, setStartTime, setService, setName, setEmail, setPhone, setGender,
    setAppointmentId, setIsUpdate, setAddModalActive,
    serviceIds, setServiceIds, setSalon, addAppointment, setRequiredTime, setSlotStatus, changeSlotStatus, setChangeSlotStatus,
    setTimeSlotId
  } = data;

  useEffect(() => {
    if (modalWaitlist === true) {
      dispatch(appointmentStatusListAction())
      dispatch(availabilityAppointmentAction(slotId))
    }
  }, [modalWaitlist])

  useEffect(() => {
    if (addAppointment && addAppointment.session && addAppointment.session.status === true) {
      //dispatch(appointmentStatusListAction())
      dispatch(availabilityAppointmentAction(slotId))
    }
  }, [addAppointment])

  return (
    <>
      <Modal show={modalWaitlist} style={{}}>
        <ModalHeading heading={'Waitlist'} onClose={WaitlistModalClose} />
        <WaitlistTable data={{
          availabilityAppointment, appointmentStatusList, setDeleteAptModal,
          setAppointmentId, setIsUpdate, setAddModalActive, setDate,
          setStartTime, setService, setName, setEmail, setPhone, setGender,
          serviceIds, setServiceIds, setSalon, setRequiredTime, setSlotStatus,
          changeSlotStatus, setChangeSlotStatus, setTimeSlotId
        }} />
      </Modal>
    </>
  )
}

export default WaitlistModal