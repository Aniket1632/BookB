import React, { Fragment, useState, useEffect } from 'react';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import FileUpload from '../../components/formInputs/FileUpload';
import InputSections from '../../components/Modal/InputsSectionColumn';

import AppSettingStyles from './AppSetting.module.css';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';
import { toast } from 'react-toastify';
import HomeScreenSkeleton from '../../components/Skeletons/AppSettings/HomeScreenSkeleton';

const ShopScreen = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
	const [loading, setLoading] = useState(false);

	const [shopScreenData, setShopScreenData] = useState({});
	const [screenHeadingText, setScreenHeadingText] = useState({ value: '', error: '' });
	const [searchBoxText, setSearchBoxText] = useState({ value: '', error: '' });
	const [myCartHeadingText, setMyCartHeadingText] = useState({ value: '', error: '' });
	const [myOrdersHeadingText, setMyOrdersHeadingText] = useState({ value: '', error: '' });

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (shopScreenData && shopScreenData._id) {
				setScreenHeadingText({ value: shopScreenData.shopScreenHeadingText, error: '' });
				setSearchBoxText({ value: shopScreenData.shopSearchBoxText, error: '' });
				setMyCartHeadingText({ value: shopScreenData.shopMyCartText, error: '' });
				setMyOrdersHeadingText({ value: shopScreenData.shopMyOrdersText, error: '' });
				setImageSrc(shopScreenData.shopHeaderImageURL);
			}
		},
		[shopScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('shop', token);
			setShopScreenData(data);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (screenHeadingText.value === '' || screenHeadingText.value.trim() === '') {
			setScreenHeadingText({ ...screenHeadingText, error: 'Please enter screen heading text' });
		} else if (searchBoxText.value === '' || searchBoxText.value.trim() === '') {
			setSearchBoxText({ ...searchBoxText, error: 'Please enter search box text' });
		} else if (myCartHeadingText.value === '' || myCartHeadingText.value.trim() === '') {
			setMyCartHeadingText({ ...myCartHeadingText, error: 'Please enter my cart heading text' });
		} else if (myOrdersHeadingText.value === '' || myOrdersHeadingText.value.trim() === '') {
			setMyOrdersHeadingText({
				...myOrdersHeadingText,
				error: 'Please enter my orders heading text'
			});
		} else if (!imageSrc) {
			setUploadFileData({ ...uploadFileData, error: 'Please upload background image' });
		} else {
			let formData = new FormData();
			formData.append('shopScreenHeadingText', screenHeadingText.value);
			formData.append('shopSearchBoxText', searchBoxText.value);
			formData.append('shopMyCartText', myCartHeadingText.value);
			formData.append('shopMyOrdersText', myOrdersHeadingText.value);
			uploadFileData.data.length > 0 && formData.append('shopHeaderImageURL', uploadFileData.data[0]);

			try {
				setLoading(true);
				await setSalonAppSetting('shop', formData, token);
				// toast.success(data && data.message);
				toast.success('Shop screen settings updated!');
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
			<h3 className={AppSettingStyles.screenCardTitle}>Shop Screen Settings</h3>
			{loading ? (
				<HomeScreenSkeleton />
			) : (
				<Fragment>
					<div className='flex'>
						<InputSections>
							<div className='flex'>
								<InputBox
									label='Screen Heading Text'
									placeholder='eg, Shop'
									value={screenHeadingText.value}
									onChange={(e) => setScreenHeadingText({ value: e.target.value, error: '' })}
									errorMessage={screenHeadingText.error}
								/>
								<InputBox
									label='Search Box Text'
									placeholder='eg, Search Products'
									value={searchBoxText.value}
									onChange={(e) => setSearchBoxText({ value: e.target.value, error: '' })}
									errorMessage={searchBoxText.error}
								/>
							</div>
							<div className='flex'>
								<InputBox
									label='My Cart Heading Text'
									placeholder='eg, My Cart'
									value={myCartHeadingText.value}
									onChange={(e) => setMyCartHeadingText({ value: e.target.value, error: '' })}
									errorMessage={myCartHeadingText.error}
								/>
								<InputBox
									label='My Orders Heading Text'
									placeholder='eg, My Orders'
									value={myOrdersHeadingText.value}
									onChange={(e) => setMyOrdersHeadingText({ value: e.target.value, error: '' })}
									errorMessage={myOrdersHeadingText.error}
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

					<ModalButton label='Save' icon='plus' onClick={handleSubmit} />
				</Fragment>
			)}
		</div>
	);
};

export default ShopScreen;
