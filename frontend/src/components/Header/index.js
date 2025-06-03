import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeAdminAction, getUserByTokenAction, logout } from '../../redux/actions/userActions';
import { CHANGE_ADMIN_RESET } from '../../redux/constants/userConstants';
import InputBox from '../formInputs/InputBox';
import Spinner from '../Spinner/Spinner';
import './Header.css';
import { toast } from 'react-toastify';
import HeaderSkeleton from '../Skeletons/HeaderSkeleton';

const Header = ({
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


	listFilter,
	listType,
	getTypeList,
	onTypeListChange,

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
		<Fragment>
			<div className='header'>
				<div className='header__left'>
					<h2 className='header__heading'>{title}</h2>
					{
						listFilter && (
							<select
								value={listType}
								onChange={(e) => onTypeListChange(e.target.value)}
								name='listType'
								id='listType'
								className='typeSelectBox'>
								{getTypeList &&
									getTypeList.length > 0 &&
									getTypeList.map((type, index) => (
										<option value={type.value} key={index + 1}>
											{type.label}
										</option>
									))}
							</select>
						)
					}
					{addBtn && (
						<button onClick={addBtnClick} className='header__container--button'>
							<svg className='header__container--icon'>
								<use xlinkHref={`/assets/sprite.svg#icon-${addBtnIcon}`} />
							</svg>
							<span>{addBtnText}</span>
						</button>
					)}
				</div>
				<div className='header__left'>
					{search && (
						<InputBox
							placeholder={searchPlaceholder}
							icon={searchIcon}
							value={searchvalue}
							onChange={searchOnChange}
							style={{ backgroundColor: 'var(--pure-white)', border: '1px solid #d9d9d9' }}
						/>
					)}

					{userData && userData.loading ? (
						<HeaderSkeleton />
					) : (
						<div style={{ display: 'flex', gap: '2rem' }}>
							{currentClient && (
								<div className='dropdown_container'>
									<div className='dropdown'>
										<svg className='form_input__icon'>
											<use xlinkHref={`/assets/sprite.svg#icon-user`} />
										</svg>
										<h2 className='header__heading'>
											{currentClient.name} &nbsp;
											<span
												style={{ textTransform: 'capitalize', fontWeight: '400', fontSize: '1.2rem' }}>
												({currentClient.role})
											</span>
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

			</div>

			{/* <div className='header'>

				<div className='header__left'>
					<div className='header__container'>
						{addBtn && (
							<button onClick={addBtnClick} className='header__container--button'>
								<svg className='header__container--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-${addBtnIcon}`} />
								</svg>
								<span>{addBtnText}</span>
							</button>
						)}
					</div>
				</div>

				<div style={{ display: 'flex', gap: '2rem' }}>
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

			</div>*/}
		</Fragment>
	);
};

export default Header;
