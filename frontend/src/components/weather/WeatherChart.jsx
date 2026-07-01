import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherChart = ({ hourlyData }) => {
  if (!hourlyData || !hourlyData.time) return null;

  // Take next 24 hours
  const times = hourlyData.time.slice(0, 24).map(t => new Date(t).toLocaleTimeString([], { hour: '2-digit' }));
  const temps = hourlyData.temperature_2m.slice(0, 24);
  const rainProbs = hourlyData.precipitation_probability.slice(0, 24);

  const data = {
    labels: times,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temps,
        borderColor: 'rgb(249, 115, 22)', // orange-500
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        yAxisID: 'y',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Rain Probability (%)',
        data: rainProbs,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9ca3af'
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#9ca3af' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#9ca3af' },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">24-Hour Forecast Trend</h3>
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default WeatherChart;
