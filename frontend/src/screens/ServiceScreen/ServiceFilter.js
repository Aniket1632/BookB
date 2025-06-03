import React from 'react';
import ServiceStyle from './Service.module.css';

const ServiceFilter = ({ service,setFilterId, list, onChangeMonthHandler, showfilter }) => {
	return (
		showfilter && (
			<div className='textBox__input' style={{ width: 'auto', backgroundColor: '#FFFFFF' }}>
				<select
					value={service}
					className='textBox__input--box'
					style={{ margin: '0', backgroundColor: '#FFFFFF' }}
					onChange={(e) => {
						setFilterId(e.target.value);
						onChangeMonthHandler(e.target.value);
					}}>
					<option value=''>
						Select All
					</option>
					{
						list &&
						list.categories &&
						list.categories.data &&
						list.categories.data.length > 0 &&
						list.categories.data.map((m) => (
							<option value={m._id} key={m._id}>
								{m.title}
							</option>
						))}
				</select>
			</div>
		)
	);
};

export default ServiceFilter;
