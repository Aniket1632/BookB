import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputBox from '../../components/formInputs/InputBox';
import ModalButtons from '../../components/Modal/ModalButton';

const AddPriceModal = ({
	data,
	addPlanModal,
	interval,
	priceValue,
	setPriceValue,
	handleAddPlan,
	handleAddPlanModalClose
}) => {
	return (
		<Modal show={addPlanModal}>
			<ModalHeading heading={`Add ${interval}ly plan for ${data.name}`} onClose={handleAddPlanModalClose} />

			<ModalForm style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label={`${interval === 'month' ? 'Monthly' : 'Yearly'} Price (in $) `}
						placeholder='eg, 25'
						value={priceValue.value}
						onChange={(event) => {
							setPriceValue({ value: event.target.value, error: '' });
						}}
						errorMessage={priceValue.error}
					/>
				</InputsSection>

				<ModalButtons
					label={`Add ${interval}ly plan `}
					onClick={handleAddPlan}
				// cancelButtonLabel='Cancel'
				// onCancel={handleAddPlanModalClose}
				/>
			</ModalForm>
		</Modal>
	);
};

export default AddPriceModal;
