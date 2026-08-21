import React from 'react';
import './TrackDataWidget.css';

const TrackDataWidget = ({ trackData }) => {
  if (!trackData) return <div className="track-data-widget">Loading track data...</div>;

  return (
    <div className="track-data-widget">
      <h2>Track Information</h2>
      <div className="track-info">
        <div className="info-item">
          <span className="label">Circuit:</span>
          <span className="value">{trackData.circuit}</span>
        </div>
        <div className="info-item">
          <span className="label">Lap Record:</span>
          <span className="value">{trackData.lapRecord}</span>
        </div>
        <div className="info-item">
          <span className="label">Record Holder:</span>
          <span className="value">{trackData.lapRecordHolder}</span>
        </div>
        <div className="info-item">
          <span className="label">Total Laps:</span>
          <span className="value">{trackData.totalLaps}</span>
        </div>
        <div className="info-item">
          <span className="label">Lap Distance:</span>
          <span className="value">{trackData.lapDistance} km</span>
        </div>
        <div className="info-item">
          <span className="label">Race Distance:</span>
          <span className="value">{trackData.raceDistance} km</span>
        </div>
        <div className="info-item">
          <span className="label">Turns:</span>
          <span className="value">{trackData.turns}</span>
        </div>
        <div className="info-item">
          <span className="label">DRS Zones:</span>
          <span className="value">{trackData.drsZones}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackDataWidget;