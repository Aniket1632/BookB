import React, { useState } from 'react'
import { inputPhoneMasking } from '../../utils/validators';

const StylistDetails = ({ nextStep, prevStep, stylistData, data, setData, setShowAddModal, subscriptionData, navigateLogin }) => {

  const next = () => {
    stylistData && stylistData.length > 0 ? nextStep() : setShowAddModal(true)
  }
  return (
    <div>
        {
          (!stylistData ||
            stylistData.length < subscriptionData.metadata.calendars) &&
          <div className='onboard_button' style={{ marginTop: '0rem' ,marginBottom: '20px' }}>
            <button onClick={() => setShowAddModal(true)} >Add Stylist</button>
          </div>
        }
    <div className='form_container'>
      <div className='form_container_box'>
        <table className='table' style={{ marginBottom: '10rem' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              stylistData && stylistData.length > 0 ?
                stylistData.map((item, i) => {
                  return <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{inputPhoneMasking(item.phone)}</td>
                    <td>
                      <button
                        className='table__button table__button--delete'
                        onClick={() => {
                          debugger
                          let newFormValues = data;
                          newFormValues.stylist.splice(i, 1);
                          setData({ ...newFormValues });
                        }}
                      >
                        <svg className='table__button--icon-red'>
                          <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
                        </svg>
                        <span>Delete User</span>
                      </button>
                    </td>
                  </tr>
                }) :
                <tr>
                  <td colSpan="4">
                    <div className='noData'>
                      <svg className="noData_icon">
                        <use xlinkHref={`/assets/sprite.svg#icon-sad`} />
                      </svg>
                      <h3 >No Data Found!</h3>
                    </div>
                  </td>
                </tr>
            }
          </tbody>
        </table>
      </div>



    </div>
      <div className='onboard_down' style={{marginTop: '4rem'}}>
        <p onClick={navigateLogin}>Back to login</p>
        <div className='onboard_button'>
          <button onClick={prevStep} className='prev'>Previous</button>
          <button onClick={next}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default StylistDetails