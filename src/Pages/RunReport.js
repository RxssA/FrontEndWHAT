import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./RunReport.module.css";
import Map from "../Map";
import Navbar from "../Components/Navbar";
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

const RunReport = () => {
  const { state } = useLocation();
  const { time, distance, path, startTime, endTime } = state || {};
  const userWeight = 70;
  const MET = distance / (time / 3600) < 4.8 ? 2.8 : 3.8;
  const caloriesBurned = (MET * userWeight * (time / 3600)).toFixed(2);
  const [heartRateData, setHeartRateData] = useState([]);

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_API_URL}/data/last10`)
      .then((response) => response.json())
      .then((data) => setHeartRateData(data))
      .catch((error) => console.error('Error fetching heart rate data:', error));
  }, []);

  const filteredHeartRateData = heartRateData.filter((record) => {
    const recordTime = new Date(record.timestamp).getTime();
    const start = startTime ? new Date(startTime).getTime() : Date.now();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    return recordTime >= start && recordTime <= end;
  });

  console.log("Filtered Heart Rate Data:", filteredHeartRateData);
  console.log("Start Time:", new Date(startTime).toLocaleString());
  console.log("End Time:", new Date(endTime).toLocaleString());
  console.log("Heart Rate Data Timestamps:", heartRateData.map(record => new Date(record.timestamp).toLocaleString()));

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatDistance = (distanceInMeters) => {
    return distanceInMeters >= 1000
      ? `${(distanceInMeters / 1000).toFixed(2)} km`
      : `${distanceInMeters.toFixed(2)} m`;
  };

  const calculatePace = () => {
    if (!distance) return "N/A";
    const paceInSecondsPerKm = time / (distance / 1000);
    const mins = Math.floor(paceInSecondsPerKm / 60);
    const secs = Math.round(paceInSecondsPerKm % 60).toString().padStart(2, "0");
    return `${mins}:${secs} min/km`;
  };

  const saveRunReport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      const response = await fetch(`http://${process.env.REACT_APP_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      const userId = userData._id;

      const reportData = {
        userId,
        time,
        distance,
        path,
        caloriesBurned,
        pace: calculatePace(),
      };

      const saveResponse = await fetch(`http://${process.env.REACT_APP_API_URL}/runreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reportData),
      });
      const data = await saveResponse.json();
      console.log(data.message);
      alert("Run report saved successfully!");
    } catch (error) {
      console.error("Error saving run report:", error);
      alert("Failed to save run report.");
    }
  };

  const labels = filteredHeartRateData.map((record) => new Date(record.timestamp).toLocaleTimeString());
  const heartRateValues = filteredHeartRateData.map((record) => record.heartRate);
  const averageHeartRateData = filteredHeartRateData.map((record) => record.averageHeartRate);
  const highestHeartRateData = filteredHeartRateData.map((record) => record.highestHeartRate);
  const lowestHeartRateData = filteredHeartRateData.map((record) => record.lowestHeartRate);

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
        heartRateValues,
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)'
      ),
      createDataset(
        'Average Heart Rate',
        averageHeartRateData,
        'rgb(153, 102, 255)',
        'rgb(153, 102, 255)'
      ),
      createDataset(
        'Highest Heart Rate',
        highestHeartRateData,
        'rgb(255, 99, 132)',
        'rgb(255, 99, 132)'
      ),
      createDataset(
        'Lowest Heart Rate',
        lowestHeartRateData,
        'rgb(54, 162, 235)',
        'rgb(54, 162, 235)'
      ),
    ],
  };

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <div className={styles["data-box"]}>
          <h1>Run Report</h1>
          <div className={styles["time-info"]}>
            <p>Start Time: {startTime ? new Date(startTime).toLocaleString() : "N/A"}</p>
            <p>End Time: {endTime ? new Date(endTime).toLocaleString() : "N/A"}</p>
            <p>Total Time: {time ? formatTime(time) : "N/A"}</p>
          </div>
          <p>Total Distance: {distance ? formatDistance(distance) : "N/A"}</p>
          <p>Pace: {calculatePace()}</p>
          <p>Calories Burned: {caloriesBurned} kcal</p>
          <button onClick={saveRunReport} className={styles["save-button"]}>Save Report</button>
          <div className={styles["map-container"]}>
            {path ? (
              <Map latitude={path[0]?.lat} longitude={path[0]?.lng} path={path} />
            ) : (
              <p className={styles["loading"]}>Loading map...</p>
            )}
          </div>
          <div className={styles["chart-container"]}>
            <h2>Heart Rate Data During Run</h2>
            {filteredHeartRateData.length > 0 ? (
              <Line data={chartData} options={chartOptions} width={1000} height={400} />
            ) : (
              <p>No heart rate data available for the run duration.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunReport;