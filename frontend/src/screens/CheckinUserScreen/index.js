import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';

import Content from '../../components/Content';
import Button from '../../components/formInputs/Button';
import Spinner from '../../components/Spinner/Spinner';
import { checkIAction } from '../../redux/actions/attendanceActions';
import { getUserListAction } from '../../redux/actions/userActions';
import { CHECKINOUT_RESET } from '../../redux/constants/attendanceConstants';

import CheckinStyles from './CheckinUserScreen.module.css';

const CheckinUserScreen = ({ history }) => {
	const dispatch = useDispatch();
	const [ data, setData ] = useState([]);
	const [ userName, setUserName ] = useState(null);
	const [ userId, setUserId ] = useState(null);
	const [ stylistId, setStylistId ] = useState(null);

	const { userInfo } = useSelector((state) => state.userLogin);
	const userList = useSelector((state) => state.userList);
	const checkInOut = useSelector((state) => state.checkInOut);
	const getUserInfo = useSelector((state) => state.getUserInfo);

	useEffect(
		() => {
			if (
				!data.length &&
				userList &&
				userList.userInfo &&
				userList.userInfo.data &&
				userList.userInfo.data.result &&
				userList.userInfo.data.result.length > 0
			) {
				const newList = userList.userInfo.data.result.map((item) => {
					const phone = item.phone && '(phone: xxxx-xxx-' + item.phone.substring(item.phone.length - 4) + ')';
					return { value: item._id, label: item.name + ' ' + phone, stylistId: item.stylist._id };
				});
				setData(newList);
			}
		},
		[ userList, data ]
	);

	useEffect(
		() => {
			if (userInfo && userInfo.data && userInfo.data.token) {
				dispatch(getUserListAction({ pageNumber: 1, pageSize: 50, filter: '' }));
			} else {
				history.push('/login');
			}
		},
		[ userInfo, history, dispatch ]
	);

	useEffect(
		() => {
			if (checkInOut && !checkInOut.loading && checkInOut.userInfo && checkInOut.userInfo.status) {
				toast.success(checkInOut.userInfo.message);
				dispatch({ type: CHECKINOUT_RESET });
			}
		},
		[ checkInOut ]
	);

	const onCheckInOutHandler = (userData) => {
		dispatch(checkIAction(userData));
		setUserName('');
		setUserId('');
		setStylistId('');
	};

	const handleChange = (user) => {
		setUserName(user);
		setUserId(user.value);
		setStylistId(user.stylistId);
	};

	const colourStyles = {
		menuList: (styles) => ({
			...styles,
			backgroundColor: 'hsl(210deg 25 % 6 %)'
		}),
		option: (styles, { isFocused, isSelected }) => ({
			...styles,
			color: isSelected ? '#fff' : '#000',
			backgroundColor: isSelected ? '#ff9000' : '#fff',
			zIndex: 1
		}),
		menu: (base) => ({
			...base,
			zIndex: 999,
			backgroundColor: 'var(--dark-grey)',
			boxShadow: 'var(--box-shadow1)'
		})
	};

	const NoOptionsMessage = (props) => {
		return (
			<components.NoOptionsMessage {...props}>
				<span>No users found with name</span>
			</components.NoOptionsMessage>
		);
	};

	return (
		<Content currentMenu='check-in'>
			<div className={CheckinStyles.contentSection}>
				{checkInOut && checkInOut.loading ? (
					<Spinner />
				) : (
					<div className='check-in-header' style={{ flexDirection: 'column' }}>
						{getUserInfo &&
						getUserInfo.userInfo &&
						getUserInfo.userInfo.status &&
						getUserInfo.userInfo.data && (
							<img
								src={getUserInfo.userInfo.data.photo}
								alt={getUserInfo.userInfo.data.name}
								className={CheckinStyles.logo}
							/>
						)}
						<Select
							classNamePrefix='select'
							styles={colourStyles}
							components={{ NoOptionsMessage }}
							placeholder='Search and select your name'
							value={userName} // set selected value
							options={data} // set list of the data
							onChange={handleChange} // assign onChange function
						/>

						<Button
							label='Check-in'
							icon='checkin'
							onClick={() => {
								onCheckInOutHandler({ user: userId, stylist: stylistId });
							}}
						/>
					</div>
				)}
			</div>
		</Content>
	);
};

export default CheckinUserScreen;
