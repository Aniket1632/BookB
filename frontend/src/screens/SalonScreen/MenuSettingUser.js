import React from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import settingStyle from './Salon.module.css'

const MenuSettingUser = ({ data }) => {
	const {
		appMenu,
		setAppMenu,
		onSettingModalClose,
		modalSettingState,
		onSettingHandler
	} = data;


	return (
		<Modal show={modalSettingState}>
			<ModalHeading heading='Salon App Settings' onClose={onSettingModalClose} />
			<ModalForm onSubmit={onSettingHandler} style={{ marginBottom: '2.5rem' }}>
				<InputsSectionColumn>
					<label className={settingStyle.form_input__label}>
						App Settings
					</label>
					<div className='flex' style={{ gap: '2rem' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
							<label className='switch'>
								<input
									id='isVideo'
									checked={appMenu.isVideo}
									onChange={() => {
										setAppMenu({ ...appMenu, isVideo: !appMenu.isVideo });
									}}
									type='checkbox'
									className='checkbox'
									name='active' />
								<span className='slider round' />
							</label>
							<label htmlFor='active' className='inputBox__toggle--label'>
								Video
							</label>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
							<label className='switch'>
								<input
									id='isCheckin'
									checked={appMenu.isCheckin}
									onChange={() => {
										setAppMenu({ ...appMenu, isCheckin: !appMenu.isCheckin });
									}}
									type='checkbox'
									className='checkbox'
									name='active' />
								<span className='slider round' />
							</label>
							<label htmlFor='active' className='inputBox__toggle--label'>
								Checkin
							</label>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
							<label className='switch'>
								<input
									id='isPOS'
									checked={appMenu.isPOS}
									onChange={() => {
										setAppMenu({ ...appMenu, isPOS: !appMenu.isPOS });
									}}
									type='checkbox'
									className='checkbox'
									name='active' />
								<span className='slider round' />
							</label>
							<label htmlFor='active' className='inputBox__toggle--label'>
								Point of Sales
							</label>
						</div>
					</div>
				</InputsSectionColumn>
				<ModalButton label='Update Settings' icon='setting' onClick={onSettingHandler} />
			</ModalForm>
		</Modal>
	);
};

export default MenuSettingUser;

