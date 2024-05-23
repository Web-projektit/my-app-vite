// UserPieChart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  };

  return <Pie data={data} />;
};

UserPieChart.propTypes = {
    activeUsers: PropTypes.number.isRequired,
    inactiveUsers: PropTypes.number.isRequired,
  }

export default UserPieChart;
