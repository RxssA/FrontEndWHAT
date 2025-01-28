import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./WalkReport.module.css";
import Map from "../Map";

const WalkReport = () => {
  const { state } = useLocation();
  const { time, distance, path } = state || {};

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

  return (
    <div className={styles["data-box"]}>
      <h1>Walk Report</h1>
      <p>Total Time: {time ? formatTime(time) : "N/A"}</p>
      <p>Total Distance: {distance ? formatDistance(distance) : "N/A"}</p>
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

export default WalkReport;
