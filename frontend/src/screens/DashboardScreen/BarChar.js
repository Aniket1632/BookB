import React from 'react'
import moment from "moment"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );




  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','November','December'];

  
  export const options = {
    responsive: true,
    scales: {
        x: {
           grid: {
              display: false
           }
        },
        y: {
           grid: {
              display: false
           }
        }
   },
    plugins: {
      legend: {
        display:false,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
  };

const BarChar = ({appointmentData,role}) => {
    const data = {
        labels:role==="admin"?appointmentData && appointmentData.map(item=>item && item.salonData  && item.salonData.name) : appointmentData && appointmentData.appointmentChart.map(item=> moment(item._id).format('MMM Do, h:mm a')),
        datasets: [
          {
            // label: 'Dataset 1',
            data: role==="admin"?appointmentData && appointmentData.map(item=>item && item.appointmentCount) : appointmentData && appointmentData.appointmentChart.map(item=>item.count),
            barThickness: 20,
            // maxBarThickness:40,
            // minBarLength: 10,
            backgroundColor: '#ff9000',
          },
          
        ],
      };
    
  return (
    <div className='dashboard_section_2'>
        <p className='dashboard_p'>Number of appointments</p>
        <Bar options={options} data={data} />
    </div>
  )
}

export default BarChar