import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./WalkReport.module.css";
import Map from "../Map";
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

const WorkoutReport = () => {
  const { state } = useLocation();
  const { time, startTime, endTime } = state || {}; 
  
  // If startTime or endTime are undefined, set to current time as fallback
  const start = startTime ? new Date(startTime).getTime() : Date.now();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  
  const [heartRateData, setHeartRateData] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.23:4000/data/last10')
      .then((response) => response.json())
      .then((data) => setHeartRateData(data))
      .catch((error) => console.error('Error fetching heart rate data:', error));
  }, []);

  // Filter heart rate data based on start and end times
  const filteredHeartRateData = heartRateData.filter((record) => {
    const recordTime = new Date(record.timestamp).getTime();
    return recordTime >= start && recordTime <= end;
  });

  console.log("Filtered Heart Rate Data:", filteredHeartRateData);
  console.log("Start Time:", new Date(start).toLocaleString());
  console.log("End Time:", new Date(end).toLocaleString());
  console.log("Heart Rate Data Timestamps:", heartRateData.map(record => new Date(record.timestamp).toLocaleString()));

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
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
    <div className={styles["data-box"]}>
      <h1>Workout Report</h1>
      <p>Total Time: {time ? formatTime(time) : "N/A"}</p>
      <div className={styles["data-box1"]}>
      </div>
      <div>
        <h2>Heart Rate Data During Workout</h2>
        {filteredHeartRateData.length > 0 ? (
          <Line data={chartData} options={chartOptions} width={1000} height={400} />
        ) : (
          <p>No heart rate data available for the workout duration.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutReport;
