import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import Content from '../../components/Content/Content'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner/Spinner'
import { activateCouponAction, addCouponAction, deleteCouponAction, getAllCouponsAction } from '../../redux/actions/couponBookBActions'
import { ACTIVATE_COUPON_BOOKB_RESET, ADD_COUPON_BOOKB_RESET, DELETE_COUPON_BOOKB_RESET } from '../../redux/constants/couponBookBConstants'
import NoData from '../../website/components/NoData'
import './coupon.css'
import AddCoupon from './Modals/AddCoupon'
import DeleteCouponModal from './Modals/DeleteCouponModal'

const CouponBookB = () => {
    const dispatch = useDispatch();

    const getAllCoupons = useSelector((state) => state.getAllCouponsBookB);
    const addCoupon = useSelector((state) => state.addCouponBookB);
    const deleteCoupon = useSelector((state) => state.deleteCouponBookB);
    const activateCoupon = useSelector((state) => state.activateCouponBookB);

    const [showAddCouponModal, setShowAddCouponModal] = useState(false)
    const [showDeleteCouponModal, setShowDeleteCouponModal] = useState(false);
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const pageLimit = 15;
    const [search, setSearch] = useState('');

    const [addCouponData, setAddCouponData] = useState({
        id: '',
        name: '',
        amount_off: '',
        duration: '',
        currency: 'usd',
        title: '',
        code: ''
        // stateDate: '',
        // endDate: ''
    })

    const [addCouponDataError, setAddCouponDataError] = useState({
        name: '',
        amount_off: '',
        duration: '',
        currency: 'usd',
        title: '',
        code: ''
    })

    useEffect(() => {
        dispatch(getAllCouponsAction())
    }, [dispatch])




    useEffect(() => {
        if (addCoupon && addCoupon.data && addCoupon.data.status) {
            setShowAddCouponModal(false);
            toast.success(addCoupon.data.message)
            clearData();
            // dispatch(getAllCouponsAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }))
            dispatch({ type: ADD_COUPON_BOOKB_RESET });
        } else if (addCoupon && addCoupon.data && !addCoupon.data.status) {
            dispatch({ type: ADD_COUPON_BOOKB_RESET });
            toast.error(addCoupon.data.message);
        }
    }, [addCoupon, pageNumber, pageLimit, dispatch, clearData])

    useEffect(() => {
        if (deleteCoupon && deleteCoupon.data && deleteCoupon.data.status) {
            setShowDeleteCouponModal(false)
            toast.success(deleteCoupon.data.message)
            clearData();
            dispatch({ type: DELETE_COUPON_BOOKB_RESET });
        } else if (deleteCoupon && deleteCoupon.data && !deleteCoupon.data.status) {
            toast.error(deleteCoupon.data.message);
            dispatch({ type: DELETE_COUPON_BOOKB_RESET });
        }
    }, [deleteCoupon, pageNumber, pageLimit, dispatch, clearData])

    useEffect(() => {
        if (activateCoupon && activateCoupon.data && activateCoupon.data.status) {
            toast.success(activateCoupon.data.message)
            clearData();
            dispatch({ type: ACTIVATE_COUPON_BOOKB_RESET });
        } else if (activateCoupon && activateCoupon.data && !activateCoupon.data.status) {
            toast.error(activateCoupon.data.message);
            dispatch({ type: ACTIVATE_COUPON_BOOKB_RESET });
        }
    }, [activateCoupon, pageNumber, pageLimit, dispatch, clearData])

    const closeAddCouponModal = () => {
        setShowAddCouponModal(false)
        clearData();
    }

    const closeDeleteCouponModal = () => {
        setShowDeleteCouponModal(false)
        clearData();
    }

    const handleAddCoupon = (e) => {
        e.preventDefault()
        if (addCouponData.id !== '') {
            if (addCouponData.name === '' || addCouponData.name && addCouponData.name.trim() === '' || addCouponData.name === null) {
                setAddCouponDataError({ ...addCouponDataError, name: 'Please enter coupon name' });
            } else if (addCouponData.name.length > 15) {
                setAddCouponDataError({ ...addCouponDataError, name: 'Coupon name cannot exceed 15 characters' });
            } else {
                let formData = {
                    id: addCouponData.id,
                    name: addCouponData.name,
                }
                dispatch(activateCouponAction(formData))
            }
        } else {

            if (addCouponData.name === '' || addCouponData.name && addCouponData.name.trim() === '' || addCouponData.name === null) {
                setAddCouponDataError({ ...addCouponDataError, name: 'Please enter coupon name' });
            } else if (addCouponData.name.length > 15) {
                setAddCouponDataError({ ...addCouponDataError, name: 'Coupon name cannot exceed 15 characters' });
            } else if (addCouponData.amount_off === '' || addCouponData.amount_off === null) {
                setAddCouponDataError({ ...addCouponDataError, amount_off: 'Please enter a discount' });
            } else if (addCouponData.duration === '' || addCouponData.duration && addCouponData.duration.trim() === '' || addCouponData.duration === null) {
                setAddCouponDataError({ ...addCouponDataError, duration: 'Please enter coupon duration' });
            } else {
                let formData = {
                    name: addCouponData.name,
                    duration: addCouponData.duration,
                    amount_off: addCouponData.amount_off,
                    currency: 'usd'
                }
                dispatch(addCouponAction(formData))
            }

        }
    }

    const onChangeHandler = (id, activation) => {
        let formData = {
            id: id,
            status: {
                active: !activation
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
        dispatch(getAllCouponsAction())
        setShowAddCouponModal(false)
    }


    const handlePageChange = async (currentPage) => {
        const selectedPage = currentPage.selected;
        dispatch(getAllCouponsAction());
        setPageNumber(selectedPage + 1);
    };

    const onSearchHandler = (event) => {
        setSearch(event.target.value);
        if (search.trim() !== '' && search.length > 0) {
            setPageNumber(1);
        }
        dispatch(getAllCouponsAction());
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
                getAllCoupons.data.data &&
                getAllCoupons.data.data.length > 0 ? (
                <div className='main--card__Container'>
                    {getAllCoupons.data.data.map((item, i) => (
                        <div className='single__discountCard' key={i}>
                            <div className='card--coupons'>
                                <h1>{item.name}</h1>
                                <p>Duration: &nbsp;
                                    {item.duration.toUpperCase()}
                                    {/* {new Date(item.expireDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })} */}
                                </p>
                                <h4>Code: <span style={{ fontWeight: 'bold' }}>{item.name}</span></h4>
                            </div>
                            <div className='coupon--card_bottom'>
                                <label className='switch'>
                                    {/* <input
                                        //id={d._id}
                                        checked={item.valid}
                                        onChange={() => { onChangeHandler(item.id, item.valid) }}
                                        type='checkbox'
                                        className='checkbox'
                                        name='active'
                                    />
                                    <span className='slider round' /> */}
                                </label>
                                <div className='coupon--edit_delete'>
                                    <button className='cardCouponIcon__button'
                                        onClick={() => {
                                            setShowAddCouponModal(true)
                                            setAddCouponData({
                                                ...addCouponData,
                                                id: item.id,
                                                name: item.name,
                                                duration: item.duration,
                                                amount_off: item.amount_off,
                                                title: item.name,
                                                code: item.name
                                                // stateDate: item.startDate,
                                                // endDate: item.expireDate
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
                                            setAddCouponData({ ...addCouponData, id: item.id })
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

export default CouponBookB