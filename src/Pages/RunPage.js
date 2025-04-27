import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../Map';
import styles from './Run.module.css';
import { getDistance } from 'geolib';
import { useData } from '../context/DataContext';
import Navbar from '../Components/Navbar';

const RunPage = () => {
  const { location, heartRate } = useData();
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn, navigate]);

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
    if (isRunning && location) {
      const { lat, lng } = location;

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
  }, [location, isRunning]);

  const handleStartRun = () => {
    setIsRunning(true);
    setPath([]); // Reset path at the start of a run
    setDistance(0); // Reset distance
    setTime(0); // Reset timer
    setStartTime(new Date().toISOString()); // Set start time
  };

  const handleEndRun = () => {
    setIsRunning(false);
    const currentEndTime = new Date().toISOString(); 
    setEndTime(currentEndTime);
    navigate('/RunReport', {
      state: { time, distance, path, startTime, endTime: currentEndTime }
    });
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
    <div className="App">
      <Navbar />
      <div className="content">
        <div className={styles['map-page-container']}>
          <div className={styles['data-box']}>
            <h1>Run</h1>
            <div>
              <p>Elapsed Time: {formatTime(time)}</p>
              <p>Total Distance: {(distance / 1000).toFixed(2)} km</p>
              <p>Pace: {calculatePace()}</p>
              <p>Heart Rate: {heartRate} BPM</p>
            </div>

            <div className={styles['button-container']}>
              <button onClick={handleStartRun} className={styles['start-run-button']}>Start Run</button>
              <button onClick={handleEndRun} className={styles['end-run-button']}>End Run</button>
            </div>

            <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
              <Map
                latitude={location?.lat || 51.5074}
                longitude={location?.lng || -0.1278}
                path={path}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunPage;
