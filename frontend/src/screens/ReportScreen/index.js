import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../../components/Content';
import {
	generalCountAdminAction,
	getEarningsReportByMonthAction,
	getGeneralCountAction,
	getSessionChartDataAction,
	getSessionReportAction,
	getStylistTotalEarningByMonthChartAction,
	getStylistTotalSessionByMonthAction,
	getStylistTotalSessionByMonthChartAction,
	totalEarningByMonthAdminAction,
	totalEarningByMonthAdminChartAction,
	totalSessionByMonthAdminAction,
	totalSessionByMonthAdminChartAction
} from '../../redux/actions/reportsActions';
import { Bar } from 'react-chartjs-2';
import { options } from './chartOptions';
import ReportToggle from './ReportToggle';
import ReportHeader from './ReportHeader';
import Chart from 'chart.js/auto';
import ReportStyles from './Report.module.css';
import { Link } from 'react-router-dom';
import IncomeChart from './IncomeChart';
import { months } from './months';
import {
	GENERAL_COUNT_ADMIN_RESET,
	GET_EARNING_BY_MONTH_REPORT_RESET,
	GET_GENERAL_COUNT_RESET,
	GET_SESSION_DATA_REPORT_RESET,
	GET_SESSION_REPORT_RESET,
	GET_STYLER_TOTAL_EARNING_BY_MONTH_CHART_RESET,
	GET_STYLER_TOTAL_SESSION_BY_MONTH_CHART_RESET,
	GET_STYLER_TOTAL_SESSION_BY_MONTH_RESET,
	TOTAL_EARNING_BY_MONTH_ADMIN_CHART_RESET,
	TOTAL_EARNING_BY_MONTH_ADMIN_RESET,
	TOTAL_SESSION_BY_MONTH_ADMIN_CHART_RESET,
	TOTAL_SESSION_BY_MONTH_ADMIN_RESET
} from '../../redux/constants/reportsConstants';
import ChartSkeleton from '../../components/Skeletons/ChartSkeleton';
import DashboardCard from '../../components/Skeletons/DashboardCard';

