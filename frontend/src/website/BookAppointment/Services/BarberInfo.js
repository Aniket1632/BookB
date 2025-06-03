import React from "react";
import { inputPhoneMasking } from "../../../utils/validators";
import AppointmentTime from "./AppointmentTime";

const BarberInfo = ({
  data,
  setModalState,
  serviceName,
  subServiceName,
  charges,
  stylist,
  setInfo,
  serviceId,
  salon,
  subServiceId,
  requiredTime
}) => {
  return (
    <div className="barber_info">
      {data.stylistData && (
        <div className="appointment-box">
          <img
            src={data.stylistData.photo}
            className="barber_image"
            alt="dummy profile"
          />
          <div className="barber_info_name">
            <h1 className="appointment_heading2">{data.stylistData.name}</h1>
            {/* <p className="appointment_subheading1">desc</p> */}
            <div className="stylist-detail">
              <div className="stylist-detail-icon">
                <svg className="appointment-icon">
                  <use xlinkHref={`/assets/sprite.svg#icon-email`} />
                </svg>
                <p className="appointment_subheading1">{data.stylistData.email}</p>
              </div>
              <div className="stylist-detail-icon">
                <svg className="appointment-icon">
                  <use xlinkHref={`/assets/sprite.svg#icon-call`} />
                </svg>
                <p className="appointment_subheading1">{inputPhoneMasking(data.stylistData.phone)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="time-box">
        {data.availableTime.map((item, i) => (
          <AppointmentTime
            serviceName={serviceName}
            subServiceName={subServiceName}
            charges={charges}
            key={item._id}
            data={item}
            setInfo={setInfo}
            stylist={stylist}
            availableTime={item._id}
            setModalState={setModalState}
            serviceId={serviceId}
            salon={salon}
            subServiceId={subServiceId}
            dateAsAString={item.dateAsAString}
            requiredTime={requiredTime}
            availableList={item.appointmentList}
          />

        ))}
      </div> 
    </div>
  );
};

export default BarberInfo;
