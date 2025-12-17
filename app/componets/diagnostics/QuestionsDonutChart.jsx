'use client';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function QuestionsDonutChart({ data }) {
  const labels = data.map((d) => d.service);
  const counts = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Questions Distribution',
        data: counts,
        backgroundColor: [
          '#00ff8c',
          '#ff5468',
          '#ffd700',
          '#1e90ff',
          '#ff7f50',
          '#32cd32',
          '#ff69b4',
          '#8a2be2',
          '#00ced1',
        ],
        borderColor: '#111',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#9ee6c1', font: { size: 12 } },
      },
      title: {
        display: true,
        text: 'Questions Distribution by Service (%)',
        color: '#9ee6c1',
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-900 border-4 border-blue-500 rounded-lg">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
