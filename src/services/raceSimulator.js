// Real-Time Race Simulation Engine
// Simulates live car movements on circuit path, sector splits, speed traps, and telemetry

export const CIRCUITS_MAP = {
  zandvoort: {
    id: 'zandvoort',
    name: 'Circuit Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    length: 4.259,
    totalLaps: 72,
    turns: 14,
    drsZones: 2,
    lapRecord: '1:11.097 (Max Verstappen)',
    // SVG path string representing the circuit geometry
    path: 'M 180 340 C 140 340 100 310 90 260 C 80 210 110 160 160 140 C 220 110 270 120 310 90 C 350 60 410 70 450 110 C 490 150 510 210 490 270 C 470 320 420 350 360 340 C 310 330 260 340 220 350 Z',
    drsStartT: [0.05, 0.55],
    drsEndT: [0.22, 0.72]
  },
  monza: {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: 'Italy',
    flag: '🇮🇹',
    length: 5.793,
    totalLaps: 53,
    turns: 11,
    drsZones: 2,
    lapRecord: '1:21.046 (Rubens Barrichello)',
    path: 'M 100 320 L 460 320 C 510 320 530 270 510 220 L 440 120 C 420 80 380 80 350 110 L 260 180 C 230 200 180 190 150 150 L 110 100 C 80 70 50 100 60 150 L 80 280 C 85 310 90 320 100 320 Z',
    drsStartT: [0.02, 0.45],
    drsEndT: [0.25, 0.65]
  },
  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'Great Britain',
    flag: '🇬🇧',
    length: 5.891,
    totalLaps: 52,
    turns: 18,
    drsZones: 2,
    lapRecord: '1:27.097 (Max Verstappen)',
    path: 'M 150 320 C 100 320 80 270 110 220 C 130 190 170 190 200 160 C 230 130 240 80 290 70 C 340 60 380 100 420 90 C 460 80 500 120 490 170 C 480 220 430 240 400 280 C 370 320 320 330 270 310 C 230 290 190 320 150 320 Z',
    drsStartT: [0.08, 0.60],
    drsEndT: [0.28, 0.80]
  },
  spa: {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    flag: '🇧🇪',
    length: 7.004,
    totalLaps: 44,
    turns: 19,
    drsZones: 2,
    lapRecord: '1:46.286 (Valtteri Bottas)',
    path: 'M 140 330 C 100 320 90 270 110 230 C 130 190 180 170 200 130 C 220 90 260 70 310 70 C 360 70 420 100 460 130 C 500 160 520 220 490 260 C 460 300 400 320 350 300 C 300 280 240 330 180 340 Z',
    drsStartT: [0.12, 0.58],
    drsEndT: [0.32, 0.78]
  },
  monaco: {
    id: 'monaco',
    name: 'Circuit de Monaco',
    country: 'Monaco',
    flag: '🇲🇨',
    length: 3.337,
    totalLaps: 78,
    turns: 19,
    drsZones: 1,
    lapRecord: '1:12.909 (Lewis Hamilton)',
    path: 'M 150 280 C 120 280 110 240 130 210 C 150 180 190 160 210 120 C 230 80 280 70 330 90 C 380 110 420 150 440 200 C 460 250 430 290 380 300 C 330 310 280 270 240 270 C 200 270 180 280 150 280 Z',
    drsStartT: [0.02],
    drsEndT: [0.18]
  }
};

export class RaceSimulator {
  constructor(initialDrivers, circuitKey = 'zandvoort') {
    this.circuit = CIRCUITS_MAP[circuitKey] || CIRCUITS_MAP.zandvoort;
    this.drivers = initialDrivers.map((d, i) => ({
      ...d,
      progress: Math.max(0, 1 - i * 0.045), // Position along track 0 -> 1
      speed: 310 + Math.random() * 25,
      rpm: 11200 + Math.floor(Math.random() * 800),
      gear: 7 + (Math.random() > 0.4 ? 1 : 0),
      throttle: 85 + Math.floor(Math.random() * 15),
      brake: 0,
      steer: 0,
      drs: i < 3,
      s1Status: i === 0 ? 'PURPLE' : i < 3 ? 'GREEN' : 'YELLOW',
      s2Status: i === 1 ? 'PURPLE' : i < 4 ? 'GREEN' : 'YELLOW',
      s3Status: i === 2 ? 'PURPLE' : i < 5 ? 'GREEN' : 'YELLOW',
      stintLaps: d.stintLaps || 15
    }));
    this.currentLap = 58;
    this.weather = {
      airTemperature: 22.1,
      trackTemperature: 32.4,
      humidity: 56,
      windSpeed: 14.8,
      rainfall: 0
    };
  }

  setCircuit(circuitKey) {
    if (CIRCUITS_MAP[circuitKey]) {
      this.circuit = CIRCUITS_MAP[circuitKey];
    }
  }

  tick(deltaSeconds = 0.5) {
    // Progress cars along track
    const baseSpeedProgress = 0.015 * deltaSeconds;

    this.drivers = this.drivers.map((drv, idx) => {
      // Small jitter for realistic delta
      const speedFactor = 1.0 + (Math.random() - 0.48) * 0.04;
      let newProgress = (drv.progress + baseSpeedProgress * speedFactor) % 1.0;

      // In DRS Zone?
      const inDrs = this.circuit.drsStartT.some((start, i) => {
        const end = this.circuit.drsEndT[i];
        return newProgress >= start && newProgress <= end;
      });

      const cornering = newProgress > 0.35 && newProgress < 0.55;
      const speed = inDrs ? Math.round(330 + Math.random() * 12) : cornering ? Math.round(140 + Math.random() * 30) : Math.round(290 + Math.random() * 25);
      const rpm = cornering ? Math.round(8500 + Math.random() * 1500) : Math.round(11200 + Math.random() * 1200);
      const gear = cornering ? Math.floor(3 + Math.random() * 2) : speed > 300 ? 8 : 7;
      const throttle = cornering ? Math.round(45 + Math.random() * 35) : 100;
      const brake = cornering ? Math.round(30 + Math.random() * 50) : 0;

      return {
        ...drv,
        progress: newProgress,
        speed,
        rpm,
        gear,
        throttle,
        brake,
        drs: inDrs,
        stintLaps: drv.stintLaps
      };
    });

    // Slight temperature oscillation
    this.weather.trackTemperature = Number((32.0 + Math.sin(Date.now() / 60000) * 1.5).toFixed(1));
    this.weather.airTemperature = Number((22.0 + Math.sin(Date.now() / 120000) * 0.8).toFixed(1));

    return {
      drivers: this.drivers,
      circuit: this.circuit,
      weather: this.weather,
      currentLap: this.currentLap
    };
  }
}
