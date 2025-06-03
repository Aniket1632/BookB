import React, { useState, Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';

import FileUpload from '../../components/formInputs/FileUpload';
import ModalButton from '../../components/Modal/ModalButton';
import LogoUploadSkeleton from '../../components/Skeletons/AppSettings/LogoUploadSkeleton';
import { getSalonAppSetting, setSalonAppSetting } from '../../redux/actions/AppSettingsActions';

import AppSettingStyles from './AppSetting.module.css';

const LogoUpload = ({ token }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [uploadLogo, setUploadLogo] = useState({ data: [], error: '' });
	const [loading, setLoading] = useState(false);
	const [loginScreenData, setLoginScreenData] = useState({});

	useEffect(
		() => {
			if (token) getData();
		},
		[token]
	);

	useEffect(
		() => {
			if (loginScreenData && loginScreenData._id) {
				setImageSrc(loginScreenData.appLogoImageURL);
			}
		},
		[loginScreenData]
	);

	const getData = async () => {
		setLoading(true);

		try {
			const { data } = await getSalonAppSetting('logo', token);
			setLoginScreenData(data);
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

		if (!imageSrc) {
			setUploadLogo({ ...uploadLogo, error: 'Please upload salon logo' });
		} else {
			let formData = new FormData();
			uploadLogo.data.length > 0 && formData.append('appLogoImageURL', uploadLogo.data[0]);

			try {
				setLoading(true);
				await setSalonAppSetting('logo', formData, token);
				setLoading(false);
				// toast.success(data && data.message);
				toast.success('Salon logo updated!');
				getData();
			} catch (error) {
				setLoading(false);
				toast.error(error);
			}
		}
	};

	return (
		<div className={AppSettingStyles.flex}>
			<div className={AppSettingStyles.screenCard}>
				<h3 className={AppSettingStyles.screenCardTitle}>App Logo Settings</h3>
				{loading ? (
					<LogoUploadSkeleton />
				) : (
					<Fragment>
						<FileUpload
							label='Upload App Logo'
							icon='upload'
							image={imageSrc}
							onChange={(e) => {
								handleChangeImage(e);
								setUploadLogo({ data: e.target.files, error: '' });
							}}
							errorMessage={uploadLogo.error}
						// style={{ padding: '.5rem 1.5rem', paddingBottom: '1.5rem' }}
						/>
						<ModalButton label='Save' icon='plus' onClick={handleSubmit} />
					</Fragment>
				)}
			</div>
		</div>
	);
};

export default LogoUpload;
