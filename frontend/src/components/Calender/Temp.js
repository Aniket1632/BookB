import React, { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "./Calender.css";
import {
  getUnBlockAvailabilitysAction,
  blockAppointmentAction,
  addDailyAvailabilityAction,
} from "../../redux/actions/availabilityActions";
import {
  confirmAppointmentAction,
  getAppointmentAction,
  updateAppointmentAction,
} from "../../redux/actions/appointmentAction";

const TempCalendar = ({ data, childFunctionRef  }) => {
  const {
    date,
    socket,
    setDate,
    match,
    setEndDate,
    endDate,
    setStartDate,
    startDate,
    setGetlatestData,
    setStartTime,
    calendarRef,
    setCreateSlotModal,
    setAddModalActive,
    setAddBuinessHoursModal,
    addAppointment,
    appointments,
    setDeleteModalActive,
    appointmentId,
    setAppointmentId,
    addModalActive,
    setSlotId,
    setModalWaitlist,
    setAppointments,
    startTime,
    dispatch,
    calendarApi,
    setCalendarApi,
    store,
    blankEvent,

    openDropdownBHours,
    setOpenDropdownBHours,
    businessHours,
    setBusinessHours,
    addDailyAvailabilitys,
    addDayAvailabilitys,

    unBlockHandler,
    addDayAvailabilityHandler,
    getUnblockAvailabilitys,
    userLogin,
    stylistId,
    setIsUpdate,
    getUserInfo,
    updateAppointment,
    deleteAppointment,
    deleteSlot,
    confirmAppointment,
    publicAddAppointment,
    setAddSlotModal,
    setAppointmentTime,
    addBulkAvailabilitys,
    setTimeSlotId,
    slotId,
    timeSlotId,
    setAppointmentList,
    setSalon,
  } = data;
  const [tempDate, setTempDate] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [eventList, setEventList] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [active, setActive] = useState(false);
  const [isDayWiseCalendarOpen, setisDayWiseCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [dragDrop, setDragDrop] = useState("");
  const [currentView, setCurrentView] = useState("timeGridWeek");

  let eventData = {
    fromDate: startDate,
    toDate: endDate,
    stylistId: stylistId,
    endDate: "00:30:00",
    salon:
      getUserInfo &&
      getUserInfo.userInfo &&
      getUserInfo.userInfo.data &&
      getUserInfo.userInfo.data._id,
  };

  //business hours type
  const businessHoursType = [
    {
      id: 1,
      title: "Change hours by day",
      name: "byDays",
    },
    {
      id: 2,
      title: "Change Weekly by hour",
      name: "byWeeks",
    },
  ];

  const [changeByHours, setChangeByHours] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [availableList, setAvailableList] = useState([]);

  const addBuinessHoursClick = (event) => {
    document.querySelectorAll(".dayButton").forEach(function (el) {
      el.style.display = "none";
    });
    if (event.name === "byWeeks") {
      setAddBuinessHoursModal(true);
      setBusinessHours(event);
      setOpenDropdownBHours(false);
    } else if (event.name === "byDays") {
      setBusinessHours(event);
      calendarRef.current._calendarApi.changeView("businessHour");
      setAddBuinessHoursModal(false);
      setOpenDropdownBHours(false);
      setChangeByHours(true);
      document.querySelectorAll(".dayButton").forEach(function (el) {
        el.style.display = "block";
      });
    }
  };

  var add_minutes = function (dt, minutes) {
    return moment(dt).add(minutes, "minutes").format();
  };

  useEffect(() => {
    getList();
  }, [
    addAppointment,
    startDate,
    endDate,
    eventStart,
    setGetlatestData,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    publicAddAppointment,
    addDailyAvailabilitys,
    addBulkAvailabilitys,
    deleteSlot,
    // dragDrop,
  ]);

  const dateHour = (date, hour) => {
    let datetimeA = moment(date + " " + hour);
    return datetimeA.toISOString();
  };
  // const handleViewChange = (viewInfo) => {
  //   setCurrentView(viewInfo.view.type);
  // };

  // const getList = () => {
  //   getAppointmentAction(eventData, userLogin).then(res => {
  //     if (res && res.data && res.data.result) {
  //       const dataArray = res.data.result.map(item => (
  //         {
  //           start: dateHour(item.start_date, item && item.userList && item.userList[0] && item.userList[0].appointmentDetail.timeAsADate),
  //           end: dateHour(item.start_date, item && item.userList && item.userList[0] && item.userList[0].appointmentDetail.timeAsADate),
  //           // end: add_minutes(dateHour(item && item.start_date, item && item.slots && item.slots[0] && item.slots[0].timeAsADate), 30),
  //           color: eventColorData(item),
  //           slotId: item.availability,
  //           timeSlotId: item && item.slots && item.slots[0] && item.slots[0]._id,
  //           appointmentDetail: item && item.userList && item.userList[0].appointmentId,
  //           userList: item && item.userList,
  //           isFullDay: true,
  //           appointmentDetail: item.appointmentDetail,
  //           start_date: item.start_date,
  //           slots: item.slots,
  //           appointmentList: item.appointmentList,
  //           border: '1px solid #ddd',
  //         }));
  //       setEventList(dataArray);
  //     }
  //   });
  // };

  const getList = () => {
    getAppointmentAction(eventData, userLogin).then((res) => {
      if (res && res.data && res.data.result) {
        const dataArray = res.data.result.map((item) => {
          let displayData;
          if (currentView === "dayGridMonth") {
            displayData = dateHour(
              item.start_date,
              item &&
              item.userList &&
              item.userList[0] &&
              item.userList[0].appointmentDetail.timeAsADate
            );
          } else if (
            currentView === "timeGridWeek" ||
            currentView === "timeGridDay"
          ) {
            displayData = dateHour(
              item.start_date,
              item && item.slots && item.slots[0] && item.slots[0].timeAsADate
            );
          }

          return {
            start: displayData,
            end: add_minutes(displayData, 30),
            color: eventColorData(item),
            slotId: item.availability,
            timeSlotId:
              item && item.slots && item.slots[0] && item.slots[0]._id,
            appointmentDetail:
              item && item.userList && item.userList[0].appointmentId,
            userList: item && item.userList,
            isFullDay: true,
            appointmentDetail: item.appointmentDetail,
            start_date: item.start_date,
            slots: item.slots,
            appointmentList: item.appointmentList,
            border: "1px solid #ddd",
          };
        });

        setEventList(dataArray);
      }
    });
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("appointment-request", (obj) => {
        if (endDate && startDate) {
          getList();
        }
      });
    }
  }, [endDate, socket, startDate]);

  useEffect(() => {
    getList();
  }, []);

  const eventColorData = (item) => {
    if (
      moment(
        dateHour(
          item.start_date,
          item && item.slots && item.slots[0] && item.slots[0].timeAsADate
        )
      ) < moment().add(15, "minutes")
    ) {
      return "#8b8b8b26";
    } else if (item && item.stylistConfirmationStatus) {
      return "#ff900029";
    } else {
      return "#ff900029";
    }
  };
  // useEffect(() => {
  //   if (
  //     dragDrop &&
  //     dragDrop.event &&
  //     dragDrop.event.extendedProps &&
  //     dragDrop.event.extendedProps.slotId !== '' &&
  //     moment(dragDrop.oldEvent.start).format() > moment().add(15, 'minutes').format() &&
  //     moment(dragDrop.event.start).format() > moment().add(15, 'minutes').format()
  //   ) {
  //     let data = {
  //       time: moment(dragDrop.event.start, 'hh:mm').format('HH:mm'),
  //       date: moment(dragDrop.event.start).format('YYYY-MM-DD'),
  //       slotId: dragDrop.event.extendedProps.slotId,
  //       appointmentId: dragDrop.event.id,
  //       appointmentList: dragDrop.event.extendedProps.appointmentList,
  //       timeData: {
  //         id: dragDrop.event.extendedProps.timeSlotId,
  //         timeAsAString: moment(dragDrop.event.start, 'hh:mm').format('hh:mm a'),
  //         timeAsADate: moment(dragDrop.event.start, 'hh:mm').format('HH:mm'),
  //       },
  //     };
  //     dispatch(addDailyAvailabilityAction(data, stylistId));
  //   }
  // }, [dragDrop]);

  const handleBlockStatus = (date) => {
    dispatch(
      blockAppointmentAction(moment(date.event.start).format("MM-DD-YYYY"))
    );
  };
  const handleWaitlist = (info) => {
    setModalWaitlist(true);
    setSlotId(info.event.extendedProps.slotId);
    setTimeSlotId(info.event.extendedProps.timeSlotId);
  };

  const handleEditSlot = (info) => {
    setCreateSlotModal(true);
    setDate(info.event.start);
    setStartTime(moment(info.event.start).format("HH:mm"));
    setIsUpdate(true);
    setAppointmentId(info.event.id);
    setAppointmentList(info.event.extendedProps.appointmentList);
    setSlotId(info.event.extendedProps.slotId);
    setTimeSlotId(info.event.extendedProps.timeSlotId);
  };

  const handleAddAppointment = (info) => {
    setAddModalActive(true);
    setDate(info.event.start);
    setStartTime(moment(info.event.start).format("HH:mm"));
    setAppointmentId(info.event.extendedProps.appointmentDetail);
    setSlotId(info.event.extendedProps.slotId);
    setTimeSlotId(info.event.extendedProps.timeSlotId);
    setSalon(info.event.extendedProps.appointmentDetail.salon);
  };

  const handleDeleteAppointment = (info) => {
    setDeleteModalActive(true);
    setAppointmentTime(info.event.start);
    setAppointmentId(info.event.extendedProps.slotId);
  };

  const handleStatusChange = (info) => {
    let data = {
      stylist: stylistId,
      appointmentId: info.event.id,
      status: !info.event.extendedProps.statusData,
    };
    setActive(data);
  };

  const renderEventContent = (eventInfo) => {
    if (eventInfo.view.type === "dayGridMonth") {
      return (
        <>
          {eventInfo &&
            eventInfo.event &&
            eventInfo.event.extendedProps &&
            eventInfo.event.extendedProps.userList &&
            eventInfo.event.extendedProps.userList[0] &&
            eventInfo.event.extendedProps.userList[0].mainServiceDetail && (
              <div
                className={
                  moment(eventInfo.event.start).format() < moment().format()
                    ? "event-box1"
                    : "event-box"
                }
              >
                {eventInfo &&
                  eventInfo.event &&
                  eventInfo.event.extendedProps &&
                  !eventInfo.event.extendedProps.userList && (
                    <>
                      <p className="event-text">
                        {moment(eventInfo.event.start).format("LT")}
                      </p>
                    </>
                  )}
                {eventInfo &&
                  eventInfo.event &&
                  eventInfo.event.extendedProps &&
                  eventInfo.event.extendedProps.userList && (
                    <>
                      <p className="event-text">
                        {moment(eventInfo.event.start).format("LT")}
                      </p>
                      <p className="event-text">
                        {eventInfo &&
                          eventInfo.event &&
                          eventInfo.event.extendedProps &&
                          eventInfo.event.extendedProps.userList &&
                          eventInfo.event.extendedProps.userList[0] &&
                          eventInfo.event.extendedProps.userList[0]
                            .mainServiceDetail &&
                          eventInfo.event.extendedProps.userList[0]
                            .mainServiceDetail.title}
                      </p>
                    </>
                  )}
              </div>
            )}
        </>
      );
    } else
      return (
        <div className="event-box2">
          {moment(eventInfo.event.start) > moment().add(15, "minutes") && (
            // moment(eventInfo.event.start) > moment().add(-15,'minute')
            <div className="table__iconBox1">
              <p className="event-text"></p>
              <div className="event-btn">
                {/* <button
            disabled={moment(eventInfo.event.start).format() < moment().format() ? true : false}
            className="table__button table__button--delete"
            onClick={() => handleWaitlist(eventInfo)}
          >
            <svg className="table__button--icon-red">
              <use xlinkHref={`/assets/sprite.svg#icon-user`} />
            </svg>
            <span>Waitlist</span>
          </button>*/}
                <button
                  disabled={
                    moment(eventInfo.event.start).format() < moment().format()
                      ? true
                      : false
                  }
                  className="table__button"
                  onClick={() => handleEditSlot(eventInfo)}
                // onClick={() => setCreateSlotModal(true)}
                >
                  <svg className="table__button--icon">
                    <use xlinkHref={`/assets/sprite.svg#icon-edit`} />
                  </svg>
                  <span>Update Slot</span>
                </button>
                <button
                  disabled={
                    moment(eventInfo.event.start).format() < moment().format()
                      ? true
                      : false
                  }
                  className="table__button table__button--delete"
                  onClick={() => handleDeleteAppointment(eventInfo)}
                >
                  <svg className="table__button--icon-red">
                    <use xlinkHref={`/assets/sprite.svg#icon-delete`} />
                  </svg>
                  <span>Delete Slot</span>
                </button>

                <button
                  disabled={
                    moment(eventInfo.event.start).format() < moment().format()
                      ? true
                      : false
                  }
                  className="table__button table__button--delete"
                  onClick={() => handleAddAppointment(eventInfo)}
                >
                  <svg className="table__button--icon-red">
                    <use xlinkHref={`/assets/sprite.svg#icon-plus`} />
                  </svg>
                  <span>Create Appointement</span>
                </button>
              </div>
            </div>
          )}
          {eventInfo &&
            eventInfo.event &&
            eventInfo.event.extendedProps &&
            !eventInfo.event.extendedProps.userList ? (
            <p className="event-text">No Appointment yet</p>
          ) : (
            <>
              {eventInfo &&
                eventInfo.event &&
                eventInfo.event.extendedProps &&
                eventInfo.event.extendedProps.userList &&
                eventInfo.event.extendedProps.userList[0] && (
                  <div
                    className="event-appointment"
                    onClick={() => handleWaitlist(eventInfo)}
                  >
                    {moment(eventInfo.event.start).format("LT")} -{" "}
                    {eventInfo &&
                      eventInfo.event &&
                      eventInfo.event.extendedProps &&
                      eventInfo.event.extendedProps.userList &&
                      eventInfo.event.extendedProps.userList[0] &&
                      eventInfo.event.extendedProps.userList[0]
                        .mainServiceDetail &&
                      eventInfo.event.extendedProps.userList[0]
                        .mainServiceDetail.title}
                    {eventInfo &&
                      eventInfo.event &&
                      eventInfo.event.extendedProps &&
                      eventInfo.event.extendedProps.userList &&
                      eventInfo.event.extendedProps.userList[0] &&
                      eventInfo.event.extendedProps.userList[0]
                        .appointmentDetail &&
                      eventInfo.event.extendedProps.userList[0]
                        .appointmentDetail.userName &&
                      "( " +
                      eventInfo.event.extendedProps.userList[0]
                        .appointmentDetail.userName +
                      " )"}
                  </div>
                )}

              <div
                className="event-readmore"
                onClick={() => handleWaitlist(eventInfo)}
              >
                More..
              </div>
            </>
          )}
        </div>
      );
  };

  const calendarOptions = {
    events: eventList,
    // events: dateString,
    // eventColor: active ? "#ff9000" : "#09baa567",
    // eventDrop(info) {
    // setDragDrop(info);
    // setAppointmentId(info.event.id);
    // setEventStart(info.event.start);
    // setSlotId(info.event.extendedProps.slotId);
    // setTimeSlotId(info.event.extendedProps.timeSlotId)
    // },
    eventContent: renderEventContent,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: currentView,
    selecatable: true,
    dateClick: function (info) {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(info.date);
        calendarApi.changeView("timeGridDay");
      }
    },
    headerToolbar: {
      start: "prev,today,next",
      // start: 'prev,today,next,bookAppointment',
      center: "title",
      end: "businessHour,dayGridMonth,timeGridWeek,timeGridDay",
    },
    customButtons: {
      businessHour: {
        // text: openDropdownBHours ? "Done" : "Business Hours",
        text: "Business Hours",
        click() {
          // setOpenDropdownBHours(false);
          setAddBuinessHoursModal(true);
          setChangeByHours(true);
        },
      },
      // bookAppointment: {
      //   text: 'Create Slot',
      //   click() {
      //     setCreateSlotModal(true);
      //   },
      // },
    },
    views: {
      businessHour: {
        type: "timeGrid",
        duration: { weeks: 1 },
        //  buttonText: openDropdownBHours ? "Done" : "Business Hours",
        buttonText: "Business Hours",
        // slotMinTime: "12:00",
        // slotMaxTime: "20:00",
      },
      week: {
        dayHeaderFormat: { weekday: "short", day: "2-digit" },
      },
      day: {
        dayHeaderFormat: { weekday: "short", day: "2-digit" },
      },
    },
    // dayHeaderFormat: { weekday: 'short', day: '2-digit' },
    editable: true,
    slotMinTime: "06:00",
    slotMaxTime: "24:00",
    eventResizableFromStart: false,
    dragScroll: false,
    navLinks: false,
    ref: calendarRef,
    direction: "ltr",
    selectable: true,
    selectMirror: false,
    selectOverlap: true,
    slotDuration: "00:30:00",
    allDaySlot: false,
    // viewClassNames(viewArgs) {
    //   viewChangeHandler(viewArgs);
    //   renderCustomDateButtons()
    // },
    // viewDidMount(viewArgs) {
    //   viewChangeHandler(viewArgs);
    //   renderCustomDateButtons()
    // },
    dayCellDidMount(datedayRenderInfo) { },
    selectAllow(select) {
      return JudgeWeekDay(select.start, [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    },
    datesSet(dateInfo) {
      // renderCustomDateButtons()
      setCurrentView(dateInfo.view.type);
      setStartDate(dateInfo.start); //start of the range the calendar date
      setEndDate(dateInfo.end); //end of the range the calendar date
      // getList(dateInfo.view.type);
    },
    select(info) {
      // if (moment(info.start) > moment().add(-15,'minutes')) {
      //   if (info.view.type === "businessHour") {
      //     setAddSlotModal(true)
      //     setAppointmentTime(info.start)

      //   }
      //   setTempDate(info.start);
      // } else {
      //   toast.error("Please select valid date");
      // }
      if (info.view.type === "dayGridMonth") {
        if (moment(info.start) > moment().subtract(1, "days")) {
          // setCreateSlotModal(true);
          setisDayWiseCalendarOpen(true);
          // setDate(info.start);
        }
      } else {
        // if (moment(info.start) > moment().subtract(2,'days')){
        if (moment(info.start) > moment().add(15, "minutes")) {
          setAddSlotModal(true);
          setAppointmentTime(info.start);
        }
      }
      // if(info.view.type === "dayGridMonth")

      // else{
      //   if (moment(info.start) > moment().add(-1,'day')){
      //     setAddModalActive(true)
      //     setAppointmentTime(info.start)
      //   }
      // }
      setTempDate(info.start);
    },
  };

  const JudgeWeekDay = (strDate, working_days) => {
    var strDateTime = strDate.toString().substring(0, 3);
    var allow = false;
    for (var i = 0; i < working_days.length; i++) {
      if (working_days[i].substring(0, 3) == strDateTime) {
        allow = true;
      }
    }
    return allow;
  };

  const handleSwitchToWeekView = (date) => {
    if (calendarRef.current) {
      // console.log(calendarApi)
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
      calendarApi.changeView("timeGridDay");
    }
  };


  const refreshList = () => {
    setRefreshLoading(true)
    getList();
    setTimeout(() => {
      setRefreshLoading(false)
    }, 8000);
  }

  childFunctionRef.current = refreshList;

  return (
    <>
      {businessHoursType && openDropdownBHours && (
        <div className="businessHours_container">
          {businessHoursType &&
            businessHoursType.map((item, index) => (
              <div
                className={
                  businessHours.name === item.name
                    ? "selected_dropdown_item"
                    : "dropdown_item"
                }
                key={index}
                onClick={() => addBuinessHoursClick(item)}
              >
                {/* <p className="dropdown_item_userName">{item.title}</p> */}
              </div>
            ))}
        </div>
      )}
      <button className="refreshButton" onClick={() => refreshList()} style={{ marginBottom: "10px" }}>
        {refreshLoading ? 'Refreshing...' : 'Refresh Calendar'}
      </button>
      <FullCalendar
        dateClick={(info) => {
          if (info.view.type === "dayGridMonth") {
            handleSwitchToWeekView(info.date);
          }
        }}
        ref={calendarRef}
        {...calendarOptions}
      />
    </>
  );
};

export default TempCalendar;
