import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content/Content';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination';
import { changeOrderStatusAction, getProductOrderHistoryAction } from '../../redux/actions/productActions';
import OrderData from './OrderData';
import formStyle from './orders.module.css';
import ProductSummary from './ProductSummary';
import { CHANGE_ORDER_STATUS_RESET, GET_PRODUCT_ORDER_RESET } from '../../redux/constants/productConstants';
import NoData from '../../website/components/NoData';

const OrderHistoryScreen = ({ showFilter = false, history }) => {
	const dispatch = useDispatch();
	const userInfo = useSelector((state) => state.userLogin);
	const getUserInfo = useSelector((state) => state.getUserInfo);

	const orderList = useSelector((state) => state.orderList);
	const changeOrderStatus = useSelector((state) => state.changeOrderStatus);
	const [productSummaryList, setProductSummaryList] = useState({});
	const [modalSummaryState, setModalSummaryState] = useState(false);
	const [status, setStatus] = useState({ value: '', error: '' });

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 16;
	const [search, setSearch] = useState('');
	const statusList = [
		{
			_id: 1,
			name: 'Pending',
			value: 'Pending'
		},
		{
			_id: 2,
			name: 'Completed',
			value: 'Completed'
		}
	];

	useEffect(
		() => {
			if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' || getUserInfo.userInfo.data.role === 'superadmin')
			) {
				dispatch(getProductOrderHistoryAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));

				return () => {
					dispatch({ type: GET_PRODUCT_ORDER_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch, history, pageNumber]
	);

	useEffect(
		() => {
			if (
				orderList &&
				orderList.categories &&
				orderList.categories.status &&
				orderList.categories.data.result.length > 0
			) {
				setTotalPageSize(orderList.categories.data.totalPageSize);
			}
		},
		[orderList]
	);

	useEffect(
		() => {
			if (changeOrderStatus && changeOrderStatus.categories && changeOrderStatus.categories.status) {
				toast.success(changeOrderStatus.categories.message);
				dispatch({ type: CHANGE_ORDER_STATUS_RESET });
			} else if (changeOrderStatus && changeOrderStatus.categories && !changeOrderStatus.categories.status) {
				toast.error(changeOrderStatus.categories.message);
				dispatch({ type: CHANGE_ORDER_STATUS_RESET });
			}
		},
		// eslint-disable-next-line
		[changeOrderStatus, dispatch]
	);

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getProductOrderHistoryAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getProductOrderHistoryAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	const onSummaryModalClose = () => {
		setModalSummaryState(false);
	};

	const onChangeHandler = (res, status) => {
		dispatch(changeOrderStatusAction(res._id, status));
	};

	return (
		<Content
			currentMenu='products'
			headerTitle='Orders'
			addBtn={false}
			addBtnText='Add New Order'
			addBtnIcon='plus'
			addBtnClick={() => { }}
			search={true}
			searchPlaceholder='Search Orders...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}>
			{orderList.loading ? (
				<Spinner />
			) : orderList &&
				orderList.categories &&
				orderList.categories.status &&
				orderList.categories.data.result &&
				orderList.categories.data.result.length > 0 ? (
				<div>
					<OrderData
						data={orderList.categories.data.result}
						showFilter={showFilter}
						statusList={statusList}
						setProductSummaryList={setProductSummaryList}
						setModalSummaryState={setModalSummaryState}
						onChangeHandler={onChangeHandler}
						setStatus={setStatus}
					/>
					{totalPageSize > 1 && (
						<div className='tableContainer--paginater'>
							<Pagination
								list={orderList.categories}
								onPageChange={handlePageChange}
								rowsPerPage={pageLimit}
								totalPageSize={totalPageSize}
								pageNumber={pageNumber}
							/>
						</div>
					)}
				</div>
			) : (
				<NoData
					title='No Data Found!'
					subTitle='We could not find any order data.'
					height='40vh'
				/>
			)}

			<ProductSummary data={{ modalSummaryState, onSummaryModalClose, productSummaryList }} />
		</Content>
	);
};

export default OrderHistoryScreen;
