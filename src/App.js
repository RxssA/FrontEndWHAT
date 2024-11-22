import React, { useState, useEffect } from 'react';
import Map from './Map';
import './App.css'; // Assuming your styles are in App.css

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
    <div className="App">
      {/* Navigation Bar with Buttons */}
      <nav className="navbar">
        <h1>Wearable Health and Fitness Tracker</h1>
        <div className="nav-buttons">
          <button className="nav-btn">Heart Rate</button>
          <button className="nav-btn">Skin Temperature</button>
          <button className="nav-btn">Location</button>
          <button className="nav-btn">Exercise</button>
        </div>
      </nav>



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
              <Map latitude={data.location?.lat} longitude={data.location?.lng} />
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
