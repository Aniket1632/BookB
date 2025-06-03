import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner/Spinner'
import { getOrderHistoryAction } from '../../redux/actions/productActions' 
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent'
import Content from '../components/WebsiteContent/Content'
import moment from 'moment'

const OrderSummary = () => {
    const { salonId, orderId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
    const getOrderHistory = useSelector((state) => state.getOrderHistory);
    const userLogin = useSelector((state) => state.userLogin);
 
    useEffect(
        () => {
            if (userLogin && !userLogin.userInfo) {
                history.push(`/salon/${salonId}/login`);
            }
        },
        [history, userLogin, dispatch]
    );

    useEffect(
        () => {
            dispatch(getOrderHistoryAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
        },
        [dispatch]
    );


    return (
        <Content getPublicWebsite={getPublicWebsite}>
            <SubHeadingContent
                title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
                subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
            />
            <div className='order_history' style={{ height: 'auto' }}>
                <h2 style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => history.push(`/salon/${salonId}/order-history`)}> {`GO BACK`}</h2>
                {getOrderHistory && getOrderHistory.loading ?
                    <div className='shpping--address' style={{ height: '40vh' }}>
                        <Spinner />
                    </div>
                    :
                    getOrderHistory && getOrderHistory.categories && getOrderHistory.categories.data && getOrderHistory.categories.data.result && getOrderHistory.categories.data.result.length > 0 &&
                    getOrderHistory.categories.data.result.filter(item => item._id === orderId).map((data, index) =>
                    (
                        <div className='shpping--address'>
                            <h2>Order Id: {data.orderId}</h2>
                            <div className='shipping_detail' style={{ marginTop: '1rem', justifyContent: 'space-between' }}>
                                <div className='ship1'>
                                    <span className='shipping--header'>Summery</span>
                                    {/* <div className='sub_span'>
                                                <span className='item-name_new1'>Order ID:</span>
                                                <p className='item-name_new1'>853599852255</p>
                                            </div> */}
                                    <div className='sub_span'>
                                        <span className='item-name_new1'>Order Date:</span>
                                        <p className='item-name_new1'>{moment().format("MMM Do YY")}</p>
                                    </div>
                                    <div className='sub_span'>
                                        <span className='item-name_new1'>Order Total:</span>
                                        <p className='item-name_new1'>${data.totalAmount ? data.totalAmount : "NA"}</p>
                                    </div>
                                </div>
                                {/* <div className='ship1'>
                                    <span className='shipping--header'>Shipping Address</span>
                                    <div className='sub_span'>
                                        <span className='item-name_new1'>{data.billingAddress.address ? data.billingAddress.address : "NA"}</span>

                                    </div>
                                    <div className='sub_span'>
                                        <span className='item-name_new1'>{data.billingAddress.state ? data.billingAddress.state : "NA"}</span>

                                    </div>
                                    <div className='sub_span'>
                                        <span className='item-name_new1'>{data.billingAddress.zipcode ? data.billingAddress.zipcode : "NA"}</span>
                                    </div>
                                </div> */}
                            </div>
                            <h2>Product Details</h2>
                            <div>
                                {data.items && data.items.map((item, i) => (
                                    <div className="cart__product-listContainer" key={i + 1}>
                                        <div className='order-image'>
                                            <img src={item.productImageURL} alt='img' />
                                        </div>
                                        <div className='cart--productDetail__container' style={{ gap: '0.2rem', padding: '0' }}>

                                            <div className='cart__product--nameContainer'>
                                                {/* <img className="cart-product_image" src={item.productImageURL} alt={item.productImageKey} /> */}
                                                <p className="item-name_new"> {item.productName}</p>
                                            </div>
                                            <div className='cart__product--countContainer'>
                                                <span className="item-price">{item.quantity}  &#215; ${item.productPrice}</span>
                                                <span className="item-price">$ {item.quantity * item.productPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className='summary-items'>
                                    {/* <div className='summary--content'>
                                    <p>Items ({totalItems})</p>
                                    <p>${markedPrice}</p>
                                </div>
                                <div className='summary--content'>
                                    <p>Discount</p>
                                    <p>-${discountPrice}</p>
                                </div> */}
                                    <div className='summary--content'>
                                        <p>Shipping</p>
                                        <p>Free</p>
                                    </div>
                                </div>
                                <div className='total--price'>
                                    <p>Total</p>
                                    <p>${data.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    )

                    )
                }
            </div>
        </Content>
    )
}

export default OrderSummary