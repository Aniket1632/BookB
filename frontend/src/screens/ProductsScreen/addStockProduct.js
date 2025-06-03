import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputSections from '../../components/Modal/InputSections';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import RadioButtons from '../../components/formInputs/RadioButtons/RadioButtons';

const AddStockProduct = ({ data }) => {
	const {
		productId,

		quantity,
		type,
		setQuantity,
		setStockType,

		handleSubmit,
		addStockModalActive,
		handleAddStockModalClose,

	} = data;

	const onChangeContentType = (e) => {
		setStockType({ value: e.target.value, error: '' });
	};

	return (
		<Modal show={addStockModalActive}>
			<ModalHeading heading={productId && 'Add Product Stock'} onClose={handleAddStockModalClose} />
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Quantity'
						icon='film'
						placeholder='eg, 10'
						value={quantity.value}
						onChange={(e) => setQuantity({ value: e.target.value })}
						errorMessage={quantity.error}
					/>
					<RadioButtons
						label='Type'
						placeholder='Type'
						radioButtons={[
							{
								id: 1,
								label: 'Credit',
								value: 'credit'
							},
							{
								id: 2,
								label: 'Debit',
								value: 'debit'
							}
						]}
						checked={type.value ? type.value : 'credit'}
						onChange={onChangeContentType}
						error={type.error}
					/>

				</InputsSection>

				<ModalButton label={productId ? 'Add Stock' : 'Add Stock'} icon={productId ? 'plus' : 'plus'} onClick={handleSubmit} />

			</ModalForm>
		</Modal>
	);
};

export default AddStockProduct;
