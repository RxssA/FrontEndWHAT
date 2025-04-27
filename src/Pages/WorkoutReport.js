import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./WalkReport.module.css";
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

const WorkoutReport = () => {
  const { state } = useLocation();
  const { time, startTime, endTime, exercises } = state || {}; 
  
  // If startTime or endTime are undefined, set to current time as fallback
  const start = startTime ? new Date(startTime).getTime() : Date.now();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  
  const [heartRateData, setHeartRateData] = useState([]);

  useEffect(() => {
    fetch('http://${process.env.REACT_APP_API_URL}/data/last10')
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

  const saveWorkoutReport = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        // Get timestamps from state/component props
        const reportData = {
            time: time,  // Total duration in seconds
            exercises: exercises,
            startTime: startTime,  // Should be a timestamp
            endTime: endTime       // Should be a timestamp
        };

        const response = await fetch("http://${process.env.REACT_APP_API_URL}/workoutreport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reportData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to save workout');
        }

        console.log('Workout saved:', data);
        alert("Workout report saved successfully!");
        // Optional: Redirect or clear state
    } catch (error) {
        console.error("Error saving workout report:", error);
        alert(error.message || "Failed to save workout report.");
    }
};

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <div className={styles["data-box"]}>
          <h1>Workout Report</h1>
          <div className={styles["time-info"]}>
            <p>Start Time: {startTime ? new Date(startTime).toLocaleString() : "N/A"}</p>
            <p>End Time: {endTime ? new Date(endTime).toLocaleString() : "N/A"}</p>
            <p>Total Time: {time ? formatTime(time) : "N/A"}</p>
          </div>
          
          {/* Workout Exercises Section */}
          <div className={styles["exercises-section"]}>
            <h2>Workout Exercises</h2>
            {exercises && exercises.length > 0 ? (
              <div className={styles["exercises-grid"]}>
                {exercises.map((exercise) => (
                  <div key={exercise.id} className={styles["exercise-card"]}>
                    <h3>{exercise.name}</h3>
                    <div className={styles["exercise-details"]}>
                      <p><strong>Weight:</strong> {exercise.weight} Kg</p>
                      <p><strong>Reps:</strong> {exercise.reps}</p>
                      <p><strong>Sets:</strong> {exercise.sets}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No exercises recorded during this workout.</p>
            )}
          </div>

          <button onClick={saveWorkoutReport} className={styles["save-button"]}>Save Workout Report</button>

          <div>
            <h2>Heart Rate Data During Workout</h2>
            {filteredHeartRateData.length > 0 ? (
              <Line data={chartData} options={chartOptions} width={1000} height={400} />
            ) : (
              <p>No heart rate data available for the workout duration.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutReport;
