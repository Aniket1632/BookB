import React, { useState } from "react";
import { inputPhoneMasking } from "../../utils/validators";
import stylist from "./onboarding.css";
const StylistDetails = ({
	nextStep,
	prevStep,
	state,
	setState,
	setShowAddModal,
	navigateLogin,
}) => {
	const [disableStylist, setDisableStylist] = useState(false);
	const [stylistError, setStylistError] = useState('');

	React.useEffect(() => {
		if (state &&
			state.step2 &&
			state.step2.stylist &&
			state.step2 &&
			state.step2.stylist.length === 1) {
			setDisableStylist(true);
		}
		else {
			setDisableStylist(false);
		}
	}, [state, setState]);

	// React.useEffect(() => {
	// 	if (state &&
	// 		state.step2 &&
	// 		state.step2.stylist &&
	// 		state.step2 &&
	// 		state.step2.stylist.length.toString() <= state.step2.selectedPackage.value.metadata.users) {
	// 		setStylistError('')
	// 	}
	// }, [state]);

	const next = () => {
		if (state &&
			state.step2 &&
			state.step2.stylist &&
			state.step2 &&
			state.step2.selectedPackage &&
			state.step2.selectedPackage.value &&
			state.step2.stylist.length.toString() > state.step2.selectedPackage.value.metadata.users) {
			setStylistError('You have selected more users than your plan.*')
			return;
		}
		else {
			setStylistError('')
		}
		state.step2.stylist && state.step2.stylist.length > 0
			? nextStep()
			: setShowAddModal(true);
	};


	return (
		<div>

			{!disableStylist && <div
				className="onboard_button"
				style={{ marginTop: "0rem", marginBottom: "20px", opacity: disableStylist ? '30%' : '100%' }}
			>
				<button className="button1" style={{ opacity: disableStylist ? '30%' : '100%', }} onClick={() => setShowAddModal(true)}>
					Add Stylist
				</button>
			</div>}

			<div className="form_container">
				<div className="form_container_box">
					<table className="tables" style={{ marginBottom: "10rem", backgroundColor: '#3D3D3D' }}>
						<thead>
							<tr>
								<th >#</th>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Delete stylist</th>
							</tr>
						</thead>
						<tbody>
							{state.step2.stylist?.length > 0 ? (
								state.step2.stylist.map((item, i) => {
									return (
										<tr key={i}>
											<td style={{ color: "#fff" }}>{i + 1}</td>
											<td style={{ color: "#fff" }}>{item.name}</td>
											<td style={{ color: "#fff" }}>{item.email}</td>
											<td style={{ color: "#fff" }}>
												{inputPhoneMasking(item.phone)}
											</td>
											<td>
												<button
													className="table__button table__button--delete"
													onClick={() => {
														const isSalonEmailIdentical =
															item.email ===
															state.step1.email
																.value;

														let newFormValues =
															state.step2.stylist;
														newFormValues.splice(
															i,
															1
														);

														setState((prevVal) => ({
															...prevVal,
															step1: {
																...prevVal.step1,
																multiRole: {
																	value: isSalonEmailIdentical
																		? false
																		: prevVal
																			.step1
																			.multiRole
																			.value,
																},
															},
															step2: {
																stylist:
																	newFormValues,
																checkboxState: {
																	status: isSalonEmailIdentical
																		? false
																		: prevVal
																			.step2
																			.checkboxState
																			.status,
																	email: isSalonEmailIdentical
																		? ""
																		: prevVal
																			.step2
																			.checkboxState
																			.email,
																},
															},
														}));
													}}
												>
													<svg className="table__button--icon-reds">
														<use
															xlinkHref={`/assets/sprite.svg#icon-delete`}
														/>
													</svg>
													<span>Delete Stylist</span>
												</button>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan="5" style={{ padding: 0 }}>
										<div style={{ backgroundColor: "#3D3D3D", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
											<h3 style={{ color: "#fff", margin: 5 }}>Add Stylist</h3>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{stylistError && <p style={{ color: 'red' }}>{stylistError}</p>}
			<div className="onboard_down" style={{ marginTop: "4rem" }}>
				<div className='onboard_down1'>
					<span onClick={navigateLogin}>Back to login</span>
				</div>
				<div className="onboard_button">
					<button onClick={prevStep} className="prev">
						Previous
					</button>
					<button onClick={next}>Next</button>
				</div>
			</div>
		</div>
	);
};

export default StylistDetails;
