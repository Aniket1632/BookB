import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../components/Content/Content";
import AddAvailability from "./AddAvailability";
import StylistSessionStyles from "./StylistAvailability.module.css";
import AddBusinessHoursWeekly from "./AddBusinessHoursWeekly";
import { WeekDaysArray } from "./calendarData";
import {
  addBulkAvailabilityAction,
  addDailyAvailabilityAction,
  addDayAvailabilityAction,
  getUnBlockAvailabilitysAction,
  blockAppointmentAction,
} from "../../redux/actions/availabilityActions";

import {
  ADD_BULK_AVAILABILITYS_RESET,
  ADD_DAILY_AVAILABILITYS_RESET,
  ADD_DAY_AVAILABILITYS_RESET,
  DEL_BLOCK_AVAILABILITYS_RESET,
  GET_UNBLOCK_AVAILABILITYS_RESET,
} from "../../redux/constants/availabilityConstants";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import TempCalendar from "../../components/Calender/Temp";
import { useParams } from "react-router-dom";
import {
  addAppointmentAction,
  availabilityAppointmentAction,
  changeAppointmentAction,
  getAppointmentAction,
  getBusinessHourAction,
  updateAppointmentAction,
} from "../../redux/actions/appointmentAction";
import {
  ADD_APPOINTMENT_RESET,
  APPOINTMENT_AVAILIBILITY_RESET,
  APPOINTMENT_STATUS_LIST_RESET,
  CHANGE_APPOINTMENT_RESET,
  DELETE_APPOINTMENT_RESET,
  DELETE_SLOT_RESET,
  UPDATE_APPOINTMENT_RESET,
  UPDATE_APPOINTMENT_STATUS_RESET,
} from "../../redux/constants/appointmentConstants";
import DeleteAvailability from "./DeleteAvailability";
import WaitlistModal from "../Waitlist/WaitlistModal";
import AddSlotModal from "./AddSlotModal";
import CreateSlot from "./CreateSlotModal";
import { unMasking, validateEmail } from "../../utils/validators";
import DeleteAppointmentModal from "../Waitlist/DeleteAppointmentModal";
import { createStylistSettingsAction } from "../../redux/actions/stylistActions";

