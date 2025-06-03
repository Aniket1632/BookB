import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/Modal/InputBox';
import ModalButtons from '../../components/Modal/ModalButtons';
import DeleteModalSkeleton from '../../components/Skeletons/DeleteModalSkeleton';

const DeletePackageModal = ({
	deletePackageModal,
	loading,
	handleDeletePackageModalClose,
	handleDeletePackage,
	data
}) => {
	const { deletePackageNameConfirm, setDeletePackageNameConfirm } = data;

	return (
		<Modal show={deletePackageModal.status}>
			<ModalHeading heading={`Delete ${deletePackageModal.data.name}`} />
			{loading ? (
				<DeleteModalSkeleton />
			) : deletePackageModal.data && deletePackageModal.data.plans && deletePackageModal.data.plans.length > 0 ? (
				<ModalForm style={{ marginBottom: '2.5rem' }}>
					<InputsSection style={{ width: '34rem' }}>
						<p className='dangerText'>
							This plan has pricing plans. <br />Please delete them first to delete this package.
						</p>
					</InputsSection>
					<ModalButtons cancelButtonLabel='Cancel' onCancel={handleDeletePackageModalClose} />
				</ModalForm>
			) : (
				<ModalForm style={{ marginBottom: '2.5rem' }} onSubmit={handleDeletePackage}>
					<InputsSection style={{ width: '34rem' }}>
						<InputBox
							label={`Enter ${deletePackageModal.data.name} to delete this package`}
							placeholder={deletePackageModal.data.name}
							value={deletePackageNameConfirm.value}
							onChange={(event) => {
								setDeletePackageNameConfirm({ value: event.target.value, error: '' });
							}}
							errorMessage={deletePackageNameConfirm.error}
							style={{ width: '30rem' }}
						/>
						<p className='dangerText'>
							Please note that this will delete this package entire data and will not be restored in future.
						</p>
					</InputsSection>

					{/* <InputsSection style={{ width: '34rem' }}>
						<p className='primaryText'>
							If your intension is to restrict this user from logging in, we recommend to change user active status
							instead of deleting.
						</p>
					</InputsSection> */}
					<ModalButtons
						submitButtonLabel='Delete Package'
						onSubmit={handleDeletePackage}
						cancelButtonLabel='Cancel'
						onCancel={handleDeletePackageModalClose}
					/>
				</ModalForm>
			)}
		</Modal>
	);
};

export default DeletePackageModal;
