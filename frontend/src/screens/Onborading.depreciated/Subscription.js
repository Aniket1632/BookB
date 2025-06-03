import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { getEnableSubscriptionAction } from '../../redux/actions/subscriptionAction';
import PackagesStyles from './Packages.module.css';

const Subscription = ({ prevStep, nextStep, subsList, subscriptionData, update, navigateLogin }) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(null);
    const [selectedItem, setSelectedItem] = useState({ index: null, isSelected: false });
    const [error, setError] = useState("");
    const [subData, setSubData] = useState({ ...subscriptionData })
    const [recurringType, setRecurringType] = useState('month');
    const getEnableSubscription = useSelector(state => state.getEnableSubscription);
    // useEffect(() => {
    //     dispatch(getEnableSubscriptionAction(recurringType))
    // }, [recurringType])

        const next = () => {
            if (count === null) {       
                setError("Please select one of the subscription");
                setCount(1);
                return;
            } else {
                update('subscription', subData)
                nextStep();
                setError("");
            }
        }
   


    return (
        <div>
            <div className='payment_btn_list'>
                <div className={count === 1 ? 'payment-container-active' : 'payment-container'} onClick={() => { setCount(1); setRecurringType("month"); } }>
                    <div className='payment-price'>
                        <h3>Monthly</h3>
                    </div>
                </div>
                <div className={count === 2 ? 'payment-container-active' : 'payment-container'} onClick={() => { setCount(2); setRecurringType("year"); }}>
                    <div className='payment-price'>
                        <h3>Yearly</h3>
                    </div>
                </div>
            </div>
        

            <div className='form_container' style={{ margin: '1rem' }}>
                {/* {error && <div className='onboard_error'>
                    <p>{error}</p>
                </div>} */}
                {getEnableSubscription.loading ? (
                    <Spinner />
                ) :
                    <div className='subscription_btn_list' style={{ padding: '5rem 1rem 0rem 0rem' }}>
                        {
                           subsList && subsList.map((item, index) => (
                                <div key={index + 1} className={selectedItem.index === index && subData ? 'sub-container-active' : 'sub-container'}
                                    onClick={() => {
                                        setSubData(item);
                                        // setSelectedIdx(index)
                                        setSelectedItem({ index: index, isSelected: !selectedItem.isSelected });
                                    }}>
                                    <h1 style={{ width: '30rem' }}>
                                        {item.name}
                                        <div className={PackagesStyles.pricing_card_feature}>
                                            <p className={PackagesStyles.pricing_card_feature_text}>{item.description}</p>
                                        </div>
                                    </h1>
                                    {item.metadata &&
                                        item.metadata.users && (
                                            <div className={PackagesStyles.pricing_card_features}>

                                                <div className={PackagesStyles.pricing_card_feature}>
                                                    <div className={PackagesStyles.pricing_card_feature_icon_box}>
                                                        <svg className={PackagesStyles.pricing_card_feature_icon}>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-user`} />
                                                        </svg>
                                                    </div>
                                                    <p className={PackagesStyles.pricing_card_feature_text}>{item.metadata.users} User</p>
                                                </div>
                                                <div className={PackagesStyles.pricing_card_feature}>
                                                    <div className={PackagesStyles.pricing_card_feature_icon_box}>
                                                        <svg className={PackagesStyles.pricing_card_feature_icon}>
                                                            <use xlinkHref={`/assets/sprite.svg#icon-calendar`} />
                                                        </svg>
                                                    </div>
                                                    <p className={PackagesStyles.pricing_card_feature_text}>
                                                        {item.metadata.calendars} Calendar
                                                    </p>
                                                </div>
                                                
                                            </div>

                                        )}

                                    <div className='sub-price'>
                                        <h2>$ {item.plans[0] ? item.plans[0].amount : 'NA'}</h2>
                                    </div>
                                </div>
                            ))
                        }
                        {error && <div className='onboard_error'>
                                                    <p>{error}</p></div>}

                    </div>}

            </div>
            <div className='onboard_down'>
                <p onClick={navigateLogin}>Back to login</p>
                <div className='onboard_button'>
                    <button onClick={prevStep} className='prev'>Previous</button>
                    <button onClick={() => next()} >Next</button>
                </div>
            </div>

        </div>

    )
}

export default Subscription