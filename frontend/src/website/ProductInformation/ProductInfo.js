import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCartAction, adjustQtyCartAction, checkOutAction, getOneProductAction, getSimilarProductAction } from '../../redux/actions/productActions';
import { GET_ONE_PRODUCT_RESET } from '../../redux/constants/productConstants';
import CheckoutButton from '../components/Button/CheckoutButton';
import Content from '../components/WebsiteContent/Content';
import Stars from '../components/Stars/Stars';
import './Productinfo.css'
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';
import QuantityInput from '../components/QuantityInput/QuantityInput';
import { getWebsiteSettingAction, getWebsiteSettingActionById } from '../../redux/actions/websiteSettingAction';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';
import Spinner from '../components/WebsiteSpinner/Spinner';
import NoData from '../components/NoData';

const ProductInfo = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { salonId, id } = useParams();
    const getOneProduct = useSelector((state) => state.getOneProduct);
    const getSimilarProducts = useSelector((state) => state.getSimilarProducts);
    const cartProducts = useSelector((state) => state.cartProducts.cart);
    const [productInfo, setProductInfo] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const [descBox, setDescBox] = useState(1)
    const [discPerc, setDiscPerc] = useState(0)
    const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
    const imageArr = [
        productInfo.productImageURL,
    ]
    const userData = useSelector((state) => state.getUserInfo);
    const [quantity, setQuantity] = useState(1)
    const len = imageArr.length - 1;
    const [color, setColor] = useState("")

    useEffect(() => {
        if (getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status) {
            setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
        }
    }, [])

    useEffect(
        () => {
            dispatch(getOneProductAction(id));
        }, [id, dispatch]);

    useEffect(() => {
        if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
            dispatch(getWebsiteSettingActionById(salonId));
        }

        // return () => {
        //     dispatch({ type: GET_WEBSITE_SETTING_RESET })
        // }
    }, [dispatch])


    useEffect(() => {
        if (getOneProduct && getOneProduct.product && getOneProduct.product.data && getOneProduct.product.data.result) {

            setProductInfo(getOneProduct.product && getOneProduct.product.data && getOneProduct.product.data.result)
            let disc = getOneProduct.product.data.result.actualPrice - getOneProduct.product.data.result.productPrice;
            let percentage = (disc / getOneProduct.product.data.result.actualPrice) * 100;

            setDiscPerc(parseFloat(parseFloat(percentage).toFixed(2)))
            const formData = {
                id: id,
                pageNumber: 1,
                pageSize: 4,
                filter: getOneProduct.product.data.result && getOneProduct.product.data.result.category && getOneProduct.product.data.result.category.categoryName
            }
            dispatch(getSimilarProductAction(formData));

        }
    }, [getOneProduct])

    const handleAddCart = (item) => {
        if (item.stock > 0) {
            dispatch(addToCartAction(item._id))
            dispatch(adjustQtyCartAction(item._id, quantity))
            toast.success('Item Added to Cart')
        } else {
            toast.error("Item is currently Out of Stock, please check-in later. ")
        }
    }

    const stars = [];
    for (let i = 1; i <= productInfo.rating; i++) {
        stars.push(
            <svg className="cart--icon--star" >
                <use xlinkHref="assets/sprite.svg#icon-star-full" />
            </svg>
        );
    }

    useEffect(
        () => {
            return () => {
                dispatch({ type: GET_ONE_PRODUCT_RESET });
            };
        },
        [dispatch]);

    const handleCheckout = (productInfo) => {
        const cart = [{ ...productInfo, quantity: 1 }];
        dispatch(checkOutAction(cart))
        localStorage.setItem('checkout', JSON.stringify(cart))
        history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/checkout`)
    }

    return (
        <>
            <Content getPublicWebsite={getPublicWebsite}>
                <SubHeadingContent
                    title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
                    subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
                    style={{ backgroundColor: color }}
                />
                {getOneProduct.loading ? (
                    <div className="product_main_container" style={{ height: '50rem' }}>
                        <Spinner />
                    </div>
                ) : productInfo ? (
                    <>
                        <div className="product_main_container">
                            <div className='product--navigation'>
                                <svg className="home--icon" onClick={() => history.push('/home-screen')}>
                                    <use xlinkHref="assets/sprite.svg#icon-home2" />
                                </svg>
                                <p >&nbsp;/&nbsp;<span style={{ cursor: 'pointer' }} onClick={() =>
                                    history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/products-list`)
                                }>
                                    Shop</span>&nbsp;/&nbsp;
                                    {productInfo && productInfo.category && productInfo.category.categoryName}&nbsp;/&nbsp;{productInfo.productName}&nbsp;
                                </p>
                            </div>
                        </div>

                        <div className="product_main_container">
                            <div className='image--caraousel'>
                                {imageArr.length > 0 ?
                                    <div className='product--image-circle__container'>
                                        {imageArr.map((url, i) =>
                                            <div className='product__image--circle' onClick={() => setActiveIndex(i)}>
                                                <img className='product--image' src={url} alt={activeIndex + i} />
                                            </div>)}
                                    </div> : null
                                }

                                <div className='image--carousel--container'>
                                    {imageArr.length > 1 ?
                                        <svg className="arrow--icon" onClick={() => setActiveIndex(activeIndex < 1 ? len : activeIndex - 1)}>
                                            <use xlinkHref="assets/sprite.svg#icon-chevron-left" />
                                        </svg> : null}

                                    <div className='product--imageContainer'>
                                        <img className='product--image' src={imageArr[activeIndex]} alt="" />
                                    </div>

                                    {imageArr.length > 1 ?
                                        <svg className="arrow--icon" onClick={() => setActiveIndex(activeIndex === len ? 0 : activeIndex + 1)}>
                                            <use xlinkHref="assets/sprite.svg#icon-chevron-right" />
                                        </svg> : null}
                                </div>
                            </div>

                            <div className='product--InfoContainer'>
                                <p className='product--name'>
                                    {productInfo.productName}
                                </p>
                                <p className='Brand-Name'>Category: {productInfo && productInfo.category && productInfo.category.categoryName}</p>
                                {productInfo.rating > 0 ?
                                    <div className="product--rate">
                                        <Stars rating={productInfo.rating} color={color} />
                                        <p style={{ fontSize: '14px' }}>{productInfo.rating} rating</p>
                                    </div> : null}

                                <div className='price-container'>
                                    <p className='save-percent'>Save {discPerc} %</p>

                                    <p className='striked--price'>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}{productInfo.actualPrice}</p>
                                    <p className='main--price' style={{ color: color }}>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}{productInfo.productPrice}</p>

                                </div>
                                {/* <p className='order--notice' style={{ color: color }} >Order now, your order will dispatch in 24 hours!</p> */}

                                <div className='info--belowButton' style={{ gap: '2rem', marginTop: '1rem' }}>
                                    <QuantityInput
                                        type="text"
                                        placeholder="Quantity"
                                        errorMessage=""
                                        label="Quantity"
                                        style={{}}
                                        disabled={true}
                                        min={0}
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                        stock={productInfo.stock > 0 ? productInfo.stock : 0}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {
                                            quantity <= productInfo.stock ?
                                                <p className='inStock'>InStock</p> :
                                                <p className='outofStock'>Out of Stock !</p>}
                                    </div>
                                </div>

                                <div className='buttonContainer'>
                                    <button disabled={quantity > productInfo.stock ? true : false} className='cart--button' onClick={() => handleAddCart(productInfo)}>ADD TO CART</button>
                                    <button disabled={quantity > productInfo.stock ? true : false} className='cart--checkout__button' style={{ backgroundColor: color }} onClick={() => handleCheckout(productInfo)}>BUY NOW</button>
                                </div>
                                <div className="info--belowButton">
                                    {/* <div className='fast-delivery'>
                                        <svg className="cart--icon" >
                                            <use xlinkHref="assets/sprite.svg#icon-cart2" />
                                        </svg>
                                        <p>Fast delivery</p>
                                    </div> */}
                                    <div className='fast-delivery'>
                                        <svg className="support--icon">
                                            <use xlinkHref="assets/sprite.svg#icon-support" />
                                        </svg>
                                        <p>24x7 support</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="product_main_container">
                            <div className='description--container'>
                                <div className='description--header'>
                                    <p className={descBox === 1 ? 'selected--header' : 'unselected--header'} onClick={() => setDescBox(1)}>Description</p>
                                   
                                    <p className={descBox === 3 ? 'selected--header' : 'unselected--header'} onClick={() => setDescBox(3)}>Review <span style={{ color: 'var(--gold)' }}>({productInfo.rating ? 1 : 0})</span></p>
                                </div>
                                <div className='description--content'>
                                    {descBox === 1 ?
                                        <p className='product--desc'>{productInfo.productDescription}</p>
                                        :
                                        descBox === 2 ?
                                            <ul className='product--specs'>
                                                <li>Looking for the perfect versatile dress for the mid-season weather? We’ve got you covered.</li>
                                                <li>Crafted from 100% cotton and paired with a removable slip, our flowy Tiered Maxi </li>
                                                <li>Dress will have you feeling elegant no matter the event. Dress up with your favourite.</li>
                                                <li>heels and golden jewels in the evening or pair with tan booties at the weekend.</li>
                                            </ul>
                                            :
                                            descBox === 3 &&
                                            <div className='review--container'>
                                                {
                                                    productInfo.rating ? (
                                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'center', fontSize: '14px' }}>
                                                            <Stars rating={productInfo.rating} /> {productInfo.rating} Reviews
                                                        </div>
                                                    ) : (
                                                        <p style={{ fontSize: '14px', marginLeft: '2rem' }}>No Reviews Yet</p>
                                                    )
                                                }
                                            </div>

                                    }
                                </div>
                            </div>
                        </div>

                        <div className="product_main_container">
                            <div style={{ marginBottom: '2rem', width: '100%' }}>
                                {
                                    getSimilarProducts && getSimilarProducts.categories && getSimilarProducts.categories.data
                                        && getSimilarProducts.categories.data.result ?
                                        <p className='recommendation--header'>RELATED PRODUCTS <hr /> </p> : null
                                }

                                <div className='card--slider'>
                                    {getSimilarProducts && getSimilarProducts.categories && getSimilarProducts.categories.data && getSimilarProducts.categories.data.result
                                        && getSimilarProducts.categories.data.result.map((item, i) => (
                                            <div className='productList--card' key={i}>
                                                <div className='list--card--image--container'>
                                                    <img className='recomendation--product--image'
                                                        src={item.productImageURL} onClick={() => history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/product-info/${item._id}`)} />
                                                </div>
                                                <div className='product--card--info__container'>
                                                    <p className='item--name'>{item.productName.length > 10 ? item.productName.slice(0, 22) + '...' : item.productName}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <p style={{ fontSize: '17px', fontWeight: '600', color: 'var(--gold)' }}>${item.productPrice}  <span className="actualPrice">${item.actualPrice}</span></p>
                                                    </div>

                                                    {item.rating > 0 ?
                                                        <div className="product--rate">
                                                            <Stars rating={item.rating} />
                                                            <p style={{ fontSize: '12px' }}>{item.rating} Reviews</p>
                                                        </div> : null}
                                                    <div className='price-button'>
                                                        <CheckoutButton
                                                            label='Add to Cart'
                                                            icon={'shopcart'}
                                                            style={{ padding: '0.5rem', textAlign: 'center', marginTop: '0.8rem' }}
                                                            onClick={() => handleAddCart(item)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <NoData
                        title='No Data Found!'
                        subTitle='We could not find any product data.'
                        height='40vh'
                    />
                )}

            </Content>
        </>
    )
}

export default ProductInfo