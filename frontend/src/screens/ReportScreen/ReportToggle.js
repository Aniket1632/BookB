import React from 'react';
import './ReportToggle.css';

const ReportToggle = ({ data, onChangeMonthHandler, showfilter }) => {
	const { month } = data;

	const monthList = [
		{ name: 'January', id: 1 },
		{ name: 'February', id: 2 },
		{ name: 'March', id: 3 },
		{ name: 'April', id: 4 },
		{ name: 'May', id: 5 },
		{ name: 'June', id: 6 },
		{ name: 'July', id: 7 },
		{ name: 'August', id: 8 },
		{ name: 'September', id: 9 },
		{ name: 'October', id: 10 },
		{ name: 'November', id: 11 },
		{ name: 'December', id: 12 }
	];
	return (
		showfilter && (
			<div className='textBox__input' style={{ width: 'auto' }}>
				<select
					value={month}
					className='textBox__input--box'
					style={{ margin: '0' }}
					onChange={(e) => {
						onChangeMonthHandler(e.target.value);
					}}>
					{monthList &&
						monthList.map((m) => (
							<option value={m.id} key={m.id}>
								{m.name}
							</option>
						))}
				</select>
			</div>
		)
	);
};

export default ReportToggle;
