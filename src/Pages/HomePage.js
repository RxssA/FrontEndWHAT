import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Map from '../Map';
import '../App.css';
import './HomePageMap.css';
import HeartRatePage from './HeartRatePage';
import TempPage from './TempPage';
import MapPage from './MapPage';
import ExercisePage from './ExercisePage';
import WalkPage from './WalkPage';
import RunPage from './RunPage';
import WalkReport from './WalkReport';
import RunReport from './RunReport';
import Workout from './Workout';
import WorkoutReport from './WorkoutReport';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';


const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=53.270962&longitude=-9.062691&current=temperature_2m,apparent_temperature,precipitation,rain,showers,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,showers,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_hours&timezone=Europe/Dublin";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      weather: null, // Stores weather data
    };
  }

  componentDidMount() {
    this.ws = new WebSocket("http://192.168.0.23:4000");
    this.ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      this.setState({ data: receivedData });
    };


    this.fetchWeatherData();
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  async fetchWeatherData() {
    try {
      const response = await fetch(WEATHER_API_URL);
      const weatherData = await response.json();
      this.setState({ weather: weatherData });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  render() {
    const { data, weather } = this.state;
    const currentWeather = weather?.current || {};
    const dailyWeather = weather?.daily || {};

    return (
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="navbar-content">
              <h1>Wearable Health and Activity Tracker</h1>
              <div className="nav-buttons">
                <Link to="/"><button className="nav-btn">Home</button></Link>
                <Link to="/heart-rate"><button className="nav-btn">Heart Rate</button></Link>
                <Link to="/temp"><button className="nav-btn">Skin Temperature</button></Link>
                <Link to="/map"><button className="nav-btn">Location</button></Link>
                <Link to="/exercise"><button className="nav-btn">Exercise</button></Link>
                <Link to="/login"><button className="nav-btn">Login</button></Link>
                <Link to="/signup"><button className="nav-btn">Sign Up</button></Link>
              </div>
            </div>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div className="home-page-content">
                  <div className="welcome-section">
                    <h2>Welcome to Your Health Tracker</h2>
                    <p>Track your health and fitness data in real-time with the Wearable Health and Activity Tracker (WHAT).</p>
                  </div>

                  <div className="data-section">
                    {/* Weather Card */}
                    <div className="data-card weather-card">
                      <h3>Weather</h3>
                      {weather ? (
                        <div>
                          <p><strong>Temperature:</strong> {currentWeather.temperature_2m} °C</p>
                          <p><strong>Feels Like:</strong> {currentWeather.apparent_temperature} °C</p>
                          <p><strong>Rain:</strong> {currentWeather.rain ? `${currentWeather.rain} mm` : "No Rain"}</p>
                          <p><strong>Showers:</strong> {currentWeather.showers ? `${currentWeather.showers} mm` : "None"}</p>
                          <p><strong>Wind Speed:</strong> {currentWeather.wind_speed_10m} km/h</p>

                          {/* Daily Forecast */}
                          <h4>Daily Forecast</h4>
                          <p><strong>Max Temp:</strong> {dailyWeather.temperature_2m_max?.[0]} °C</p>
                          <p><strong>Min Temp:</strong> {dailyWeather.temperature_2m_min?.[0]} °C</p>
                          <p><strong>Sunrise:</strong> {dailyWeather.sunrise?.[0]}</p>
                          <p><strong>Sunset:</strong> {dailyWeather.sunset?.[0]}</p>
                          <p><strong>UV Index:</strong> {dailyWeather.uv_index_max?.[0]}</p>
                          <p><strong>Precipitation Hours:</strong> {dailyWeather.precipitation_hours?.[0]} hrs</p>
                        </div>
                      ) : (
                        <p>Loading weather data...</p>
                      )}
                    </div>

                    {/* Health Data */}
                    {data ? (
                      <div className="data-card">
                        <h3>Current Health Data</h3>
                        <div className="data-item">
                          <span>Heart Rate:</span>
                          <span>{data.heartRate} BPM</span>
                        </div>
                        <div className="data-item">
                          <span>Temperature:</span>
                          <span>{data.temperature} °C</span>
                        </div>
                        <div className="data-item">
                          <span>Last Updated:</span>
                          <span>{new Date(data.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="map-container">
                          <Map latitude={data.location?.lat} longitude={data.location?.lng} />
                        </div>
                      </div>
                    ) : (
                      <p>Loading health data...</p>
                    )}
                  </div>
                </div>
              }
            />
            <Route path="/heart-rate" element={<HeartRatePage data={data} />} />
            <Route path="/temp" element={<TempPage data={data} />} />
            <Route path="/map" element={<MapPage data={data} />} />
            <Route path="/exercise" element={<ExercisePage data={data} />} />
            <Route path="/walk" element={<WalkPage data={data} />} />
            <Route path="/run" element={<RunPage data={data} />} />
            <Route path="/workout" element={<Workout data={data} />} />
            <Route path="/walkreport" element={<WalkReport data={data} />} />
            <Route path="/RunReport" element={<RunReport data={data} />} />
            <Route path="/WorkoutReport" element={<WorkoutReport data={data} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default HomePage;
