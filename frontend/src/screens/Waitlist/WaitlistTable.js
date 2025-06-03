import React from "react";
import Spinner from "../../components/Spinner/Spinner";
import { inputPhoneMasking } from "../../utils/validators";
import moment from "moment";
import "./Waitlist.css";
import { useSelector } from "react-redux";

const WaitlistTable = ({ data }) => {
  const {
    availabilityAppointment,
    appointmentStatusList,
    setDeleteAptModal,
    setAppointmentId,
    setIsUpdate,
    setAddModalActive,
    setDate,
    setStartTime,
    setService,
    setName,
    setEmail,
    setPhone,
    setGender,
    serviceIds,
    setServiceIds,
    setSalon,
    setRequiredTime,
    setSlotStatus,
    changeSlotStatus,
    setChangeSlotStatus,
    setTimeSlotId,
  } = data;

  const dateHour = (date, hour) => {
    let datetimeA = moment(date + " " + hour);
    return datetimeA.toISOString();
  };

  const userIndex = 1;
  const userData = useSelector((state) => state.getUserInfo);

  //   console.log(appointmentStatusList);

  return (
    <div className="waitlisttableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Time Slot</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Service</th>
            <th>Charges</th>
            <th>Status</th>
            {/* <th/> */}
            {availabilityAppointment &&
              availabilityAppointment.session &&
              availabilityAppointment.session.result &&
              availabilityAppointment.session.result.appointmentList &&
              availabilityAppointment.session.result.appointmentList.length >
                0 &&
              availabilityAppointment.session.result.appointmentList &&
              moment(
                dateHour(
                  availabilityAppointment.session.result.appointmentList[0]
                    .dateAsAString,
                  availabilityAppointment.session.result.appointmentList[0]
                    .timeAsADate
                )
              ) > moment().add(15, "minutes") && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {availabilityAppointment && !availabilityAppointment.loading ? (
            availabilityAppointment &&
            availabilityAppointment.session &&
            availabilityAppointment.session.result &&
            availabilityAppointment.session.result.appointmentList &&
            availabilityAppointment.session.result.appointmentList.length >
              0 ? (
              availabilityAppointment.session.result.appointmentList.map(
                (item, i) => (
                  <tr key={i}>
                    <td>{userIndex + i}</td>
                    <td style={{ textTransform: "uppercase" }}>
                      {item.timeAsAString}
                    </td>
                    <td className="textCapitalize">{item && item.userName}</td>
                    <td>{item && item.userEmail}</td>
                    <td>
                      {inputPhoneMasking(item && item.user && item.user.phone)}
                    </td>
                    <td className="textCapitalize">{item && item.gender}</td>
                    <td className="textCapitalize">{item.mainService.title}</td>
                    <td className="textCapitalize">
                    {userData &&
									userData?.userInfo &&
									userData?.userInfo?.data &&
									userData?.userInfo?.data?.currency
								}{item && item.subService && item.subService.charges}
                    </td>
                    <td>
                      <div>
                        <select
                          className="selectBox"
                          value={item.status}
                          onChange={(e) => {
                            setChangeSlotStatus(e.target.value);
                            setAppointmentId(item._id);
                          }}
                          disabled={
                            moment(
                              dateHour(
                                item && item.dateAsAString,
                                item.timeAsADate
                              )
                            ) < moment().add(15, "minutes")
                              ? true
                              : false
                          }
                        >
                          {appointmentStatusList &&
                            appointmentStatusList.session &&
                            appointmentStatusList.session.data &&
                            appointmentStatusList.session.data.map((status) => (
                              <option value={status.value}>
                                {status.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                    {moment(
                      dateHour(item && item.dateAsAString, item.timeAsADate)
                    ) > moment().add(15, "minutes") && (
                      <td>
                        <div className="table__iconBox">
                          <button
                            className="table__button"
                            disabled={
                              moment(
                                dateHour(
                                  item && item.dateAsAString,
                                  item.timeAsADate
                                )
                              ) < moment().add(15, "minutes")
                                ? true
                                : false
                            }
                            onClick={() => {
                              setAddModalActive(true);
                              setIsUpdate(true);
                              setDate(item.dateAsAString);
                              setStartTime(item.timeAsADate);
                              setService(item.mainService.title);
                              setName(item.userName);
                              setEmail(item.userEmail);
                              setPhone(inputPhoneMasking(item.userMobile));
                              setGender(item.gender);
                              setSalon(item.salon);
                              setRequiredTime(item.requiredDuration);
                              setSlotStatus(item.status);
                              setTimeSlotId(
                                availabilityAppointment.session.result &&
                                  availabilityAppointment.session.result
                                    .timeData[0] &&
                                  availabilityAppointment.session.result
                                    .timeData[0]._id
                              );
                              setServiceIds({
                                ...serviceIds,
                                mainServiceId: item.mainService._id,
                                subServiceId: item.subService._id,
                              });
                            }}
                          >
                            <svg className="table__button--icon">
                              <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                            </svg>
                            <span>Edit Appointment</span>
                          </button>

                          <button
                            className="table__button"
                            disabled={
                              moment(
                                dateHour(
                                  item && item.dateAsAString,
                                  item.timeAsADate
                                )
                              ) < moment().add(15, "minutes")
                                ? true
                                : false
                            }
                            onClick={() => {
                              setDeleteAptModal(true);
                              setAppointmentId(item._id);
                            }}
                          >
                            {console.log(item._id)}
                            <svg className="table__button--icon">
                              <use
                                xlinkHref={`/assets/sprite.svg#icon-delete`}
                              />
                            </svg>
                            <span>Delete Appointment</span>
                          </button>
                          {console.log(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="13"
                  style={{ textAlign: "center", height: "200px" }}
                >
                  No Appointments Found
                </td>
              </tr>
            )
          ) : (
            <tr>
              <Spinner />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WaitlistTable;
