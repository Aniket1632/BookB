import React from 'react';
import { Bar } from 'react-chartjs-2';
import { options } from './chartOptions';

import ReportStyles from './Report.module.css';

const IncomeChart = ({ earningReportByMonth }) => {
	// const data = {
	// 	labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ],
	// 	datasets: [
	// 		{
	// 			type: 'line',
	// 			label: 'Earning (in $)',
	// 			data: [ 30, 20, 10, 50, 30, 20, 10, 50, 30, 20, 10, 50 ],
	// 			fill: false,
	// 			backgroundColor: 'rgb(54, 162, 235)',
	// 			tension: 0.5
	// 		},
	// 		{
	// 			type: 'line',
	// 			label: 'Utilities (in $)',
	// 			data: [ 40, 25, 0, 60, 20, 25, 10, 40, 30, 25, 10, 40 ],
	// 			fill: false,
	// 			backgroundColor: '#007c6e',
	// 			tension: 0.5
	// 		},
	// 		{
	// 			type: 'bar',
	// 			label: 'Sessions',
	// 			data: [ 20, 20, 30, 40, 20, 20, 30, 40, 20, 20, 30, 40 ],
	// 			borderColor: 'rgb(255, 99, 132)',
	// 			backgroundColor: 'rgba(255, 51, 102, .5)'
	// 		},
	// 		{
	// 			type: 'bar',
	// 			label: 'Stylist Earnings (in $)',
	// 			data: [ 17, 10, 20, 45, 10, 5, 40, 60, 50, 10, 0, 30 ],
	// 			borderColor: 'rgb(255, 99, 132)',
	// 			backgroundColor: 'rgba(255, 144, 0, .5)'
	// 		}
	// 	]
	// };
	return (
		<div className={ReportStyles.chartContent}>
			<div className={ReportStyles.chartContentHeader}>
				<h1 className={ReportStyles.chartContentHeading}>Earning Report</h1>
			</div>

			{earningReportByMonth &&
			earningReportByMonth.report &&
			earningReportByMonth.report.data &&
			Object.keys(earningReportByMonth.report.data).length > 0 ? (
				<Bar
					data={earningReportByMonth.report.data}
					options={options}
					className={ReportStyles.report_chart_container}
				/>
			) : (
				<p>No report found</p>
			)}
		</div>
	);
};

export default IncomeChart;
