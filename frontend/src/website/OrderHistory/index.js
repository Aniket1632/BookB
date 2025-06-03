import React, { useEffect, useState } from 'react'
import Content from '../components/WebsiteContent/Content';
import { useDispatch, useSelector } from 'react-redux';
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';
import { getWebsiteSettingAction } from '../../redux/actions/websiteSettingAction';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';
import { useHistory, useParams } from 'react-router-dom';
import "./OrderHistory.css"
import Pagination from '../../components/Pagination';
import { getOrderHistoryAction } from '../../redux/actions/productActions';
import Spinner from '../../components/Spinner/Spinner';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { salonId } = useParams()
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
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const pageLimit = 3
    const [color,setColor] = useState("")
	
	useEffect(()=>{
		if(getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.status){
			setColor(getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.bgColor)
			}
	},[])



    useEffect(
        () => {
            dispatch(getOrderHistoryAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
        },
        [dispatch]
    );

    useEffect(() => {
        if (getOrderHistory && getOrderHistory.categories && getOrderHistory.categories.data && getOrderHistory.categories.data.result && getOrderHistory.categories.data.result.length > 0) {
            setTotalPageSize(getOrderHistory.categories.data.totalPageSize)
        }
    }) 
    const handlePageChange = async (currentPage) => {
        const selectedPage = currentPage.selected;
        dispatch(getOrderHistoryAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
        setPageNumber(selectedPage + 1);
    };
    const userData = useSelector((state) => state.getUserInfo);

    return (
        <Content getPublicWebsite={getPublicWebsite}>
            <SubHeadingContent
                title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
                subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
                style={{backgroundColor:color}}
            />
            <div className='order_history'>
                <h1>Order History</h1>
                {
                    getOrderHistory && getOrderHistory.loading ?
                        <div className='shpping--address' style={{ height: '40vh' }}>
                            <Spinner />
                        </div>
                        :
                        getOrderHistory && getOrderHistory.categories && getOrderHistory.categories.data && getOrderHistory.categories.data.result && getOrderHistory.categories.data.result.length > 0 &&
                        getOrderHistory.categories.data.result.map((item, id) => (
                            <div className='order-container' key={id} onClick={() => history.push(`/salon/${salonId}/order-summary/${item._id}`)}>
                                <h2>{item.orderId}</h2>
                                <div className='order-image'>
                                    <img src={item.items && item.items[0] && item.items[0].productImageURL} alt='img' />
                                </div>
                                <h2 className='titleOrder' >{item.items && item.items[0] && item.items[0].productName} + more..</h2>
                                <span style={{color:color}}>{userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}{item.totalAmount.toFixed(2)}</span>
                                <div className={item.orderStatus === "Completed" ? 'order-status-complete' : 'order-status-pending'} style={item.orderStatus === "Pending" && {backgroundColor:color}}>{item.orderStatus}</div>
                            </div>
                        ))
                }


                {totalPageSize > 1 && (
                    <div className='tableContainer--paginater'>
                        <Pagination
                            // list={userList.userInfo}
                            onPageChange={handlePageChange}
                            rowsPerPage={pageLimit}
                            totalPageSize={totalPageSize}
                            pageNumber={pageNumber}
                        />
                    </div>
                )}
            </div>
        </Content>
    )
}

export default OrderHistory