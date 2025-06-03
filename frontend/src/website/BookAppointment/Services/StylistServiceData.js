import React, { Fragment } from "react"; 
import AppointmentStyles from '../BookAppointment.module.css';
import BarberInfo from "./BarberInfo";

const StylistServiceData = ({ service, setModalState, serviceName, subServiceId, setInfo, serviceId, salon, requiredTime }) => {
  return (
    <Fragment>
      <div className="time_intervals">
        <div className="service_name2">
          <div>
            <h1 className={AppointmentStyles.appointment_header2}>{service.title}</h1>
            <p className="appointment_subheading1">{service.description}</p>
          </div>

          <h2 className={AppointmentStyles.appointment_header2}>${service.charges}</h2>
        </div>
        {service &&
          service.stylistList
          && service.stylistList.length > 0 ?
          service.stylistList.map((data) => (
            <BarberInfo
              key={data._id}
              data={data}
              stylist={data._id}
              serviceName={serviceName}
              subServiceName={service.title}
              charges={service.charges}
              setModalState={setModalState}
              setInfo={setInfo}
              serviceId={serviceId}
              salon={salon}
              subServiceId={subServiceId}
              requiredTime={requiredTime}
            />
          )) : <p className="appointment_subheading4">No Time Slots Available for this day</p>}
      </div>
      {/* <div className="time_intervals">
				{service.appointmentTiming &&
					service.appointmentTiming.map((timing) => (
						<AppointmentTime key={timing._id} time={timing.time} setModalState={setModalState} />
					))}
			</div> */}
    </Fragment>
  );
};

export default StylistServiceData;
