import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import Spinner from '../../components/Spinner/Spinner';
import { getOneProductAction } from '../../redux/actions/productActions';
import ProductDetailStyle from './ProductDetails.module.css';
import { GET_ONE_PRODUCT_RESET } from '../../redux/constants/productConstants';

const ProductDetailModal = ({ data }) => {
	const { productId, modalProductDetailState, onProductDetailModalClose } = data;

	const dispatch = useDispatch();

	const getOneProduct = useSelector((state) => state.getOneProduct);
	const userData = useSelector((state) => state.getUserInfo);

	useEffect(
		() => {
			if (productId) dispatch(getOneProductAction(productId));

			return () => {
				dispatch({ type: GET_ONE_PRODUCT_RESET });
			};
		},
		[productId, dispatch]
	);

	return (
		<Modal show={modalProductDetailState}>
			<ModalHeading heading='Product Details' onClose={onProductDetailModalClose} />
			<ModalForm>
				{getOneProduct && getOneProduct.loading ? (
					<Spinner />
				) : (
					getOneProduct &&
					getOneProduct.product &&
					getOneProduct.product.data &&
					getOneProduct.product.data.result && (
						<div className={ProductDetailStyle.productDetails}>
							<div className={ProductDetailStyle.productDetails}>
								<div className={ProductDetailStyle.product_detail_screen_main_right}>
									<img
										src={getOneProduct.product.data.result.productImageURL}
										className={ProductDetailStyle.product_detail_screen_main_image}
									/>
								</div>
								<div className={ProductDetailStyle.product_detail_screen_main_left}>
									<h1 className={ProductDetailStyle.productTitle}>{getOneProduct.product.data.result.productName}</h1>

									<h1 className={ProductDetailStyle.productDots}>
										<span>&#8226;</span> <span>&#8226;</span> <span>&#8226;</span> <span>&#8226;</span>
									</h1>

									<div className={ProductDetailStyle.productPriceQuantity}>
										<h3 className={ProductDetailStyle.productPrice}>
											{userData &&
												userData?.userInfo &&
												userData?.userInfo?.data &&
												userData?.userInfo?.data?.currency
											} {getOneProduct.product.data.result.productPrice}
										</h3>
										<p className={ProductDetailStyle.productQuantity}>
											({getOneProduct.product.data.result.quantity} / {getOneProduct.product.data.result.stock})
										</p>
									</div>

									<p className={ProductDetailStyle.productDesc}>
										{getOneProduct.product.data.result.productDescription}
									</p>

									<p className={ProductDetailStyle.productCategory}>
										<span>Category:</span>
										<svg className={ProductDetailStyle.productCategoryIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-archive`} />
										</svg>
										{getOneProduct.product.data.result.category.categoryName}
									</p>
								</div>
							</div>
						</div>
					)
				)}
			</ModalForm>
		</Modal>
	);
};

export default ProductDetailModal;
