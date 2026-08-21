import React from 'react';
import './DriverTracker.css';

const DriverTracker = ({ drivers }) => {
  return (
    <div className="driver-tracker f1-card">
      <h2>Driver Standings</h2>
      <div className="drivers-table">
        <div className="table-header">
          <div className="pos">Pos</div>
          <div className="driver">Driver</div>
          <div className="team">Team</div>
          <div className="laps">Laps</div>
          <div className="time">Time/Gap</div>
          <div className="points">Pts</div>
        </div>
        <div className="table-body">
          {drivers.map(driver => (
            <div key={driver.position} className="table-row">
              <div className="pos">{driver.position}</div>
              <div className="driver">
                <span className="driver-name">{driver.name}</span>
              </div>
              <div className="team">{driver.team}</div>
              <div className="laps">{driver.laps}</div>
              <div className="time">{driver.time}</div>
              <div className="points">{driver.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverTracker;