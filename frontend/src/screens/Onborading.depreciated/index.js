import React, { useEffect, useState } from 'react'
import ProgressForm from '../../components/ProgressForm'
import BusinessHours from './BusinessHours'
import './onboarding.css'
import Payment from './Payment'
import SalonInfo from './SalonInfo'
import StylistDetails from './StylistDetails'
import { useDispatch, useSelector } from 'react-redux';
import { onBoardNewUserAction } from '../../redux/actions/onboardingActions'
import './onboarding.css';
import imgSrc from '../../components/assets/check.gif'
import Button from '../../components/formInputs/Button'
import { useHistory } from 'react-router-dom'
import AddStylistModal from './AddStylistModal'
import Subscription from './Subscription';
import Spinner from '../../components/Spinner/Spinner'

const OnBoarding = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onBoardComplete = useSelector((state) => state.onBoardComplete);
  const [showAddModal, setShowAddModal] = useState(false)
  const getEnableSubscription = useSelector(state => state.getEnableSubscription);
  const [couponData, setCouponData] = useState({});

  const navigateLogin = () => {
    history.push('/login');
  }

  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    salon: {
      name: '',
      email: '',
      phone: '',
      address: '',
      photo: '',
    },
    stylist: [],
    maxCalendar: 0,
    businessHours: [
      { day: 'Sun', slot: [] },
      { day: 'Mon', slot: [{ startTime: "", endTime: "" }] },
      { day: 'Tue', slot: [] },
      { day: 'Wed', slot: [] },
      { day: 'Thu', slot: [] },
      { day: 'Fri', slot: [] },
      { day: 'Sat', slot: [] },
    ],
    payment: {},
    subscription: {}
  })

  const handleSubmit = () => {
    debugger
    let formData = {
      salon: data.salon,
      stylist: data.stylist,
      maxCalendar: data.subscription && data.subscription.metadata && data.subscription.metadata.calendars,
      businessHours: data.businessHours,
      payment: {
        id: data.payment.id,
        promotion_code: couponData.promotionCode[0].id
      },
      subscription: {
        package: data.subscription && data.subscription.id,
        plan: data.subscription && data.subscription.plans[0].id,
        maxCalendar: data.subscription && data.subscription.metadata && data.subscription.metadata.calendars,
      }
    }
    dispatch(onBoardNewUserAction(formData))
  }

  const updateData = (type, newData) => {
    setData((data) => {
      return { ...data, [type]: newData }
    })
  }

  //to next screen
  const nextStep = () => {
    setStep((count) => count + 1)
  }

  //to previous screen
  const prevStep = () => {
    setStep((count) => count - 1)
  }

  const handleAddModalClose = () => {
    setShowAddModal(false)
  }

  const multiForm = () => {
    switch (step) {
      case 1:
        return (
          <SalonInfo
            update={updateData}
            nextStep={nextStep}
            data={data.salon}
            navigateLogin={navigateLogin}
          />
        )

      // case 2:
      //   return (
      //     <Subscription
      //       prevStep={prevStep}
      //       nextStep={nextStep}
      //       subsList={getEnableSubscription && getEnableSubscription.data && getEnableSubscription.data.data}
      //       subscriptionData={data.subscription}
      //       update={updateData}
      //       navigateLogin={navigateLogin}
      //     />
      //   )
      case 2:
        return (
          <StylistDetails
            nextStep={nextStep}
            prevStep={prevStep}
            stylistData={data.stylist}
            data={data}
            setData={setData}
            setShowAddModal={setShowAddModal}
            subscriptionData={data.subscription}
            navigateLogin={navigateLogin}
          />
        )
      case 3:
        return (
          <BusinessHours
            prevStep={prevStep}
            nextStep={nextStep}
            data={data.businessHours}
            navigateLogin={navigateLogin}
          />
        )
      case 4:
        return (
          <Payment
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            paymentData={data.payment}
            couponData={couponData}
            setCouponData={setCouponData}
            subscriptionData={data.subscription}
            clientData={data}
            navigateLogin={navigateLogin}
          />
        )

      default:
        break
    }
  }


  return (
    <div className='onboarding' style={{ backgroundImage: "url('./assets/39084.png')" }}>
      <div className='onboarding-container' >
        <div className='onboard_img'></div>
        <div className='onboard_container'>
          {onBoardComplete && onBoardComplete.loading ? (
            <Spinner />
          ) : (
            <>
              {
                onBoardComplete && onBoardComplete.data && onBoardComplete.data.status ?
                  <div className='congrats_onboard_container'>
                    <h1>You made it!</h1>
                    <div className='congrats_list'>
                      <div className='congrats_btn_list1'>
                        <div className='sub-container'>
                          <h2>Salon created successfully</h2>
                          <img src={imgSrc} style={{ width: "50px" }} />
                        </div>
                      </div>
                      <div className='congrats_btn_list2'>
                        <div className='sub-container'>
                          <h2>Stylist created successfully</h2>
                          <img src={imgSrc} style={{ width: "50px" }} />
                        </div>
                      </div>

                      <div className='congrats_btn_list3'>
                        <div className='sub-container'>
                          <h2>Payment successfull</h2>
                          <img src={imgSrc} style={{ width: "50px" }} />
                        </div>
                      </div>
                    </div>
                    <Button label='Login' onClick={navigateLogin} icon='arrow_right' />
                  </div>
                  :
                  <><ProgressForm step={step} />
                    {multiForm()}
                  </>
              }
            </>)
          }
        </div>
      </div>
      <AddStylistModal
        props={{
          showAddModal,
          handleAddModalClose,
          stylistData: data.stylist,
          data,
          setData
        }}
      />
    </div>
  )
}

export default OnBoarding