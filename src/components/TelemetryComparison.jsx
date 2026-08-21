import React, { useState } from 'react';
import { BarChart3, Gauge, Zap, Flame, Disc, ArrowLeftRight } from 'lucide-react';
import './TelemetryComparison.css';

const TelemetryComparison = ({ drivers }) => {
  const [driverAId, setDriverAId] = useState(drivers[0]?.driverNumber || 1);
  const [driverBId, setDriverBId] = useState(drivers[1]?.driverNumber || 4);

  const driverA = drivers.find(d => d.driverNumber === driverAId) || drivers[0] || {};
  const driverB = drivers.find(d => d.driverNumber === driverBId) || drivers[1] || {};

  return (
    <div className="telemetry-card">
      <div className="telemetry-card-header">
        <div className="tel-title-left">
          <BarChart3 size={18} color="#00f0ff" />
          <h2>HEAD-TO-HEAD TELEMETRY COMPARISON</h2>
        </div>
      </div>

      {/* Driver Selectors Header */}
      <div className="comparator-selectors">
        {/* Driver A Selector */}
        <div className="driver-select-box" style={{ borderColor: driverA.teamColor || '#e10600' }}>
          <div className="select-meta">
            <span className="car-num" style={{ backgroundColor: driverA.teamColor || '#e10600' }}>
              #{driverA.driverNumber}
            </span>
            <select 
              value={driverAId} 
              onChange={e => setDriverAId(Number(e.target.value))}
              className="d-select"
            >
              {drivers.map(d => (
                <option key={d.driverNumber} value={d.driverNumber}>
                  P{d.position} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
          <div className="driver-sub-badge">{driverA.team}</div>
        </div>

        <div className="vs-badge">VS</div>

        {/* Driver B Selector */}
        <div className="driver-select-box" style={{ borderColor: driverB.teamColor || '#00f0ff' }}>
          <div className="select-meta">
            <span className="car-num" style={{ backgroundColor: driverB.teamColor || '#00f0ff' }}>
              #{driverB.driverNumber}
            </span>
            <select 
              value={driverBId} 
              onChange={e => setDriverBId(Number(e.target.value))}
              className="d-select"
            >
              {drivers.map(d => (
                <option key={d.driverNumber} value={d.driverNumber}>
                  P{d.position} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
          <div className="driver-sub-badge">{driverB.team}</div>
        </div>
      </div>

      {/* Telemetry Metrics Comparison Rows */}
      <div className="telemetry-meters-grid">
        {/* Speed Delta */}
        <div className="meter-row">
          <div className="meter-val left" style={{ color: driverA.teamColor || '#e10600' }}>
            {Math.round(driverA.speed || 320)} <small>KM/H</small>
          </div>
          <div className="meter-center">
            <span className="meter-title"><Gauge size={13} /> TOP SPEED</span>
            <div className="dual-bar-track">
              <div 
                className="dual-fill left" 
                style={{ 
                  width: `${((driverA.speed || 320) / 360) * 100}%`,
                  backgroundColor: driverA.teamColor || '#e10600' 
                }} 
              />
              <div 
                className="dual-fill right" 
                style={{ 
                  width: `${((driverB.speed || 320) / 360) * 100}%`,
                  backgroundColor: driverB.teamColor || '#00f0ff' 
                }} 
              />
            </div>
          </div>
          <div className="meter-val right" style={{ color: driverB.teamColor || '#00f0ff' }}>
            {Math.round(driverB.speed || 320)} <small>KM/H</small>
          </div>
        </div>

        {/* Engine RPM */}
        <div className="meter-row">
          <div className="meter-val left" style={{ color: driverA.teamColor || '#e10600' }}>
            {Math.round(driverA.rpm || 11500)} <small>RPM</small>
          </div>
          <div className="meter-center">
            <span className="meter-title"><Flame size={13} /> ENGINE RPM</span>
            <div className="dual-bar-track">
              <div 
                className="dual-fill left" 
                style={{ 
                  width: `${((driverA.rpm || 11500) / 15000) * 100}%`,
                  backgroundColor: driverA.teamColor || '#e10600' 
                }} 
              />
              <div 
                className="dual-fill right" 
                style={{ 
                  width: `${((driverB.rpm || 11500) / 15000) * 100}%`,
                  backgroundColor: driverB.teamColor || '#00f0ff' 
                }} 
              />
            </div>
          </div>
          <div className="meter-val right" style={{ color: driverB.teamColor || '#00f0ff' }}>
            {Math.round(driverB.rpm || 11500)} <small>RPM</small>
          </div>
        </div>

        {/* Throttle % */}
        <div className="meter-row">
          <div className="meter-val left" style={{ color: '#00ff66' }}>
            {driverA.throttle ?? 100}%
          </div>
          <div className="meter-center">
            <span className="meter-title">THROTTLE APPLIED</span>
            <div className="dual-bar-track">
              <div className="dual-fill left throttle" style={{ width: `${driverA.throttle ?? 100}%` }} />
              <div className="dual-fill right throttle" style={{ width: `${driverB.throttle ?? 100}%` }} />
            </div>
          </div>
          <div className="meter-val right" style={{ color: '#00ff66' }}>
            {driverB.throttle ?? 100}%
          </div>
        </div>

        {/* Brake % */}
        <div className="meter-row">
          <div className="meter-val left" style={{ color: '#ff3333' }}>
            {driverA.brake ?? 0}%
          </div>
          <div className="meter-center">
            <span className="meter-title">BRAKE FORCE</span>
            <div className="dual-bar-track">
              <div className="dual-fill left brake" style={{ width: `${driverA.brake ?? 0}%` }} />
              <div className="dual-fill right brake" style={{ width: `${driverB.brake ?? 0}%` }} />
            </div>
          </div>
          <div className="meter-val right" style={{ color: '#ff3333' }}>
            {driverB.brake ?? 0}%
          </div>
        </div>

        {/* Gear & DRS */}
        <div className="extra-telemetry-row">
          <div className="extra-box left">
            <div className="extra-item">GEAR: <strong>{driverA.gear || 8}</strong></div>
            <div className="extra-item">DRS: <span className={driverA.drs ? 'drs-on' : 'drs-off'}>{driverA.drs ? 'ACTIVE' : 'OFF'}</span></div>
          </div>

          <div className="extra-center-tag">GEAR / DRS STATUS</div>

          <div className="extra-box right">
            <div className="extra-item">GEAR: <strong>{driverB.gear || 8}</strong></div>
            <div className="extra-item">DRS: <span className={driverB.drs ? 'drs-on' : 'drs-off'}>{driverB.drs ? 'ACTIVE' : 'OFF'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryComparison;
