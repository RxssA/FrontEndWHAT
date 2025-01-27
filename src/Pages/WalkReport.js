import React from 'react';
import { useLocation } from 'react-router-dom';

const WalkReport = () => {
  const { state } = useLocation();
  const { time, distance, path } = state || {};
  return (
    <div>
      <h1>Walk Report</h1>
      <p>Total Time: {time}</p>
      <p>Total Distance: {distance}</p>
      <p>Path: {JSON.stringify(path)}</p>
    </div>
  );
};

export default WalkReport;
