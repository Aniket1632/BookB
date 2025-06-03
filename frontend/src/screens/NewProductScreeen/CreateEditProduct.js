import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputSections from '../../components/NewModal/InputSections';
import InputBox from '../../components/NewInputBox';
import ModalButton from '../../components/NewModal/ModalButton';
import SelectBox from '../../components/NewSelectBox';
import UploadFile from '../../components/NewModal/UploadFile';
import { getAllProductCategoriesAction } from '../../redux/actions/productActions';
import { getStylistListAction } from '../../redux/actions/stylistActions';
import FileUpload from '../../components/NewFileUpload';
import TextareaBox from '../../components/NewTextareaBox';
import Styles from './Products.module.css'

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
	const userData = useSelector((state) => state.getUserInfo);

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
			<ModalForm className={Styles.form} onSubmit={handleSubmit} >
				<InputsSection>
					<InputBox
						className={Styles.input}
						label='Product Name'
						icon='film'
						placeholder='eg, Shampoo  '
						value={productName.value}
						onChange={(e) => setProductName({ value: e.target.value })}
						errorMessage={productName.error}
					/>
					<TextareaBox
						className={Styles.textArea}
						// style={{ backgroundColor: 'transparent', border: '1px solid #585858' }}
						label='Product Description'
						icon='film'
						placeholder='eg, Product description'
						value={productDesc.value}
						onChange={(e) => setProductDesc({ value: e.target.value })}
						errorMessage={productDesc.error}
					/>
					<SelectBox
						className={Styles.selectBox}
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
						className={Styles.input}
						label='Product Price'
						// icon='rupee'
						currency={  userData && 
							userData?.userInfo &&
							userData?.userInfo?.data &&
							userData?.userInfo?.data?.currency
							}
							placeholder={`eg, ${  userData && 
								userData?.userInfo &&
								userData?.userInfo?.data &&
								userData?.userInfo?.data?.currency
								} 12`}
						value={productPrice.value}
						onChange={(e) => setProductPrice({ value: e.target.value })}
						errorMessage={productPrice.error}
					/>

					<InputBox
						className={Styles.input}
						label='Actual Price'
						currency={  userData && 
							userData?.userInfo &&
							userData?.userInfo?.data &&
							userData?.userInfo?.data?.currency
							}
						placeholder={`eg, ${  userData && 
							userData?.userInfo &&
							userData?.userInfo?.data &&
							userData?.userInfo?.data?.currency
							} 12`}
						value={actualPrice.value}
						onChange={(e) => setActualPrice({ value: e.target.value })}
						errorMessage={actualPrice.error}
					/>
					<SelectBox
						className={Styles.selectBox}
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
					className={Styles.fileUpload}
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
