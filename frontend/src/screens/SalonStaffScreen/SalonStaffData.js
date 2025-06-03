import React from 'react';
import { inputPhoneMasking } from '../../utils/validators';
import Styles from './SalonStaff.module.css';

const SalonStaffData = ({ showFilter, data, setModalDeleteState, setSelectUpdateModel, setModalChangePasswordState, handleEditModalUser, onChangeHandler }) => {

	const getRoleLabelHandler = (role) => {
		switch (role) {
			case 'admin':
				return 'Admin'
			case 'salon':
				return 'Salon'
			case 'stylist':
				return 'Stylist'
			case 'user':
				return 'User'
			case 'manager':
				return 'Manager'
			case 'superadmin':
				return 'Super Admin'
			case 'company':
				return 'Company'
			default:
				return role
		}
	};
	// console.log(data , "data");

	return (
		<div className={Styles.tableContainer} style={{ height: showFilter ? '63vh' : '65vh' }}>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th className='text_wrap_desc'>Address</th>
						<th>Role</th>
						<th>Active</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((d, index) => (
							<tr key={d._id}>
								<td>{index + 1}</td>
								<td style={{ textAlign: 'left' }}> {d.name}</td>
								<td>{d.email}</td>
								<td>{inputPhoneMasking(d.phone)}</td>
								<td>{d.address}</td>
								<td>{getRoleLabelHandler(d.role)}</td>
								<td>
									<label className='switch'>
										<input id={d._id}
											checked={d.active}
											onChange={() => {
												onChangeHandler(d)
											}}

											type='checkbox'
											className='checkbox'
											name='active' />
										<span className='slider round' />
									</label>
								</td>
								<td>
									{d.role !== 'superadmin' &&
										<div className='table__iconBox'>
											<button className='table__button' onClick={() => {
												setSelectUpdateModel(d);
												handleEditModalUser(d);
											}}>
												<svg className='table__button--icon'>
													<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
												</svg>
												<span>Edit User Details</span>
											</button>


											<button className='table__button table__button--changepwd' onClick={() => {
												setSelectUpdateModel(d);
												setModalChangePasswordState(true);
											}}>
												<svg className='table__button--icon-green'>
													<use xlinkHref={`/assets/sprite.svg#icon-key`} />
												</svg>
												<span>Change Password</span>
											</button>


											<button className='table__button table__button--delete' onClick={() => {
												setSelectUpdateModel(d);
												setModalDeleteState(true);
											}}>
												<svg className='table__button--icon-red'>
													<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
												</svg>
												<span>Delete User</span>
											</button>
										</div>
									}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default SalonStaffData;
