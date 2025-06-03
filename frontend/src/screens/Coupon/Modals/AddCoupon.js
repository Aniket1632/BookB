import React from 'react'
import InputBox from '../../../components/formInputs/InputBox';
import Modal from '../../../components/Modal';
import InputsSection from '../../../components/Modal/InputsSectionColumn';
import ModalButton from '../../../components/Modal/ModalButton';
import ModalForm from '../../../components/Modal/ModalForm';
import ModalHeading from '../../../components/Modal/ModalHeading';
import { numberMasking } from '../../../utils/validators';
import moment from 'moment';
import TextareaBox from '../../../components/formInputs/TextareaBox';
import Styles from '../coupon.css'

const AddCoupon = ({ data }) => {
	const {
		showAddCouponModal,
		closeAddCouponModal,
		handleAddCoupon,
		addCouponData,
		setAddCouponData,
		addCouponDataError,
		setAddCouponDataError
	} = data;

	return (
		<Modal show={showAddCouponModal}>
			<ModalHeading heading={addCouponData.id ? 'Edit Coupon' : 'Add Coupon'} onClose={closeAddCouponModal} />
			<ModalForm className={Styles.form} onSubmit={handleAddCoupon} style={{ marginBottom: '2.5rem' }}>
				<div className='form'>
					<InputsSection>
						<div style={{ display: 'flex', gap: '2rem' }}>
							<InputBox
								label='Coupon Title'
								icon='title'
								placeholder='$ 10 OFF'
								value={addCouponData.title}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, title: e.target.value })
									setAddCouponDataError({ ...addCouponDataError, title: '' });
								}}
								errorMessage={addCouponDataError.title}
							/>

							<TextareaBox style={{ width: "24rem", paddingLeft: "0rem", paddingBottom: "0rem", marginLeft: "0.5rem" }}
								label='description'
								icon='title'
								placeholder='Coupon description'
								value={addCouponData.description}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, description: e.target.value })
									setAddCouponDataError({ ...addCouponDataError, description: '' });
								}}
								errorMessage={addCouponDataError.description}
							/>

						</div>
						<div style={{ display: 'flex', gap: '2rem' }}>
							<InputBox
								label='Discount Amount'
								icon='dollar'
								placeholder='10'
								value={addCouponData.discount}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, discount: numberMasking(e.target.value) })
									setAddCouponDataError({ ...addCouponDataError, discount: '' });
								}}
								errorMessage={addCouponDataError.discount}
							/>
							<InputBox
								label='Coupon Code'
								icon='ticket'
								placeholder='HAPPYEASTER'
								value={addCouponData.code}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, code: e.target.value.toUpperCase() })
									setAddCouponDataError({ ...addCouponDataError, code: '' });
								}}
								errorMessage={addCouponDataError.code}
							/>
						</div>

						<div style={{ display: 'flex', gap: '2rem' }}>
							<InputBox
								type='date'
								label='Valid From'
								icon='calendar'
								placeholder='eg, 123 456 7890'
								value={moment(addCouponData.stateDate).format("YYYY-MM-DD")}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, stateDate: e.target.value })
									setAddCouponDataError({ ...addCouponDataError, stateDate: '' });
								}}
								errorMessage={addCouponDataError.stateDate}
							/>
							<InputBox
								type='date'
								label='Valid Till'
								icon='calendar'
								placeholder='eg, 123 456 7890'
								value={moment(addCouponData.endDate).format("YYYY-MM-DD")}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, endDate: e.target.value })
									setAddCouponDataError({ ...addCouponDataError, endDate: '' })
								}}
								errorMessage={addCouponDataError.endDate}
							/>
						</div>

						{/* <div style={{ display: 'flex', gap: '2rem' }}>

						<TextareaBox
							label='description'
							icon='title'
							placeholder='Coupon description'
							value={addCouponData.description}
							onChange={(e) => {
								setAddCouponData({ ...addCouponData, description: e.target.value })
								setAddCouponDataError({ ...addCouponDataError, description: '' });
							}}
							errorMessage={addCouponDataError.description}
						/>

					</div> */}
					</InputsSection>
				</div>
				<ModalButton label={addCouponData.id ? 'Edit Coupon' : 'Add Coupon'} icon={addCouponData.id ? 'edit' : 'plus'} onClick={handleAddCoupon} />
			</ModalForm>
		</Modal>
	)
}

export default AddCoupon