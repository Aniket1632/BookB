import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { inputPhoneMasking } from '../../utils/validators';
import Button from '../../components/formInputs/Button'

const UsersData = ({
	setUserId,
	showFilter,
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
	setModalLogOutUserState
}) => {
	const getUserInfo = useSelector((state) => state.getUserInfo);

	return (
		<div className='tableContainer' style={{ height: showFilter ? '63vh' : '65vh' }}>
			<table className='table'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						{/* <th>Salon Names</th> */}
						{getUserInfo &&
							getUserInfo.userInfo &&
							getUserInfo.userInfo.data &&
							getUserInfo.userInfo.data.role !== 'stylist' && <th>Stylist</th>}
						<th>Email</th>
						<th>Phone</th>
						<th>Gender</th>
						<th>OS</th>
						<th>Active</th>
						<th>Action</th>
						{/* <th>Notes</th> */}
						<th>Message</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((d, index) => (
							<tr key={d._id}>
								<td>{index + 1}</td>
								<td style={{ textAlign: 'left' }}> {d.name}</td>
								{getUserInfo &&
									getUserInfo.userInfo &&
									getUserInfo.userInfo.data &&
									getUserInfo.userInfo.data.role !== 'stylist' && <td>{d.stylist.name} </td>}
								<td>{d.email}</td>
								<td>{d && d.phone ? inputPhoneMasking(d && d.phone) : 'NA'}</td>
								<td className='textCapitalize'>{d.gender}</td>
								<td>{d.platform ? d.platform : 'N/A'}</td>
								<Fragment>
									<td>
										<label className='switch'>
											<input
												id={d._id}
												checked={d.active}
												onChange={(e) => {
													onChangeHandler(d);
												}}
												type='checkbox'
												className='checkbox'
												name='active'
											/>
											<span className='slider round' />
										</label>
									</td>
									<td>
										<div className='table__iconBox'>
											<button
												className='table__button'
												onClick={() => {
													setSelectUpdateModelUser(d);
													handleEditModalUser(d);
												}}>
												<svg className='table__button--icon'>
													<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
												</svg>
												<span>Edit User Details</span>
											</button>
											<button
												className='table__button table__button--delete'
												onClick={() => {
													setSelectUpdateModelUser(d);
													setModalDeleteState(true);
												}}>
												<svg className='table__button--icon-red'>
													<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
												</svg>
												<span>Delete User</span>
											</button>
											<button
												className='table__button table__button--delete'
												onClick={() => {
													setSelectUpdateModelUser(d);
													setModalLogOutUserState(true);
												}}>
												<svg className='table__button--icon-red'>
													<use xlinkHref={`/assets/sprite.svg#icon-logout`} />
												</svg>
												<span>Logout User</span>
											</button>
										</div>
									</td>
								</Fragment>
								<td>
									{d.clientNote && <button
										className='table__button'
									>
										<svg className='table__button--icon'>
											<use xlinkHref={`/assets/sprite.svg#icon-info`} />
										</svg>
										<span>{d.clientNote}</span>
									</button>}
								</td>

								<td>
									<Button label='Send Message' icon='message' onClick={() => handleMessageModal(d)}></Button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default UsersData;
