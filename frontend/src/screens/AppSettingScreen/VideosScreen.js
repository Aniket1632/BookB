import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import AppSettingStyles from './AppSetting.module.css';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import VideosScreenSkeleton from '../../components/Skeletons/AppSettings/VideosScreenSkeleton';

const VideosScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [videoScreenData, setVideoScreenData] = useState({});
	const [screenHeadingText, setScreenHeadingText] = useState({ value: '', error: '' });
	const [categoriesHeadingText, setCategoriesHeadingText] = useState({ value: '', error: '' });
	const [stylistVideosHeadingText, setStylistVideosHeadingText] = useState({ value: '', error: '' });
	const [mostWatchedVideosHeadingText, setMostWatchedVideosHeadingText] = useState({ value: '', error: '' });
	const [myFavoriteVideosHeadingText, setMyFavoriteVideosHeadingText] = useState({ value: '', error: '' });
	const [mySalonVideosHeadingText, setMySalonVideosHeadingText] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (videoScreenData && videoScreenData._id) {
				setScreenHeadingText({ value: videoScreenData.videoScreenHeadingText, error: '' });
				setCategoriesHeadingText({ value: videoScreenData.videoCategoriesHeadingText, error: '' });
				setStylistVideosHeadingText({ value: videoScreenData.videoStylistVideoHeadingText, error: '' });
				setMostWatchedVideosHeadingText({ value: videoScreenData.videoMostWatchedVideoHeadingText, error: '' });
				setMostWatchedVideosHeadingText({ value: videoScreenData.videoMostWatchedVideoHeadingText, error: '' });
				setMyFavoriteVideosHeadingText({ value: videoScreenData.videoMyFavoriteVideoHeadingText, error: '' });
				setImageSrc(videoScreenData.videoHeaderImageURL);
			}
		},
		[videoScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('video', token);
			setVideoScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (screenHeadingText.value === '' || screenHeadingText.value.trim() === '') {
			setScreenHeadingText({ ...screenHeadingText, error: 'Please enter screen heading text' });
		} else if (categoriesHeadingText.value === '' || categoriesHeadingText.value.trim() === '') {
			setCategoriesHeadingText({ ...categoriesHeadingText, error: 'Please enter categories heading text' });
		} else if (stylistVideosHeadingText.value === '' || stylistVideosHeadingText.value.trim() === '') {
			setStylistVideosHeadingText({ ...stylistVideosHeadingText, error: 'Please enter stylist videos text' });
		} else if (mostWatchedVideosHeadingText.value === '' || mostWatchedVideosHeadingText.value.trim() === '') {
			setMostWatchedVideosHeadingText({
				...mostWatchedVideosHeadingText,
				error: 'Please enter most watched text'
			});
		} else if (myFavoriteVideosHeadingText.value === '' || myFavoriteVideosHeadingText.value.trim() === '') {
			setMyFavoriteVideosHeadingText({
				...myFavoriteVideosHeadingText,
				error: 'Please enter my favorite videos text'
			});
		} else if (mySalonVideosHeadingText.value === '' || mySalonVideosHeadingText.value.trim() === '') {
			setMySalonVideosHeadingText({ ...mySalonVideosHeadingText, error: 'Please enter my salon videos heading text' });
		} else if (!imageSrc) {
			setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		} else {
			let formData = new FormData();
			formData.append('videoScreenHeadingText', screenHeadingText.value);
			formData.append('videoCategoriesHeadingText', categoriesHeadingText.value);
			formData.append('videoStylistVideoHeadingText', stylistVideosHeadingText.value);
			formData.append('videoMostWatchedVideoHeadingText', mostWatchedVideosHeadingText.value);
			formData.append('videoMyFavoriteVideoHeadingText', myFavoriteVideosHeadingText.value);
			formData.append('videoMySalonVideoHeadingText', mySalonVideosHeadingText.value);
			uploadFileData.data.length > 0 && formData.append('videoHeaderImageURL', uploadFileData.data[0]);

			try {
				setLoading(true);
				await setSalonAppSetting('video', formData, token);
				// toast.success(data && data.message);
				toast.success('Videos screen settings updated!');
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
			<h3 className={AppSettingStyles.screenCardTitle}>Videos Screen Settings</h3>
			{loading ? (
				<VideosScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex' style={{ alignItems: 'flex-start' }}>
								<InputBox
									label='Screen Heading Text'
									placeholder='eg, Videos'
									value={screenHeadingText.value}
									onChange={(e) => setScreenHeadingText({ value: e.target.value, error: '' })}
									errorMessage={screenHeadingText.error}
								/>
								<InputBox
									label='Categories Heading Text'
									placeholder='eg, Categories'
									value={categoriesHeadingText.value}
									onChange={(e) => setCategoriesHeadingText({ value: e.target.value, error: '' })}
									errorMessage={categoriesHeadingText.error}
								/>
							</div>
							<div className='flex' style={{ alignItems: 'flex-start' }}>
								<InputBox
									label='Stylist Videos Heading Text'
									placeholder='eg, Stylist Videos'
									value={stylistVideosHeadingText.value}
									onChange={(e) => setStylistVideosHeadingText({ value: e.target.value, error: '' })}
									errorMessage={stylistVideosHeadingText.error}
								/>
								<InputBox
									label='Most Watched Videos Heading Text'
									placeholder='eg, Most Watched Videos'
									value={mostWatchedVideosHeadingText.value}
									onChange={(e) => setMostWatchedVideosHeadingText({ value: e.target.value, error: '' })}
									errorMessage={mostWatchedVideosHeadingText.error}
								/>
							</div>
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
					<InputSections>
						<div className='flex' style={{ alignItems: 'flex-start' }}>
							<InputBox
								label='My Favorite Videos Heading Text'
								placeholder='eg, My Favorite Videos'
								value={myFavoriteVideosHeadingText.value}
								onChange={(e) => setMyFavoriteVideosHeadingText({ value: e.target.value, error: '' })}
								errorMessage={myFavoriteVideosHeadingText.error}
							/>
							<InputBox
								label='My Salon Videos Heading Text'
								placeholder='eg, My Salon Videos'
								value={mySalonVideosHeadingText.value}
								onChange={(e) => setMySalonVideosHeadingText({ value: e.target.value, error: '' })}
								errorMessage={mySalonVideosHeadingText.error}
							/>
						</div>
					</InputSections>

					<ModalButton label='Save' icon='plus' onClick={handleSubmit} />
				</Fragment>
			)}
		</div>
	);
};

export default VideosScreen;
