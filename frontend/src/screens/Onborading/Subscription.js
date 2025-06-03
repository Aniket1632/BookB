import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import PackagesStyles from './Packages.module.css';

const Subscription = ({ prevStep, nextStep, recurringType, setRecurringType, state, setState, navigateLogin }) => {
  const getEnableSubscription = useSelector(state => state.getEnableSubscription);

  const next = () => {
    if (!(state.step2.selectedPackage.value && state.step2.selectedPackage.value.id)) {
      setState(prevVal => ({
        ...prevVal,
        step2: { ...prevVal.step2, selectedPackage: { ...prevVal.step2.selectedPackage, error: 'Please select one of the subscription.' } },
      }));
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <div className='payment_btn_list'>
        <div
          className={recurringType === 'month' ? 'payment-container-active' : 'payment-container'}
          onClick={() => {
            setRecurringType('month');
          }}
        >
          <div className='payment-price'>
            <h3>Monthly</h3>
          </div>
        </div>
        <div
          className={recurringType === 'year' ? 'payment-container-active' : 'payment-container'}
          onClick={() => {
            setRecurringType('year');
          }}
        >
          <div className='payment-price'>
            <h3>Yearly</h3>
          </div>
        </div>
      </div>

      <div className='form_container' style={{ margin: '1rem' }}>
        {getEnableSubscription.loading ? (
          <Spinner />
        ) : (
          <div className='subscription_btn_list' style={{ padding: '1rem 1rem 0rem 0rem' }}>
            {getEnableSubscription &&
              getEnableSubscription.data &&
              getEnableSubscription.data.data &&
              getEnableSubscription.data.data.map(item => (
                <div
                  key={item.id}
                  className={state.step2.selectedPackage.value.id === item.id ? 'sub-container-active' : 'sub-container'}
                  onClick={() => {
                    setState(prevVal => ({ ...prevVal, step2: { ...prevVal.step2, selectedPackage: { value: item, error: '' } } }));
                  }}
                >
                  <h1 style={{ width: '30rem' }}>
                    {item.name}
                    <div className={PackagesStyles.pricing_card_feature}>
                      <p className={PackagesStyles.pricing_card_feature_text}>{item.description}</p>
                    </div>
                  </h1>
                  {item.metadata && item.metadata.users && (
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
                        <p className={PackagesStyles.pricing_card_feature_text}>{item.metadata.calendars} Calendar</p>
                      </div>
                    </div>
                  )}

                  <div className='sub-price'>
                    <h2>$ {item.plans[0] ? item.plans[0].amount : 'NA'}</h2>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
        {state.step2.selectedPackage.error && (
          <div className='onboard_error'>
            <p>{state.step2.selectedPackage.error}</p>
          </div>
        )}
      <div className='onboard_down'>
        <p onClick={navigateLogin}>Back to login</p>
        <div className='onboard_button'>
          <button onClick={prevStep} className='prev'>
            Previous
          </button>
          <button onClick={() => next()}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
