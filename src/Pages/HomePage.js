import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Map from '../Map';
import '../App.css';
import './HomePageMap.css';
import UserProfilePage from './UserProfile';
import Navbar from '../Components/Navbar';

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=53.270962&longitude=-9.062691&current=temperature_2m,apparent_temperature,precipitation,rain,showers,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,showers,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_hours&timezone=Europe/Dublin";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      weather: null,
      username: localStorage.getItem('username') || '',
      showDropdown: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({ showDropdown: !prevState.showDropdown }));
  }

  handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = '/auth';
  };

  componentDidMount() {
    this.ws = new WebSocket("ws://" + process.env.REACT_APP_API_URL);
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
    const { data, weather, username } = this.state;
    const currentWeather = weather?.current || {};
    const dailyWeather = weather?.daily || {};
    const weatherClass = currentWeather.temperature_2m > 20 ? "hot-weather" : "cold-weather";

    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="home-page-content">
            <div className="welcome-section">
              <h2>Welcome to Your Health Tracker</h2>
              <p>Track your health and fitness data in real-time with the Wearable Health and Activity Tracker (WHAT).</p>
            </div>

            <div className="data-section">
              {/* Weather Card */}
              <div className={`data-card weather-card ${weatherClass}`}>
                <h3>Weather</h3>
                {weather ? (
                  <>
                    <div className="weather-icon">🌤️</div>
                    <p className="weather-temp">{currentWeather.temperature_2m}°C</p>
                    <div className="weather-details">
                      <div><strong>Feels Like:</strong> {currentWeather.apparent_temperature}°C</div>
                      <div><strong>Precipitation:</strong> {currentWeather.precipitation ? `${currentWeather.precipitation} mm` : "None"}</div>
                      <div><strong>Rain:</strong> {currentWeather.rain ? `${currentWeather.rain} mm` : "None"}</div>
                      <div><strong>Showers:</strong> {currentWeather.showers ? `${currentWeather.showers} mm` : "None"}</div>
                      <div><strong>Wind Speed:</strong> {currentWeather.wind_speed_10m} km/h</div>

                      <div className="daily-forecast">
                        <h4>Daily Forecast</h4>
                        <div><strong>Max Temp:</strong> {dailyWeather.temperature_2m_max?.[0]}°C</div>
                        <div><strong>Min Temp:</strong> {dailyWeather.temperature_2m_min?.[0]}°C</div>
                        <div><strong>UV Index:</strong> {dailyWeather.uv_index_max?.[0]}</div>
                        <div><strong>Precipitation Hours:</strong> {dailyWeather.precipitation_hours?.[0]}h</div>
                      </div>

                      <div className="sun-times">
                        <div className="weather-sunrise">🌅 Sunrise: {dailyWeather.sunrise?.[0]}</div>
                        <div className="weather-sunset">🌇 Sunset: {dailyWeather.sunset?.[0]}</div>
                      </div>
                    </div>
                  </>
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
                  <div className="map-containerH">
                    <Map latitude={data.location?.lat} longitude={data.location?.lng} />
                  </div>
                </div>
              ) : (
                <p>Loading health data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
