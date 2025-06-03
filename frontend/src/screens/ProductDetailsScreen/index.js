import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import ProductDetailStyle from './ProductDetails.module.css';
import ProductsStyle from '../ProductsScreen/Products.module.css';
import { getOneProductAction } from '../../redux/actions/productActions';

const ProductDetailsScreen = ({ match }) => {
	const productId = match.params.id;
	const dispatch = useDispatch();

	const getOneProduct = useSelector((state) => state.getOneProduct);

	// useEffect(
	// 	() => {
	// 		dispatch(getOneProductAction(productId));

	// 		// return () => {
	// 		// 	dispatch({ type: GET_ONE_PRODUCT_RESET });
	// 		// };
	// 	},
	// 	[productId, dispatch]
	// );

	return (
		<Content currentMenu='products' headerTitle='Product Details'>
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
								<img src={getOneProduct.product.data.result.productImageURL} className={ProductDetailStyle.product_detail_screen_main_image} />
							</div>
							<div className={ProductDetailStyle.product_detail_screen_main_left}>
								<h1 style={{ fontWeight: 'bold', fontSize: '3rem' }} className={ProductsStyle.productCardStat}>{getOneProduct.product.data.result.productName}</h1>

								<h1 style={{ fontWeight: 'bold', fontSize: '3rem', marginBottom: '2rem', color: '#fff' }}>   <span>&#8226;</span> <span>&#8226;</span> <span>&#8226;</span> <span>&#8226;</span> </h1>

								<div className={ProductsStyle.productCardStat} style={{ marginBottom: '2rem' }}>
									<h3> $ {getOneProduct.product.data.result.productPrice}</h3>

									<p>({getOneProduct.product.data.result.quantity} / {getOneProduct.product.data.result.stock})</p>
								</div>

								<p style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>	{getOneProduct.product.data.result.productDescription}</p>

								<div style={{ marginBottom: '2rem' }} className={ProductsStyle.productCardStatsCount}>
									<div className={ProductsStyle.productCardStat}>
										<svg className={ProductsStyle.productCardStatIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-archive`} />
										</svg>
										<p>{getOneProduct.product.data.result.category.categoryName}</p>
									</div>
								</div>

								{/* <Button label='Edit Product' icon='edit' /> */}

							</div>
						</div>
					</div>
				)
			)}
		</Content>
	);
};

export default ProductDetailsScreen;
