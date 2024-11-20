import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  // Fetch health data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the data from the backend API
        const response = await fetch('/data');
        const result = await response.json();  // Convert the response to JSON
        setData(result);  // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data on initial load and refresh every 5 seconds
    fetchData();
    const interval = setInterval(fetchData, 4000);  // Refresh every 5 seconds

    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, []);  // Empty dependency array ensures this runs only once on mount

  return (
    <div className="App">
      <header>
        <h1>Wearable Health Data</h1>
      </header>

      {data ? (
        <div className="data">
          <div className="data-box">
            <p>Heart Rate: {data.heartRate} BPM</p>
          </div>
          <div className="data-box">
            <p>Temperature: {data.temperature} °C</p>
          </div>
        </div>
      ) : (
        <p>Loading health data...</p> // Display loading message if data is not yet available
      )}
    </div>
  );
}

export default App;
