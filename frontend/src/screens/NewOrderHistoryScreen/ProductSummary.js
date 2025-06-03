import React from 'react';
import Modal from '../../components/NewModal';
import ModalForm from '../../components/NewModal/ModalForm';
import ModalHeading from '../../components/NewModal/ModalHeading';
import Styles from './orders.module.css'
import { useSelector } from 'react-redux';

const ProductSummary = ({ data }) => {
	const { modalSummaryState, onSummaryModalClose, productSummaryList } = data;
	const userData = useSelector((state) => state.getUserInfo);

	return (
		<Modal show={modalSummaryState}>
			<ModalHeading heading='Product Summary' onClose={onSummaryModalClose} />
			<ModalForm>
				<div className={Styles.productSummaryTableContainer} style={{ height: '40vh' }}>
					<table className={Styles.productSummaryTable}>
						<thead>
							<tr>
								<th>#</th>
								<th>Product Name</th>
								<th>Product Amount</th>
								<th>Quantity</th>
								<th>Total Amount</th>
							</tr>
						</thead>
						<tbody>
							{productSummaryList &&
								productSummaryList.items &&
								productSummaryList.items.map((d, index) => (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{d.productName}</td>
										<td>{userData &&
											userData?.userInfo &&
											userData?.userInfo?.data &&
											userData?.userInfo?.data?.currency
										} {d.productPrice}</td>
										<td>{d.quantity ? d.quantity : 0}</td>
										<td>{userData &&
											userData?.userInfo &&
											userData?.userInfo?.data &&
											userData?.userInfo?.data?.currency
										} {((d.quantity ? d.quantity : 0) * d.productPrice)}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</ModalForm>
		</Modal>
	);
};

export default ProductSummary;
