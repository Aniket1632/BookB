import React, { Fragment, useState, useEffect } from 'react';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import AppSettingStyles from './AppSetting.module.css';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import { toast } from 'react-toastify';
import HomeScreenSkeleton from '../../components/Skeletons/AppSettings/HomeScreenSkeleton';

const HomeScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [homeScreenData, setHomeScreenData] = useState({});
	const [stylistHeadingText, setStylistHeadingText] = useState({ value: '', error: '' });
	const [productsHeadingText, setProductsHeadingText] = useState({ value: '', error: '' });
	const [videosHeadingText, setVideosHeadingText] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (homeScreenData && homeScreenData._id) {
				setStylistHeadingText({ value: homeScreenData.stylistHeaderTitle, error: '' });
				setProductsHeadingText({ value: homeScreenData.productHeaderTitle, error: '' });
				setVideosHeadingText({ value: homeScreenData.videoHeaderTitle, error: '' });
				setImageSrc(homeScreenData.headerImageURL);
			}
		},
		[homeScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('home', token);
			setHomeScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();

	// 	if (stylistHeadingText.value === '' || stylistHeadingText.value.trim() === '') {
	// 		setStylistHeadingText({ ...stylistHeadingText, error: 'Please enter stylist heading text' });
	// 	} else if (productsHeadingText.value === '' || productsHeadingText.value.trim() === '') {
	// 		setProductsHeadingText({ ...productsHeadingText, error: 'Please enter products heading text' });
	// 	} else if (videosHeadingText.value === '' || videosHeadingText.value.trim() === '') {
	// 		setVideosHeadingText({ ...videosHeadingText, error: 'Please enter videos heading text' });
	// 	} else if (!imageSrc) {
	// 		setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
	// 	} else {
	// 		let formData = new FormData();
	// 		formData.append('stylistHeaderTitle', stylistHeadingText.value);
	// 		formData.append('productHeaderTitle', productsHeadingText.value);
	// 		formData.append('videoHeaderTitle', videosHeadingText.value);
	// 		uploadFileData.data.length > 0 && formData.append('headerImageURL', uploadFileData.data[0]);

	// 		try {
	// 			setLoading(true);
	// 			await setSalonAppSetting('home', formData, token);
	// 			// toast.success(data && data.message);
	// 			toast.success('Home screen settings updated!');
	// 			getData();
	// 		} catch (error) {
	// 			toast.error(error);
	// 		}
	// 		setLoading(false);
	// 	}
	// };


	const handleSubmit = async (e) => {
		e.preventDefault();
	  
		let isFormValid = true;
	  
		// Validate and set error state for each input field
		const validateInput = (value, setValue, errorMessage) => {
		  if (!value || !value.trim()) {
			setValue({ value, error: errorMessage });
			isFormValid = false;
		  } else {
			setValue({ value, error: '' });
		  }
		};
	  
		validateInput(stylistHeadingText.value, setStylistHeadingText, 'Please enter stylist heading text');
		validateInput(productsHeadingText.value, setProductsHeadingText, 'Please enter products heading text');
		validateInput(videosHeadingText.value, setVideosHeadingText, 'Please enter videos heading text');
	  
		if (!imageSrc) {
		  setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		  isFormValid = false;
		} else {
		  setUploadFileData({ ...uploadFileData, error: '' });
		}
	  
		if (isFormValid) {
		  let formData = new FormData();
		  formData.append('stylistHeaderTitle', stylistHeadingText.value);
		  formData.append('productHeaderTitle', productsHeadingText.value);
		  formData.append('videoHeaderTitle', videosHeadingText.value);
		  uploadFileData.data.length > 0 && formData.append('headerImageURL', uploadFileData.data[0]);
	  
		  try {
			setLoading(true);
			await setSalonAppSetting('home', formData, token);
			toast.success('Home screen settings updated!');
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
			<h3 className={AppSettingStyles.screenCardTitle}>Home Screen Settings</h3>
			{loading ? (
				<HomeScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex' style={{ alignItems: 'flex-start' }}>
								<InputBox
									label='Stylist Heading Text'
									placeholder='eg, Your Stylist Details'
									value={stylistHeadingText.value}
									onChange={(e) => setStylistHeadingText({ value: e.target.value, error: '' })}
									errorMessage={stylistHeadingText.error}
								/>
								<InputBox
									label='Products Heading Text'
									placeholder='eg, Boost yourself'
									value={productsHeadingText.value}
									onChange={(e) => setProductsHeadingText({ value: e.target.value, error: '' })}
									errorMessage={productsHeadingText.error}
								/>
							</div>
							<InputBox
								label='Videos Heading Text'
								placeholder='eg, Videos For you'
								value={videosHeadingText.value}
								onChange={(e) => setVideosHeadingText({ value: e.target.value, error: '' })}
								errorMessage={videosHeadingText.error}
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

export default HomeScreen;
