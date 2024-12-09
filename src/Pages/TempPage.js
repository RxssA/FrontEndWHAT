import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TempPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the last 10 temperature records from the server
    fetch('http://localhost:4000/data/last10') // Update with your server's endpoint
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (data.length === 0) {
    return <p>Loading data...</p>;
  }

  // Extract labels (timestamps) and temperature data for the chart
  const labels = data.map((record) =>
    new Date(record.timestamp).toLocaleTimeString()
  );
  const temperatureData = data.map((record) => record.temperature);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="centered-text">
      <h1>Temperature Data</h1>
      <Line data={chartData} options={chartOptions} width={1000} height={400} />
    </div>
  );
};

export default TempPage;
