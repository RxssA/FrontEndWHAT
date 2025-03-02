import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./RunReport.module.css";
import Map from "../Map";

const RunReport = () => {
  const { state } = useLocation();
  const { time, distance, path } = state || {};
  const userWeight = 70; 
  const MET = distance / (time / 3600) < 4.8 ? 2.8 : 3.8;
  const caloriesBurned = (MET * userWeight * (time / 3600)).toFixed(2);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatDistance = (distanceInMeters) => {
    if (distanceInMeters >= 1000) {
      return `${(distanceInMeters / 1000).toFixed(2)} km`;
    }
    return `${distanceInMeters.toFixed(2)} m`;
  };

  const calculatePace = () => {
    if (distance === 0) return 'N/A';
    const paceInSecondsPerKm = time / (distance / 1000); // time (s) per km
    const mins = Math.floor(paceInSecondsPerKm / 60);
    const secs = Math.round(paceInSecondsPerKm % 60).toString().padStart(2, '0');
    return `${mins}:${secs} min/km`;
  };

  return (
    <div className={styles["data-box"]}>
      <h1>Run Report</h1>
      <p>Total Time: {time ? formatTime(time) : "N/A"}</p>
      <p>Total Distance: {distance ? formatDistance(distance) : "N/A"}</p>
      <p>Pace: {calculatePace()}</p>
      <p>Calories Burned: {caloriesBurned} kcal</p>
      <div className={styles["data-box1"]}>
        {path ? (
          <div className={styles["data-box1"]}>
          <Map
            latitude={path[0]?.lat}
            longitude={path[0]?.lng}
            path={path}
          />
          </div>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default RunReport;
