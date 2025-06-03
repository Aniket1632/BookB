import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputSections from '../../components/Modal/InputSections';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import SelectBox from '../../components/formInputs/SelectBox';
import UploadFile from '../../components/Modal/UploadFile';
import { getAllProductCategoriesAction } from '../../redux/actions/productActions';
import { getStylistListAction } from '../../redux/actions/stylistActions';
import FileUpload from '../../components/formInputs/FileUpload';
import TextareaBox from '../../components/formInputs/TextareaBox';

const CreateProduct = ({ data }) => {
	const {
		productId,
		addModalActive,
		handleAddModalClose,
		productName,
		setProductName,
		productDesc,
		setProductDesc,
		productCategory,
		setProductCategory,
		productPoster,
		setProductPoster,
		productPrice,
		setProductPrice,
		actualPrice,
		setActualPrice,
		rating,
		setRating,


		imageSrc,
		setImageSrc,
		handleSubmit
	} = data;

	const dispatch = useDispatch();
	const getAllProductCategories = useSelector((state) => state.getAllProductCategories);

	useEffect(
		() => {
			dispatch(getAllProductCategoriesAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
			dispatch(getStylistListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
		},
		[dispatch]
	);


	const handleChangeImage = (e) => {
		var file = e.target.files[0];
		var reader = new FileReader();
		if (e.target.files[0]) {
			var url = reader.readAsDataURL(file);
			reader.onloadend = () => {
				setImageSrc(reader.result);
			};
		}
	}


	return (
		<Modal show={addModalActive}>
			<ModalHeading heading={productId ? 'Update Product' : 'Add New Product'} onClose={handleAddModalClose} />
			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Product Name'
						icon='film'
						placeholder='eg, Shampoo  '
						value={productName.value}
						onChange={(e) => setProductName({ value: e.target.value })}
						errorMessage={productName.error}
					/>
					<TextareaBox
						label='Product Description'
						icon='film'
						placeholder='eg, Product description'
						value={productDesc.value}
						onChange={(e) => setProductDesc({ value: e.target.value })}
						errorMessage={productDesc.error}
					/>
					<SelectBox
						value={productCategory.value}
						onChange={(e) => setProductCategory({ value: e.target.value })}
						errorMessage={productCategory.error}
						label='Product Category'
						icon='archive'
						name='product-category'>
						<option className='optionBox' value=''>
							Select Category
						</option>
						{getAllProductCategories &&
							getAllProductCategories.categories &&
							getAllProductCategories.categories.data &&
							getAllProductCategories.categories.data.result &&
							getAllProductCategories.categories.data.result.map((res) => (
								<option value={res._id} key={res._id}>
									{res.categoryName}
								</option>
							))}
					</SelectBox>

				</InputsSection>
				<InputsSection>
					<InputBox
						label='Product Price'
						icon='cash'
						placeholder='eg, $ 9999'
						value={productPrice.value}
						onChange={(e) => setProductPrice({ value: e.target.value })}
						errorMessage={productPrice.error}
					/>

					<InputBox
						label='Actual Price'
						icon='cash'
						placeholder='eg, $ 9999'
						value={actualPrice.value}
						onChange={(e) => setActualPrice({ value: e.target.value })}
						errorMessage={actualPrice.error}
					/>
					<SelectBox
						value={rating.value}
						onChange={(e) => setRating({ value: e.target.value })}
						label='Product Rating'
						icon='archive'
						name='product-rating'
						errorMessage={rating.error}>
						<option className='optionBox' value=''>
							Select Rating
						</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</SelectBox>
				</InputsSection>
				<FileUpload
					label='Upload Product Poster'
					icon='upload'
					accept='image/*'
					image={imageSrc}
					onChange={(e) => {
						handleChangeImage(e);
						setProductPoster({ value: e.target.files[0], error: '' });
					}}
					errorMessage={productPoster.error}
				/>
				<ModalButton label={productId ? 'Update Product' : 'Add New'} icon={productId ? 'edit' : 'plus'} onClick={handleSubmit} />

			</ModalForm>
		</Modal>
	);
};

export default CreateProduct;
