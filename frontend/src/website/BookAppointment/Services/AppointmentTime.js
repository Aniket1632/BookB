import React from "react";
import moment from "moment"

const AppointmentTime = ({
  time,
  setModalState,
  data,
  serviceName,
  subServiceName,
  charges,
  setInfo,
  availableTime,
  stylist,
  serviceId,
  salon,
  subServiceId,
  dateAsAString,
  requiredTime,
  availableList
}) => {
  const handleClick = (info) => {
    setModalState(true); 
    setInfo({
      serviceName: serviceName,
      subServiceName: subServiceName,
      charges: charges,
	  salon:salon,
	  serviceId: serviceId,
	  subServiceId:subServiceId,
	  dateAsAString:dateAsAString,
	  requiredTime:requiredTime,
    stylist:stylist,
    availableTime:availableTime,
    availableList:availableList,
      ...info,
    });
  };
  // :"time"

  const dateHour = (date,hour)=>{
		let datetimeA = moment(date + " " + hour);
		return datetimeA.toISOString()
	}

  console.log(data)

  return (
    <>
      {data.timeData.map((d) => {
        return (
          // moment(dateHour(dateAsAString,d.timeAsAString)) > moment().add(15,'minutes') ?
          <div className="time-btn">
             <span>Current Waiting List : {availableList && availableList.length}</span>
          <button onClick={() => handleClick(d)} disabled={d.slotStatus=== 'confirmed'&&true|| d.slotStatus=== 'canceled'&&true || moment(dateHour(dateAsAString,d.timeAsAString)) < moment().add(15,'minutes')} className={d.slotStatus=== 'booked'&&"time-booked" || d.slotStatus=== 'confirmed'&&"time-confirmed" || d.slotStatus=== 'waiting'&&"time-waiting"|| d.slotStatus=== 'requested'&&"time-waiting" ||d.slotStatus=== 'available'&&"time" ||d.slotStatus=== 'canceled'&&"time-canceled"   }>
            {d.timeAsAString}
          </button>
         
          </div>
          
        );
      })}

      {/* <p>{data.salon}</p> */}
    </>
    // <button onClick={() => setModalState(true)} className="time">
    // 	{time}
    // </button>
  );
};

export default AppointmentTime;
