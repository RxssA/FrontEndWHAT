import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

const TempPage = () => {
  const [data, setData] = useState([]);
  const [factIndex, setFactIndex] = useState(0);

  const skinTempFacts = [
    "Normal skin temperature ranges between 33-35°C.",
    "Stress and anxiety can cause skin temperature to drop due to reduced blood flow.",
    "Infrared thermometers are commonly used to measure skin temperature.",
    "Exercise increases skin temperature due to increased blood circulation.",
    "Cold environments can lower skin temperature faster than core body temperature.",
    "Some smartwatches now track skin temperature to detect early signs of fever.",
    "Skin temperature can be affected by hydration levels and overall health."
  ];

  useEffect(() => {
    fetch('http://192.168.0.23:4000/data/last10')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (data.length === 0) {
    return <p>Loading data...</p>;
  }

  const labels = data.map((record) => new Date(record.timestamp).toLocaleTimeString());
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

  const nextFact = () => {
    setFactIndex((prevIndex) => (prevIndex + 1) % skinTempFacts.length);
  };

  return (
    <div className="centered-text">
      <h1>Temperature Data</h1>
      <Line data={chartData} options={chartOptions} width={1000} height={400} />
      <div className="text-container">
        <h3>Skin Temperature Fact</h3>
        <div className="fact-box">
          <p>{skinTempFacts[factIndex]}</p>
          <button className="next-btn" onClick={nextFact}>➡️</button>
        </div>
      </div>
    </div>
  );
};

export default TempPage;
