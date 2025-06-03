import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select'; 
import { toast } from 'react-toastify';

import Content from '../../components/Content';
import Button from '../../components/formInputs/Button';
import AttendData from './AttendData';

import { checkIAction, deleteCheckinAction, getAttendListAction } from '../../redux/actions/attendanceActions';
import { getUserListAction } from '../../redux/actions/userActions';

import { CHECKINOUT_RESET, DELETE_CHECKIN_RESET } from '../../redux/constants/attendanceConstants';

import HomeStyle from './Home.module.css';
import Pagination from '../../components/Pagination';
import DeleteModal from '../../components/Modal/DeleteModal';

const HomeScreenOld = ({ history, showFilter = false }) => {
	const dispatch = useDispatch();
	const [data, setData] = useState([]);
	const [userName, setUserName] = useState(null);
	const [userId, setUserId] = useState(null);
	const [stylistId, setStylistId] = useState(null);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [selectUpdateModel, setSelectUpdateModel] = useState({});

	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;

	const userData = useSelector((state) => state.getUserInfo);
	const { userInfo } = useSelector((state) => state.userLogin);
	const attendanceList = useSelector((state) => state.attendanceList);
	const checkInOut = useSelector((state) => state.checkInOut);
	const userList = useSelector((state) => state.userList);
	const deleteCheckin = useSelector((state) => state.deleteCheckin);

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
		[userList, data]
	);

	useEffect(
		() => {
			if (userInfo && userInfo.data && userInfo.data.token) {
				dispatch({ type: CHECKINOUT_RESET });
				dispatch(getUserListAction({ pageNumber: 1, pageSize: 50, filter: '' }));
				dispatch(getAttendListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else {
				history.push('/login');
			}
		},
		[userInfo, history, dispatch]
	);

	useEffect(
		() => {
			if (checkInOut && checkInOut.userInfo && checkInOut.userInfo.status) {
				toast.success(checkInOut.userInfo.message);
				dispatch({ type: CHECKINOUT_RESET });
				dispatch(getAttendListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
			} else if (checkInOut && checkInOut.userInfo && !checkInOut.userInfo.status) {
				toast.error(checkInOut.userInfo.message);
				dispatch({ type: CHECKINOUT_RESET });
			}
		},
		[checkInOut, pageNumber, pageLimit, dispatch]
	);

	useEffect(
		() => {
			if (deleteCheckin && deleteCheckin.userInfo && deleteCheckin.userInfo.status) {
				toast.success(deleteCheckin.userInfo.message);
				dispatch(getUserListAction({ pageNumber: 1, pageSize: 50, filter: '' }));
				dispatch(getAttendListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: DELETE_CHECKIN_RESET });
			}
		},
		[deleteCheckin, dispatch]
	);

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAttendListAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};


	const onCheckInOutHandler = (userData) => {
		dispatch(checkIAction(userData));
		setUserName('');
		setUserId('');
		setStylistId('');
		// dispatch(getAttendListAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: ''}));
	};

	const onDeleteModalClose = () => {
		setUserName('');
		setUserId('');
		setStylistId('');
		setSelectUpdateModel({});
		setModalDeleteState(false);
	};


	const onDeleteHandler = () => {
		dispatch(deleteCheckinAction(selectUpdateModel._id));
		onDeleteModalClose();
	};



	// handle onChange event of the dropdown
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
		<Content currentMenu='dashboard' headerTitle={"Today's Check-ins " + '(' + new Date().toLocaleDateString() + ')'}>
			<div className='check-in-header'>
				<Select
					classNamePrefix='select'
					styles={colourStyles}
					components={{ NoOptionsMessage }}
					placeholder='Select user to check-in'
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

			<AttendData
				attendanceList={attendanceList}
				showFilter={showFilter}
				onCheckInOutHandler={onCheckInOutHandler}
				setSelectUpdateModel={setSelectUpdateModel} 
				setModalDeleteState={setModalDeleteState}
			/>

			{totalPageSize > 1 && (
				<div className='tableContainer--paginater'>
					<Pagination list={attendanceList.userInfo} onPageChange={handlePageChange} rowsPerPage={pageLimit} totalPageSize={totalPageSize} pageNumber={pageNumber} />
				</div>
			)}

			<DeleteModal data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />
		</Content>
	);
};

export default HomeScreenOld;
