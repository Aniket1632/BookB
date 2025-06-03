import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import { setSalonAppSetting, getSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import AppSettingStyles from './AppSetting.module.css';
import LoginScreenSkeleton from '../../components/Skeletons/AppSettings/LoginScreenSkeleton';

const LoginScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [loginScreenData, setLoginScreenData] = useState({});
	const [headingText, setHeadingText] = useState({ value: '', error: '' });
	const [subHeadingText, setSubHeadingText] = useState({ value: '', error: '' });
	const [loginButtonText, setLoginButtonText] = useState({ value: '', error: '' });

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

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (loginScreenData && loginScreenData._id) {
				setHeadingText({ value: loginScreenData.loginTitle, error: '' });
				setSubHeadingText({ value: loginScreenData.loginSubTitle, error: '' });
				setLoginButtonText({ value: loginScreenData.loginButton, error: '' });
				setImageSrc(loginScreenData.loginBackgroundImageURL);
			}
		},
		[loginScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('login', token);
			setLoginScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (headingText.value === '' || headingText.value.trim() === '') {
			setHeadingText({ ...headingText, error: 'Please enter login heading text' });
		} else if (subHeadingText.value === '' || subHeadingText.value.trim() === '') {
			setSubHeadingText({ ...subHeadingText, error: 'Please enter login sub-heading text' });
		} else if (loginButtonText.value === '' || loginButtonText.value.trim() === '') {
			setLoginButtonText({ ...loginButtonText, error: 'Please enter login button text' });
		} else if (!imageSrc) {
			setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		} else {
			let formData = new FormData();
			formData.append('loginTitle', headingText.value);
			formData.append('loginSubTitle', subHeadingText.value);
			formData.append('loginButton', loginButtonText.value);
			uploadFileData.data.length > 0 && formData.append('loginBackgroundImageURL', uploadFileData.data[0]);

			try {
				setLoading(true);
				await setSalonAppSetting('login', formData, token);
				// toast.success(data && data.message);
				setHeadingText({ value: '', error: '' });
				setSubHeadingText({ value: '', error: '' });
				setLoginButtonText({ value: '', error: '' });
				setImageSrc('');
				setUploadFileData({ data: '', error: '' });
				toast.success('Login screen settings updated!');
				getData();
			} catch (error) {
				toast.error(error);
			}
			setLoading(false);
		}
	};

	return (
		<div className={AppSettingStyles.screenCard}>
			<h3 className={AppSettingStyles.screenCardTitle}>Login Screen Settings</h3>
			{loading ? (
				<LoginScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex' style={{ alignItems: 'flex-start' }}>
								<InputBox
									label='Login Heading Text'
									placeholder='eg, Login'
									value={headingText.value}
									onChange={(e) => setHeadingText({ value: e.target.value, error: '' })}
									errorMessage={headingText.error}
								/>
								<InputBox
									label='Login Sub-heading Text'
									placeholder='eg, Please sign in to continue'
									value={subHeadingText.value}
									onChange={(e) => setSubHeadingText({ value: e.target.value, error: '' })}
									errorMessage={subHeadingText.error}
								/>
							</div>
							<InputBox
								label='Login Button Text'
								placeholder='eg, Login'
								value={loginButtonText.value}
								onChange={(e) => setLoginButtonText({ value: e.target.value, error: '' })}
								errorMessage={loginButtonText.error}
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

export default LoginScreen;
