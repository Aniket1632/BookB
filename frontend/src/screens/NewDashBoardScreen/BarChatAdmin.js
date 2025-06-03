import React from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','November','December'];

const createGradient = (context) => {
  const gradient = context.chart.ctx.createLinearGradient(120, 120, 180, 300);
  gradient.addColorStop(0, "#ff9000"); // Start color
  return gradient;
};

// export const options = {
//   responsive: true,
//   scales: {
//       x: {
//          grid: {
//             display: false,
//             color: 'white',
//             drawBorder: false,
//             borderDash: []
//          },
//          ticks: {
//           // callback: (value) => {
//           //   const index = Math.round(value);
//           //   return appointmentData[index] ? moment(appointmentData[index]._id).format('MMM Do, h:mm a') : '';
//           // },
//         },
//         beginAtZero: true,
//       },
//       y: {
//          grid: {
//           color: '#ffffff1c',
//           margin: '1rem'
//          },
//         //  beginAtZero: true
//       }
//  },
//   plugins: {
//     legend: {
//       display:false,
//     },
//     title: {
//       display: false,
//       text: 'Chart.js Bar Chart',
//     },
//   },
// };

const BarChatAdmin = ({ appointmentData, role }) => {
  // console.log(appointmentData , "appointment")
  const labels = Array.from(
    { length: (appointmentData && appointmentData.length) || 0 },
    (_, index) => index
  );

  const data = {
    labels:
      role === "admin"
        ? appointmentData &&
          appointmentData.map(
            (item) => item && item.salonData && item.salonData.name
          )
        : appointmentData &&
          appointmentData.appointmentChart.map((item) =>
            moment(item._id).format("MMM Do, h:mm a")
          ),
    datasets: [
      {
        label: labels,
        data:
          role === "admin"
            ? appointmentData &&
              appointmentData.map((item) => item && item.appointmentCount)
            : appointmentData &&
              appointmentData.appointmentChart.map((item) => item.count),
        barThickness: 30,
        maxBarThickness: 40,
        minBarLength: 10,
        backgroundColor: (context) => createGradient(context),
        borderWidth: 1,
        borderColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          color: "white",
        },
        ticks: {
          //   callback: (value) => {
          //     const ticksArray =
          //       appointmentData &&
          //       appointmentData.appointmentChart &&
          //       appointmentData.appointmentChart.map((item) =>
          //         moment(item._id).format("MMM Do")
          //       );
          //     const index = Math.round(value);
          //     return ticksArray ? ticksArray[index] : "";
          //   },
          color: "white",
          font: {
            size: 14,
          },
          // },
          beginAtZero: true,
          // borderWidth: 1,
          // afterBuildTicks: (scale) => {
          //   console.log('Ticks:', scale.ticks);
        },
      },
      y: {
        grid: {
          color: "#ffffff1c",
          margin: "1rem",
          drawBorder: false,
        },
        ticks: {
          //   stepSize: 1,
          color: "white",
          borderWidth: 1,
          fontSize: 30,
        },
        zeroLineColor: "white",
        afterBuildTicks: (scale) => {
          // console.log('Ticks:', scale.ticks);
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };
  return (
    <div className="dashboard_section_4">
      <p className="dashboard_p1">Number of appointments in current month</p>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChatAdmin;
