import React, { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import Styles from './NewStyles.module.css'
ChartJS.register(ArcElement, Tooltip, Legend);


export const config = {

  plugins: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        enabled: true,
      },
    },
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        font: {
          size: 18
        }
      }
    }
  },
  cutout: '65%',
  radius: '80%',
  maintainAspectRatio: false,
  height: 200,
}

const PieChart = ({ userPieData }) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const calculatePercentage = (count, totalUsers) => {
    if (totalUsers === 0 || count === undefined) {
      return 0;
    } else {
      const percentage = (count / totalUsers) * 100;
      return Math.min(Math.round(percentage * 10) / 10, 100);
    }
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: '80%',
    radius: '94%',
    maintainAspectRatio: false,
    height: 100
  };

  const data2 = {
    labels: userPieData && userPieData.userChart.map(item => capitalizeFirstLetter(item._id)),
    datasets: [
      {
        label: 'Gender Percentage',
        data: userPieData && userPieData.userChart.map(item => item.count),
        backgroundColor: [
          '#FF9000',
          '#FFFFFF',
          '#0A0A0A',
        ],
        borderColor: '#0070ae',
        borderWidth: 0,
      },
    ],
  };

  const maleCount = userPieData?.userChart.find(data => data._id === 'male')?.count || 0;
  const femaleCount = userPieData?.userChart.find(data => data._id === 'female')?.count || 0;
  const totalUsers = maleCount + femaleCount;

  const memoizedMalePercentage = useMemo(
    () => calculatePercentage(maleCount, totalUsers),
    [userPieData, maleCount, totalUsers]
  );

  const memoizedFemalePercentage = useMemo(
    () => calculatePercentage(femaleCount, totalUsers),
    [userPieData, femaleCount, totalUsers]
  );

  return (
    <div className={Styles.pie_chart_container}>
      <p className={Styles.dashboard_p} style={{ width: "100%", float: 'left', fontSize: '2.2rem' }}>Clients</p>
      <div className={Styles.chart8_circle}>
        <div className={Styles.chart8_circle_info}>
          <p className={Styles.chart8_circle_info_text}>
            Clients Percentage
          </p>
        </div>
        <div className={Styles.chart8_circle_chart}>
          <Doughnut data={data2} options={options2} />
        </div>
      </div >
      <div className={Styles.percenatage_container}>
        <div className={Styles.dot_container}>
          <div className={Styles.dot}></div>
          <span className={Styles.male_percentage_Text}>Male: {memoizedMalePercentage === 0 ? '-' : memoizedMalePercentage} {memoizedMalePercentage === 0 ? '' : '%'}</span>

        </div>
        <div className={Styles.dot_container}>
          <div className={Styles.dot1}></div>
          <span className={Styles.male_percentage_Tex1}>Female: {memoizedFemalePercentage === 0 ? '-' : memoizedFemalePercentage} {memoizedFemalePercentage === 0 ? '' : '%'}</span>
        </div>
        {/* <div className={Styles.dot_container}>
              <div className={Styles.dot}></div>
              <span className={Styles.male_percentage_Text}>Male: {memoizedMalePercentage}</span>
            </div> */}
      </div>
    </div>
  )
}

export default PieChart