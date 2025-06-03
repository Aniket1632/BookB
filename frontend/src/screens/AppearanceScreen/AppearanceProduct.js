import React from 'react'
import Stars from '../../website/components/Stars/Stars';

const AppearanceProduct = ({ data }) => {
    const { getAllProducts,
        clickProduct,
        setClickProduct,
        productText,
        setProductText,
        handleProductClick,
        productTitle,
        color
         } = data;


    return (
        <>
       {getAllProducts?.products?.data?.length && <div className="homescreen_products" id="products" style={{backgroundColor:color}}>
            <div className="appearanceCardHeader">
                <div className='appearnce-button-container'>
                    <button className='appearance-btn' onClick={() => setClickProduct(!clickProduct)}>
                        <svg className="table__button--icon">
                            <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                        </svg>
                    </button>
                    {clickProduct && <button className='appearance-btn' onClick={() =>handleProductClick()}>
                        SUBMIT
                    </button>}
                </div>
                <h1 contentEditable={clickProduct ? true : false} onInput={(e) => {setProductText(e.target.innerText) }}>{productTitle}</h1>
            </div>
            <div className='product-container'>
                {getAllProducts && getAllProducts.products && getAllProducts.products.data && getAllProducts.products.data.result &&
                    getAllProducts.products.data.result.slice(0,3).map((res) => (
                        <div className="product_card--layout">
                            <img src={res.productImageURL} alt="product thumb" className="product_card" />
                            <div className="porduct-desc">
                                <h1 className="productCard__title">
                                {res.rating > 0 ?
									<div className="product--rate">
										<Stars rating={res.rating} />
									</div> : null}
                                    <br />
                                    {res.productName.length > 10 ? res.productName.slice(0, 20) : res.productName}
                                    <br />
                                    $ {res.productPrice}
                                </h1>
                            </div>
                        </div>
                    ))}

            </div>
            <div className="all_products">
                <a>
                    <button className="all_products_button">View all</button>
                </a>
            </div>
        </div> }
        </>
    )
}

export default AppearanceProduct