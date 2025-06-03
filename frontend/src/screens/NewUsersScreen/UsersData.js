import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { inputPhoneMasking } from "../../utils/validators";
import Button from "../../components/formInputs/Button";
import Styles from "./Users.module.css";
import UserScreenSkeleton from "../../components/Skeletons/UserScreenSkeleton";

const UsersData = ({
	setUserId,
	showFilter,
	setNotes,
	data,
	setModalDeleteState,
	setSelectUpdateModelUser,
	handleEditModalUser,
	onChangeHandler,
	setModalDoumentState,
	setModalSettingState,
	addNotesModal,
	setAddNotesModal,
	sendMessageModal,
	setSendMessageModal,
	handleNoteModal,
	handleMessageModal,
	setModalLogOutUserState,
}) => {
	const getUserInfo = useSelector((state) => state.getUserInfo);
	// console.log(getUserInfo , "user")
	const [loading, setLoading] = useState(false);

	return (
		<>
			{loading ? (
				<UserScreenSkeleton />
			) : (
				<div
					className={Styles.tableContainer}
					style={{ height: showFilter ? "63vh" : "65vh" }}
				>
					<table className={Styles.table}>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								{/* <th>Salon Names</th> */}
								<th>Email</th>
								<th>Phone</th>
								<th>Gender</th>
								<th>Coins</th>
								<th>OS</th>
								<th>Active</th>
								<th>Action</th>
								<th>Notes</th>
								<th>Message</th>
							</tr>
						</thead>
						<tbody>
							{data &&
								data.map((d, index) => (
									<tr key={d._id}>
										<td>{index + 1}</td>
										<td style={{ textAlign: "left" }}>
											{" "}
											{d?.name}
										</td>
										<td>{d.email}</td>
										<td>
											{d && d.phone
												? inputPhoneMasking(
														d && d.phone
												  )
												: "NA"}
										</td>
										<td className="textCapitalize">
											{d.gender}
										</td>
										<td>
										<svg className={Styles.coinIcon}>
		                                   <use xlinkHref={`/assets/sprite.svg#icon-reward-coins`} />
	                                    </svg>
                                           <span>{d.coins}</span>
										</td>
										<td>
											{d.platform ? d.platform : "N/A"}
										</td>
										<Fragment>
											<td>
												<label className="switch">
													<input
														id={d._id}
														checked={d.active}
														onChange={(e) => {
															onChangeHandler(d);
														}}
														type="checkbox"
														className="checkbox"
														name="active"
													/>
													<span className="slider round" />
												</label>
											</td>
											<td>
												<div className="table__iconBox">
													<button
														className="table__button"
														onClick={() => {
															setSelectUpdateModelUser(
																d
															);
															handleEditModalUser(
																d
															);
														}}
													>
														<svg className="table__button--icon">
															<use
																xlinkHref={`/assets/sprite.svg#icon-edit`}
															/>
														</svg>
														<span>
															Edit User Details
															info
														</span>
													</button>
													<button
														className="table__button table__button--delete"
														onClick={() => {
															setSelectUpdateModelUser(
																d
															);
															setModalDeleteState(
																true
															);
														}}
													>
														<svg className="table__button--icon-red">
															<use
																xlinkHref={`/assets/sprite.svg#icon-delete`}
															/>
														</svg>
														<span>Delete User</span>
													</button>
													<button
														className="table__button table__button--delete"
														onClick={() => {
															setSelectUpdateModelUser(
																d
															);
															setModalLogOutUserState(
																true
															);
														}}
													>
														<svg className="table__button--icon-red">
															<use
																xlinkHref={`/assets/sprite.svg#icon-logout`}
															/>
														</svg>
														<span>Logout User</span>
													</button>
												</div>
											</td>
										</Fragment>
										<td>
											{/* {d.clientNote &&  */}
											<button
												className="table__button"
												onClick={() => {
													setUserId(d._id);
													setNotes(d.userNote);
													setAddNotesModal(true);
												}}
											>
												<svg className="table__button--icon">
													<use
														xlinkHref={`/assets/sprite.svg#icon-info`}
													/>
												</svg>
												{/* <span>{d.clientNote}</span> */}
											</button>
											{/* } */}
										</td>

										<td>
											<Button
												style={{ marginLeft: "0rem" }}
												label="Send Message"
												icon="message"
												onClick={() =>
													handleMessageModal(d)
												}
											></Button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default UsersData;
