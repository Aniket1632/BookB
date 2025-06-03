import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CheckoutButton from '../components/Button/CheckoutButton'
import Spinner from '../../components/Spinner/Spinner';
import Stars from '../components/Stars/Stars';
import NoData from '../components/NoData';
import { useSelector } from 'react-redux';

const Products = ({ data }) => {
	const { getAllProducts, handleCart, cartProducts, getPublicWebsite, color } = data;
	const history = useHistory();
	const userData = useSelector((state) => state.getUserInfo);
	const userIndex = 1;

	return (
		<>
			{getAllProducts && getAllProducts.loading ?
				<Spinner />
				:
				getAllProducts &&
					getAllProducts.products &&
					getAllProducts.products.data &&
					getAllProducts.products.data.result.length > 0 ? (
					getAllProducts.products.data.result.map((item, i) => (
						<div className='productList--card' key={userIndex + i}>
							<div className='list--card--image--container'>
								<img className='list--card--product--image' src={item.productImageURL} alt="" onClick={() => history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/product-info/${item._id}`)} />
							</div>
							<div className='product--card--info__container'>
								<p className='item--name'>{item.productName.length > 10 ? item.productName.slice(0, 22) + '...' : item.productName}</p>
								<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
									<p style={{ fontSize: '17px', fontWeight: '600', color: color ? color : 'var(--gold)' }}>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {item.productPrice.toFixed(2)}  <span className="actualPrice">{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								} {item.actualPrice.toFixed(2)}</span></p>
								</div>

								{item.rating > 0 ?
									<div className="product--rate">
										<Stars rating={item.rating} color={color} />
										<p style={{ fontSize: '12px' }}>{item.rating} Reviews</p>
									</div> : null}
								<div className='price-button'>
									<CheckoutButton
										label='Add to Cart'
										icon={'shopcart'}
										style={{ padding: '0.5rem', textAlign: 'center', marginTop: '0.8rem' }}
										onClick={() => handleCart(item)}
									/>
								</div>
							</div>
						</div>
					))
				) : (
					<NoData
						title='No Data Found!'
						subTitle='We could not find any product data.'
						height='40vh'
					/>
				)}
		</>
	)
};

export default Products;