const ReportScreen = ({ history }) => {
	const dispatch = useDispatch();

	const [ month, setMonth ] = useState(new Date().getMonth() + 1);

	const userLogin = useSelector((state) => state.userLogin);
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const sessionReport = useSelector((state) => state.sessionReport);
	const sessionChartReport = useSelector((state) => state.sessionChartReport);
	const generalCountReport = useSelector((state) => state.generalCountReport);
	const earningReportByMonth = useSelector((state) => state.earningReportByMonth);
	const getStylistSessionByMonth = useSelector((state) => state.getStylistSessionByMonth);
	const getStylistSessionByMonthChart = useSelector((state) => state.getStylistSessionByMonthChart);
	const getStylistEarningByMonthChart = useSelector((state) => state.getStylistEarningByMonthChart);

	const generalCountAdmin = useSelector((state) => state.generalCountAdmin);
	const totalSessionByMonthAdmin = useSelector((state) => state.totalSessionByMonthAdmin);
	const totalSessionByMonthAdminChart = useSelector((state) => state.totalSessionByMonthAdminChart);
	const totalEarningByMonthAdmin = useSelector((state) => state.totalEarningByMonthAdmin);
	const totalEarningByMonthAdminChart = useSelector((state) => state.totalEarningByMonthAdminChart);

	useEffect(
		() => {
			if (!(userLogin && userLogin.userInfo && userLogin.userInfo.data && userLogin.userInfo.data.token)) {
				history.push('/login');
			} else if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'salonadmin' ||
					getUserInfo.userInfo.data.role === 'superadmin')
			) {
				dispatch(getGeneralCountAction());
				dispatch(getSessionReportAction({ month: month }));
				dispatch(getSessionChartDataAction({ month: month }));
				dispatch(getEarningsReportByMonthAction());
			} else if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				getUserInfo.userInfo.data.role === 'stylist'
			) {
				dispatch(getStylistTotalSessionByMonthAction());
				dispatch(getStylistTotalSessionByMonthChartAction());
				dispatch(getStylistTotalEarningByMonthChartAction());
			} else if (
				getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				getUserInfo.userInfo.data.role === 'admin'
			) {
				dispatch(generalCountAdminAction());
				dispatch(totalSessionByMonthAdminAction());
				dispatch(totalSessionByMonthAdminChartAction());
				dispatch(totalEarningByMonthAdminAction());
				dispatch(totalEarningByMonthAdminChartAction());
			}
		},
		[ history, getUserInfo, dispatch, month, userLogin ]
	);

	useEffect(
		() => {
			return () => {
				dispatch({ type: GET_GENERAL_COUNT_RESET });
				dispatch({ type: GET_SESSION_REPORT_RESET });
				dispatch({ type: GET_SESSION_DATA_REPORT_RESET });
				dispatch({ type: GET_EARNING_BY_MONTH_REPORT_RESET });
				dispatch({ type: GET_STYLER_TOTAL_SESSION_BY_MONTH_RESET });
				dispatch({ type: GET_STYLER_TOTAL_SESSION_BY_MONTH_CHART_RESET });
				dispatch({ type: GET_STYLER_TOTAL_EARNING_BY_MONTH_CHART_RESET });
				dispatch({ type: GENERAL_COUNT_ADMIN_RESET });
				dispatch({ type: TOTAL_SESSION_BY_MONTH_ADMIN_RESET });
				dispatch({ type: TOTAL_SESSION_BY_MONTH_ADMIN_CHART_RESET });
				dispatch({ type: TOTAL_EARNING_BY_MONTH_ADMIN_RESET });
				dispatch({ type: TOTAL_EARNING_BY_MONTH_ADMIN_CHART_RESET });
			};
		},
		[ dispatch ]
	);

	const onChangeMonthHandler = (m) => {
		setMonth(m);
		dispatch(getSessionReportAction({ month: m }));
		dispatch(getSessionChartDataAction({ month: m }));
	};

	return (
		<Content currentMenu='dashboard' headerTitle='Dashboard' addBtn={false} search={false}>
			{getUserInfo &&
			getUserInfo.userInfo &&
			getUserInfo.userInfo.data &&
			getUserInfo.userInfo.data.role === 'admin' ? (
				<div className={ReportStyles.reportContent}>
					<div className={ReportStyles.leftContent}>
						{generalCountAdmin && generalCountAdmin.loading ? (
							<DashboardCard />
						) : (
							<ReportHeader
								data={{ generalCountReport: generalCountAdmin }}
								role={getUserInfo.userInfo.data.role}
								style={{ width: '12.5vw' }}
							/>
						)}
						{totalSessionByMonthAdminChart && totalSessionByMonthAdminChart.loading ? (
							<ChartSkeleton />
						) : (
							totalSessionByMonthAdminChart &&
							totalSessionByMonthAdminChart.report &&
							totalSessionByMonthAdminChart.report.data && (
								<div className={ReportStyles.chartContent}>
									<div className={ReportStyles.chartContentHeader}>
										<h1 className={ReportStyles.chartContentHeading}>Session Chart</h1>
									</div>
									<Bar
										data={totalSessionByMonthAdminChart.report.data}
										options={options}
										className={ReportStyles.report_chart_container}
									/>
								</div>
							)
						)}
						{totalEarningByMonthAdminChart && totalEarningByMonthAdminChart.loading ? (
							<ChartSkeleton />
						) : (
							totalEarningByMonthAdminChart &&
							totalEarningByMonthAdminChart.report &&
							totalEarningByMonthAdminChart.report.data && (
								<div className={ReportStyles.chartContent}>
									<div className={ReportStyles.chartContentHeader}>
										<h1 className={ReportStyles.chartContentHeading}>Earning by Month Chart</h1>
									</div>
									<Bar
										data={totalEarningByMonthAdminChart.report.data}
										options={options}
										className={ReportStyles.report_chart_container}
									/>
								</div>
							)
						)}
					</div>
					<div className={ReportStyles.rightContent3}>
						{totalEarningByMonthAdmin &&
						totalEarningByMonthAdmin.report &&
						totalEarningByMonthAdmin.report.data && (
							<div className={ReportStyles.rightContent2}>
								<h1 className={ReportStyles.chartContentHeading}>Monthwise Earning</h1>
								{totalEarningByMonthAdmin.report.data.map((res) => (
									<div key={res._id} className={ReportStyles.stylistList}>
										<div className={ReportStyles.stylistListData}>
											<div>
												<h4 className={ReportStyles.stylistListName}>
													{months.length > 0 && months.map((m) => m.month === res.month && m.name)}
												</h4>
												<h6 className={ReportStyles.stylistListSessions}>
													$ <span>{res.earning}</span> {'(' + res.total_session + 'Availabilities)'}
												</h6>
												{/* <p className={ReportStyles.stylistListEarning}>{res.total_session + 'Availabilities'}</p> */}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						{totalSessionByMonthAdmin &&
						totalSessionByMonthAdmin.report &&
						totalSessionByMonthAdmin.report.data && (
							<div className={ReportStyles.rightContent4}>
								<h1 className={ReportStyles.chartContentHeading}>Monthwise Sessions</h1>
								{totalSessionByMonthAdmin.report.data.map((res) => (
									<div key={res._id} className={ReportStyles.stylistList}>
										<div className={ReportStyles.stylistListData}>
											<div>
												<h4 className={ReportStyles.stylistListName}>
													{months.length > 0 && months.map((m) => m.month === res.month && m.name)}
												</h4>
												<h6 className={ReportStyles.stylistListSessions}>
													<span>{res.total}</span> sessions
												</h6>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			) : getUserInfo &&
			getUserInfo.userInfo &&
			getUserInfo.userInfo.data &&
			getUserInfo.userInfo.data.role === 'stylist' ? (
				<div className={ReportStyles.reportContent}>
					<div className={ReportStyles.leftContent}>
						{getStylistSessionByMonth && getStylistSessionByMonth.loading ? (
							<DashboardCard />
						) : (
							// <ReportHeaderStylist getStylistSessionByMonth={getStylistSessionByMonth} />
							<ReportHeader data={{ generalCountReport: getStylistSessionByMonth }} />
						)}
						{getStylistSessionByMonthChart && getStylistSessionByMonthChart.loading ? (
							<ChartSkeleton />
						) : (
							getStylistSessionByMonthChart &&
							getStylistSessionByMonthChart.report &&
							getStylistSessionByMonthChart.report.data && (
								<div className={ReportStyles.chartContent}>
									<div className={ReportStyles.chartContentHeader}>
										<h1 className={ReportStyles.chartContentHeading}>Session Chart</h1>
									</div>
									<Bar
										data={getStylistSessionByMonthChart.report.data}
										options={options}
										className={ReportStyles.report_chart_container}
									/>
								</div>
							)
						)}
					</div>
					{getStylistEarningByMonthChart &&
					getStylistEarningByMonthChart.report &&
					getStylistEarningByMonthChart.report.data && (
						<div className={ReportStyles.rightContent2}>
							<h1 className={ReportStyles.chartContentHeading}>Your Earning History</h1>
							{getStylistEarningByMonthChart.report.data.map((res) => (
								<div key={res._id} className={ReportStyles.stylistList}>
									<div className={ReportStyles.stylistListData}>
										<div>
											<h4 className={ReportStyles.stylistListName}>
												{months.length > 0 && months.map((m) => m.month === res.month && m.name)}
											</h4>
											<h6 className={ReportStyles.stylistListSessions}>
												$ <span>{res.earning}</span>
											</h6>
											<p className={ReportStyles.stylistListEarning}>{res.total_session + 'Availabilities'}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className={ReportStyles.reportContent}>
					<div className={ReportStyles.leftContent}>
						{sessionReport && sessionReport.loading ? (
							<DashboardCard />
						) : (
							<ReportHeader data={{ generalCountReport }} />
						)}
						{sessionChartReport && sessionChartReport.loading ? (
							<ChartSkeleton />
						) : (
							<div className={ReportStyles.chartContent}>
								<div className={ReportStyles.chartContentHeader}>
									<h1 className={ReportStyles.chartContentHeading}>Stylist Session Chart</h1>
									<ReportToggle showfilter={true} data={{ month }} onChangeMonthHandler={onChangeMonthHandler} />
								</div>

								{sessionChartReport &&
								sessionChartReport.report &&
								sessionChartReport.report.data &&
								Object.keys(sessionChartReport.report.data).length > 0 ? (
									<Bar
										data={sessionChartReport.report.data}
										options={options}
										className={ReportStyles.report_chart_container}
									/>
								) : (
									<p>No report found</p>
								)}
							</div>
						)}
						{earningReportByMonth && earningReportByMonth.loading ? (
							<ChartSkeleton />
						) : (
							<IncomeChart earningReportByMonth={earningReportByMonth} />
						)}
					</div>
					<div className={ReportStyles.rightContent}>
						<h1 className={ReportStyles.chartContentHeading}>Stylist Sessions History</h1>
						{sessionReport &&
							sessionReport.report &&
							sessionReport.report.data &&
							sessionReport.report.data.length > 0 &&
							sessionReport.report.data.map((res) => (
								<Link
									to={`/stylist-sessions/${res.stylist._id}`}
									key={res.stylist._id}
									className={ReportStyles.stylistList}>
									<div className={ReportStyles.stylistListData}>
										<img src={res.stylist.photo} alt={res.stylist.name} className={ReportStyles.stylistListImage} />
										<div>
											<h4 className={ReportStyles.stylistListName}>{res.stylist.name}</h4>
											<h6 className={ReportStyles.stylistListSessions}>
												<span>{res.session}</span> Sessions
											</h6>
											<p className={ReportStyles.stylistListEarning}>{'Total Earning $' + res.earning}</p>
										</div>
									</div>
									<svg className={ReportStyles.stylistListIcon}>
										<use xlinkHref={`/assets/sprite.svg#icon-chevron-right`} />
									</svg>
								</Link>
							))}
					</div>
				</div>
			)}
		</Content>
	);
};

export default ReportScreen;
