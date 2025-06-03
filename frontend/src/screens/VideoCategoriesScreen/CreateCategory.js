import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';

const CreateCategory = ({ data }) => {
	const { addModalActive, handleAddModalClose, categoryName, setCategoryName, handleSubmit, selectedCategory } = data;
	const createVideoCategory = useSelector((state) => state.createVideoCategory);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading={selectedCategory._id ? 'Update Video Category' : 'Create New Video Category'} onClose={handleAddModalClose} />

			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Catgory Name'
						icon='archive'
						placeholder='eg, Shampoo '
						value={categoryName.value}
						onChange={(e) => setCategoryName({ value: e.target.value })}
						errorMessage={categoryName.error}
					/>
				</InputsSection>

				{createVideoCategory && createVideoCategory.loading ? (
					<ModalButton label={'Please wait'} icon={'plus'} />
				) : (
					<ModalButton label={selectedCategory._id ? 'Update Category' : 'Add New'} icon={selectedCategory._id ? 'edit' : 'plus'} onClick={handleSubmit} />
				)}
			</ModalForm>
		</Modal>
	);
};

export default CreateCategory;
