import React, { useState, useEffect } from 'react';
import Map from '../Map';
import './Walk.css'

const WalkPage = ({ data }) => {
  const [time, setTime] = useState(0); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Format time in HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="map-page-container">
      <h1>Walk</h1>
      <div className="timer">
        <p>Elapsed Time: {formatTime(time)}</p>
      </div>
      <Map />
    </div>
  );
};

export default WalkPage;
