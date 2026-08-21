import React, { useState } from 'react';
import { Activity, Zap, Radio, ChevronDown, ChevronUp, Disc, Shield, Gauge } from 'lucide-react';
import './DriverTracker.css';

const TIRE_CONFIG = {
  SOFT: { label: 'S', color: '#ff3333', border: '#ff3333', bg: 'rgba(255, 51, 51, 0.2)' },
  MEDIUM: { label: 'M', color: '#ffd700', border: '#ffd700', bg: 'rgba(255, 215, 0, 0.2)' },
  HARD: { label: 'H', color: '#ffffff', border: '#ffffff', bg: 'rgba(255, 255, 255, 0.2)' },
  INTERMEDIATE: { label: 'I', color: '#00ff66', border: '#00ff66', bg: 'rgba(0, 255, 102, 0.2)' },
  WET: { label: 'W', color: '#00b4d8', border: '#00b4d8', bg: 'rgba(0, 180, 216, 0.2)' }
};

const DriverTracker = ({ drivers, onSelectDriver, selectedDriverNumber }) => {
  const [expandedDriver, setExpandedDriver] = useState(null);

  const toggleExpand = (driverNumber) => {
    setExpandedDriver(prev => prev === driverNumber ? null : driverNumber);
    if (onSelectDriver) {
      onSelectDriver(driverNumber);
    }
  };

  return (
    <div className="driver-tracker-card">
      <div className="tracker-card-header">
        <div className="header-left-title">
          <Activity size={18} color="#e10600" />
          <h2>LIVE TIMING TOWER</h2>
        </div>
        <div className="tower-meta-badges">
          <span className="fastest-lap-legend">⚡ = FASTEST LAP</span>
          <span className="live-tag"><span className="dot" /> SYNCED</span>
        </div>
      </div>

      <div className="timing-table-wrapper">
        <div className="timing-table-header">
          <div className="col-pos">POS</div>
          <div className="col-driver">DRIVER</div>
          <div className="col-team">TEAM</div>
          <div className="col-tire">TIRE</div>
          <div className="col-gap">GAP</div>
          <div className="col-interval">INTERVAL</div>
          <div className="col-sectors">SECTORS (S1 / S2 / S3)</div>
          <div className="col-drs">DRS</div>
          <div className="col-pits">PIT</div>
        </div>

        <div className="timing-table-body">
          {drivers.map((d, index) => {
            const isExpanded = expandedDriver === d.driverNumber;
            const tireInfo = TIRE_CONFIG[d.tire] || TIRE_CONFIG.MEDIUM;

            return (
              <React.Fragment key={d.driverNumber || index}>
                <div 
                  className={`driver-row ${isExpanded ? 'expanded' : ''} ${d.position <= 3 ? `podium-p${d.position}` : ''}`}
                  onClick={() => toggleExpand(d.driverNumber)}
                >
                  {/* Team color accent line */}
                  <div className="team-color-strip" style={{ backgroundColor: d.teamColor || '#e10600' }} />

                  {/* Position */}
                  <div className="col-pos">
                    <span className="pos-badge">{d.position}</span>
                  </div>

                  {/* Driver Name & Number */}
                  <div className="col-driver">
                    <div className="driver-number-box" style={{ borderColor: d.teamColor || '#ffffff' }}>
                      {d.driverNumber || (index + 1)}
                    </div>
                    <div className="driver-name-group">
                      <span className="driver-acronym">{d.acronym || 'DRV'}</span>
                      <span className="driver-full-name">{d.name}</span>
                    </div>
                    {d.fastestLap && <span className="fastest-lap-badge" title="Current Fastest Lap (1 Bonus Pt)">⚡</span>}
                  </div>

                  {/* Team */}
                  <div className="col-team">
                    <span className="team-name-text">{d.team}</span>
                  </div>

                  {/* Tire */}
                  <div className="col-tire">
                    <div 
                      className="tire-pill" 
                      style={{ 
                        color: tireInfo.color, 
                        borderColor: tireInfo.border,
                        backgroundColor: tireInfo.bg 
                      }}
                      title={`${d.tire} compound - ${d.stintLaps || 1} laps old`}
                    >
                      <span className="tire-letter">{tireInfo.label}</span>
                      <span className="tire-age">{d.stintLaps || 12}L</span>
                    </div>
                  </div>

                  {/* Gap & Interval */}
                  <div className="col-gap">
                    <span className="gap-text">{d.gap || d.time}</span>
                  </div>
                  <div className="col-interval">
                    <span className="interval-text">{d.interval || '+0.000'}</span>
                  </div>

                  {/* Micro-Sectors */}
                  <div className="col-sectors">
                    <div className="micro-sector-box">
                      <span className={`sector-pill ${d.s1Status?.toLowerCase() || (index === 0 ? 'purple' : 'green')}`}>
                        {d.s1 || '24.1'}
                      </span>
                      <span className={`sector-pill ${d.s2Status?.toLowerCase() || (index === 1 ? 'purple' : 'green')}`}>
                        {d.s2 || '28.3'}
                      </span>
                      <span className={`sector-pill ${d.s3Status?.toLowerCase() || (index === 2 ? 'purple' : 'yellow')}`}>
                        {d.s3 || '26.0'}
                      </span>
                    </div>
                  </div>

                  {/* DRS */}
                  <div className="col-drs">
                    <span className={`drs-pill ${d.drs ? 'active' : 'inactive'}`}>
                      {d.drs ? 'DRS' : '---'}
                    </span>
                  </div>

                  {/* Pit stops */}
                  <div className="col-pits">
                    <span className="pit-badge">{d.pitStops || 1}</span>
                    <span className="expand-indicator">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </div>

                {/* Expanded Telemetry Drawer */}
                {isExpanded && (
                  <div className="driver-telemetry-drawer">
                    <div className="drawer-grid">
                      {/* Speed & Gear */}
                      <div className="telemetry-box speed-box">
                        <div className="t-label"><Gauge size={14} /> SPEED</div>
                        <div className="t-val">{Math.round(d.speed || 320)} <small>KM/H</small></div>
                        <div className="gear-indicator">GEAR <strong>{d.gear || 8}</strong></div>
                      </div>

                      {/* RPM Bar */}
                      <div className="telemetry-box rpm-box">
                        <div className="t-label">ENGINE RPM</div>
                        <div className="t-val">{Math.round(d.rpm || 11500)} <small>RPM</small></div>
                        <div className="rpm-bar-mini">
                          <div 
                            className="rpm-bar-fill"
                            style={{ width: `${Math.min(100, ((d.rpm || 11500) / 15000) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Throttle % */}
                      <div className="telemetry-box throttle-box">
                        <div className="t-label">THROTTLE</div>
                        <div className="pedal-bar-track">
                          <div 
                            className="pedal-fill throttle" 
                            style={{ width: `${d.throttle ?? 100}%` }} 
                          />
                        </div>
                        <div className="pedal-val">{d.throttle ?? 100}%</div>
                      </div>

                      {/* Brake % */}
                      <div className="telemetry-box brake-box">
                        <div className="t-label">BRAKE</div>
                        <div className="pedal-bar-track">
                          <div 
                            className="pedal-fill brake" 
                            style={{ width: `${d.brake ?? 0}%` }} 
                          />
                        </div>
                        <div className="pedal-val">{d.brake ?? 0}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DriverTracker;