const NewStylistSessionScreen = ({ history, match, location, socket }) => {
  const { stylistName, stylistId } = useParams();
  const refreshRef = useRef(null);
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarApi, setCalendarApi] = useState(null);

  const store = useSelector((state) => state.calendar);
  const getUnblockAvailabilitys = useSelector(
    (state) => state.getUnblockAvailabilitys
  );
  const addDailyAvailabilitys = useSelector(
    (state) => state.addDailyAvailabilitys
  );
  const addBulkAvailabilitys = useSelector(
    (state) => state.addBulkAvailabilitys
  );
  const addDayAvailabilitys = useSelector((state) => state.addDayAvailabilitys);
  const availabilityAppointment = useSelector(
    (state) => state.availabilityAppointment
  );
  const appointmentStatusList = useSelector(
    (state) => state.appointmentStatusList
  );
  const changeAppointmentStatus = useSelector(
    (state) => state.changeAppointmentStatus
  );
  const delBlockAvailabilitys = useSelector(
    (state) => state.delBlockAvailabilitys
  );
  const addAppointment = useSelector((state) => state.addAppointment);
  const updateAppointment = useSelector((state) => state.updateAppointment);
  const deleteAppointment = useSelector((state) => state.deleteAppointment);
  const deleteSlot = useSelector((state) => state.deleteSlot);
  const getUserInfo = useSelector((state) => state.getUserInfo);
  const confirmAppointment = useSelector((state) => state.confirmAppointment);
  const publicAddAppointment = useSelector(
    (state) => state.publicAddAppointment
  );
  const userLogin = useSelector((state) => state.userLogin);
  const getBusinessHour = useSelector((state) => state.getBusinessHour);

  const [openDropdownBHours, setOpenDropdownBHours] = useState(false);
  const [businessHours, setBusinessHours] = useState({});

  const [selectUpdateModel, setSelectUpdateModel] = useState({});
  const [updateWaitlistModal, setUpdateWaitlistModal] = useState(false);
  const [getLatestData, setGetlatestData] = useState(false);
  const [createSlotModal, setCreateSlotModal] = useState(false);
  const [modalWaitlist, setModalWaitlist] = useState(false);
  const [deleteAptModal, setDeleteAptModal] = useState(false);
  const [addModalActive, setAddModalActive] = useState(false);
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [addBuinessHoursModal, setAddBuinessHoursModal] = useState(false);
  const [addSlotModal, setAddSlotModal] = useState(false);
  const [businessHourDetail, setBusinessHourDetail] = useState("");
  const [weekDays, setWeekDays] = useState(WeekDaysArray);
  const [resetHandler, setresetHandler] = useState(true);
  const [resetslot, setresetslot] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState();

  const [name, setName] = useState();
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slotId, setSlotId] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [requiredTime, setRequiredTime] = useState("");
  const [requiredTimeError, setRequiredTimeError] = useState("");
  const [service, setService] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState();
  const [appointmentId, setAppointmentId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [salon, setSalon] = useState();
  const [appointmentTime, setAppointmentTime] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [slotStatus, setSlotStatus] = useState("");
  const [changeSlotStatus, setChangeSlotStatus] = useState("");
  const [appointmentList, setAppointmentList] = useState("");
  const [recurringType, setRecurringType] = useState({
    value: "custom",
    error: "",
  });

  const [serviceIds, setServiceIds] = useState({
    mainServiceId: "",
    subServiceId: "",
  });

  const [totalPageSize, setTotalPageSize] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const pageLimit = 20;

  useEffect(() => {
    if (
      userLogin &&
      userLogin.userInfo &&
      userLogin.userInfo.data &&
      !userLogin.userInfo.data.token
    ) {
      history.push("/login");
    }
  }, [userLogin, history]);

  useEffect(() => {
    if (
      addDailyAvailabilitys &&
      addDailyAvailabilitys.session &&
      addDailyAvailabilitys.session.status
    ) {
      toast.success(addDailyAvailabilitys.session.message);
      setCreateSlotModal(false);
      setDate("");
      setStartTime("");
      dispatch({ type: ADD_DAILY_AVAILABILITYS_RESET });
    } else if (
      addDailyAvailabilitys &&
      addDailyAvailabilitys.session &&
      !addDailyAvailabilitys.session.status
    ) {
      toast.error(addDailyAvailabilitys.session.message);
      dispatch({ type: ADD_DAILY_AVAILABILITYS_RESET });
    }
  }, [addDailyAvailabilitys]);

  // useEffect(() => {
  //   if (
  //     addAppointment &&
  //     addAppointment.session &&
  //     addAppointment.session.status
  //   ) {
  //     toast.success(addAppointment.session.message);
  //     dispatch({ type: ADD_APPOINTMENT_RESET });
  //   } else if (
  //     addAppointment &&
  //     addAppointment.session &&
  //     !addAppointment.session.status
  //   ) {
  //     toast.error(addAppointment.session.message);
  //     dispatch({ type: ADD_APPOINTMENT_RESET });
  //   }
  // }, [addAppointment]);

  useEffect(() => {
    if (
      updateAppointment &&
      updateAppointment.session &&
      updateAppointment.session.status
    ) {
      toast.success(updateAppointment.session.message);
      dispatch({ type: UPDATE_APPOINTMENT_RESET });
    } else if (
      updateAppointment &&
      updateAppointment.session &&
      !updateAppointment.session.status
    ) {
      toast.error(updateAppointment.session.message);
      dispatch({ type: UPDATE_APPOINTMENT_RESET });
    }
  }, [updateAppointment]);

  useEffect(() => {
    if (
      availabilityAppointment &&
      availabilityAppointment.session &&
      availabilityAppointment.session.status === true
    ) {
      setAppointmentId(
        availabilityAppointment.session.result &&
          availabilityAppointment.session.result.appointmentId
      );
    }
  }, [availabilityAppointment]);

  useEffect(() => {
    if (
      deleteAppointment &&
      deleteAppointment.session &&
      deleteAppointment.session.status
    ) {
      toast.success(deleteAppointment.session.message);
      setDeleteModalActive(false);
      dispatch({ type: DELETE_APPOINTMENT_RESET });
      dispatch(availabilityAppointmentAction(slotId));
    } else if (
      deleteAppointment &&
      deleteAppointment.session &&
      !deleteAppointment.session.status
    ) {
      toast.error(deleteAppointment.session.message);
      dispatch({ type: DELETE_APPOINTMENT_RESET });
    }
  }, [deleteAppointment]);

  useEffect(() => {
    if (deleteSlot && deleteSlot.session && deleteSlot.session.status) {
      toast.success(deleteSlot.session.message);
      dispatch({ type: DELETE_SLOT_RESET });
    } else if (deleteSlot && deleteSlot.session && !deleteSlot.session.status) {
      toast.error(deleteSlot.session.message);
      dispatch({ type: DELETE_SLOT_RESET });
    }
  }, [deleteSlot]);

  useEffect(() => {
    if (
      confirmAppointment &&
      confirmAppointment.session &&
      confirmAppointment.session.status
    ) {
      toast.success(confirmAppointment.session.message);
      setBusinessHours({});
      setStartTime("");
      setService("");
      setDate("");
      setEmail("");
      setPhone("");
      setRequiredTime("");
      setAddModalActive(false);
      dispatch({ type: UPDATE_APPOINTMENT_STATUS_RESET });
    } else if (
      confirmAppointment &&
      confirmAppointment.session &&
      !confirmAppointment.session.status
    ) {
      toast.error(confirmAppointment.session.message);
      dispatch({ type: UPDATE_APPOINTMENT_STATUS_RESET });
    }
  }, [confirmAppointment]);

  useEffect(() => {
    if (
      addBulkAvailabilitys &&
      addBulkAvailabilitys.session &&
      addBulkAvailabilitys.session.status
    ) {
      toast.success(addBulkAvailabilitys.session.message);
      dispatch({ type: ADD_BULK_AVAILABILITYS_RESET });
    } else if (
      addBulkAvailabilitys &&
      addBulkAvailabilitys.session &&
      !addBulkAvailabilitys.session.status
    ) {
      toast.error(addBulkAvailabilitys.session.message);
      dispatch({ type: ADD_BULK_AVAILABILITYS_RESET });
    }
  }, [addBulkAvailabilitys]);

  useEffect(() => {
    if (
      addDayAvailabilitys &&
      addDayAvailabilitys.session &&
      addDayAvailabilitys.session.status
    ) {
      toast.success(addDayAvailabilitys.session.message);
      dispatch({ type: ADD_DAY_AVAILABILITYS_RESET });
    } else if (
      addDayAvailabilitys &&
      addDayAvailabilitys.session &&
      !addDayAvailabilitys.session.status
    ) {
      toast.error(addDayAvailabilitys.session.message);
      dispatch({ type: ADD_DAY_AVAILABILITYS_RESET });
    }
  }, [addDayAvailabilitys]);

  useEffect(() => {
    if (
      delBlockAvailabilitys &&
      delBlockAvailabilitys.sessions &&
      delBlockAvailabilitys.sessions.status
    ) {
      toast.success(delBlockAvailabilitys.sessions.message);
      dispatch({ type: DEL_BLOCK_AVAILABILITYS_RESET });
    } else if (
      delBlockAvailabilitys &&
      delBlockAvailabilitys.sessions &&
      !delBlockAvailabilitys.sessions.status
    ) {
      toast.error(delBlockAvailabilitys.sessions.message);
      dispatch({ type: DEL_BLOCK_AVAILABILITYS_RESET });
    }
  }, [delBlockAvailabilitys]);

  useEffect(() => {
    if (
      getBusinessHour &&
      getBusinessHour.session &&
      getBusinessHour.session.status &&
      getBusinessHour.session.data &&
      getBusinessHour.session.data.slots.length > 0
    ) {
      setBusinessHourDetail(getBusinessHour.session.data);
      setWeekDays(getBusinessHour.session.data.slots);
    } else {
      setWeekDays(WeekDaysArray);
      setBusinessHourDetail(
        getBusinessHour &&
          getBusinessHour.session &&
          getBusinessHour.session.status &&
          getBusinessHour.session.data
      );
    }
  }, [getBusinessHour]);

  const handleResetSlot = (e) => {
    e.preventDefault();
    setresetHandler(true);
    if (
      getBusinessHour &&
      getBusinessHour.session &&
      getBusinessHour.session.status &&
      getBusinessHour.session.data &&
      getBusinessHour.session.data.slots.length > 0
    ) {
      setBusinessHourDetail(getBusinessHour.session.data);
      setWeekDays(getBusinessHour.session.data.slots);
      setRecurringType({
        value:
          getBusinessHour.session.data &&
          getBusinessHour.session.data.stylist &&
          getBusinessHour.session.data.stylist.recurringType,
      });
    } else {
      setWeekDays(WeekDaysArray);
      setBusinessHourDetail(
        getBusinessHour &&
          getBusinessHour.session &&
          getBusinessHour.session.status &&
          getBusinessHour.session.data
      );
    }
    // setresetslot(true)
  };

  useEffect(() => {
    dispatch(getBusinessHourAction(stylistId));
  }, [addBuinessHoursModal]);

  useEffect(() => {
    if (
      changeAppointmentStatus &&
      changeAppointmentStatus.session &&
      changeAppointmentStatus.session.status === true
    ) {
      toast.success(changeAppointmentStatus.session.message);
      dispatch(availabilityAppointmentAction(slotId));
      dispatch({ type: CHANGE_APPOINTMENT_RESET });
    }
  }, [changeAppointmentStatus, dispatch]);

  useEffect(() => {}, [addDailyAvailabilitys, addDayAvailabilitys]);

  //Change Slot Status
  useEffect(() => {
    if (changeSlotStatus) {
      const formData = {
        slotId: slotId,
        status: changeSlotStatus,
        timeDataId: timeSlotId,
      };
      dispatch(changeAppointmentAction(formData, appointmentId));
    }
  }, [changeSlotStatus]);

  const handleAddModalClose = () => {
    setBusinessHours({});
    setStartTime("");
    setService("");
    setName("");
    setDate("");
    setEmail("");
    setPhone("");
    setRequiredTime("");
    setName("");
    setGender("");
    setAddModalActive(false);
    setAddBuinessHoursModal(false);
    setDeleteModalActive(false);
    setDeleteAptModal(false);
    setIsUpdate(false);
    setCreateSlotModal(false);
    setAddSlotModal(false);
    setDateError("");
    setStartTimeError("");
    setServiceError("");
    setRequiredTimeError("");
    setNameError("");
    setEmailError("");
    setPhoneError("");
  };
  const WaitlistModalClose = () => {
    setIsUpdate(false);
    setModalWaitlist(false);
    setStartTime("");
    setService("");
    setDate("");
    setEmail("");
    setPhone("");
    setRequiredTime("");
    setName("");
    setGender("");
    setTimeSlotId("");
    dispatch({ type: APPOINTMENT_AVAILIBILITY_RESET });
    dispatch({ type: APPOINTMENT_STATUS_LIST_RESET });
  };
  // ** Blank Event Object
  const blankEvent = {
    title: "",
    start: "",
    end: "",
    allDay: false,
    url: "",
    extendedProps: {
      calendar: "",
      guests: [],
      location: "",
      description: "",
    },
  };

  // useEffect(()=>{
  //   if (recurringType.value === '' && recurringType.value.trim() === '') {
  // 		setRecurringType({ ...recurringType, error: 'Please select recurring type' });
  //   }else{
  //     dispatch(createStylistSettingsAction({id:stylistId,recurringType: recurringType.value}))
  //   }
  // },[recurringType.value])

  const dateHour = (date, hour) => {
    let datetimeA = moment(date + " " + hour);
    return datetimeA.toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (date === "") {
      setDateError("Date required");
    } else if (startTime === "") {
      setStartTimeError("Time Required");
    } else if (!service) {
      setServiceError("Please Select Service");
    } else if (requiredTime === "") {
      setRequiredTimeError("Time Required");
    } else if (name === "") {
      setNameError("Please enter name");
    } else if (email === "") {
      setEmailError("Please enter email");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter valid email");
    } else if (phone === "") {
      setPhoneError("Please enter phone no.");
    } else if (gender === "") {
      setGenderError("Please enter your gender");
    } else {
      const data = {
        name: name,
        appointmentDate: dateHour(
          moment(date).format("l"),
          moment(startTime, "hh:mm").format("HH:mm")
        ),
        stylistId: stylistId,
        salon: salon,
        user: userId,
        isNewUser: userId ? false : true,
        // "salon": "61c305ce3ec74d504ed67e66",
        email: email,
        gender: gender,
        mobile: unMasking(phone),
        time: moment(startTime, "hh:mm").format("HH:mm"),
        slotId: slotId,
        timeData: {
          id: timeSlotId,
          timeAsAString: moment(startTime, "hh:mm").format("hh:mm a"),
          timeAsADate: moment(startTime, "hh:mm").format("HH:mm"),
        },
        availability: slotId,
        mainService: serviceIds.mainServiceId,
        requiredDuration: requiredTime,
        subService: serviceIds.subServiceId,
      };
      dispatch(addAppointmentAction(data, stylistId));

      setAddModalActive(false);
      setDateError("");
      setStartTimeError("");
      setServiceError("");
      setRequiredTimeError("");
      setName("");
      setNameError("");
      setEmailError("");
      setPhoneError("");
      setBusinessHours({});
      setStartTime("");
      setService("");
      setDate("");
      setEmail("");
      setPhone("");
      setRequiredTime("");
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (date === "") {
      setDateError("Date required");
    } else if (startTime === "") {
      setStartTimeError("Time Required");
    } else if (service === "") {
      setServiceError("Please Select Service");
    } else if (requiredTime === "") {
      setRequiredTimeError("Time Required");
    } else if (name === "") {
      setNameError("Please enter name");
    } else if (email === "") {
      setEmailError("Please enter email");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter valid email");
    } else if (phone === "") {
      setPhoneError("Please enter phone no.");
    } else if (gender === "") {
      setGenderError("Please enter your gender");
    } else {
      const data = {
        appointmentDate: date,
        stylistId: stylistId,
        user: userId,
        salon: salon,
        salon: "61c305ce3ec74d504ed67e66",
        isNewUser: false,
        slotStatus: slotStatus,
        name: name,
        email: email,
        gender: gender,
        mobile: unMasking(phone),
        id: appointmentId,
        availability: slotId,
        timeData: {
          id: timeSlotId,
          timeAsAString: moment(startTime, "hh:mm").format("hh:mm a"),
          timeAsADate: moment(startTime, "hh:mm").format("HH:mm"),
        },
        // "availability":name._id,
        //"mainService": service._id,
        mainService: serviceIds.mainServiceId,
        requiredDuration: requiredTime,
        subService: serviceIds.subServiceId,
      };

      dispatch(addAppointmentAction(data, stylistId));

      setAddModalActive(false);
    }
  };

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

  const getList = () => {
    getAppointmentAction(eventData, userLogin)
  }

  const convertMinutes = (str) => {
    var date = new Date(str);
    let time = moment(date, "hh:mm").format("HH:mm");
    return time;
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (date === "") {
      setDateError("Please enter a slot date");
    } else if (!startTime.trim() || startTime.trim() === "") {
      setStartTimeError("Please enter a slot time");
    } else {
      let data = {
        time: startTime,
        date: date,
      };
      dispatch(addDailyAvailabilityAction(data, stylistId));
    }
  };

  const handleUpdateSlot = (e) => {
    e.preventDefault();
    let data = {
      time: startTime,
      date: date,
      slotId: slotId,
      appointmentId: appointmentId,
      appointmentList: appointmentList,
      timeData: {
        id: timeSlotId,
        timeAsAString: moment(startTime, "hh:mm").format("hh:mm a"),
        timeAsADate: moment(startTime, "hh:mm").format("HH:mm"),
      },
    };
    dispatch(addDailyAvailabilityAction(data, stylistId));
  };

  const unBlockHandler = (date) => {
    let data = {
      time: convertMinutes(date),
      date: moment(date).format("MM-DD-YYYY"),
    };
    dispatch(addDailyAvailabilityAction(data, stylistId));
  };

  const addBuinessHoursClick = (event) => {
    if (event.name === "byWeeks") {
      setAddBuinessHoursModal(true);
    }
  };

  const addDayAvailabilityHandler = (date) => {
    let data = { date: moment(date).format("MM-DD-YYYY") };
    dispatch(addDayAvailabilityAction(data, stylistId));
  };

  const childFunctionRef = useRef();

const handleRefresh = () =>{
  childFunctionRef.current();
}

  return (
    <Content
      containerStyle={{ height: "92vh" }}
      headerTitle={"My Availability"}
      currentMenu={`${stylistId ? "stylist" : "stylist-sessions"}`}
      addBtn={false}
      addBtnText="Book Appointment"
      addBtnIcon="plus"
      addBtnClick={() => setAddModalActive(true)}
      showAppointment={false}
      stylistId={stylistId}
      addAppointment={addAppointment}
      updateAppointment={updateAppointment}
      deleteAppointment={deleteAppointment}
    >
      <div className={StylistSessionStyles.month}>
        <TempCalendar
       childFunctionRef={childFunctionRef}  
          data={{
            date,
            setGetlatestData,
            setDate,
            addBuinessHoursClick,
            setAddBuinessHoursModal,
            match,
            socket,
            startTime,
            setStartTime,
            setEndDate,
            endDate,
            setStartDate,
            startDate,
            dispatch,
            calendarRef,
            calendarApi,
            setCalendarApi,
            appointmentId,
            setAppointmentId,
            getUserInfo,

            store,
            blankEvent,
            setCreateSlotModal,
            addModalActive,
            setAddModalActive,

            appointments,
            setAppointments,
            openDropdownBHours,
            setOpenDropdownBHours,
            businessHours,
            setBusinessHours,
            addDailyAvailabilitys,
            addDayAvailabilitys,
            setModalWaitlist,
            unBlockHandler,
            addDayAvailabilityHandler,
            getUnblockAvailabilitys,
            userLogin,
            stylistId,
            setDeleteModalActive,
            setIsUpdate,
            addAppointment,
            updateAppointment,
            deleteAppointment,
            deleteSlot,
            confirmAppointment,
            publicAddAppointment,
            setSalon,
            setAddSlotModal,
            setAppointmentTime,
            addDailyAvailabilitys,
            addBulkAvailabilitys,
            setSlotId,
            setTimeSlotId,
            slotId,
            timeSlotId,
            setAppointmentList,
          }}
        />
      </div>

      <CreateSlot
        data={{
          createSlotModal,
          handleAddModalClose,
          handleCreateSlot,
          date,
          setDate,
          startTime,
          setStartTime,
          startTimeError,
          setStartTimeError,
          dateError,
          setDateError,
          isUpdate,
          handleUpdateSlot,
        }}
      />
      <WaitlistModal
        data={{
          modalWaitlist,
          dispatch,
          slotId,
          setAppointmentId,
          availabilityAppointment,
          appointmentStatusList,
          WaitlistModalClose,
          setDeleteAptModal,
          setIsUpdate,
          setAddModalActive,
          setAppointmentDetail,
          setUpdateWaitlistModal,
          setDate,
          setStartTime,
          setService,
          setName,
          setEmail,
          setPhone,
          setGender,
          setAppointmentId,
          serviceIds,
          setServiceIds,
          setSalon,
          addAppointment,
          setRequiredTime,
          setSlotStatus,
          changeSlotStatus,
          setChangeSlotStatus,
          setTimeSlotId,
        }}
      />

      <AddAvailability
        data={{
          addModalActive,
          handleAddModalClose,
          handleSubmit,
          selectUpdateModel,
          setUserId,

          date,
          setDate,

          dateError,
          setDateError,

          name,
          email,
          phone,

          setName,
          setEmail,
          setPhone,

          nameError,
          phoneError,
          emailError,

          setNameError,
          setPhoneError,
          setEmailError,

          startTime,
          setStartTime,
          startTimeError,
          setStartTimeError,

          requiredTime,
          setRequiredTime,
          requiredTimeError,
          setRequiredTimeError,

          service,
          setService,
          serviceError,
          setServiceError,
          setSelectUpdateModel,
          isUpdate,
          handleUpdateSubmit,
          gender,
          setGender,
          appointmentDetail,
          serviceIds,
          setServiceIds,
          genderError,
          setGenderError,
        }}
      />
      <DeleteAppointmentModal
        data={{
          deleteAptModal,
          setDeleteAptModal,
          appointmentId,
          dispatch,
        }}
      />

      <DeleteAvailability
        data={{
          deleteModalActive,
          setDeleteModalActive,
          handleAddModalClose,
          selectUpdateModel,
          setUserId,
          appointmentId,
          userLogin,
          dispatch,
          appointmentTime,
        }}
      />

      <AddBusinessHoursWeekly
        data={{
          businessHourDetail,
          weekDays,
          setWeekDays,
          handleRefresh,
          stylistId,
          getList,
          addBuinessHoursModal,
          setAddBuinessHoursModal,
          addBulkAvailabilitys,
          setGetlatestData,
          setresetHandler,
          resetHandler,
          setresetslot,
          handleResetSlot,
          recurringType,
          setRecurringType,
        }}
      />

      {/* <AddSlotModal
        data={{
          addSlotModal,
          setAddSlotModal,
          handleAddModalClose,
          setUserId,
          appointmentId,
          appointmentTime,
          convertMinutes,
          unBlockHandler,
          userLogin,
          dispatch,
          isUpdate
        }}
      />  */}
    </Content>
  );
};

export default NewStylistSessionScreen;
