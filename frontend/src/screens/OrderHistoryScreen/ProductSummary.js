import React from 'react';
import Modal from '../../components/Modal';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';

const ProductSummary = ({ data }) => {
	const { modalSummaryState, onSummaryModalClose, productSummaryList } = data;
	return (
		<Modal show={modalSummaryState}>
			<ModalHeading heading='Product Summary' onClose={onSummaryModalClose} />
			<ModalForm>
				<div className='tableContainer' style={{ height: '40vh' }}>
					<table className='table'>
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
										<td>$ {d.productPrice}</td>
										<td>{d.quantity ? d.quantity : 0}</td>
										<td>$ {((d.quantity ? d.quantity : 0) * d.productPrice)}</td>
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
