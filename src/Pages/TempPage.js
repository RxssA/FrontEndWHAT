import React from 'react';

const TempPage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Temperature</h1>
      <p></p>

      {data ? (
        <>
          <div className="data-box">
            <p>Temperature: {data.temperature} °C</p>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TempPage;
