import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputSections from '../../components/NewModal/InputSections';
import InputBox from '../../components/NewInputBox';
import ModalButton from '../../components/NewModal/ModalButton';
import RadioButtons from '../../components/NewRadioButton/RadioButtons';
import Styles from './Products.module.css'


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
			<ModalForm onSubmit={handleSubmit} >
				<InputsSection>
					<InputBox style={{ marginTop: "2rem" }}
						className={Styles.input}
						label='Quantity'
						icon='film'
						placeholder='eg, 10'
						value={quantity.value}
						onChange={(e) => setQuantity({ value: e.target.value })}
						errorMessage={quantity.error}
					/>
					{/* <RadioButtons style={{ marginTop: "3rem" }}
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
					/> */}

				</InputsSection>

				<ModalButton label={productId ? 'Add Stock' : 'Add Stock'} icon={productId ? 'plus' : 'plus'} onClick={handleSubmit} />

			</ModalForm>
		</Modal>
	);
};

export default AddStockProduct;
