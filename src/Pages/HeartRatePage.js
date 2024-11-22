import React from 'react';

const HeartRatePage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Heart Rate</h1>
      <p></p>

      {data ? (
        <>
          <div className="data-box">
            <p>Heart Rate: {data.heartRate} BPM</p>
            <p>Average Heart Rate: BPM</p>
            <p>Highest Heart Rate: BPM</p>
            <p>Lowest Heart Rate: BPM</p>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HeartRatePage;
