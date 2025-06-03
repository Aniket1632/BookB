import React from 'react'
import Button from '../../components/formInputs/Button'
import './Appearance.css'
import moment from "moment"

const AppearanceAppointment = ({ data }) => {
  const { appointmentModal, setAppointmentModal, getPublicWebsite,
    clickHourText,
    setClickHourText,
    clickHourPara,
    setClickHourPara,
    hourText,
    setHourText,
    hourPara,
    setHourPara,
    handleHourTextClick,
    handleHourParaClick,
    hourTitle,
    hourSubTitle,
    color,
    phone } = data;
  return (
    <div className="appearance_working_time" id="hoursOfOperation">
      <div className='appearnce-button-container'>

      </div>
      <div className="appperance_working_time_left" style={{backgroundColor:color,}}>
        <div className='appearnce-button-container'>
          <button className='appearance-btn' onClick={() => { setAppointmentModal(!appointmentModal) }}>
            <svg className="table__button--icon">
              <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
            </svg>
          </button>

        </div>
        <h1 className="working_time_heading">WORKING HOURS</h1>
        <p className="our_services_subheading1">The hours and days we can serve you</p>
        <br />
        <br />
        {
          getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.workHour && getPublicWebsite.websiteInfo.data.workHour.map((item, id) =>
          (
            <>
              {item.isAvailable ?
                <div className="days_we_work">
                  <p className="our_services_subheading">{item.day}</p>
                  <p className="our_services_subheading">{moment(item && item.slot && item.slot.startTime, "hh:mm a").format('LT')} - {moment(item && item.slot && item.slot.endTime, "hh:mm a").format('LT')}</p>
                </div>
                :
                (<div className="days_we_work-sunday">
                  <p className="our_services_subheading">{item.day}</p>
                  <p className="our_services_subheading">Closed</p>
                </div>)

              }
            </>

          )
          )
        }
        <hr className="hr" />
        <div className="bookings">
          <h2 className="our_services_subheading1">
            BY APPOINTMENT ONLY
          </h2>
          <p className="our_services_subheading">{phone}</p>
        </div>
      </div>
      <div className="working_time_right">
        <div className="appearance_working_time_heading">
          <div className='appearnce-button-container'>
            <button className='appearance-btn' onClick={() => setClickHourText(!clickHourText)}>
              <svg className="table__button--icon">
                <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
              </svg>
            </button>
            {clickHourText && <button className='appearance-btn' onClick={handleHourTextClick}>
              SUBMIT
            </button>}
          </div>
          <h1 contentEditable={clickHourText ? true : false} onInput={(e) => { setHourText(e.target.innerText) }}>{hourTitle ? hourTitle : "What times are we open"}</h1>
        </div>
        {/* <h1 className="working_time_heading">What times are we open</h1> */}
        <br />

        <div className="appearance_our_services_subheading1">
          <div className='appearnce-button-container'>
            <button className='appearance-btn' onClick={() => setClickHourPara(!clickHourPara)}>
              <svg className="table__button--icon">
                <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
              </svg>
            </button>
            {clickHourPara && <button className='appearance-btn' onClick={handleHourParaClick}>
              SUBMIT
            </button>}
          </div>
          <p contentEditable={clickHourPara ? true : false} onInput={(e) => { setHourPara(e.target.innerText) }}>
            {hourSubTitle ? hourSubTitle : "We are open Monday through Friday, 9 to 5 pm. But you can still call the support team outside working hours and send the email"}
          </p>
        </div>


        <br />
        <br />
        <Button
          varient="primary"
          style={{
            width: '70%',
            justifyContent: 'center',
            backgroundColor:color
          }}
          label="Book an Appointment"
          icon="arrow_right"
        />
      </div>
    </div>
  )
}

export default AppearanceAppointment