import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import AppSettingStyles from './AppSetting.module.css';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import LoginScreenSkeleton from '../../components/Skeletons/AppSettings/LoginScreenSkeleton';

const RegisterScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [registerScreenData, setRegisterScreenData] = useState({});
	const [headingText, setHeadingText] = useState({ value: '', error: '' });
	const [subHeadingText, setSubHeadingText] = useState({ value: '', error: '' });
	const [registerButtonText, setRegisterButtonText] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (registerScreenData && registerScreenData._id) {
				setHeadingText({ value: registerScreenData.registerTitle, error: '' });
				setSubHeadingText({ value: registerScreenData.registerSubTitle, error: '' });
				setRegisterButtonText({ value: registerScreenData.registerButton, error: '' });
				setImageSrc(registerScreenData.registerBackgroundImageURL);
			}
		},
		[registerScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('register', token);
			setRegisterScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleChangeImage = (e) => {
		var file = e.target.files[0];
		var reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setImageSrc(reader.result);
			};
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (headingText.value === '' || headingText.value.trim() === '') {
			setHeadingText({ ...headingText, error: 'Please enter register heading text' });
		} else if (subHeadingText.value === '' || subHeadingText.value.trim() === '') {
			setSubHeadingText({ ...subHeadingText, error: 'Please enter register sub-heading text' });
		} else if (registerButtonText.value === '' || registerButtonText.value.trim() === '') {
			setRegisterButtonText({ ...registerButtonText, error: 'Please enter register button text' });
		} else if (!imageSrc) {
			setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		} else {
			let formData = new FormData();
			formData.append('registerTitle', headingText.value);
			formData.append('registerSubTitle', subHeadingText.value);
			formData.append('registerButton', registerButtonText.value);
			uploadFileData.data.length > 0 && formData.append('registerBackgroundImageURL', uploadFileData.data[0]);

			try {
				setLoading(true);
				await setSalonAppSetting('register', formData, token);
				// toast.success(data && data.message);
				toast.success('Register screen settings updated!');
				getData();
			} catch (error) {
				toast.error(error);
			}
			setLoading(false);
		}
	};

	return (
		<div className={AppSettingStyles.screenCard}>
			<h3 className={AppSettingStyles.screenCardTitle}>Register Screen Settings</h3>
			{loading ? (
				<LoginScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex' style={{ alignItems: 'flex-start' }}>
								<InputBox
									label='Register Heading Text'
									placeholder='eg, Register'
									value={headingText.value}
									onChange={(e) => setHeadingText({ value: e.target.value, error: '' })}
									errorMessage={headingText.error}
								/>
								<InputBox
									label='Register Sub-heading Text'
									placeholder='eg, Please enter your details to create an account'
									value={subHeadingText.value}
									onChange={(e) => setSubHeadingText({ value: e.target.value, error: '' })}
									errorMessage={subHeadingText.error}
								/>
							</div>
							<InputBox
								label='Register Button Text'
								placeholder='eg, Register'
								value={registerButtonText.value}
								onChange={(e) => setRegisterButtonText({ value: e.target.value, error: '' })}
								errorMessage={registerButtonText.error}
							/>
						</InputSections>
						<FileUpload
							label='Background Image'
							icon='upload'
							image={imageSrc}
							onChange={(e) => {
								handleChangeImage(e);
								setUploadFileData({ data: e.target.files, error: '' });
							}}
							errorMessage={uploadFileData.error}
							style={{ padding: '.5rem 1.5rem', paddingBottom: '1.5rem' }}
						/>
					</div>

					<ModalButton label='Save' icon='plus' onClick={handleSubmit} />
				</Fragment>
			)}
		</div>
	);
};

export default RegisterScreen;
