import React, { useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: true,
        color: '#4d4d4d4f', // Change this to the desired color (e.g., red with 20% opacity)
        drawBorder: false,
        borderDash: []
      },
      ticks: {
        display: true,
        color: 'white', // Change this to the desired color (e.g., red with 20% opacity)
        drawBorder: false
      }
    },
    y: {
      grid: {
        display: true,
        drawBorder: false,
        color: '#4d4d4d4f', 
        borderDash: []
      },
      ticks: {
        display: true,
        color: 'white', // Change this to the desired color (e.g., red with 20% opacity)
        drawBorder: false,
        stepSize: 1
      }
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
function getMonth(month) {
  switch (month) {
    case 'Jan': return 1;
    case 'Feb': return 2;
    case 'Mar': return 3;
    case 'Apr': return 4;
    case 'May': return 5;
    case 'Jun': return 6;
    case 'Jul': return 7;
    case 'Aug': return 8;
    case 'Sep': return 9;
    case 'Oct': return 10;
    case 'Nov': return 11;
    case 'Dec': return 12;
    default: break;
  }
}



const LineChart = ({ currentData,style }) => {
  const dataset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (var i = 0; i < 12; i++) {
    let dataMonth = getMonth(currentData && currentData[i] && currentData[i]._id)
    if ((currentData && currentData[i] && currentData[i]._id)) {
      dataset[dataMonth - 1] = currentData && currentData[i] && currentData[i].count;
    }
  }

  const data = {
    // labels:currentData && currentData.map(item=>item._id),
    labels,
    datasets: [
      {
        // data: currentData && currentData.map(item=>item.count),
        data: dataset,
        barPercentage: 0.5,
        backgroundColor: "#ff9000",
        borderColor: "#ff9000",
        fill: false,
        lineTension: 0.4,
        //  pointRadius: 0,     
        radius: 6,
      },

    ],
  };
  return (
    <div className='dashboard_box' style={style}>
      <p className='dashboard_p' style={{marginBottom: '1.2rem'}}>Appointments by month</p>
      <Line options={options} data={data} style={{height: '2rem'}} />
    </div>
  )
}

export default LineChart