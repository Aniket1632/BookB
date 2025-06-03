import React, { useEffect } from 'react'
import Modal from '../../components/Modal'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import InputsSection from '../../components/Modal/InputsSection';
import InputBox from '../../components/formInputs/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import SelectBox from '../../components/formInputs/SelectBox';
import ModalButton from '../../components/Modal/ModalButton';
import { getAllCouponsAction } from '../../redux/actions/couponBookBActions';
import { GET_ALL_COUPONS_BOOKB_RESET } from '../../redux/constants/couponBookBConstants';

const CreatePromoCode = ({ data }) => {
	const dispatch = useDispatch();
	const {
		promoCode,
		setPromoCode,
		coupon,
		setCoupon,
		createModal,
		setCreateModal,
		handleCreateModal,
		handleCloseModal,
		handleSubmit
	} = data;


	const getAllCoupons = useSelector((state) => state.getAllCouponsBookB);

	return (
		<Modal show={createModal}>
			<ModalHeading heading='Add New Promo Code' onClose={handleCloseModal} />
			<ModalForm style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Promotional Code'
						icon='ticket'
						placeholder='Enter promo code'
						value={promoCode.value}
						onChange={(e) => setPromoCode({ value: e.target.value })}
						errorMessage={promoCode.error}
						style={{ width: '100%' }}
					/>
					<SelectBox 
						value={coupon.value}
						onChange={(e) => setCoupon({ value: e.target.value })}
						errorMessage={coupon.error}
						label='Product Category'
						icon='archive'
						name='product-category'>
						<option className='optionBox' value=''>
							Select Coupon
						</option>
						{
							getAllCoupons &&
							getAllCoupons.data &&
							getAllCoupons.data.status &&
							getAllCoupons.data.data &&
							getAllCoupons.data.data.length > 0 &&
							getAllCoupons.data.data.map((res) => (
								<option value={res.id} key={res.id}>
									{res.name}
								</option>
							))
						}
					</SelectBox>
				</InputsSection>
				<ModalButton label='Add Promo Code' icon='plus' onClick={handleSubmit} />

			</ModalForm>

		</Modal>
	)
}

export default CreatePromoCode