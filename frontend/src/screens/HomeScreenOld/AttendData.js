import React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import HomeStyle from './Home.module.css';

const AttendData = ({ showFilter, attendanceList, setSelectUpdateModel, setModalDeleteState }) => {
	// const convertTime = (sec) => {
	// 	var hours = Math.floor(sec / 3600);
	// 	hours >= 1 ? (sec = sec - hours * 3600) : (hours = '00');
	// 	var min = Math.floor(sec / 60);
	// 	min >= 1 ? (sec = sec - min * 60) : (min = '00');
	// 	sec < 1 ? (sec = '00') : void 0;
	// 	min.toString().length == 1 ? (min = '0' + min) : void 0;
	// 	sec.toString().length == 1 ? (sec = '0' + sec) : void 0;
	// 	return hours + ':' + min; // + ':' + sec;
	// };

	return (
		<div className='tableContainer' style={{ height: showFilter ? '65vh' : '52vh' }}>
			{attendanceList && attendanceList.loading ? (
				<Spinner />
			) : attendanceList &&
				attendanceList.userInfo &&
				attendanceList.userInfo.status &&
				attendanceList.userInfo.data &&
				attendanceList.userInfo.data.result &&
				attendanceList.userInfo.data.result.length > 0 ? (
				attendanceList.userInfo.data.result.map((d) => (
					<div className={HomeStyle.checkinList} key={d._id}>
						<p className={HomeStyle.checkinList__text}>
							{d.user.name +
								' (phone: xxxx-xxx-' +
								d.user.phone.substring(d.user.phone.length - 4) +
								')' +
								' has checked-in with stylist ' +
								d.stylist.name +
								' at ' +
								d.checkInTimeString}
						</p>
						<div className='table__iconBox'>
							<button className='table__button table__button--delete' onClick={() => {
								setSelectUpdateModel(d);
								setModalDeleteState(true)
							}}>
								<svg className='table__button--icon-red'>
									<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
								</svg>
								<span>Delete User</span>
							</button>
						</div>
					</div>
				))
			) : (
				<div className={HomeStyle.checkinList}>
					<p className={HomeStyle.checkinList__text}>No check-ins for today...</p>
				</div>
			)}

			{/* <table className='table'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Stylist Name</th>
						<th>Checked-in At</th>
					</tr>
				</thead>
				<tbody>
					{attendanceList && attendanceList.loading ? (
						<tr>
							<td colSpan='5' style={{ textAlign: 'center' }}>
								<Spinner />
							</td>
						</tr>
					) : attendanceList &&
					attendanceList.userInfo &&
					attendanceList.userInfo.status &&
					attendanceList.userInfo.data &&
					attendanceList.userInfo.data.result &&
					attendanceList.userInfo.data.result.length > 0 ? (
						attendanceList.userInfo.data.result.map((d, index) => (
							<tr key={d._id}>
								<td>{index + 1}</td>
								<td>{d.user.name}</td>
								<td>{d.user.phone}</td>
								<td>{d.stylist.name}</td>
								<td>{d.checkInTimeString}</td>
								<td>
									<button onClick={() => handleDelete(d._id)}>delete</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan='5' style={{ textAlign: 'center' }}>
								No results found
							</td>
						</tr>
					)}
				</tbody>
			</table> */}
		</div>
	);
};

export default AttendData;
