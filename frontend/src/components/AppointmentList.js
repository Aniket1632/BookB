import React from 'react'
import ActivitySkeleton from './Skeletons/Activityskeleton';
import ActivitySkeletonSmall from './Skeletons/ActivitySkeletonSmall';

const AppointmentList = ({ getActivity, activeToggle, currentMenu, getRecentAppointment }) => {




	const sortedList = getActivity && getActivity.session && getActivity.session.result && getActivity.session.result.appointments && getActivity.session.result.appointments.length > 0
		&& getActivity.session.result.appointments.sort(function (a, b) {
			var key1 = a.slotString;
			var key2 = b.slotString;

			if (key1 < key2) {
				return -1;
			} else if (key1 == key2) {
				return 0;
			} else {
				return 1;
			}
		});


	return (
		<>
			{activeToggle ?
				<>
					{getActivity.loading ? <ActivitySkeleton /> :
						<>
							<div className='stylist_box'>
								<img src={getActivity &&
									getActivity.session &&
									getActivity.session.result &&
									getActivity.session.result.stylistData &&
									getActivity.session.result.stylistData.photo
								} className='stylist_img'></img>
								<div className='stylist_text'>
									<span>{getActivity &&
										getActivity.session &&
										getActivity.session.result &&
										getActivity.session.result.stylistData &&
										getActivity.session.result.stylistData.name}</span>
									<p>Description</p>
								</div>
							</div>
							<div className='current_appointment'>
								<h2 className='appointment_upcoming'>Upcoming Appointments</h2>

								{
									sortedList ? sortedList.map((item, id) => {
										return (
											<div className='appointment_card' key={id}>
												<div className='appointment_time'>
													<div className='time_circle'></div>
													<p>{item.slot}</p>
												</div>
												<div className='appointment_name'>
													<h1>{item.appointmentDetail.userName}</h1>
													<p>{item && item.userList && item.userList[0] && item.userList[0].userDetail && item.userList[0].userDetail.clientNote ? item.userList[0].userDetail.clientNote : "No Notes"}</p>
												</div>
											</div>
										)
									}) :
										<div className='appointment_card'>
											<p>No Appointment Available</p>
										</div>
								}
							</div>
						</>}
				</>
				:
				<>
					{
						getActivity.loading ? <ActivitySkeletonSmall /> :
							<>
								<div className='stylist_box1'>
									<img src={getActivity &&
										getActivity.session &&
										getActivity.session.result &&
										getActivity.session.result.stylistData &&
										getActivity.session.result.stylistData.photo
									} className='stylist_img'></img>
									<div className='stylist_text1'>
										<span style={{ textAlign: 'center' }}>{getActivity &&
											getActivity.session &&
											getActivity.session.result &&
											getActivity.session.result.stylistData &&
											getActivity.session.result.stylistData.name}</span>
									</div>
								</div>
								{
									sortedList ? sortedList.map((item, id) => {
										return (
											<div className='appointment_card' key={id}>
												<div className='appointment_time'>
													<div className='time_circle'></div>
													<p>{item.slot}</p>
												</div>
												<div className='appointment_name'>
													<h1 style={{ fontSize: '16px' }}>{item.appointmentDetail.userName}</h1>
													<p>{item && item.userList && item.userList[0] && item.userList[0].userDetail && item.userList[0].userDetail.clientNote ? item.userList[0].userDetail.clientNote : "No Notes"}</p>
												</div>
											</div>
										)
									}) :
										<div className='appointment_card'>
											<p>No Appointment Available</p>
										</div>
								}
							</>
					}




				</>}

		</>
	)
}

export default AppointmentList
