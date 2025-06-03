import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Content from '../../components/Content/Content'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner/Spinner'
import { activateCouponAction, addCouponAction, deleteCouponAction, getAllCouponsAction } from '../../redux/actions/couponActions'
import { ACTIVATE_COUPON_RESET, ADD_COUPON_RESET, DELETE_COUPON_RESET } from '../../redux/constants/couponConstants'
import NoData from '../../website/components/NoData'
import './coupon.css'
import AddCoupon from './Modals/AddCoupon'
import DeleteCouponModal from './Modals/DeleteCouponModal'

const Coupon = () => {
    const dispatch = useDispatch();

    const getAllCoupons = useSelector((state) => state.getAllCoupons);
    const addCoupon = useSelector((state) => state.addCoupon);
    const deleteCoupon = useSelector((state) => state.deleteCoupon);
    const activateCoupon = useSelector((state) => state.activateCoupon);

    const [showAddCouponModal, setShowAddCouponModal] = useState(false)
    const [showDeleteCouponModal, setShowDeleteCouponModal] = useState(false);
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const pageLimit = 15;
    const [search, setSearch] = useState('');

    const [addCouponData, setAddCouponData] = useState({
        id: '',
        title: '',
        discount: '',
        code: '',
        stateDate: '',
        endDate: '',
        description: ''
    })

    const [addCouponDataError, setAddCouponDataError] = useState({
        title: '',
        discount: '',
        code: '',
        stateDate: '',
        endDate: '',
        description: ''
    })

    useEffect(() => {
        dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
    }, [dispatch, pageNumber])


    useEffect(() => {
        if (getAllCoupons && getAllCoupons.data && getAllCoupons.data.status && getAllCoupons.data.data.result.length > 0) {
            setTotalPageSize(getAllCoupons.data.totalPageSize);
        }
    }, [getAllCoupons])

    useEffect(() => {
        if (addCoupon && addCoupon.data && addCoupon.data.status) {
            setShowAddCouponModal(false);
            toast.success(addCoupon.data.message)
            clearData();
            dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
            dispatch({ type: ADD_COUPON_RESET });
        } else if (addCoupon && addCoupon.data && !addCoupon.data.status) {
            dispatch({ type: ADD_COUPON_RESET });
            toast.error(addCoupon.data.message);
        }
    }, [addCoupon, pageNumber, pageLimit, dispatch])

    useEffect(() => {
        if (deleteCoupon && deleteCoupon.data && deleteCoupon.data.status) {
            setShowDeleteCouponModal(false)
            toast.success(deleteCoupon.data.message)
            clearData();
            dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
            dispatch({ type: DELETE_COUPON_RESET });
        } else if (deleteCoupon && deleteCoupon.data && !deleteCoupon.data.status) {
            toast.error(deleteCoupon.data.message);
            dispatch({ type: DELETE_COUPON_RESET });
        }
    }, [deleteCoupon, pageNumber, pageLimit, dispatch])

    useEffect(() => {
        if (activateCoupon && activateCoupon.data && activateCoupon.data.status) {
            toast.success(activateCoupon.data.message)
            clearData();
            dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
            dispatch({ type: ACTIVATE_COUPON_RESET });
        } else if (activateCoupon && activateCoupon.data && !activateCoupon.data.status) {
            toast.error(activateCoupon.data.message);
            dispatch({ type: ACTIVATE_COUPON_RESET });
        }
    }, [activateCoupon, pageNumber, pageLimit, dispatch])

    const closeAddCouponModal = () => {
        setShowAddCouponModal(false)
        clearData();
    }

    const closeDeleteCouponModal = () => {
        setShowDeleteCouponModal(false)
        clearData();
    }

    const handleAddCoupon = (e) => {
        e.preventDefault();

        if (addCouponData.title === '' || addCouponData.title && addCouponData.title.trim() === '' || addCouponData.title === null) {
            setAddCouponDataError({ ...addCouponDataError, title: 'Please enter coupon title' });
        } else if (addCouponData.title.length > 15) {
            setAddCouponDataError({ ...addCouponDataError, title: 'Coupon title cannot exceed 15 characters' });
        } else if (addCouponData.discount === '' || addCouponData.discount && addCouponData.discount.trim() === '' || addCouponData.discount === null) {
            setAddCouponDataError({ ...addCouponDataError, discount: 'Please enter a discount' });
        } else if (addCouponData.code === '' || addCouponData.code && addCouponData.code.trim() === '' || addCouponData.code === null) {
            setAddCouponDataError({ ...addCouponDataError, code: 'Please enter coupon code' });
        } else if (addCouponData.code.length > 15) {
            setAddCouponDataError({ ...addCouponDataError, code: 'Coupon code cannot exceed 15 characters' });
        } else if (addCouponData.stateDate === '' || addCouponData.stateDate && addCouponData.stateDate.trim() === '' || addCouponData.stateDate === null) {
            setAddCouponDataError({ ...addCouponDataError, stateDate: 'Please enter a start date' });
        } else if (addCouponData.endDate === '' || addCouponData.endDate && addCouponData.endDate.trim() === '' || addCouponData.endDate === null) {
            setAddCouponDataError({ ...addCouponDataError, endDate: 'Please enter an end date' });
        } else {
            if (addCouponData.id !== '') {
                // Edit Coupon
                let formData = {
                    id: addCouponData.id,
                    title: addCouponData.title,
                    code: addCouponData.code,
                    discount: addCouponData.discount,
                    startDate: addCouponData.stateDate,
                    expireDate: addCouponData.endDate,
                    isExpired: false,
                    description: addCouponData.description
                }
                dispatch(addCouponAction(formData))
            } else {
                let formData = {
                    title: addCouponData.title,
                    code: addCouponData.code,
                    discount: addCouponData.discount,
                    startDate: addCouponData.stateDate,
                    expireDate: addCouponData.endDate,
                    isExpired: false,
                    description: addCouponData.description
                }
                dispatch(addCouponAction(formData))
            }

        }
    }

    const onChangeHandler = (id, activation) => {
        let formData = {
            id: id,
            enableDisable: {
                enable: !activation
            }

        }
        dispatch(activateCouponAction(formData))
    }

    const handleDeleteCoupon = (e) => {
        e.preventDefault();
        dispatch(deleteCouponAction(addCouponData.id))
    }

    const clearData = () => {
        setAddCouponData({
            id: '',
            title: '',
            discount: '',
            code: '',
            stateDate: '',
            endDate: '',
            description: ''
        })
        setAddCouponDataError({
            title: '',
            discount: '',
            code: '',
            stateDate: '',
            endDate: '',
            description: '',
        })
    }


    const handlePageChange = async (currentPage) => {
        const selectedPage = currentPage.selected;
        dispatch(getAllCouponsAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
        setPageNumber(selectedPage + 1);
    };

    const onSearchHandler = (event) => {
        setSearch(event.target.value);
        if (search.trim !== '' && search.length > 0) {
            setPageNumber(1);
        }
        dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
    };

    return (
        <Content currentMenu='coupon' headerTitle='Coupons'
            addBtn={true}
            addBtnText='Add Coupon'
            addBtnIcon='plus'
            addBtnClick={() => { setShowAddCouponModal(true) }}
            search={true}
            searchPlaceholder='Search Coupon...'
            searchIcon='search'
            searchvalue={search}
            searchOnChange={onSearchHandler}


        >

            {getAllCoupons.loading ? (
                <Spinner />
            ) : getAllCoupons &&
                getAllCoupons.data &&
                getAllCoupons.data.status &&
                getAllCoupons.data.data.result &&
                getAllCoupons.data.data.result.length > 0 ? (
                <div className='main--card__Container'>
                    {getAllCoupons.data.data.result.map((item, i) => (
                        <div className='single__discountCard' key={i}>
                            <div className='card--coupons'>
                                <h1>{item.title}</h1>
                                <p>Valid Until: &nbsp;
                                    {/* {item.expireDate} */}
                                    {new Date(item.expireDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}</p>
                                <h4>Code: <span style={{ fontWeight: 'bold' }}>{item.code}</span></h4>
                            </div>
                            <div className='coupon--card_bottom'>
                                <label className='switch'>
                                    <input
                                        //id={d._id}
                                        checked={item.enable}
                                        onChange={() => { onChangeHandler(item._id, item.enable) }}
                                        type='checkbox'
                                        className='checkbox'
                                        name='active'
                                    />
                                    <span className='slider round' />
                                </label>
                                <div className='coupon--edit_delete'>
                                    <button className='cardCouponIcon__button'
                                        onClick={() => {
                                            setShowAddCouponModal(true)
                                            setAddCouponData({
                                                ...addCouponData,
                                                id: item._id,
                                                title: item.title,
                                                discount: item.discount,
                                                code: item.code,
                                                stateDate: item.startDate,
                                                endDate: item.expireDate
                                            })
                                        }}
                                    >
                                        <svg className='edit--coupon_icon'>
                                            <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                                        </svg>
                                        <span>Update Coupon</span>
                                    </button>
                                    <button className='cardCouponIcon__button'
                                        onClick={() => {
                                            setShowDeleteCouponModal(true)
                                            setAddCouponData({ ...addCouponData, id: item._id })
                                        }}
                                    >
                                        <svg className='cardCoupon--icon-red'>
                                            <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
                                        </svg>
                                        <span>Delete Coupon</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {totalPageSize > 1 && (
                        <div className='tableContainer--paginater'>
                            <Pagination
                                list={getAllCoupons.data}
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
                    subTitle='We could not find any coupon data.'
                    height='40vh'
                />
            )}

            <AddCoupon
                data={{ showAddCouponModal, closeAddCouponModal, addCouponData, setAddCouponData, handleAddCoupon, addCouponDataError, setAddCouponDataError }}
            />
            <DeleteCouponModal
                data={{ showDeleteCouponModal, closeDeleteCouponModal, handleDeleteCoupon }}
            />
        </Content>
    )
}

export default Coupon