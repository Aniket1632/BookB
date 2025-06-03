import React from "react";
import AppointmentStyles from "../BookAppointment.module.css";
import StylistServiceData from "./StylistServiceData";

const ServiceCard = ({ data, setModalState, setInfo }) => {
  return (
    <div className="our_services">
      <div className="service_name">
        <h1 className={AppointmentStyles.appointment_header1}>{data.title}</h1>
      </div>
      <div className="service_name">
        <p className="appointment_subheading1">{data.serviceDes}</p>
      </div>

      {data.subService && data.subService.length > 0 ?
        data.subService.map((service) => (
          <StylistServiceData
            key={service._id}
            subServiceId={service._id}
            serviceName={data.title}
            serviceId={service.service}
            salon={data.salon}
            setInfo={setInfo}
            service={service}
            setModalState={setModalState}
            requiredTime={service.requiredTime}
          />
        )) : (
          <div className="time_intervals">
            <p className="appointment_subheading4">No Time Slots Available for this day</p>
          </div>
        )}
    </div>
  );
};

export default ServiceCard;
