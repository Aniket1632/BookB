import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Styles from "./Stylist.module.css";
import { inputPhoneMasking } from "../../utils/validators";
import UserScreenSkeleton from "../../components/Skeletons/UserScreenSkeleton";

const StylistData = ({
  showFilter,
  data,
  setShowAddModal,
  setModalDeleteState,
  setSelectUpdateModel,
  handleEditModalStylist,
  setModalChangePasswordState,
  setStylistSettingsModal,
  onChangeHandler,
  setUserId,
  setAddNotesModal,
  setNotes,
}) => {
  const getUserInfo = useSelector((state) => state.getUserInfo);
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
                <th className={Styles.th}>#</th>
                <th className={Styles.th}>Name</th>
                <th className={Styles.th}>Email</th>
                <th className={Styles.th}>Phone</th>
                <th className={Styles.th}>Gender</th>
                {/* <th className={Styles.th}>Coins</th> */}
                {getUserInfo &&
                  getUserInfo.userInfo &&
                  getUserInfo.userInfo.data &&
                  (getUserInfo.userInfo.data.role === "salon" ||
                    getUserInfo.userInfo.data.role === "manager" ||
                    getUserInfo.userInfo.data.role === "superadmin") && (
                    <th>Active</th>
                  )}
                <th>Action</th>
                {/* <th>Notes</th> */}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((d, index) => (
                  <tr key={d._id}>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "left" }}>{d.name}</td>
                    <td>{d.email}</td>
                    <td>
                      {d && d.phone ? inputPhoneMasking(d && d.phone) : "NA"}
                    </td>
                    <td className="textCapitalize">{d.gender}</td>
                    {/* <td>
										<svg className={Styles.coinIcon}>
		                                   <use xlinkHref={`/assets/sprite.svg#icon-reward-coins`} />
	                                    </svg>
                                           <span>100</span>
										</td> */}
                    {getUserInfo &&
                      getUserInfo.userInfo &&
                      getUserInfo.userInfo.data &&
                      (getUserInfo.userInfo.data.role === "salon" ||
                        getUserInfo.userInfo.data.role === "manager" ||
                        getUserInfo.userInfo.data.role === "superadmin") && (
                        <td>
                          <label className="switch">
                            <input
                              id="active"
                              checked={d.active}
                              onChange={() => {
                                onChangeHandler(d);
                              }}
                              type="checkbox"
                              className="checkbox"
                              name="active"
                            />
                            <span className="slider round" />
                          </label>
                        </td>
                      )}

                    <td>
                      <div className={Styles.table__iconBox}>
                        {getUserInfo &&
                          getUserInfo.userInfo &&
                          getUserInfo.userInfo.data &&
                          getUserInfo.userInfo.data.role === "salon" && (
                            <Link
                              to={`stylist-sessions/${d._id}/${d.name}`}
                              className={Styles.table__button__second}
                            >
                              <span>View Availabilities</span>
                              <div
                                className={
                                  Styles.table__button__secondIconContainer
                                }
                              >
                                <svg
                                  className={Styles.table__button__secondIcon}
                                >
                                  <use
                                    xlinkHref={`/assets/sprite.svg#icon-chevron-right`}
                                  />
                                </svg>
                              </div>
                            </Link>
                          )}
                        {getUserInfo &&
                          getUserInfo.userInfo &&
                          getUserInfo.userInfo.data &&
                          (getUserInfo.userInfo.data.role === "salon" ||
                            getUserInfo.userInfo.data.role === "manager" ||
                            getUserInfo.userInfo.data.role ===
                              "superadmin") && (
                            <Fragment>
                              <button
                                className={Styles.table__button}
                                onClick={() => {
                                  setShowAddModal(true);
                                  setSelectUpdateModel(d);
                                  handleEditModalStylist(d);
                                }}
                              >
                                <svg className="table__button--icon">
                                  <use
                                    xlinkHref={`/assets/sprite.svg#icon-edit`}
                                  />
                                </svg>
                                <span>Edit User Details</span>
                              </button>
                              {/* <button
                                className="table__button table__button--delete"
                                onClick={() => {
                                  setSelectUpdateModel(d);
                                  setStylistSettingsModal(true);
                                }}
                              >
                                <svg className="table__button--icon-red">
                                  <use
                                    xlinkHref={`/assets/sprite.svg#icon-setting`}
                                  />
                                </svg>
                                <span>Stylist Settings</span>
                              </button> */}
                              <button
                                className="table__button table__button__changepwd"
                                onClick={() => {
                                  setSelectUpdateModel(d);
                                  setModalChangePasswordState(true);
                                }}
                              >
                                <svg className="table__button--icon-green">
                                  <use
                                    xlinkHref={`/assets/sprite.svg#icon-key`}
                                  />
                                </svg>
                                <span>Reset Password</span>
                              </button>
                              <button
                                className="table__button table__button--delete"
                                onClick={() => {
                                  setModalDeleteState(true);
                                  setSelectUpdateModel(d);
                                }}
                              >
                                <svg className="table__button--icon-red">
                                  <use
                                    xlinkHref={`/assets/sprite.svg#icon-delete`}
                                  />
                                </svg>
                                <span>Delete User</span>
                              </button>
                            </Fragment>
                          )}
                      </div>
                    </td>
                    {/* <td>
										<button
											className='table__button' onClick={() => {
												setUserId(d._id);
												setNotes(d.userNote)
												setAddNotesModal(true)
											}}
										>
											<svg className='table__button--icon'>
												<use xlinkHref={`/assets/sprite.svg#icon-info`} />
											</svg>
										</button>
									</td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default StylistData;
