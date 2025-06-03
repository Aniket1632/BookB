import React from 'react';
import formStyle from './orders.module.css';

const OrderData = ({
	showFilter,
	data,
	onChangeHandler,
	setModalSummaryState,
	setProductSummaryList,
	statusError,
	setStatus,
	statusList
}) => {
	return (
		<div className='tableContainer tableContainer_order' style={{ height: showFilter ? '63vh' : '65vh' }}>
			<table className='table'>
				<thead>
					<tr>
						<th>#</th>
						<th>Amount</th>
						<th>Other Amount</th>
						<th>Total Amount</th>
						<th>OrderBy</th>
						<th>Status</th>
						<th>Product Summary</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((d, index) => (
							<tr key={index}>
								<td>{d.orderId}</td>
								<td>$ {d.amount}</td>
								<td>$ {d.otherAmount}</td>
								<td>$ {d.totalAmount}</td>
								<td>
									{d.orderBy.name}
									{' (Phone: xxxx-xxx-' + d.orderBy.phone.substring(d.orderBy.phone.length - 4) + ')'}
								</td>
								<td>
									<select
										name='status'
										id='status'
										className={formStyle.selectBox}
										value={d.orderStatus}
										onChange={(e) => {
											d.orderStatus = e.target.value;
											setStatus(e.target.value);
											onChangeHandler(d, e.target.value);
										}}>
										{statusList &&
											statusList.map((status) => (
												<option value={status.value} key={status._id}>
													{status.name}
												</option>
											))}
									</select>
								</td>
								<td>
									<button
										className={formStyle.signDataAddBtn}
										onClick={() => {
											setProductSummaryList(d);
											setModalSummaryState(true);
										}}>
										<svg className={formStyle.signDataAddBtnIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-document`} />
										</svg>
										Order Details
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default OrderData;
