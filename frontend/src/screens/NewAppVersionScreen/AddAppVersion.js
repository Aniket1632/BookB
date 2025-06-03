import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../components/NewModal';
import ModalHeading from '../../components/NewModal/ModalHeading';
import ModalForm from '../../components/NewModal/ModalForm';
import InputsSection from '../../components/NewModal/InputsSection';
import InputBox from '../../components/NewInputBox';
import ModalButton from '../../components/NewModal/ModalButton';
import TextareaBox from '../../components/NewTextareaBox';
import Styles from './Appversion.module.css'

const AddAppVersion = ({ data }) => {
	const {
		addModalActive,
		handleAddModalClose,
		handleSubmit,

		versionTitleAndroid,
		setVersionTitleAndroid,
		versionTitleAndroidError,
		setVersionTitleAndroidError,
		versionTitleIOS,
		setVersionTitleIOS,
		versionTitleIOSError,
		setVersionTitleIOSError,
		appDescription,
		setVersionDescription,
		versionDescriptionError,
		setVersionDescriptionError,
		isCompulsory,
		setIsCompulsory,
		isCompulsoryError,
		setIsCompulsoryError,

		androidStoreURL,
		setAndroidStoreURL,
		iosStoreURL,
		setIOSStoreURL,
		androidStoreURLError,
		setAndroidStoreURLError,
		iosStoreURLError,
		setIOSStoreURLError
	} = data;
	const createAppVersion = useSelector((state) => state.createAppVersion);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading='Add New Version' onClose={handleAddModalClose} />

			<ModalForm className={Styles.form} onSubmit={handleSubmit}>
				<InputsSection>
					<InputBox
						className={Styles.input}
						label='Android Version'
						icon='android'
						placeholder='eg, 0.0.1'
						value={versionTitleAndroid}
						onChange={(event) => {
							setVersionTitleAndroid(event.target.value);
							setVersionTitleAndroidError('');
						}}
						errorMessage={versionTitleAndroidError}
					/>
					<InputBox
						className={Styles.input}
						label='iOS Version'
						icon='apple'
						placeholder='eg, 0.0.1'
						value={versionTitleIOS}
						onChange={(event) => {
							setVersionTitleIOS(event.target.value);
							setVersionTitleIOSError('');
						}}
						errorMessage={versionTitleIOSError}
					/>
				</InputsSection>

				<InputsSection>
					<InputBox
						className={Styles.input}
						label='Android Store URL'
						icon='android'
						placeholder='eg, https://play.google.com/'
						value={androidStoreURL}
						onChange={(event) => {
							setAndroidStoreURL(event.target.value);
							setAndroidStoreURLError('');
						}}
						errorMessage={androidStoreURLError}
					/>
					<InputBox
						className={Styles.input}
						label='iOS Store URL'
						icon='apple'
						placeholder='eg, https://apps.apple.com/'
						value={iosStoreURL}
						onChange={(event) => {
							setIOSStoreURL(event.target.value);
							setIOSStoreURLError('');
						}}
						errorMessage={iosStoreURLError}
					/>
				</InputsSection>
				<InputsSection>
					<TextareaBox
						className={Styles.textArea}
						label='App Description'
						icon='info'
						placeholder='Enter App Description'
						value={appDescription}
						onChange={(event) => {
							setVersionDescription(event.target.value);
							setVersionDescriptionError('');
						}}
						errorMessage={versionDescriptionError}
					/>

					<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
						<label className='switch' >
							<input
								id='isPOS'
								checked={isCompulsory}
								onChange={() => {
									setIsCompulsory(!isCompulsory);
									setIsCompulsoryError('');
								}}
								type='checkbox'
								className='checkbox'
								name='active'
							/>
							<span className='slider round' />
						</label>
						<label htmlFor='active' className='inputBox__toggle--label' style={{ color: '#ffffff' }}>
							Compulsory
						</label>
					</div>
				</InputsSection>
				{createAppVersion && createAppVersion.loading ? (
					<ModalButton label={'Please wait'} icon={'plus'} />
				) : (
					<ModalButton label='Add New Version' icon='plus' onClick={handleSubmit} />
				)}
			</ModalForm>
		</Modal>
	);
};

export default AddAppVersion;
