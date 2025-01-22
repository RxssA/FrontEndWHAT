import React, { useState, useEffect } from 'react';
import Map from '../Map'; // Ensure your Map component supports polylines
import './Walk.css';
import styles from './map.module.css';
import { getDistance } from 'geolib'; // Library for calculating distances

const WalkPage = ({ data }) => {
  const [time, setTime] = useState(0); 
  const [path, setPath] = useState([]); // Array to store GPS coordinates
  const [distance, setDistance] = useState(0); // Total distance traveled
  const [isWalking, setIsWalking] = useState(true); // Track if walk is ongoing

  useEffect(() => {
    // Timer to track elapsed time
    const intervalId = setInterval(() => {
      if (isWalking) {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isWalking]);

  useEffect(() => {
    // Update path whenever new data is received
    if (data?.location) {
      setPath((prevPath) => {
        const newPath = [...prevPath, { lat: data.location.lat, lng: data.location.lng }];

        // Calculate new distance if there are at least two points
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

  // Format time in HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleEndWalk = () => {
    setIsWalking(false); // Stop the timer and updates
  };

  return (
    <div className={styles['map-page-container']}>
      {data ? (
        <div className={styles["data-box"]}>
          <h1>Walk</h1>
          <div className="timer">
            <p>Elapsed Time: {formatTime(time)}</p>
          </div>
          <p>Total Distance: {(distance / 1000).toFixed(2)} km</p>
          <Map
            latitude={data.location?.lat}
            longitude={data.location?.lng}
            path={path} // Pass the path to the Map component
          />
          {isWalking && (
            <button onClick={handleEndWalk} className={styles['end-walk-button']}>
              End Walk
            </button>
          )}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default WalkPage;
