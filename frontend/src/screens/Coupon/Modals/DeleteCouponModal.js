import React from 'react'
import Modal from '../../../components/Modal';
import ModalButton from '../../../components/Modal/ModalButton';
import ModalForm from '../../../components/Modal/ModalForm';
import ModalHeading from '../../../components/Modal/ModalHeading';

const DeleteCouponModal = ({ data }) => {
  const { showDeleteCouponModal, closeDeleteCouponModal, handleDeleteCoupon } = data;

  return (
    <Modal show={showDeleteCouponModal}>
      <ModalHeading heading='Delete Coupon' onClose={closeDeleteCouponModal} />
      <ModalForm onSubmit={handleDeleteCoupon} style={{ marginBottom: '2.5rem' }}>
        <p className='delete--modal--text'>
          Are you sure you want to delete this coupon?
        </p>
        <ModalButton varient='danger' icon='delete' label='Delete' onClick={handleDeleteCoupon} />
      </ModalForm>
    </Modal>
  )
}

export default DeleteCouponModal