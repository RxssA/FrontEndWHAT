import React, { useState, useEffect } from 'react';

const UsingWebSocket = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Wearable Health Data</h2>
      {data ? (
        <div className="data">
          <div className="data-box">
            <p>Heart Rate: {data.heartRate} BPM</p>
          </div>
          <div className="data-box">
            <p>Temperature: {data.temperature} °C</p>
          </div>
          <div className="data-box">
            <p>
              Location: Lat {data.location?.lat}, Lng {data.location?.lng}
            </p>
          </div>
          <div className="data-box">
            <p>
              Accelerometer: X={data.accelerometer?.x}, Y={data.accelerometer?.y}, Z={data.accelerometer?.z}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading health data...</p>
      )}
    </div>
  );
};

export default UsingWebSocket;
