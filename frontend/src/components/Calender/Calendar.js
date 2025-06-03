import { useEffect, useRef, Fragment, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "./Calender.css";
import { getUnBlockAvailabilitysAction } from "../../redux/actions/availabilityActions";

const Calendar = ({ data }) => {
  const {
    date,
    setDate,
    setStartTime,
    calendarRef,
    setAddModalActive,
    setAddBuinessHoursModal,
    appointments,

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

    unBlockHandler,
    addDayAvailabilityHandler,
    getUnblockAvailabilitys,
    userLogin,
  } = data;


  let [appointmentData, setAppointmentData] = useState([]);
  let temp = [...appointmentData];

  const getList = (date) => {
    getUnBlockAvailabilitysAction(date, userLogin).then((res) => {
      temp.push(res.data.data);
      setAppointmentData(temp);
    });
  };

  let dateArray =
    appointmentData && appointmentData.length > 0
      ? appointmentData.map((item) => ({
        date: item ? item.dateAsADate : "",
      }))
      : "";


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


  // const viewChangeHandler = (viewArgs) => {
  //   if (viewArgs.view.type === "timeGridDay") {
  //     let elements = document.querySelectorAll(".td-extra");
  //     if (elements && elements.length > 0) {
  //     }
  //     for (let i = 0; i < elements.length; i++) {
  //       elements[i].remove();
  //     }
  //   } else if (viewArgs.view.type === "timeGridWeek") {
  //     let slots = document.querySelectorAll(".fc-timegrid-slots");
  //     if (
  //       slots[0] &&
  //       slots[0].childNodes[0] &&
  //       slots[0].childNodes[0].childNodes[1] &&
  //       slots[0].childNodes[0].childNodes[1].childNodes[0] &&
  //       (
  //         slots[0].childNodes[0].childNodes[1].childNodes[0].innerHTML.match(
  //           new RegExp("</td>", "g")
  //         ) || []
  //       ).length < 3
  //     ) {
  //       for (
  //         let i = 0;
  //         i < slots[0].childNodes[0].childNodes[1].childNodes.length;
  //         i++
  //       ) {
  //         slots[0].childNodes[0].childNodes[1].childNodes[i].innerHTML +=
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
  //           "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>";
  //       }
  //     }
  //   } else if (viewArgs.view.type === "dayGridMonth") {
  //   }
  // };

  const viewChangeHandler = (viewArgs) => {
    if (viewArgs.view.type === "timeGridDay") {
      // Code for handling timeGridDay view (unchanged)
      let elements = document.querySelectorAll(".td-extra");
      for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
      }
    } else if (viewArgs.view.type === "timeGridWeek") {
      // Code for handling timeGridWeek view
      let slots = document.querySelectorAll(".fc-timegrid-slots");
      if (
        slots[0] &&
        slots[0].childNodes[0] &&
        slots[0].childNodes[0].childNodes[1] &&
        slots[0].childNodes[0].childNodes[1].childNodes[0] &&
        (
          slots[0].childNodes[0].childNodes[1].childNodes[0].innerHTML.match(
            new RegExp("</td>", "g")
          ) || []
        ).length < 3
      ) {
        for (
          let i = 0;
          i < slots[0].childNodes[0].childNodes[1].childNodes.length;
          i++
        ) {
          // Customize this part based on your requirements for week view
          slots[0].childNodes[0].childNodes[1].childNodes[i].innerHTML +=
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>" +
            "<td class='fc-timegrid-slot fc-timegrid-slot-lane td-extra'><button class='dayButton'>CLICK TO UNBLOCK</button></td>";
        }
      }
      // Customize this part based on your requirements for the week header
      let weekHeader = document.querySelector(".fc-axis.fc-time.fc-widget-header");
      if (weekHeader) {
        weekHeader.style.display = "block"; // Show the week header
      }
    } else if (viewArgs.view.type === "dayGridMonth") {
      // Code for handling dayGridMonth view
      let dayNumbers = document.querySelectorAll(".fc-day-number");
      for (let i = 0; i < dayNumbers.length; i++) {
        // Customize this part based on your requirements for month view
        dayNumbers[i].style.display = "none";
      }
      // Customize this part based on your requirements for the week header
      let weekHeader = document.querySelector(".fc-axis.fc-time.fc-widget-header");
      if (weekHeader) {
        weekHeader.style.display = "none"; // Hide the week header
      }
    }
  };
  
  const convertMinutes = (str) => {
    var date = new Date(str);
    let time = moment(date, "hh:mm").format("HH:mm");
    return time;
  };

  const handleSubmit = (info) => {
    setDate(moment(info.start, "YYYY-dd-mm"));
    setStartTime(convertMinutes(info.start));
  };

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
      setAddBuinessHoursModal(false);
      setOpenDropdownBHours(false);
      document.querySelectorAll(".dayButton").forEach(function (el) {
        el.style.display = "block";
      });
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <button className="dayButton">UNBLOCKED</button>
      </>
    );
  }

  const rederNoEventContent = (eventInfo) => {
    eventInfo.el.innerHTML +=
      "<button class='dayButton' >Click to Unblock</button> ";
  };

  const dateClickHandle = (info) => {
    //   dispatch(getUnBlockAvailabilitysAction(moment(info.date).format('MM-DD-YYYY')));
  };

  // ** calendarOptions(Props)
  const calendarOptions = {
    // events: appointments,
    events: dateArray,
    eventContent: renderEventContent,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "prev,today,next,bookAppointment",
      center: "title",
      end: "businessHour,dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    dateClick: dateClickHandle,
    customButtons: {
      // businessHour: {
      //   // icon: 'fc-icon-chevron-right',
      //   text: "Business Hours",
      //   click() {
      //     setOpenDropdownBHours(!openDropdownBHours);
      //   },
      // },
      bookAppointment: {
        // icon: 'fc-icon-chevron-right',
        text: "Book Appointment",
        click() {
          setAddModalActive(true);
        },
      },
    },
    editable: true,
    eventResizableFromStart: false,
    // dragScroll: true,
    navLinks: false,
    ref: calendarRef,
    direction: "ltr",
    selectable: true,
    selectMirror: false,
    selectOverlap: true,
    slotDuration: "00:15:00",
    allDaySlot: true,
    // selectConstraint: "businessHours",
    eventConstraint: "businessHours",
    viewClassNames(viewArgs) {
      viewChangeHandler(viewArgs);
    },
    viewDidMount(viewArgs) {
      viewChangeHandler(viewArgs);
    },
    businessHours: [
      {
        dow: [1, 2, 3, 4, 5, 6, 7], // Monday - Friday
        start: "12:00",
        end: "20:00",
      },
      {
        dow: [1, 2, 3, 4, 5, 6, 7], // Monday - Friday (if adding lunch hours)
        start: "12:00",
        end: "20:00",
      },
    ],

    select(info) {
      if (info.allDay) {
        addDayAvailabilityHandler(info.start);
        // dispatch(getUnBlockAvailabilitysAction(moment(info.start).format('MM-DD-YYYY')));
      } else {
        unBlockHandler(info.start);
        // dispatch(getUnBlockAvailabilitysAction(moment(info.start).format('MM-DD-YYYY')));
      }

      let ele = info.jsEvent.srcElement;
      ele.remove();
    },

    eventClick: function (info) {
      // console.log(info);
      // handleSubmit(clickedEvent);
      // setAddModalActive(true);
    },

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

    slotLaneDidMount(datedayRenderInfo) {
      return (datedayRenderInfo.el.innerHTML +=
        "<button class='dayButton' data-date='" +
        datedayRenderInfo.date +
        "'>CLICK TO UNBLOCK</button> ");
    },

    dayCellDidMount(datedayRenderInfo) {
      // dispatch(getUnBlockAvailabilitysAction(moment(datedayRenderInfo.date).format('MM-DD-YYYY'))).then(data=>temp.push(data));
      getList(moment(datedayRenderInfo.date).format("MM-DD-YYYY"));

      // (datedayRenderInfo.el.innerHTML +=
      // 	"<button class='dayButton' data-date='" + datedayRenderInfo.date + "'>UNBLOCK THIS DAY</button>")
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

  return (
    <Fragment>
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
                <p className="dropdown_item_userName"> {item.title}</p>
              </div>
            ))}
        </div>
      )}
      <FullCalendar {...calendarOptions} />{" "}
    </Fragment>
  );
};

export default Calendar;
