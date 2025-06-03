import React, { Fragment } from 'react';
import HeadingCard from '../../components/ReportCard/headingCards';
import './ReportHeader.css';

const ReportHeader = ({ data, role = '', style }) => {
	const { generalCountReport } = data;
	return (
		<Fragment>
			{generalCountReport &&
			generalCountReport.report &&
			generalCountReport.report.data && (
				<div className='reportHeader--tab'>
					{generalCountReport.report.data.total_session && (
						<HeadingCard
							label='Total Availabilities'
							description='this year'
							count={generalCountReport.report.data.total_session}
							icon='stopwatch'
							style={style}
							textColor='black'
						/>
					)}
					{generalCountReport.report.data.total_earning && (
						<HeadingCard
							label='Total Earnings'
							description='this year'
							count={generalCountReport.report.data.total_earning}
							icon='dollar'
							style={style}
							textColor='primary'
						/>
					)}
					{generalCountReport.report.data.growth_percentage && (
						<HeadingCard
							label='Total Growth'
							description='from last year'
							count={generalCountReport.report.data.growth_percentage + ' %'}
							icon={generalCountReport.report.data.growth_percentage > 0 ? 'grow' : 'trending-down'}
							style={style}
							textColor={generalCountReport.report.data.growth_percentage > 0 ? 'green' : 'red'}
						/>
					)}
					{role &&
					role === 'admin' &&
					generalCountReport.report.data.salonCount && (
						<HeadingCard
							label='Total Salons'
							description='registered with us'
							count={generalCountReport.report.data.salonCount}
							icon='salon'
							style={style}
							textColor='black'
						/>
					)}
				</div>
			)}
		</Fragment>
	);
};

export default ReportHeader;
