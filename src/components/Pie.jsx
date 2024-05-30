// UserPieChart.js
import { Pie,Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);


const UserPieChart = ({ activeUsers, inactiveUsers }) => {
  const data = {
    labels: ['Aktiiviset käyttäjät', 'Ei-aktiiviset käyttäjät'],
    datasets: [
      {
        label: 'Käyttäjät',
        data: [activeUsers, inactiveUsers],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  }
  return <Pie data={data} />;
};


const UserBarChart = ({ activeUsers, inactiveUsers }) => {

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        max: 30,
      },
    },
  }
  
  const data = {
    labels: ['Aktiiviset käyttäjät', 'Ei aktiiviset käyttäjät'],
    datasets: [{
      label: 'Käyttäjät',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [activeUsers, inactiveUsers],
    }]}

  return <Bar data={data} options={options}/>;
}


UserPieChart.propTypes = {
    activeUsers: PropTypes.number.isRequired,
    inactiveUsers: PropTypes.number.isRequired,
  }

  UserBarChart.propTypes = {
    activeUsers: PropTypes.number.isRequired,
    inactiveUsers: PropTypes.number.isRequired,
  }  

export { UserPieChart, UserBarChart }
