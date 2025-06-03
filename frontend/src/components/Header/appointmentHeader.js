import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeAdminAction, getUserByTokenAction, logout } from '../../redux/actions/userActions';
import { CHANGE_ADMIN_RESET } from '../../redux/constants/userConstants';
import InputBox from '../formInputs/InputBox';
import Spinner from '../Spinner/Spinner';
import './Header.css';
import { toast } from 'react-toastify';

const AppointmentHeader = ({
	title,
	addBtn = false,
	addBtnText,
	addBtnIcon,
	addBtnClick,
	search = false,
	searchIcon,
	searchPlaceholder,
	searchvalue,
	searchOnChange,

	addBuinessHoursBtn,
	addBuinessHoursClick,
	addBuinessHoursIcon,
	addBuinessHoursText
}) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const userData = useSelector((state) => state.getUserInfo);
	const changeAdmin = useSelector((state) => state.changeAdmin);
	const [openDropdown, setOpenDropdown] = useState(false);
	const salonEnabledList = useSelector((list) => list.salonEnabledList);
	const [currentClient, setCurrentClient] = useState({});

	useEffect(
		() => {
			if (userData && userData.error && userData.error.status === false) {
				dispatch(logout());
				history.push('/login');
			} else if (userData && userData.userInfo && userData.userInfo.status && userData.userInfo.data) {
				setCurrentClient(userData.userInfo.data);
			}
		},
		[userData, history, dispatch]
	);

	useEffect(
		() => {
			if (changeAdmin && changeAdmin.userInfo && changeAdmin.userInfo.status) {
				toast.success(changeAdmin.userInfo.message);
				dispatch(getUserByTokenAction());
				window.location.reload(false);
				dispatch({ type: CHANGE_ADMIN_RESET });
			} else if (changeAdmin && changeAdmin.userInfo && !changeAdmin.userInfo.status) {
				toast.error(changeAdmin.userInfo.message);
				dispatch({ type: CHANGE_ADMIN_RESET });
			}
		},
		// eslint-disable-next-line
		[changeAdmin, dispatch]
	);

	const onChangeClient = async (item) => {
		setCurrentClient(item.salon);
		dispatch(changeAdminAction(item._id, { enable: true }));
		history.push('/');
		setOpenDropdown(false);
	};

	return (
		<div className='header'>
			<div className='header__left'>
				<div className='header__container'>
					<h2 className='header__heading'>{title}</h2>
					{addBtn && (
						<button onClick={addBtnClick} className='header__container--btn'>
							<p>
								<svg className='header__container--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-${addBtnIcon}`} />
								</svg>
							</p>
							<span>{addBtnText}</span>
						</button>
					)}
					{addBuinessHoursBtn && (
						<button onClick={addBuinessHoursClick} className='header__container--btn'>
							<p>
								<svg className='header__container--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-${addBuinessHoursIcon}`} />
								</svg>
							</p>
							<span>{addBuinessHoursText}</span>
						</button>
					)}
					{search && (
						<InputBox
							placeholder={searchPlaceholder}
							icon={searchIcon}
							value={searchvalue}
							onChange={searchOnChange}
							style={{ backgroundColor: 'var(--pure-white)', border: '1px solid #d9d9d9' }}
						/>
					)}
				</div>
			</div>
			{userData && userData.loading ? (
				<Spinner />
			) : (
				<div style={{ display: 'flex', gap: '2rem' }}>
					{currentClient && (
						<div className='dropdown_container'>
							<div className='dropdown'>
								<svg className='form_input__icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-user`} />
								</svg>
								<h2 className='header__heading'>
									{currentClient.name} &nbsp; (<span
										style={{ textTransform: 'capitalize', color: 'var(--primary-color)' }}>
										{currentClient.role}
									</span>){' '}
								</h2>
							</div>
						</div>
					)}

					{userData &&
						userData.userInfo &&
						userData.userInfo.status &&
						userData.userInfo.data &&
						userData.userInfo.data.role === 'superadmin' && (
							<div
								className='dropdown_container'
								onBlur={() => setOpenDropdown(false)}
								tabIndex='0'
								style={{ zIndex: 102 }}>
								<div className='dropdown' onClick={() => setOpenDropdown(!openDropdown)}>
									{currentClient &&
										currentClient.salon && (
											<div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
												<img src={currentClient.salon.photo} alt='role' className='role_image' />
												<h2 className='header__heading'>{currentClient.salon.name}</h2>
											</div>
										)}
									{openDropdown ? (
										<svg className='form_input__icon'>
											<use xlinkHref={`/assets/sprite.svg#icon-up`} />
										</svg>
									) : (
										<svg className='form_input__icon'>
											<use xlinkHref={`/assets/sprite.svg#icon-down`} />
										</svg>
									)}
									{
										currentClient &&
										currentClient.salon &&
										openDropdown && (
											<div className='list_container'>
												{salonEnabledList &&
													salonEnabledList.userInfo &&
													salonEnabledList.userInfo.data &&
													salonEnabledList.userInfo.data.result.map((item, index) => (
														<div
															className={currentClient.salon._id === item._id ? 'selected_dropdown_item' : 'dropdown_item'}
															key={index}
															onClick={() => onChangeClient(item)}>
															<p className='dropdown_item_userName'> {item.name}</p>
														</div>
													))}
											</div>
										)}
								</div>
							</div>
						)}
				</div>
			)}
		</div>
	);
};

export default AppointmentHeader;
