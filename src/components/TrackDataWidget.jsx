import React, { useRef, useEffect, useState } from 'react';
import { Map, Zap, Flag, Compass, Award, Navigation } from 'lucide-react';
import './TrackDataWidget.css';

const TrackDataWidget = ({ trackData, circuit, drivers }) => {
  const pathRef = useRef(null);
  const [carPositions, setCarPositions] = useState([]);

  // Calculate coordinates of each car along the SVG track path
  useEffect(() => {
    if (!pathRef.current || !drivers || drivers.length === 0) return;

    try {
      const pathEl = pathRef.current;
      const pathLength = pathEl.getTotalLength();

      const positions = drivers.map(d => {
        const progress = d.progress ?? 0;
        const point = pathEl.getPointAtLength(progress * pathLength);
        return {
          driverNumber: d.driverNumber,
          acronym: d.acronym || 'DRV',
          teamColor: d.teamColor || '#e10600',
          position: d.position,
          x: point.x,
          y: point.y
        };
      });

      setCarPositions(positions);
    } catch (e) {
      console.warn('SVG path getPointAtLength calculation error:', e);
    }
  }, [drivers, circuit]);

  const activeCircuit = circuit || {
    name: trackData?.circuit || 'Circuit Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    length: trackData?.lapDistance || 4.259,
    totalLaps: trackData?.totalLaps || 72,
    turns: trackData?.turns || 14,
    drsZones: trackData?.drsZones || 2,
    lapRecord: trackData?.lapRecord || '1:11.097',
    lapRecordHolder: trackData?.lapRecordHolder || 'Max Verstappen (2023)',
    path: 'M 180 340 C 140 340 100 310 90 260 C 80 210 110 160 160 140 C 220 110 270 120 310 90 C 350 60 410 70 450 110 C 490 150 510 210 490 270 C 470 320 420 350 360 340 C 310 330 260 340 220 350 Z'
  };

  return (
    <div className="track-data-card">
      <div className="track-card-header">
        <div className="track-title-left">
          <Map size={18} color="#00f0ff" />
          <h2>INTERACTIVE TRACK GPS & SENSORS</h2>
        </div>
        <div className="track-meta-chip">
          <span>{activeCircuit.flag} {activeCircuit.name}</span>
        </div>
      </div>

      <div className="track-map-container">
        <svg viewBox="0 0 580 400" className="circuit-svg">
          <defs>
            {/* Glow filters */}
            <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="drs-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <pattern id="track-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#track-grid)" />

          {/* Underlay Track Width */}
          <path
            d={activeCircuit.path}
            fill="none"
            stroke="#1c2436"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main Racing Line */}
          <path
            ref={pathRef}
            d={activeCircuit.path}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#circuit-glow)"
          />

          {/* Start/Finish Line */}
          <line x1="175" y1="330" x2="175" y2="350" stroke="#ffffff" strokeWidth="4" strokeDasharray="3,2" />
          <text x="185" y="365" fill="#ffffff" fontSize="10" fontFamily="'Share Tech Mono', monospace">START / FINISH</text>

          {/* DRS Zone indicators */}
          <path
            d={activeCircuit.path}
            fill="none"
            stroke="#00ff66"
            strokeWidth="5"
            strokeDasharray="60 300"
            filter="url(#drs-glow)"
          />

          {/* Turn annotations */}
          <circle cx="100" cy="240" r="10" fill="#090c12" stroke="#00f0ff" strokeWidth="1" />
          <text x="100" y="243" fill="#00f0ff" fontSize="9" textAnchor="middle" fontFamily="'Share Tech Mono'">T1</text>

          <circle cx="480" cy="180" r="10" fill="#090c12" stroke="#00f0ff" strokeWidth="1" />
          <text x="480" y="183" fill="#00f0ff" fontSize="9" textAnchor="middle" fontFamily="'Share Tech Mono'">T8</text>

          {/* Real-Time Moving Car Markers */}
          {carPositions.map(car => (
            <g key={car.driverNumber} transform={`translate(${car.x}, ${car.y})`} className="car-marker-group">
              <circle
                r={car.position <= 3 ? "9" : "7"}
                fill={car.teamColor}
                stroke="#ffffff"
                strokeWidth={car.position === 1 ? "2.5" : "1.5"}
                className="car-dot-pulse"
              />
              <text
                y="3"
                fill="#ffffff"
                fontSize={car.position <= 3 ? "8" : "7"}
                fontWeight="900"
                textAnchor="middle"
                fontFamily="'Orbitron', sans-serif"
              >
                {car.driverNumber}
              </text>
              {/* Leader label tooltip */}
              {car.position <= 3 && (
                <text
                  y="-12"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="'Share Tech Mono'"
                  className="car-acronym-label"
                >
                  P{car.position} {car.acronym}
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="track-map-legend">
          <div className="legend-item"><span className="legend-box racing-line" /> RACING LINE</div>
          <div className="legend-item"><span className="legend-box drs-zone" /> DRS ZONE</div>
          <div className="legend-item"><span className="legend-box leader-car" /> P1 LEADER</div>
        </div>
      </div>

      {/* Circuit Telemetry Grid */}
      <div className="circuit-stats-grid">
        <div className="stat-card">
          <span className="stat-label">CIRCUIT LENGTH</span>
          <span className="stat-value">{activeCircuit.length} <small>KM</small></span>
        </div>
        <div className="stat-card">
          <span className="stat-label">TOTAL RACE LAPS</span>
          <span className="stat-value">{activeCircuit.totalLaps} <small>LAPS</small></span>
        </div>
        <div className="stat-card">
          <span className="stat-label">NUMBER OF TURNS</span>
          <span className="stat-value">{activeCircuit.turns}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">DRS ZONES</span>
          <span className="stat-value">{activeCircuit.drsZones}</span>
        </div>
        <div className="stat-card span-2">
          <span className="stat-label"><Award size={13} /> OFFICIAL LAP RECORD</span>
          <span className="stat-value highlight">{activeCircuit.lapRecord}</span>
          <span className="stat-sub">{activeCircuit.lapRecordHolder}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackDataWidget;