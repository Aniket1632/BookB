import React, { useEffect, useState } from "react";
import ProgressForm from "../../components/ProgressForm";
import BusinessHours from "./BusinessHours";
import "./onboarding.css";
import Payment from "./Payment";
import SalonInfo from "./SalonInfo";
import StylistDetails from "./StylistDetails";
import { useDispatch, useSelector } from "react-redux";
import { onBoardNewUserAction } from "../../redux/actions/onboardingActions";
import "./onboarding.css";
import imgSrc from "../../components/assets/check.gif";
import Button from "../../components/formInputs/Button";
import { useHistory } from "react-router-dom";
import AddStylistModal from "./AddStylistModal";
import Subscription from "./Subscription";
import Spinner from "../../components/Spinner/Spinner";
import { getEnableSubscriptionAction } from "../../redux/actions/subscriptionAction";
import { unMasking } from "../../utils/validators";

const OnBoarding = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const [currentStep, setCurrentStep] = React.useState(1);
	const [recurringType, setRecurringType] = useState("month");
	const [state, setState] = React.useState({
		step1: {
			name: { value: "", error: "" },
			email: { value: "", error: "" },
			phone: { value: "", error: "" },
			countryCode: { value: "", error: "" },
			address: { value: "", error: "" },
			password: { value: "", error: "" },
			passwordConfirm: { value: "", error: "" },
			multiRole: {
				value: false,
			},
		},
		// step2: { selectedPackage: { value: {}, error: "" } },
		step2: {
			stylist: [],
			checkboxState: {
				status: false,
				email: "",
			},
		},
		step3: [
			{ day: "Sun", slot: [] },
			{ day: "Mon", slot: [] },
			{ day: "Tue", slot: [] },
			{ day: "Wed", slot: [] },
			{ day: "Thu", slot: [] },
			{ day: "Fri", slot: [] },
			{ day: "Sat", slot: [] },
		],
		step4: { paymentData: {} },
	});

	const onBoardComplete = useSelector((state) => state.onBoardComplete);
	const [showAddModal, setShowAddModal] = useState(false);
	const [couponData, setCouponData] = useState({});

	

	// useEffect(() => {
	// 	dispatch(getEnableSubscriptionAction());
	// }, []);


	const navigateLogin = () => {
		history.push("/login");
	};

	const handleSubmit = (paymentData) => {
		const salon = {
			name: state.step1.name.value,
			email: state.step1.email.value,
			phone: unMasking(state.step1.phone.value),
			countryCode: state.step1.countryCode.value,
			address: state.step1.address.value,
			password: state.step1.password.value,
			multiRole: state.step1.multiRole.value,
		};
		let formData = {
			salon,
			stylist: state.step2.stylist,
			 maxCalendar: 1,
			businessHours: state.step3,
			payment: paymentData,
			subscription: {
				package: state.step4.package,
				plan: state.step4.plan,
				quantity: state.step4.quantity,
				maxCalendar: 1
			},
		};
		dispatch(onBoardNewUserAction(formData));
	};

	//to next screen
	const nextStep = () => {
		setCurrentStep((previousStep) => previousStep + 1);
	};

	//to previous screen
	const prevStep = () => {
		setCurrentStep((previousStep) => previousStep - 1);
	};

	const handleAddModalClose = () => {
		setShowAddModal(false);
	};

	const multiForm = () => {
		switch (currentStep) {
			case 1:
				return (
					<SalonInfo
						nextStep={nextStep}
						setState={setState}
						state={state}
						navigateLogin={navigateLogin}
					/>
					// <Payment
					// 	prevStep={prevStep}
					// 	handleSubmit={handleSubmit}
					// 	setState={setState}
					// 	state={state}
					// 	couponData={couponData}
					// 	setCouponData={setCouponData}
					// 	navigateLogin={navigateLogin}
					// />
				);

			// case 2:
			// 	return (
			// 		<Subscription
			// 			prevStep={prevStep}
			// 			nextStep={nextStep}
			// 			recurringType={recurringType}
			// 			setRecurringType={setRecurringType}
			// 			setState={setState}
			// 			state={state}
			// 			navigateLogin={navigateLogin}
			// 		/>
			// 	);
			case 2:
				return (
					<StylistDetails
						nextStep={nextStep}
						prevStep={prevStep}
						setState={setState}
						state={state}
						setShowAddModal={setShowAddModal}
						navigateLogin={navigateLogin}
					/>
				);
			case 3:
				return (
					<BusinessHours
						prevStep={prevStep}
						nextStep={nextStep}
						data={state.step3}
						navigateLogin={navigateLogin}
					/>
				);
			case 4:
				return (
					<Payment
						prevStep={prevStep}
						handleSubmit={handleSubmit}
						setState={setState}
						state={state}
						couponData={couponData}
						setCouponData={setCouponData}
						navigateLogin={navigateLogin}
					/>
				);

			default:
				break;
		}
	};

	return (
		<div
			className="onboarding"
			style={{ backgroundImage: "url('./assets/39084.png')" }}
		>
			<div className="onboarding-container">
				<div className="onboard_img"></div>
				<div className="onboard_container">
					{onBoardComplete && onBoardComplete.loading ? (
						<Spinner />
					) : (
						<>
							{onBoardComplete &&
							onBoardComplete.data &&
							onBoardComplete.data.status ? (
								<div className="congrats_onboard_container">
									<h1 style={{color: 'white'}}>You made it!</h1>
									<div className="congrats_list">
										<div className="congrats_btn_list1">
											<div className="sub-container">
												<h2 style={{color: 'white'}}>
													Salon created successfully
												</h2>
												<img
													src={imgSrc}
													style={{ width: "50px" }}
												/>
											</div>
										</div>
										<div className="congrats_btn_list2">
											<div className="sub-container">
												<h2 style={{color: 'white'}}>
													Stylist created successfully
												</h2>
												<img
													src={imgSrc}
													style={{ width: "50px" }}
												/>
											</div>
										</div>

										<div className="congrats_btn_list3">
											<div className="sub-container">
												<h2 style={{color: 'white'}}>Payment successfull</h2>
												<img
													src={imgSrc}
													style={{ width: "50px" }}
												/>
											</div>
										</div>
									</div>
									<Button
										label="Login"
										onClick={navigateLogin}
										icon="arrow_right"
									/>
								</div>
							) : (
								<>
									<ProgressForm step={currentStep} />
									{multiForm()}
								</>
							)}
						</>
					)}
				</div>
			</div>
			<AddStylistModal
				props={{
					showAddModal,
					handleAddModalClose,
					state,
					setState,
				}}
			/>
		</div>
	);
};

export default OnBoarding;
