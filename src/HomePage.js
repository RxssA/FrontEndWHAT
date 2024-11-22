import React from 'react';

const HomePage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const ws = new WebSocket("http://localhost:4000");
  
      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        setData(receivedData);
      };
  
      return () => {
        ws.close();
      };
    }, []);
  
    return (
      <Router>
        <div className="App">
          {/* Navigation Bar with Buttons */}
          <nav className="navbar">
            <h1>Wearable Health and Fitness Tracker</h1>
            <div className="nav-buttons">
            <Link to="/heart-rate">
                <button className="nav-btn">Heart Rate</button>
              </Link>
              <button className="nav-btn">Skin Temperature</button>
              <button className="nav-btn">Location</button>
              <button className="nav-btn">Exercise</button>
            </div>
          </nav>
  
          {/* Routes */}
          <Routes>
            <Route path="/heart-rate" element={<HeartRatePage />} />
          </Routes>
  
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
      </Router>
    );
  };

export default HomePage;
