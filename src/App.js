import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  // Fetch health data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data on initial load and refresh every 5 seconds
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval); // Cleanup the interval
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Wearable Health Data</h1>
      </header>

      {data ? (
        <div className="data-container">
          <div className="data-box">
            <p><strong>Heart Rate:</strong> {data.heartRate} BPM</p>
          </div>
          <div className="data-box">
            <p><strong>Temperature:</strong> {data.temperature} °C</p>
          </div>
        </div>
      ) : (
        <p>Loading health data...</p>
      )}
    </div>
  );
}

export default App;
