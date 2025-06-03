import React, { Fragment } from 'react';
import HeadingCardstylist from '../../components/ReportCard/headingCardstylist';
import { months } from './months';
import './ReportHeader.css';

const ReportHeaderStylist = ({ getStylistSessionByMonth }) => {
	return (
		<Fragment>
			{getStylistSessionByMonth &&
			getStylistSessionByMonth.report &&
			getStylistSessionByMonth.report.data && (
				<div className='reportHeader--tab'>
					{getStylistSessionByMonth.report.data.map((report, i) => (
						<HeadingCardstylist
							key={i}
							label={months.length > 0 && months.map((m) => m.month === report.month && m.name)}
							description='Availabilities'
							count={report.total}
							icon='stopwatch'
						/>
					))}
				</div>
			)}
		</Fragment>
	);
};

export default ReportHeaderStylist;
