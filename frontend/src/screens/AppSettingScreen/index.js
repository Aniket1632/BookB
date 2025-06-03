import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuSettingsAction } from '../../redux/actions/salonActions';

import Content from '../../components/Content/Content';
import LogoUpload from './LogoUpload';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import VideosScreen from './VideosScreen';
import ShopScreen from './ShopScreen';
import MyProfileScreen from './MyProfileScreen';

import AppSettingStyles from './AppSetting.module.css';

const AppSettingScreen = () => { 
	const [ token, setToken ] = useState('');
	const userLogin = useSelector((state) => state.userLogin);
	const getUserInfo = useSelector((state) => state.getUserInfo); 
	
	useEffect(
		() => {
			if (userLogin && userLogin.userInfo && userLogin.userInfo.status && userLogin.userInfo.data) {
				setToken(userLogin.userInfo.data.token);
			}
		},
		[ userLogin ]
	);
 

	return (
		<Content currentMenu='app-settings' headerTitle='App Settings' addBtn={false}>
			<LogoUpload token={token} />

			<div className={AppSettingStyles.screenCards}>
				<LoginScreen token={token} />
				<RegisterScreen token={token} />
				<HomeScreen token={token} /> 
				{getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				getUserInfo.userInfo.data.appMenu &&
				getUserInfo.userInfo.data.appMenu.isPOS && <ShopScreen token={token} />}
				<MyProfileScreen token={token} />
			</div>
		</Content>
	);
};

export default AppSettingScreen;
