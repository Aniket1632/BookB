import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Content from '../components/WebsiteContent/Content'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner/Spinner'
import NoData from '../../website/components/NoData'
import './DiscountsList.css'
import { getAllWebsiteCouponsAction, getWebsiteSettingAction, getWebsiteSettingActionById } from '../../redux/actions/websiteSettingAction'
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent'
import { useParams } from 'react-router-dom'

const DiscountsList = () => {
	const dispatch = useDispatch();
	const { salonId } = useParams()
	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const getAllCoupons = useSelector((state) => state.getAllCoupons);
	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 12; 
	const [color,setColor] = useState("")
	
	useEffect(()=>{
		if(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status){
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
			}
	},[])

	useEffect(() => {
		if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
			dispatch(getWebsiteSettingActionById(salonId));
		}
	}, [dispatch])


	useEffect(() => {
		dispatch(getAllWebsiteCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
	}, [dispatch])


	useEffect(() => {
		if (getAllCoupons && getAllCoupons.data && getAllCoupons.data.status && getAllCoupons.data.data.result.length > 0) {
			setTotalPageSize(getAllCoupons.data.data.totalPageSize);
		}
	}, [getAllCoupons])

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllWebsiteCouponsAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	return (
		<Content getPublicWebsite={getPublicWebsite}>
			<SubHeadingContent
				title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
				subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
				style={{backgroundColor:color}}
			/>

			{getAllCoupons.loading ? (
				<Spinner />
			) : getAllCoupons &&
				getAllCoupons.data &&
				getAllCoupons.data.status &&
				getAllCoupons.data.data.result &&
				getAllCoupons.data.data.result.length > 0 ? (
				<>
					<div className='discount_main_container'>
						{getAllCoupons.data.data.result.map((item, i) => (
							<div className='couponCard' key={i}>
								<h1>{item.title}</h1>
								<p style={{color:color}}>Valid Until: &nbsp;
									{new Date(item.expireDate).toLocaleDateString('en-US', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit'
									})}</p>
								<h4>Code: <span style={{ fontWeight: 'bold' }}>{item.code}</span></h4>
								<h3 style={{ fontWeight: 'bold' }}>{item.description} </h3>  
							</div>
						))}
					</div>

					<div className='discount_main_container' style={{ justifyContent: 'center' }}>
						{totalPageSize > 1 && (
							<div className='tableContainer--paginater'>
								<Pagination
									list={getAllCoupons.data.data.result}
									onPageChange={handlePageChange}
									rowsPerPage={pageLimit}
									totalPageSize={totalPageSize}
									pageNumber={pageNumber}
								/>
							</div>
						)}
					</div>
				</>
			) : (
				<NoData
					title='No Data Found!'
					subTitle='We could not find any coupon data.'
					height='40vh'
				/>
			)}

		</Content>
	)
}

export default DiscountsList