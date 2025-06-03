import React, { Fragment, useState, useEffect } from 'react';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import AppSettingStyles from './AppSetting.module.css';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import { toast } from 'react-toastify';
import MyProfileScreenSkeleton from '../../components/Skeletons/AppSettings/MyProfileScreenSkeleton';

const MyProfileScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [myProfileScreenData, setMyProfileScreenData] = useState({});
	const [screenHeadingText, setScreenHeadingText] = useState({ value: '', error: '' });
	const [yourStylistDetailsText, setYourStylistDetails] = useState({ value: '', error: '' });
	const [yourSalonDetailsText, setYourSalonDetailsText] = useState({ value: '', error: '' });
	const [yourPreviousOrdersText, setYourPreviousOrdersText] = useState({ value: '', error: '' });
	const [logoutButtonText, setLogoutButtonText] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (myProfileScreenData && myProfileScreenData._id) {
				setScreenHeadingText({ value: myProfileScreenData.profileScreenHeadingText, error: '' });
				setYourStylistDetails({ value: myProfileScreenData.profileStylistDetailText, error: '' });
				setYourSalonDetailsText({ value: myProfileScreenData.profileSalonDetailText, error: '' });
				setYourPreviousOrdersText({ value: myProfileScreenData.profilePreviousOrderText, error: '' });
				setLogoutButtonText({ value: myProfileScreenData.profileLogoutText, error: '' });
				setImageSrc(myProfileScreenData.profileHeaderImageURL);
			}
		},
		[myProfileScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('profile', token);
			setMyProfileScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
	  
		let isFormValid = true;
		const validateInput = (value, setError, errorMessage) => {
			if (!value || !value.trim()) {
			  setError({ value, error: errorMessage });
			  isFormValid = false;
			} else {
			  setError({ value, error: '' });
			}
		  };
	  
		validateInput(screenHeadingText.value, setScreenHeadingText, 'Please enter screen heading text');
		validateInput(yourStylistDetailsText.value, setYourStylistDetails, 'Please enter your stylist details text');
		validateInput(yourSalonDetailsText.value, setYourSalonDetailsText, 'Please enter your salon details text');
		validateInput(yourPreviousOrdersText.value, setYourPreviousOrdersText, 'Please enter your previous orders text');
		validateInput(logoutButtonText.value, setLogoutButtonText, 'Please enter logout button text');
	  
		if (!imageSrc) {
		  setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		  isFormValid = false;
		} else {
		  setUploadFileData({ ...uploadFileData, error: '' });
		}
	  
		if (isFormValid) {
		  let formData = new FormData();
		  formData.append('profileScreenHeadingText', screenHeadingText.value);
		  formData.append('profileStylistDetailText', yourStylistDetailsText.value);
		  formData.append('profileSalonDetailText', yourSalonDetailsText.value);
		  formData.append('profilePreviousOrderText', yourPreviousOrdersText.value);
		  formData.append('profileLogoutText', logoutButtonText.value);
	  
		  try {
			setLoading(true);
			await setSalonAppSetting('profile', formData, token);
			toast.success('My Profile screen settings updated!');
			getData();
		  } catch (error) {
			toast.error(error);
		  }
		  setLoading(false);
		}
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

	return (
		<div className={AppSettingStyles.screenCard}>
			<h3 className={AppSettingStyles.screenCardTitle}>My Profile Screen Settings</h3>
			{loading ? (
				<MyProfileScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex'>
							<InputBox label='My Profile Screen Heading Text' placeholder='eg, Shop' value={screenHeadingText.value}
 								 onChange={(e) => setScreenHeadingText({ value: e.target.value, error: '' })}
 										 errorMessage={screenHeadingText.error}/>
											
									<InputBox
										label='Your Stylist Details Text'
										placeholder='eg, Your Stylist Details'
										value={yourStylistDetailsText.value}
										onChange={(e) => setYourStylistDetails({ value: e.target.value, error: '' })}
										errorMessage={yourStylistDetailsText.error}
										/>

							</div>
							<div className='flex'>
								<InputBox
									label='Your Salon Details Text'
									placeholder='eg, Your Salon Details'
									value={yourSalonDetailsText.value}
									onChange={(e) => setYourSalonDetailsText({ value: e.target.value, error: '' })}
									errorMessage={yourSalonDetailsText.error}
								/>
									
								<InputBox
									label='Your Previous Orders Text'
									placeholder='eg, Your Previous Orders'
									value={yourPreviousOrdersText.value}
									onChange={(e) => setYourPreviousOrdersText({ value: e.target.value, error: '' })}
									errorMessage={yourPreviousOrdersText.error}
								/>
								
							</div>
							<InputBox
								label='Logout Button Text'
								placeholder='eg, Logout from your account'
								value={logoutButtonText.value}
								onChange={(e) => setLogoutButtonText({ value: e.target.value, error: '' })}
								errorMessage={logoutButtonText.error}
							/>
						
						</InputSections>
						<FileUpload
							label='Header Image'
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

export default MyProfileScreen;
