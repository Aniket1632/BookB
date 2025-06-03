import React from 'react';
import { inputPhoneMasking, unMasking } from '../../utils/validators';
import Styles from './Salon.module.css'

const SalonData = ({
	showFilter,
	data,
	setModalDeleteState,
	setShowAddModal,
	setSelectUpdateModel,
	setModalChangePasswordState,
	onChangeHandler,
	handleEditModalSalon,
	setModalSettingState,
	setAppMenu,
	setModalCancelSubscription
}) => {

	return (
		<div className={Styles.tableContainer} style={{ height: showFilter ? '63vh' : '65vh' }}>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Active</th>
						<th style={{ width: '1rem' }}>Cancel Subscription</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((d, index) => (
							<tr key={d._id}>
								<td>{index + 1}</td>
								<td style={{ textAlign: 'left' }}>{d.name}</td>
								<td>{d.email}</td>
								<td>{inputPhoneMasking(d.phone)}</td>
								<td>
									<label className='switch'>
										<input
											id={d._id}
											checked={d.active}
											onChange={() => {
												onChangeHandler(d)
											}}
											type='checkbox'
											className='checkbox'
											name='active'
										/>
										<span className='slider round' />
									</label>
								</td>
								<td style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} >
									<div onClick={() => {
										setModalCancelSubscription(true);
										setSelectUpdateModel(d);
									}}>
										{d.cancel_at_period_end ? (
											<p className='table__status'>
												<span>•</span> Active
											</p>
										) : (
											<p className='table__status_deactive'>
												<span>•</span> Deactive
											</p>
										)}
									</div>
								</td>
								<td>
									<div className='table__iconBox'>
										<button className='table__button' onClick={() => {
											setShowAddModal(true)
											setSelectUpdateModel(d);
											handleEditModalSalon(d);
										}}>
											<svg className='table__button--icon'>
												<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
											</svg>
											<span>Edit User Details</span>
										</button>
										<button className='table__button table__button--setting' onClick={() => {
											if (d.appMenu) {
												setAppMenu({
													"isVideo": d.appMenu && d.appMenu.isVideo,
													"isCheckin": d.appMenu && d.appMenu.isCheckin,
													"isPOS": d.appMenu && d.appMenu.isPOS,
												})
											} else {
												setAppMenu({
													"isVideo": false,
													"isCheckin": false,
													"isPOS": false
												})
											}
											setSelectUpdateModel(d);
											setModalSettingState(true);
										}}>
											<svg className='table__button--icon-setting'>
												<use xlinkHref={`/assets/sprite.svg#icon-setting`} />
											</svg>
											<span>App Setting</span>
										</button>
										<button className='table__button table__button--changepwd' onClick={() => {
											setModalChangePasswordState(true);
											setSelectUpdateModel(d);
										}}>
											<svg className='table__button--icon-green'>
												<use xlinkHref={`/assets/sprite.svg#icon-key`} />
											</svg>
											<span>Reset Password</span>
										</button>
										<button className='table__button table__button--delete' onClick={() => {
											setModalDeleteState(true);
											setSelectUpdateModel(d);
										}}>
											<svg className='table__button--icon-red'>
												<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
											</svg>
											<span>Delete User</span>
										</button>
										{/* <button className='table__button table__button--delete' onClick={() => {
											setModalCancelSubscription(true);
											setSelectUpdateModel(d);
										}}>
											<svg className='table__button--icon-red'>
												<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
											</svg>
											<span>Cancel Subscription</span>
										</button> */}
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div >
	);
};

export default SalonData;
