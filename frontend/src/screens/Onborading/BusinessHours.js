import React, { Fragment, useCallback, useState } from 'react';
import AvailabilityStyle from '../../screens/StylistSessionScreen/StylistAvailability.module.css';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalForm from '../../components/Modal/ModalForm';
import moment from 'moment';

const BusinessHours = ({ prevStep, nextStep, data, navigateLogin }) => {
  const [weekDays, setWeekDays] = useState([...data]);
  const [error, setErrors] = useState('');

  const handleChange = (e, mainIndex, index, item) => {
    e.preventDefault();
    let newFormValues = [...weekDays];
    weekDays[mainIndex].slot[index][e.target.name] = e.target.value;
    item[e.target.name] = e.target.value;
    setWeekDays([...newFormValues]);
  };

  const addFormFields = slot => {
    if (slot) {
      slot.push({
        startTime: '',
        endTime: '',
      });
    }
    setWeekDays([...weekDays]);
  };

  const removeFormFields = (i, mainIndex, day) => {
    const newFormValues = [...weekDays];
    newFormValues[mainIndex].slot.splice(i, 1);
    setWeekDays(newFormValues);
    day.slot.splice(i, 1);
  };

  const handleNext = useCallback(() => {
    const hasSlotFilled = data.some(item => item.slot.length > 0);
  
    if (!hasSlotFilled) {
      setErrors('Please fill at least one slot.');
      return;
    }
    const hasAllSlotsFilled = data.every(item =>
      item.slot.every(slot => slot.startTime && slot.endTime)
    );
  
    if (!hasAllSlotsFilled) {
      setErrors('Please ensure all slots have both start time and end time.');
      return;
    }
    nextStep();
  }, [data, nextStep]);

  return (
    <div>
      <ModalForm style={{ marginBottom: '2.5rem' }}>
        <div className='form_container_new' style={{ justifyContent: 'flex-start' }}>
          {weekDays &&
            weekDays.length > 0 &&
            weekDays.map((day, mainIndex) => (
              <Fragment key={mainIndex}>
                <div className='form_section'>
                  <h1 className='onboard_day' style={{ width: '5rem', color: 'white' }}>
                    {day.day}
                  </h1>
                  <InputsSectionColumn style={{ padding: '0rem', margin: '0rem', backgroundColor: 'transparent' }}>
                    {day.slot.length > 0 ? (
                      day.slot.map((item, index) => (
                        <div key={mainIndex + index} className={AvailabilityStyle.slotRow}>
                          <div className='onboard_input'>
                            <label>{index == 0 ? 'Start Time' : false}</label>
                            <input
                              placeholder='eg, 1:00 PM'
                              value={item.startTime}
                              name='startTime'
                              type='time'
                              // step="3600000"
                              onChange={e => handleChange(e, mainIndex, index, item)}
                              min={index > 0 ? day.slot[index - 1].endTime : ''}
                              required={true}
                            />
                            {item.startTime > (index > 0 && day.slot[index - 1].endTime) && (
                              <p className='onboard_error'>
                                {item.startTime < (index > 0 && day.slot[index - 1].endTime) ? 'Start time should be greater than previous End Time' : ''}
                              </p>
                            )}
                          </div>
                          :
                          <div className='onboard_input'>
                            <label>{index == 0 ? 'End Time' : false}</label>
                            <input
                              icon='stopwatch'
                              placeholder='eg, 2:00 PM'
                              value={item.endTime}
                              name='endTime'
                              type='time'
                              // step="3600000"
                              required={true}
                              onChange={e => handleChange(e, mainIndex, index, item)}
                              min={moment(item && item.startTime, 'HH:mm')
                                .add(30, 'minutes')
                                .format('HH:mm')}
                            />
                            {/* {item.startTime > item.endTime  && <p className='onboard_error'>{ "End time should be greater than Start Time"}</p>} */}
                          </div>
                          <button
                            style={{ marginTop: index == 0 ? '2rem' : '0rem' }}
                            className='table__button table__button--delete'
                            onClick={e => {
                              e.preventDefault();
                              removeFormFields(index, mainIndex, day);
                            }}
                          >
                            <svg className='table__button--icon-reds'>
                              <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
                            </svg>
                            <span>Remove</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className='onboard_button'>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            addFormFields(day.slot);
                          }}
                        >
                          Add time slot
                        </button>
                      </div>
                    )}
                  </InputsSectionColumn>
                  {/* {
										day.slot.length > 0 &&
										<div className='slot_button'>
											<button 
												onClick={(e) => {
													e.preventDefault();
													addFormFields(day.slot)
												}}>Add time slot</button>
			
										</div>
									} */}
                </div>
              </Fragment>
            ))}
        </div>
        {error && <span style={{ color: 'red' }}>
          {error}
        </span>}
        <div className='onboard_down'>
        <div className='onboard_down1'>
        <span onClick={navigateLogin}>Back to login</span>
        </div>
          <div className='onboard_button'>
            <button onClick={prevStep} className='prev'>
              Previous
            </button>
            <button type='submit' onClick={handleNext}>Next</button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default BusinessHours;
