'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function QuestionsChart({ data }) {
  const labels = data.map((d) => d.service);
  const counts = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Questions Answered',
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
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#9ee6c1' },
      },
      title: {
        display: true,
        text: 'Questions Answered Per Service',
        color: '#9ee6c1',
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ee6c1', font: { size: 12 } },
        grid: { color: '#333' },
      },
      y: {
        ticks: { color: '#9ee6c1', font: { size: 12 } },
        grid: { color: '#333' },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-900 border-4 border-green-500 rounded-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
}
