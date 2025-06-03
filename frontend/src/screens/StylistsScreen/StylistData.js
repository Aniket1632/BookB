import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StylistData = ({
	showFilter,
	data,
	setShowAddModal,
	setModalDeleteState,
	setSelectUpdateModel,
	handleEditModalStylist,
	setModalChangePasswordState,
	setStylistSettingsModal,
	onChangeHandler
}) => {
	const getUserInfo = useSelector((state) => state.getUserInfo);

	return (
		<div className='tableContainer' style={{ height: showFilter ? '63vh' : '65vh' }}>
			<table className='table'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Email</th>
						<th>Gender</th>
						{getUserInfo &&
							getUserInfo.userInfo &&
							getUserInfo.userInfo.data &&
							(getUserInfo.userInfo.data.role === 'salon' ||
								getUserInfo.userInfo.data.role === 'manager' ||
								getUserInfo.userInfo.data.role === 'superadmin') && <th>Active</th>}
						<th>Action</th>
						<th>Phone</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((d, index) => (
							<tr key={d._id}>
								<td>{index + 1}</td>
								<td style={{ textAlign: 'left' }}>{d.name}</td>
								<td>{d.email}</td>
								<td className='textCapitalize'>{d.gender}</td>

								{getUserInfo &&
									getUserInfo.userInfo &&
									getUserInfo.userInfo.data &&
									(getUserInfo.userInfo.data.role === 'salon' ||
										getUserInfo.userInfo.data.role === 'manager' ||
										getUserInfo.userInfo.data.role === 'superadmin') && (
										<td>
											<label className='switch'>
												<input
													id='active'
													checked={d.active}
													onChange={() => {
														onChangeHandler(d);
													}}
													type='checkbox'
													className='checkbox'
													name='active'
												/>
												<span className='slider round' />
											</label>
										</td>
									)}

								<td>
									<div className='table__iconBox'>
										{getUserInfo &&
											getUserInfo.userInfo &&
											getUserInfo.userInfo.data &&
											getUserInfo.userInfo.data.role === 'salon' && (
												<Link to={`stylist-sessions/${d._id}/${d.name}`} className='table__button--second'>
													<span>View Availabilities</span>
													<div className='table__button--secondIconContainer'>
														<svg className='table__button--secondIcon'>
															<use xlinkHref={`/assets/sprite.svg#icon-chevron-right`} />
														</svg>
													</div>
												</Link>
											)}
										{getUserInfo &&
											getUserInfo.userInfo &&
											getUserInfo.userInfo.data &&
											(getUserInfo.userInfo.data.role === 'salon' ||
												getUserInfo.userInfo.data.role === 'manager' ||
												getUserInfo.userInfo.data.role === 'superadmin') && (
												<Fragment>
													<button
														className='table__button'
														onClick={() => {
															setShowAddModal(true);
															setSelectUpdateModel(d);
															handleEditModalStylist(d);
														}}>
														<svg className='table__button--icon'>
															<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
														</svg>
														<span>Edit User Details</span>
													</button>
													<button
														className='table__button table__button--delete'
														onClick={() => {
															setSelectUpdateModel(d);
															setStylistSettingsModal(true);
														}}>
														<svg className='table__button--icon-red'>
															<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
														</svg>
														<span>Stylist Settings</span>
													</button>
													<button
														className='table__button table__button--changepwd'
														onClick={() => {
															setSelectUpdateModel(d);
															setModalChangePasswordState(true);
														}}>
														<svg className='table__button--icon-green'>
															<use xlinkHref={`/assets/sprite.svg#icon-key`} />
														</svg>
														<span>Reset Password</span>
													</button>
													<button
														className='table__button table__button--delete'
														onClick={() => {
															setModalDeleteState(true);
															setSelectUpdateModel(d);
														}}>
														<svg className='table__button--icon-red'>
															<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
														</svg>
														<span>Delete User</span>
													</button>

												</Fragment>
											)}
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default StylistData;
