import React, { useState, useEffect } from 'react'; 
import styles from './Run.module.css';
import mapStyles from './map.module.css';
import { getDistance } from 'geolib';
import Map from '../Map';

const RunPage = ({ data }) => {
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(true); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isRunning) {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (data?.location) {
      setPath((prevPath) => {
        const newPath = [...prevPath, { lat: data.location.lat, lng: data.location.lng }];

        if (newPath.length > 1) {
          const lastIndex = newPath.length - 1;
          const additionalDistance = getDistance(
            newPath[lastIndex - 1],
            newPath[lastIndex]
          );
          setDistance((prevDistance) => prevDistance + additionalDistance);
        }

        return newPath;
      });
    }
  }, [data]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleEndRun = () => {
    setIsRunning(false);
  };

  return (
    <div className={styles['map-page-container']}>
      {data ? (
        <div className={styles['data-box']}>
          <h1>Run</h1>
          <div className={styles.timer}>
            <p>Elapsed Time: {formatTime(time)}</p>
          </div>
          <p>Heart Rate: {data.heartRate} BPM</p>
          <p>Total Distance: {(distance / 1000).toFixed(2)} km</p>
          <Map
            className={mapStyles['map-container']}
            latitude={data.location?.lat}
            longitude={data.location?.lng}
            path={path}
          />
          {isRunning && (
            <button onClick={handleEndRun} className={styles['end-run-button']}>
              End Run
            </button>
          )}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default RunPage;
