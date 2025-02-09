import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../Map';
import styles from './Run.module.css';
import { getDistance } from 'geolib';

const RunPage = ({ data }) => {
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && data?.location) {
      const { lat, lng } = data.location;

      // Add the new location to the path
      setPath((prevPath) => {
        const updatedPath = [...prevPath, { lat, lng }];

        // Recalculate total distance
        if (updatedPath.length > 1) {
          const lastSegmentDistance = getDistance(
            updatedPath[updatedPath.length - 2],
            updatedPath[updatedPath.length - 1]
          );
          setDistance((prevDistance) => prevDistance + lastSegmentDistance);
        }

        return updatedPath;
      });
    }
  }, [data?.location, isRunning]);

  const handleStartRun = () => {
    setIsRunning(true);
    setPath([]); // Reset path at the start of a walk
    setDistance(0); // Reset distance
    setTime(0); // Reset timer
  };

  const handleEndRun = () => {
    setIsRunning(false);
    navigate('/RunReport', { state: { time, distance, path } });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const calculatePace = () => {
    if (distance === 0) return 'N/A';
    const paceInSecondsPerKm = time / (distance / 1000); // time (s) per km
    const mins = Math.floor(paceInSecondsPerKm / 60);
    const secs = Math.round(paceInSecondsPerKm % 60).toString().padStart(2, '0');
    return `${mins}:${secs} min/km`;
  };

  return (
    <div className={styles['map-page-container']}>
      <h1>Run</h1>
      <div>
        <p>Elapsed Time: {formatTime(time)}</p>
        <p>Total Distance: {(distance / 1000).toFixed(2)} km</p>
        <p>Pace: {calculatePace()}</p>
        <span>Heart Rate:</span>
        <span>{data.heartRate} BPM</span>
      </div>

      <button onClick={handleStartRun} className={styles['start-run-button']}>Start Run</button>
      <button onClick={handleEndRun} className={styles['end-run-button']}>End Run</button>

      <div className={styles['map-container']}>
        {data?.location && (
          <Map
            latitude={data.location.lat}
            longitude={data.location.lng}
            path={path}
          />
        )}
      </div>
    </div>
  );
};

export default RunPage;
