import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputBox from '../../components/NewInputBox/index';
import ModalButton from '../../components/NewModal/ModalButton';
import Styles from './NewProductsCategoriesScreen.module.css'

const ProductsCategories = ({ data }) => {
	const { addModalActive, handleAddModalClose, categoryName, setCategoryName, selectedCategory, handleSubmit } = data;
	const createProductCategory = useSelector((state) => state.createProductCategory);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading={selectedCategory._id ? 'Update Product Category' : 'Create New Product Category'} onClose={handleAddModalClose} />

			<ModalForm onSubmit={handleSubmit} >
				<InputsSection>
					<InputBox
						className={Styles.input}
						label='Catgory Name'
						icon='archive'
						placeholder='eg, Shampoo '
						value={categoryName.value}
						onChange={(e) => setCategoryName({ value: e.target.value })}
						errorMessage={categoryName.error}
					/>
				</InputsSection>

				{createProductCategory && createProductCategory.loading ? (
					<ModalButton label={'Please wait'} icon={'plus'} />
				) : (
					<ModalButton label={selectedCategory._id ? 'Update Category' : 'Add New'} icon={selectedCategory._id ? 'edit' : 'plus'} onClick={handleSubmit} />
				)}
			</ModalForm>
		</Modal>
	);
};

export default ProductsCategories;
