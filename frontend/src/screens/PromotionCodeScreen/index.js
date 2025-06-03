import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Content from '../../components/Content'
import Spinner from '../../components/Spinner/Spinner'
import { getAllCouponsAction } from '../../redux/actions/couponBookBActions'
import { activatePromoCodesAction, createNewPromoCodeAction, getAllPromoCodesAction } from '../../redux/actions/PromoCodeAction'
import { GET_ALL_COUPONS_BOOKB_RESET } from '../../redux/constants/couponBookBConstants'
import { ACTIVATE_PROMO_CODES_RESET, ADD_PROMO_CODES_RESET } from '../../redux/constants/promoCodesConstant'
import CreatePromoCode from './CreatePromoCode'
import PromoCodeStyles from './PromoCodes.module.css';

const PromoCodeScreen = () => {
    const dispatch = useDispatch()
    const [promoCodesList, setPromoCodesList] = useState("")
    const [promoCode, setPromoCode] = useState({ value: "", error: '' })
    const [coupon, setCoupon] = useState({ value: "", error: '' })
    const [createModal, setCreateModal] = useState(false);
    const [loading, setLoading] = useState(false)

    const activatePromoCodes = useSelector((state) => state.activatePromoCodes);
    const addPromCodes = useSelector((state) => state.addPromCodes);

    // addPromCodes
    useEffect(() => {
        dispatch(getAllCouponsAction())

        return () => {
            dispatch({ type: GET_ALL_COUPONS_BOOKB_RESET })
        }
    }, [dispatch])


    const handleCreateModal = () => {
        setCreateModal(true)
    }

    useEffect(() => {
        const getCoupons = async () => {
            setLoading(true)
            const data = await dispatch(getAllPromoCodesAction());
            setPromoCodesList(data);
            if (data && data.status) {
                setLoading(false)
            }
        };
        getCoupons();
    }, [activatePromoCodes, addPromCodes])

    const handleCloseModal = () => {
        setCreateModal(false)
    }

    useEffect(() => {
        if (addPromCodes && addPromCodes.data && addPromCodes.data.status) {
            toast.success(addPromCodes.data.message)
            dispatch({ type: ADD_PROMO_CODES_RESET })
            setCreateModal(false)
        } else if (addPromCodes && addPromCodes.data && addPromCodes.data.message) {
            toast.error(addPromCodes && addPromCodes.data && addPromCodes.data.message)
            dispatch({ type: ADD_PROMO_CODES_RESET })
            setCreateModal(false)
        }
    }, [addPromCodes, dispatch])

    useEffect(() => {
        if (activatePromoCodes && activatePromoCodes.data && activatePromoCodes.data.status) {
            toast.success(activatePromoCodes.data.message)
            dispatch({ type: ACTIVATE_PROMO_CODES_RESET })
        } else if (activatePromoCodes && activatePromoCodes.data && activatePromoCodes.data.message) {
            toast.error(activatePromoCodes && activatePromoCodes.data && activatePromoCodes.data.message)
            dispatch({ type: ACTIVATE_PROMO_CODES_RESET })
        }
    }, [activatePromoCodes, dispatch])

    const onChangeHandler = (item) => {
        let status = {
            active: !item.active
        }
        dispatch(activatePromoCodesAction(item.id, status))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (promoCode.value == "") {
            setPromoCode({ value: "", error: 'Please enter promotional code' })
        } else if (promoCode.value.length > 10) {
            setPromoCode({ value: "", error: 'Promotional code cannot exceed 10 characters' })
        } else if (coupon.value == "") {
            setCoupon({ value: "", error: 'Please select coupon' })
        } else {
            let formData = {
                "code": promoCode.value,
                "coupon": coupon.value
            }

            dispatch(createNewPromoCodeAction(formData))
        }

    }
    return (
        <Content currentMenu='promo-code' headerTitle='Promotional Codes'
            addBtn={true}
            addBtnText='New Promo-Code'
            addBtnIcon='plus'
            addBtnClick={handleCreateModal}
        >

            <div className='main--card__Container'>
                {loading ? <Spinner /> :
                    promoCodesList && promoCodesList.data && promoCodesList.data.promotionCodes && promoCodesList.data.promotionCodes.length > 0 &&
                    promoCodesList.data.promotionCodes.map((promoCode, index) => (
                        <div className='single__discountCard' key={index + 1}>
                            <div className='card--coupons' style={{ borderBottom: '1px solid #ccc' }}>
                                <h1>{promoCode.code}</h1>
                                {promoCode.coupon && (
                                    <Fragment>
                                        <h4 className={PromoCodeStyles.promoCodeCard_validity}>Coupon Name: {promoCode.coupon.name}</h4>
                                        <h4 className={PromoCodeStyles.promoCodeCard_validity}>
                                            Duration: {promoCode.coupon.duration}{' '}
                                            {promoCode.coupon.duration === 'repeating' ? (
                                                ' | ' + promoCode.coupon.duration_in_months + ' months'
                                            ) : (
                                                ''
                                            )}
                                        </h4>
                                        <p className={PromoCodeStyles.promoCodeCard_code}>
                                            Discount:{' '}
                                            {promoCode.coupon.percent_off ? (
                                                <span>{promoCode.coupon.percent_off + '%'}</span>
                                            ) : (
                                                <span>{'$' + promoCode.coupon.amount_off}</span>
                                            )}
                                        </p>
                                    </Fragment>
                                )}

                            </div>
                            <div className='coupon--card_bottom' style={{ justifyContent: 'center' }}>
                                <label className='switch'>
                                    <input
                                        checked={promoCode.active}
                                        onChange={() => { onChangeHandler(promoCode) }}
                                        type='checkbox'
                                        className='checkbox'
                                        name='active'
                                    />
                                    <span className='slider round' />
                                </label>

                            </div>
                        </div>
                    ))
                }

            </div>
            <CreatePromoCode
                data={{
                    promoCode,
                    setPromoCode,
                    coupon,
                    setCoupon,
                    createModal,
                    setCreateModal,
                    handleCreateModal,
                    handleCloseModal,
                    handleSubmit
                }}
            />
        </Content>
    )
}

export default PromoCodeScreen