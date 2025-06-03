import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);


export const config = {

    plugins: {
        responsive: true,
        legend: {
            position: 'right',
            align: 'center',
            labels: {
                font: {
                    size: 18
                }
            }
        }
    }

}

const PieChart = ({ userPieData }) => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const data = {
        labels: userPieData && userPieData.userChart.map(item => capitalizeFirstLetter(item._id)),
        datasets: [
            {
                label: 'Gender',
                data: userPieData && userPieData.userChart.map(item => item.count),
                backgroundColor: [
                    '#D9D9D9',
                    '#888684',
                    '#0A0A0A',
                ],
                borderColor: [
                    '#D9D9D9',
                    '#888684',
                    '#0A0A0A',
                ],
                borderWidth: 1,
                width: "100%",
            },
        ],
    };

    return (
        <div className='dashboard_bar'>
            <p className='dashboard_p' style={{ width: "100%", float: 'left' }}>Gender</p>
            <Pie data={data} options={config} />
        </div>
    )
}

export default PieChart