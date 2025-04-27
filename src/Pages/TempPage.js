import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
import styles from './Temp.module.css';
import Navbar from '../Components/Navbar';
import '../App.css';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

const TempPage = ({ data }) => {
  const [tempData, setTempData] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username');
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
    if (data?.temperature) {
      const newDataPoint = {
        timestamp: new Date().toISOString(),
        temperature: data.temperature,
      };
      setTempData((prevData) => [...prevData, newDataPoint]);
    }
  }, [data?.temperature]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    fetch(`http://${process.env.REACT_APP_API_URL}/data/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTempData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Add function to send new data
  const sendData = async (temperature) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heartRate: 0, // You might want to get actual heart rate
          temperature,
          location: { lat: 0, lng: 0 } // You might want to get actual location
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Data sent successfully:', result);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles['centered-text']}>
        <div className={styles['data-box']}>
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your temperature data.</p>
          <Link to="/login">
            <button className={styles['nav-btn']}>Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  if (tempData.length === 0) {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="temp-page">
            <p className={styles.loading}>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  const labels = tempData.map((record) => new Date(record.timestamp).toLocaleTimeString());
  const temperatureData = tempData.map((record) => record.temperature);

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
    <div className="App">
      <Navbar />
      <div className="content">
        <div className="temp-page">
          <div className={styles['centered-text']}>
            <div className={styles['data-box']}>
              <h1>Temperature Data</h1>
              <div className={styles['chart-container']}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className={styles['text-container']}>
              <h3>Skin Temperature Fact</h3>
              <div className={styles['fact-box']}>
                <p>{skinTempFacts[factIndex]}</p>
                <button className={styles['next-btn']} onClick={nextFact}>➡️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempPage;
