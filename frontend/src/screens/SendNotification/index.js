import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Content from '../../components/Content/Content';
import InputBox from '../../components/formInputs/InputBox';
import SelectBox from '../../components/formInputs/SelectBox';
import TextareaBox from '../../components/formInputs/TextareaBox';
import InputsSection from '../../components/Modal/InputsSectionColumn';
import ModalButton from '../../components/Modal/ModalButton';
import NoData from '../../components/NoData';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner/Spinner';
import { getAllNotificationsAction, sendNotificationAction } from '../../redux/actions/notificationActions';
import { SEND_NOTIFICATION_RESET } from '../../redux/constants/notificationConstants';

import SendNotificationStyles from './SendNotification.module.css';

const SendNotification = () => {
	const dispatch = useDispatch();
	const [notificationTitle, setNotificationTitle] = useState({ value: '', error: '' });
	const [notificationContent, setNotificationContent] = useState({ value: '', error: '' });
	const [pageNumber, setPageNumber] = useState(1);
	const pageSize = 5;

	const allNotifications = useSelector((state) => state.allNotifications);
	const sendNotification = useSelector((state) => state.sendNotification);
	const [sendTo, setSendTo] = useState({ value: '', error: '' });

	const toList = [
		{ label: 'All', value: 'all' },
		{ label: 'Stylists', value: 'Stylist' },
		{ label: 'Users', value: 'user' }
	];

	useEffect(
		() => {
			dispatch(getAllNotificationsAction(pageNumber, pageSize));
		},
		[dispatch, pageNumber]
	);

	useEffect(
		() => {
			if (sendNotification && sendNotification.notification && sendNotification.notification.status) {
				setNotificationTitle({ value: '', error: '' });
				setNotificationContent({ value: '', error: '' });
				toast.success(sendNotification.notification.message);
				dispatch({ type: SEND_NOTIFICATION_RESET });
				dispatch(getAllNotificationsAction(pageNumber, pageSize));
			}
		},
		[sendNotification, dispatch, pageNumber]
	);

	const handleNotificationSubmit = () => {
		if (sendTo.value === '' || sendTo.value.trim() === '') {
			setSendTo({ ...sendTo, error: 'Please select send to' });
		} else if (notificationTitle.value === '' || notificationTitle.value.trim() === '') {
			setNotificationTitle({ ...notificationTitle, error: 'Please enter notification title' });
		} else if (notificationContent.value === '' || notificationContent.value.trim() === '') {
			setNotificationContent({ ...notificationContent, error: 'Please enter notification content' });
		} else {
			const formData = {
				to: sendTo.value,
				title: notificationTitle.value,
				body: notificationContent.value,
				entryAddedFrom: 'dashboard'
			};
			dispatch(sendNotificationAction(formData));
		}
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		setPageNumber(selectedPage + 1);
	};

	return (
		<Content currentMenu='notification' headerTitle='Notifications' addBtn={false} search={false}>
			<div className={SendNotificationStyles.content}>
				<InputsSection>
					<SelectBox
						value={sendTo.value}
						onChange={(event) => {
							setSendTo({ value: event.target.value });
						}}
						label='Send To'
						icon='users'
						name='sendTo'
						containerStyle={{ width: '30vw' }}
						errorMessage={sendTo.error}
					>
						<option className='optionBox' value=''>
							Send To
						</option>
						{toList &&
							toList.map((type, index) => (
								<option value={type.value} key={index + 1}>
									{type.label}
								</option>
							))
						}
					</SelectBox>

					<InputBox
						label='Notification Title'
						icon='title'
						placeholder='eg, Grab the best deal'
						style={{ width: '30vw' }}
						value={notificationTitle.value}
						onChange={(event) => setNotificationTitle({ value: event.target.value })}
						errorMessage={notificationTitle.error}
					/>

					<TextareaBox
						rows={8}
						label='Notification Body'
						icon='sub_title'
						// placeholder='eg, Get the best deal of this season. Don&#39;t miss this out'
						placeholder='Enter notification content'
						style={{ width: '30vw' }}
						value={notificationContent.value}
						onChange={(event) => setNotificationContent({ value: event.target.value })}
						errorMessage={notificationContent.error}
					/>
					<ModalButton label='Send Notification' icon='notification' onClick={handleNotificationSubmit} />
				</InputsSection>
				<div className={SendNotificationStyles.prevNotifications}>
					<h2 className={SendNotificationStyles.prevNotificationsHeading}>Previously Sent Notifications</h2>
					{allNotifications && allNotifications.loading ? (
						<div className={SendNotificationStyles.prevNotification} style={{ width: '100%' }}>
							<Spinner />
						</div>
					) :
						allNotifications &&
							allNotifications.notifications &&
							allNotifications.notifications.data &&
							allNotifications.notifications.data.result &&
							allNotifications.notifications.data.result.length > 0 ? (
							allNotifications.notifications.data.result.map((res) => (
								<div key={res._id} className={SendNotificationStyles.prevNotification}>
									<h4 className={SendNotificationStyles.prevNotificationTitle}>{res.title}</h4>
									<p className={SendNotificationStyles.prevNotificationSubTitle}>{res.body}</p>
									<p className={SendNotificationStyles.prevNotificationTime}>
										Sent on {new Date(res.createdAt).toLocaleDateString()} by John Doe
									</p>
								</div>
							))
						) : (
							<div className='not_data_found'>
								<NoData title='No Data Found!' subTitle='We could not find any notifications.' height='40vh' />
							</div>
						)}
					{allNotifications &&
						allNotifications.notifications &&
						allNotifications.notifications.data &&
						allNotifications.notifications.data.totalPageSize > 1 && (
							<div className='tableContainer--paginater'>
								<Pagination
									onPageChange={handlePageChange}
									rowsPerPage={pageSize}
									totalPageSize={allNotifications.notifications.data.totalPageSize}
									pageNumber={pageNumber}
								/>
							</div>
						)}
				</div>
			</div>
		</Content>
	);
};

export default SendNotification;
