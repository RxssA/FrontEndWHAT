import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../Map';
import styles from './Walk.module.css';
import mapStyles from './map.module.css';
import { getDistance } from 'geolib';

const WalkPage = ({ data }) => {
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isWalking, setIsWalking] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    if (isWalking) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isWalking]);

  const handleStartWalk = () => {
    setIsWalking(true);
  };

  const handleEndWalk = () => {
    setIsWalking(false);
    navigate('/WalkReport', { state: { time, distance, path } });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className={styles['map-page-container']}>
      <h1>Walk</h1>
      <div>
        <p>Elapsed Time: {formatTime(time)}</p>
        <p>Total Distance: {(distance / 1000).toFixed(2)} km</p>
      </div>

      <button onClick={handleStartWalk} className={styles['start-walk-button']}>Start Walk</button>
      <button onClick={handleEndWalk} className={styles['end-walk-button']}>End Walk</button>

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

export default WalkPage;
