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

  const createGradient = (context) => {
    const gradient = context.chart.ctx.createLinearGradient(120, 120, 180, 300);
    gradient.addColorStop(0, '#ff9000');  // Start color
    return gradient;
  };

  export const options = {
    responsive: true,
    scales: {
        x: {
           grid: {
              display: false,
              color: 'white'
           }
        },
        y: {
           grid: {
            color: '#ffffff1c',
            margin: '1rem'
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

const SalonBarChar = ({appointmentData,role}) => {
    const data = {
        labels:role==="admin"?appointmentData && appointmentData.map(item=>item && item.salonData  && item.salonData.name) : appointmentData && appointmentData.appointmentChart.map(item=> moment(item._id).format('MMM Do, h:mm a')),
        datasets: [
          {
            // label: 'Dataset 1',
            data: role==="admin"?appointmentData && appointmentData.map(item=>item && item.appointmentCount) : appointmentData && appointmentData.appointmentChart.map(item=>item.count),
            barThickness: 20,
            // maxBarThickness:40,
            // minBarLength: 10,
            backgroundColor: (context) => createGradient(context),
            borderWidth: 1,
            borderColor: 'white',

          },
          
        ],
      };
    
  return (
    <div className='dashboard_section_2_1'>
        <p className='dashboard_p'>Number of appointments</p>
        <Bar options={options} data={data} />
    </div>
  )
}

export default SalonBarChar