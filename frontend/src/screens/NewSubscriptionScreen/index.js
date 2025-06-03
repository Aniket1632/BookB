import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Content from '../../components/Content/Content'
import Spinner from '../../components/Spinner/Spinner';
import { addSubscriptionAction, changeStatusSubscriptionAction, createPlanAction, deletePlanAction, deleteSubscriptionAction, getSubscriptionAction, updatePlanAction } from '../../redux/actions/subscriptionAction';
import { CREATE_NEW_SUBSCRIPTION_RESET, DELETE_SUBSCRIPTION_RESET, SUBSCRIPTION_STATUS_RESET } from '../../redux/constants/SubscriptionConstants';
import CreateSubscription from './CreateSubscription';
import DeleteSubscription from './DeleteSubscription';
import AllPackages from './AllPackages'
import AddPriceModal from './AddPriceModal';


const SubscriptionScreen = () => {
    const dispatch = useDispatch();
    const addSubscription = useSelector((state) => state.addSubscription);
    const getSubscription = useSelector((state) => state.getSubscription);
    const changeStatusSubscription = useSelector((state) => state.changeStatusSubscription);
    const deleteSubscription = useSelector((state) => state.deleteSubscription);

    const [addPackageModal, setAddPackageModal] = useState(false);
    const [deletePackageModal, setDeletePackageModal] = useState(false);
    const [editPackageModal, setEditPackageModal] = useState({ data: '', status: false });

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [monthlyPrice, setMonthlyPrice] = useState("");
    const [monthlyPriceError, setMonthlyPriceError] = useState("");
    const [annualPrice, setAnnualPrice] = useState("");
    const [annualPriceError, setAnnualPriceError] = useState("");
    const [maxCalendar, setMaxCalendar] = useState(1);
    const [maxCalendarError, setMaxCalendarError] = useState("");


    useEffect(() => {
        dispatch(getSubscriptionAction())
    }, [])

    useEffect(() => {
        if (addSubscription && addSubscription.data && addSubscription.data.status) {
            toast.success(addSubscription.data.message);
            getSubscriptionPackages()
            dispatch({ type: CREATE_NEW_SUBSCRIPTION_RESET });
            handleSubsModalClose();
        } else if (addSubscription && addSubscription.data && !addSubscription.data.status) {
            toast.error(addSubscription.data.message);
            dispatch({ type: CREATE_NEW_SUBSCRIPTION_RESET });
            handleSubsModalClose();
        }
    }, [addSubscription])

    useEffect(() => {
        if (changeStatusSubscription && changeStatusSubscription.data && changeStatusSubscription.data.status) {
            toast.success(changeStatusSubscription.data.message);
            getSubscriptionPackages()
            dispatch({ type: SUBSCRIPTION_STATUS_RESET });
        } else if (changeStatusSubscription && changeStatusSubscription.data && !changeStatusSubscription.data.status) {
            toast.error(changeStatusSubscription.data.message);
            dispatch({ type: SUBSCRIPTION_STATUS_RESET });
        }
    }, [changeStatusSubscription])

    useEffect(() => {
        if (deleteSubscription && deleteSubscription.data && deleteSubscription.data.status) {
            toast.success(deleteSubscription.data.message);
            getSubscriptionPackages()
            dispatch({ type: DELETE_SUBSCRIPTION_RESET });
            handleDeleteModalClose();
        } else if (deleteSubscription && deleteSubscription.data && !deleteSubscription.data.status) {
            toast.error(deleteSubscription.data.message)
            dispatch({ type: DELETE_SUBSCRIPTION_RESET });
            handleDeleteModalClose();
        }

    }, [deleteSubscription])



    const getSubscriptionPackages = async () => {
        const data = await dispatch(getSubscriptionAction());
        // setPackages(data);
    };


    const handleSubsModalClose = () => {
        setAddPackageModal(false)
        setEditPackageModal({ data: '', status: false })
        setName("");
        setNameError("");
        setDescription("");
        setDescriptionError("");
        setMaxCalendar(1);
        setMaxCalendarError("");
        setMonthlyPrice("");
        setMonthlyPriceError("");
        setAnnualPrice("");
        setAnnualPriceError("");
    }

    const handleDeleteModalClose = () => {
        setDeletePackageModal(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || name.trim() === "") {
            setNameError("Please Enter Name")
        } else if (name.length > 10) {
            setNameError("Name cannot exceed 10 characters")
        } else if (!description.trim() || description.trim() === "") {
            setDescriptionError("Description Required")
        } else if (!editPackageModal.status && (!monthlyPrice.trim() || monthlyPrice.trim() === "")) {
            setMonthlyPriceError("Monthly Price Required")
        } else if (!editPackageModal.status && (!annualPrice.trim() || annualPrice.trim() === "")) {
            setAnnualPriceError("Annual Price Required")
        } else {
            const formData = {
                name: name,
                description: description,
                metadata: {
                    users: maxCalendar,
                    calendars: maxCalendar
                }
            };

            const plans = [
                 {
                    amount: monthlyPrice,
                    interval: 'month'
                },
                {
                    amount: annualPrice,
                    interval: 'year'
                }
            ];

            if (editPackageModal && editPackageModal.data && editPackageModal.data.id) {
                dispatch(addSubscriptionAction({ ...formData, id: editPackageModal.data.id  }))
            } else {
                dispatch(addSubscriptionAction({ ...formData, plans: plans }))
            }
        }
    }

    const editPackageHandler = (d) => {
        setName(d.name);
        setDescription(d.description);
        setMaxCalendar(d.metadata.calendars);
    }


    const onChangeHandler = async (dataObj) => {
        if (dataObj && dataObj.id) {
            const data = await dispatch(
                changeStatusSubscriptionAction(dataObj.id, { active: !dataObj.active })
            );
            if (data && data.status === true) {
                toast.success('Package status changed');
                handleToggleModalClose();
                getSubscriptionPackages();
            } else if (data && data.status === 'fail') {
                toast.error(data.msg);
                handleToggleModalClose();
            }
        }
    };

    const onDeleteHandler = () => {
        if (deletePackageModal && deletePackageModal.data && deletePackageModal.data.id) {
            dispatch(deleteSubscriptionAction(deletePackageModal.data.id));
            handleDeleteModalClose();
        }
    };

    const handleToggleModalClose = () => {
        // setTogglePackageModal(false);
        setDeletePackageModal({ data: {}, status: false });
    };

    return (
        <Content
            currentMenu='subscription'
            headerTitle='Subscription'
            addBtn={true}
            addBtnText='Add Subscription'
            addBtnIcon='plus'
            addBtnClick={() => { setAddPackageModal(true) }}
        >
            {
                getSubscription.loading ? <Spinner />
                    :
                    <AllPackages
                        packages={getSubscription}
                        getPackages={getSubscriptionPackages}
                        setEditPackageModal={setEditPackageModal}
                        editPackageHandler={editPackageHandler}
                        setDeletePackageModal={setDeletePackageModal}
                        onChangeHandler={onChangeHandler}
                    />
            }


            <DeleteSubscription data={{ deletePackageModal, handleDeleteModalClose, onDeleteHandler }} />


            <CreateSubscription
                addPackageModal={addPackageModal || editPackageModal.status}
                data={{
                    editPackageModal,
                    handleSubsModalClose,

                    name,
                    setName,
                    nameError,
                    setNameError,

                    description,
                    setDescription,
                    descriptionError,
                    setDescriptionError,

                    maxCalendar,
                    setMaxCalendar,
                    maxCalendarError,
                    setMaxCalendarError,

                    monthlyPrice,
                    setMonthlyPrice,
                    monthlyPriceError,
                    setMonthlyPriceError,

                    annualPrice,
                    setAnnualPrice,
                    annualPriceError,
                    setAnnualPriceError,

                    handleSubmit
                }} />
        </Content>
    )
}

export default SubscriptionScreen

