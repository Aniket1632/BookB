import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import { getAllProductsAction, getEnabledCategoryAction, addToCartAction, addProductsAction } from '../../redux/actions/productActions';
import Content from '../components/WebsiteContent/Content';
import Products from './Products';
import './ProductsList.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';
import { getWebsiteSettingAction, getWebsiteSettingActionById } from '../../redux/actions/websiteSettingAction';
import { useParams } from 'react-router-dom';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';

const ProductsList = () => {
	const dispatch = useDispatch();
	const { salonId } = useParams();
	const getAllProducts = useSelector((state) => state.getAllProducts);
	const getEnabledCategory = useSelector((state) => state.getEnabledCategory);
	const cartProducts = useSelector((state) => state.cartProducts.cart);
	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const [color,setColor] = useState("")
	
	useEffect(()=>{
		if(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status){
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
			}
	},[])

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 9;
	const userData = useSelector((state) => state.getUserInfo);

	const [categoryList, setCategoryList] = useState([])


	const [price, setPrice] = useState({
		min: 10,
		max: 10000,
	})


	useEffect(() => {
		if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
			dispatch(getWebsiteSettingActionById(salonId));
		}

		// return () => {
		// 	dispatch({ type: GET_WEBSITE_SETTING_RESET })
		// }
	}, [dispatch])


	useEffect(() => {
		const formData = {
			pageNumber: pageNumber,
			pageSize: pageLimit,
			filter: categoryList.map((el) => { return el.checked ? el.categoryName : false; }),
			minPrice: price.min,
			maxPrice: price.max,
			name: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name
		}
		dispatch(getAllProductsAction(formData))
	}, [categoryList, price, dispatch])


	useEffect(() => {
		const formData = {
			pageNumber: pageNumber,
			pageSize: pageLimit,
			filter: categoryList.map((el) => { return el.checked ? el.categoryName : false; }),
			minPrice: price.min,
			maxPrice: price.max
		}
		dispatch(getAllProductsAction(formData))
		dispatch(getEnabledCategoryAction())
	}, [dispatch])

	useEffect(() => {
		if (!categoryList.length)
			if (getEnabledCategory &&
				getEnabledCategory.categories &&
				getEnabledCategory.categories.data && getEnabledCategory.categories.data.length > 0) {
				getEnabledCategory.categories.data.map(category => {
					category.checked = false;
				})

				setCategoryList(getEnabledCategory.categories.data)
			}
	}, [getEnabledCategory, categoryList]);

	useEffect(() => {
		if (getAllProducts && getAllProducts.products && getAllProducts.products.data && getAllProducts.products.data.result) {
			dispatch(addProductsAction(getAllProducts.products.data.result))
			localStorage.setItem('products', JSON.stringify(getAllProducts.products.data.result))
			setTotalPageSize(getAllProducts.products.data.totalPageSize);
		}

	}, [getAllProducts])

	const handleCart = (item) => {
		if (item.stock > 0) {
			dispatch(addToCartAction(item._id))
			toast.success('Item Added to Cart')
		} else {
			toast.error("Item is currently Out of Stock, please check-in later. ")
		}
	}

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllProductsAction({
			pageNumber: selectedPage + 1,
			pageSize: pageLimit,
			filter: categoryList.map((el) => { return el.checked ? el.categoryName : false; }),
			minPrice: price.min,
			maxPrice: price.max
		}));
		setPageNumber(selectedPage + 1);
	};

	const onCheckBoxChange = (item) => {
		let newFormValues = [...categoryList];
		item.checked = !item.checked;
		setCategoryList([...newFormValues]);
	}
	return (
		<Content getPublicWebsite={getPublicWebsite}>
			<SubHeadingContent
				title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
				subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
				style={{backgroundColor:color}}
			/>
			<div className='product-category'>
				{
					categoryList &&
					categoryList.length > 0 &&
					categoryList.map((item, index) => {
						return (

							<div className={item.checked ? "product-list-chip-active" : "product-list-chip"} key={index} onClick={() => {
								onCheckBoxChange(item)
							}}>
								{item.categoryName}
							</div>)
					})}
			</div>

			<div className="product_main_container">
				{
					categoryList &&
					categoryList.length > 0 &&
					<div className="product_left_sidebar collection-filter-block">

						<div className="collection-collapse-block">
							<h3 className="collapse-block-title">By Category</h3>
							<div className="collection-collapse-block-content">
								{
									categoryList &&
									categoryList.length > 0 &&
									categoryList.map((item, index) => {
										return (
											<div className="custom-control custom-checkbox collection-filter-checkbox" key={index}>
												<input type="checkbox"
													id={item.categoryName}
													name={item.categoryName}
													checked={item.checked}
													onChange={() => {
														onCheckBoxChange(item)
													}}
													className="custom-control-input" />
												<label className="custom-control-label"
													htmlFor={item.categoryName}>{item.categoryName}</label>
											</div>)
									})}
							</div>
						</div>

						<div className="collection-collapse-block open">
							<h3 className="collapse-block-title">Price ({userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								})</h3>
							<div className="collection-collapse-block-content block-price-content">
								<div className="collection-brand-filter">
									<div className="custom-control custom-checkbox collection-filter-checkbox">
										<InputRange
										
											maxValue={10000}
											minValue={10}
											value={price}
											onChange={value => {
												setPrice(value);
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>}
				<div className="product_right_container">
					<Products data={{ getAllProducts, handleCart, cartProducts, salonName: getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name, getPublicWebsite,color }} />
				</div>
			</div>
			<div className="product_main_container" style={{ justifyContent: 'center' }}>
				{totalPageSize > 1 && (
					<Pagination
						list={getAllProducts.products}
						onPageChange={handlePageChange}
						rowsPerPage={pageLimit}
						totalPageSize={totalPageSize}
						pageNumber={pageNumber}
					/>
				)}
			</div>
		</Content>
	);
};

export default ProductsList;
