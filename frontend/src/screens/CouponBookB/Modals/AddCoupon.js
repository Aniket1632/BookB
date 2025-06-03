import React from 'react'
import InputBox from '../../../components/formInputs/InputBox';
import Modal from '../../../components/Modal';
import InputsSection from '../../../components/Modal/InputsSectionColumn';
import ModalButton from '../../../components/Modal/ModalButton';
import ModalForm from '../../../components/Modal/ModalForm';
import ModalHeading from '../../../components/Modal/ModalHeading';
import { numberMasking } from '../../../utils/validators';
import moment from 'moment';
import SelectBox from '../../../components/formInputs/SelectBox';

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
			<ModalForm onSubmit={handleAddCoupon} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Coupon Title'
						icon='title'
						placeholder='$ 10 OFF'
						value={addCouponData.name}
						onChange={(e) => {
							setAddCouponData({ ...addCouponData, name: e.target.value })
							setAddCouponDataError({ ...addCouponDataError, name: '' });
						}}
						errorMessage={addCouponDataError.name}
					/>


				</InputsSection>
				{
					!addCouponData.id &&
					<InputsSection>
						<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
							<InputBox
								label='Discount Amount'
								icon='dollar'
								placeholder='10'
								value={addCouponData.amount_off}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, amount_off: numberMasking(e.target.value) })
									setAddCouponDataError({ ...addCouponDataError, amount_off: '' });
								}}
								errorMessage={addCouponDataError.amount_off}
							/>

							<SelectBox
								value={addCouponData.duration}
								onChange={(e) => {
									setAddCouponData({ ...addCouponData, duration: e.target.value })
									setAddCouponDataError({ ...addCouponDataError, duration: '' });
								}}
								errorMessage={addCouponDataError.duration}
								label='Coupon Duration'
								icon='archive'
								name='product-category'>
								<option className='optionBox' value=''>
									Select Coupon
								</option>
								<option value="once">Once</option>
								<option value="repetative">Repetative</option>
								<option value="forever">Forever</option>
							</SelectBox>
						</div>
					</InputsSection>
				}

				<ModalButton label={addCouponData.id ? 'Edit Coupon' : 'Add Coupon'} icon={addCouponData.id ? 'edit' : 'plus'} onClick={handleAddCoupon} />
			</ModalForm>
		</Modal>
	)
}

export default AddCoupon