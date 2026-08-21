import React from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ weather }) => {
  if (!weather) return <div className="weather-widget">Loading weather...</div>;

  return (
    <div className="weather-widget">
      <h2>Weather Conditions</h2>
      <div className="weather-info">
        <div className="weather-item">
          <span className="label">Air Temperature:</span>
          <span className="value">{weather.temperature}°C</span>
        </div>
        <div className="weather-item">
          <span className="label">Track Temperature:</span>
          <span className="value">{weather.trackTemp}°C</span>
        </div>
        <div className="weather-item">
          <span className="label">Humidity:</span>
          <span className="value">{weather.humidity}%</span>
        </div>
        <div className="weather-item">
          <span className="label">Wind Speed:</span>
          <span className="value">{weather.windSpeed} km/h</span>
        </div>
        <div className="weather-item">
          <span className="label">Condition:</span>
          <span className="value">{weather.condition}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;