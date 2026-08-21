import React from 'react';
import { CloudRain, Wind, Thermometer, Droplets, Compass, ShieldAlert, Sun, Gauge } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = ({ weather }) => {
  const data = weather || {
    airTemperature: 21.4,
    trackTemperature: 31.8,
    humidity: 58,
    windSpeed: 14.2,
    windDirection: 'SW (224°)',
    windDirectionDeg: 224,
    pressure: 1012.4,
    rainfall: 0,
    condition: 'Dry / Optimal',
    wetRisk: '12%'
  };

  const isWet = data.rainfall > 0 || parseInt(data.wetRisk) > 60;

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-title-left">
          <CloudRain size={18} color="#00f0ff" />
          <h2>PIT WALL METEOROLOGY</h2>
        </div>
        <div className={`weather-status-chip ${isWet ? 'wet' : 'dry'}`}>
          {isWet ? <CloudRain size={13} /> : <Sun size={13} />}
          <span>{data.condition?.toUpperCase()}</span>
        </div>
      </div>

      <div className="weather-main-grid">
        {/* Track vs Air Temp Dual Gauge */}
        <div className="weather-box temps-box">
          <div className="temp-column">
            <span className="w-label"><Thermometer size={13} /> TRACK TEMP</span>
            <span className="temp-val track">{data.trackTemperature}°<small>C</small></span>
            <span className="temp-sub">OPTIMAL GRIP</span>
          </div>
          <div className="temp-divider" />
          <div className="temp-column">
            <span className="w-label">AIR TEMP</span>
            <span className="temp-val air">{data.airTemperature}°<small>C</small></span>
            <span className="temp-sub">AMBIENT</span>
          </div>
        </div>

        {/* Wind Compass */}
        <div className="weather-box wind-box">
          <div className="wind-left">
            <span className="w-label"><Wind size={13} /> WIND SPEED</span>
            <span className="wind-val">{data.windSpeed} <small>KM/H</small></span>
            <span className="wind-sub">{data.windDirection}</span>
          </div>
          <div className="compass-visual">
            <div className="compass-dial">
              <span className="comp-n">N</span>
              <div 
                className="compass-needle" 
                style={{ transform: `rotate(${data.windDirectionDeg || 224}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* Humidity & Pressure */}
        <div className="weather-box atmosphere-box">
          <div className="atmo-row">
            <span className="w-label"><Droplets size={13} /> HUMIDITY</span>
            <span className="atmo-val">{data.humidity}%</span>
          </div>
          <div className="humidity-bar-track">
            <div className="humidity-bar-fill" style={{ width: `${data.humidity}%` }} />
          </div>

          <div className="atmo-row mt-2">
            <span className="w-label"><Gauge size={13} /> PRESSURE</span>
            <span className="atmo-val">{data.pressure} <small>hPa</small></span>
          </div>
        </div>

        {/* Rain Risk & Tire Advisory */}
        <div className="weather-box advisory-box">
          <div className="advisory-header">
            <span className="w-label">RAIN RISK / STRATEGY</span>
            <span className="risk-badge">{data.wetRisk} RISK</span>
          </div>
          <div className="tire-strategy-recommendation">
            <div className="rec-tire-badge">
              {isWet ? 'INTERMEDIATE (🟢)' : 'SLICKS: MEDIUM / HARD (🟡 ⚪)'}
            </div>
            <p className="strategy-note">
              {isWet 
                ? 'Rain detected on track sectors. Prepare intermediate / wet tire sets.' 
                : 'Track surface is completely dry. Optimal tire window is C2 Medium & C1 Hard.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;