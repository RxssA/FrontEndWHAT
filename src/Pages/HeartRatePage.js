import React, { useEffect, useState } from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HeartRatePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.14:4000/data/last10')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (data.length === 0) {
    return <p>Loading data...</p>;
  }

  const labels = data.map((record) => new Date(record.timestamp).toLocaleTimeString());
  const heartRateData = data.map((record) => record.heartRate);
  const averageHeartRateData = data.map((record) => record.averageHeartRate);
  const highestHeartRateData = data.map((record) => record.highestHeartRate);
  const lowestHeartRateData = data.map((record) => record.lowestHeartRate);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
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
          text: 'Heart Rate (BPM)',
        },
        beginAtZero: true,
      },
    },
  };

  // Chart datasets
  const createDataset = (label, data, borderColor, backgroundColor) => ({
    label,
    data,
    borderColor,
    backgroundColor,
    borderWidth: 2,
    tension: 0.3,
  });

  const chartData = {
    labels,
    datasets: [
      createDataset(
        'Heart Rate',
        heartRateData,
        'rgba(75, 192, 192, 1)',
        'rgba(75, 192, 192, 0.2)'
      ),
      createDataset(
        'Average Heart Rate',
        averageHeartRateData,
        'rgba(153, 102, 255, 1)',
        'rgba(153, 102, 255, 0.2)'
      ),
      createDataset(
        'Highest Heart Rate',
        highestHeartRateData,
        'rgba(255, 99, 132, 1)',
        'rgba(255, 99, 132, 0.2)'
      ),
      createDataset(
        'Lowest Heart Rate',
        lowestHeartRateData,
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 0.2)'
      ),
    ],
  };

  return (
    <div className="centered-text">
      <div className="data-box">
      </div>

      <div>
        <h2>Heart Rate Data</h2>
        <Line data={chartData} options={chartOptions} width={1000} height={400} />
      </div>
    </div>
  );
};

export default HeartRatePage;
