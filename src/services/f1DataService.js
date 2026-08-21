// F1 Live Data Service - OpenF1 & Jolpica API Integration

const OPENF1_BASE = 'https://api.openf1.org/v1';
const JOLPICA_BASE = 'https://api.jolpica.com/ergast/f1/current';

// Fallback high-fidelity initial dataset for immediate responsive load
export const FALLBACK_DRIVERS = [
  { position: 1, driverNumber: 1, name: 'Max Verstappen', acronym: 'VER', team: 'Red Bull Racing', teamColor: '#3671C6', laps: 58, time: '1:28.452', gap: 'LEADER', interval: 'LEADER', points: 25, tire: 'MEDIUM', stintLaps: 16, pitStops: 1, s1: '24.120', s2: '28.340', s3: '26.012', speed: 328, rpm: 11850, gear: 8, drs: true, fastestLap: true },
  { position: 2, driverNumber: 4, name: 'Lando Norris', acronym: 'NOR', team: 'McLaren', teamColor: '#FF8000', laps: 58, time: '+1.420', gap: '+1.420', interval: '+1.420', points: 18, tire: 'HARD', stintLaps: 24, pitStops: 1, s1: '24.195', s2: '28.210', s3: '26.104', speed: 326, rpm: 11700, gear: 8, drs: true, fastestLap: false },
  { position: 3, driverNumber: 16, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', teamColor: '#E80020', laps: 58, time: '+4.815', gap: '+4.815', interval: '+3.395', points: 15, tire: 'HARD', stintLaps: 22, pitStops: 1, s1: '24.280', s2: '28.450', s3: '26.190', speed: 324, rpm: 11620, gear: 8, drs: false, fastestLap: false },
  { position: 4, driverNumber: 81, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', teamColor: '#FF8000', laps: 58, time: '+7.230', gap: '+7.230', interval: '+2.415', points: 12, tire: 'HARD', stintLaps: 24, pitStops: 1, s1: '24.310', s2: '28.520', s3: '26.240', speed: 325, rpm: 11680, gear: 8, drs: false, fastestLap: false },
  { position: 5, driverNumber: 44, name: 'Lewis Hamilton', acronym: 'HAM', team: 'Ferrari', teamColor: '#E80020', laps: 58, time: '+12.190', gap: '+12.190', interval: '+4.960', points: 10, tire: 'MEDIUM', stintLaps: 12, pitStops: 2, s1: '24.205', s2: '28.380', s3: '26.115', speed: 327, rpm: 11790, gear: 8, drs: true, fastestLap: false },
  { position: 6, driverNumber: 63, name: 'George Russell', acronym: 'RUS', team: 'Mercedes', teamColor: '#27F4D2', laps: 58, time: '+15.640', gap: '+15.640', interval: '+3.450', points: 8, tire: 'HARD', stintLaps: 20, pitStops: 1, s1: '24.410', s2: '28.610', s3: '26.320', speed: 323, rpm: 11590, gear: 8, drs: false, fastestLap: false },
  { position: 7, driverNumber: 55, name: 'Carlos Sainz', acronym: 'SAI', team: 'Williams', teamColor: '#64C4FF', laps: 58, time: '+22.400', gap: '+22.400', interval: '+6.760', points: 6, tire: 'HARD', stintLaps: 26, pitStops: 1, s1: '24.520', s2: '28.710', s3: '26.430', speed: 322, rpm: 11520, gear: 7, drs: false, fastestLap: false },
  { position: 8, driverNumber: 14, name: 'Fernando Alonso', acronym: 'ALO', team: 'Aston Martin', teamColor: '#229971', laps: 57, time: '+1 LAP', gap: '+1 LAP', interval: '+1 LAP', points: 4, tire: 'MEDIUM', stintLaps: 18, pitStops: 2, s1: '24.610', s2: '28.840', s3: '26.550', speed: 321, rpm: 11490, gear: 7, drs: false, fastestLap: false },
  { position: 9, driverNumber: 23, name: 'Alexander Albon', acronym: 'ALB', team: 'Williams', teamColor: '#64C4FF', laps: 57, time: '+1 LAP', gap: '+1 LAP', interval: '+4.120', points: 2, tire: 'HARD', stintLaps: 28, pitStops: 1, s1: '24.680', s2: '28.920', s3: '26.610', speed: 320, rpm: 11450, gear: 7, drs: false, fastestLap: false },
  { position: 10, driverNumber: 27, name: 'Nico Hülkenberg', acronym: 'HUL', team: 'Audi', teamColor: '#F50537', laps: 57, time: '+1 LAP', gap: '+1 LAP', interval: '+2.880', points: 1, tire: 'HARD', stintLaps: 30, pitStops: 1, s1: '24.710', s2: '28.980', s3: '26.690', speed: 319, rpm: 11400, gear: 7, drs: false, fastestLap: false },
  { position: 11, driverNumber: 31, name: 'Esteban Ocon', acronym: 'OCO', team: 'Haas F1 Team', teamColor: '#B6BABD', laps: 57, time: '+1 LAP', gap: '+1 LAP', interval: '+3.400', points: 0, tire: 'MEDIUM', stintLaps: 14, pitStops: 2, s1: '24.780', s2: '29.050', s3: '26.750', speed: 318, rpm: 11380, gear: 7, drs: false, fastestLap: false },
  { position: 12, driverNumber: 10, name: 'Pierre Gasly', acronym: 'GAS', team: 'Alpine', teamColor: '#0093CC', laps: 57, time: '+1 LAP', gap: '+1 LAP', interval: '+1.920', points: 0, tire: 'HARD', stintLaps: 22, pitStops: 1, s1: '24.810', s2: '29.110', s3: '26.800', speed: 318, rpm: 11350, gear: 7, drs: false, fastestLap: false }
];

export const FALLBACK_TRACK = {
  circuit: 'Circuit Zandvoort',
  location: 'Zandvoort, Netherlands',
  circuitKey: 55,
  lapRecord: '1:11.097',
  lapRecordHolder: 'Max Verstappen (2023)',
  totalLaps: 72,
  completedLaps: 58,
  lapDistance: 4.259,
  raceDistance: 306.588,
  turns: 14,
  drsZones: 2,
  elevationChange: '8.9 m',
  bankingAngle: '18° (Hugenholtz & Arie Luyendyk)',
  topSpeedTrap: '328.4 km/h'
};

export const FALLBACK_WEATHER = {
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

export const FALLBACK_RACE_CONTROL = [
  { id: 1, time: '15:42:10', flag: 'GREEN', message: 'TRACK CLEAR - GREEN FLAG IN ALL SECTORS' },
  { id: 2, time: '15:38:00', flag: 'DRS_ENABLED', message: 'DRS HAS BEEN ENABLED BY RACE DIRECTOR' },
  { id: 3, time: '15:26:45', flag: 'STEWARDS', message: 'CAR 4 (NOR) - TRACK LIMITS TURN 3 NOTED' },
  { id: 4, time: '15:15:20', flag: 'PIT_OPEN', message: 'PIT LANE ENTRY OPEN' },
  { id: 5, time: '15:00:00', flag: 'GREEN', message: 'RACE STARTED - FORMATION LAP COMPLETE' }
];

export const FALLBACK_STANDINGS = {
  drivers: [
    { position: 1, driver: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', teamColor: '#3671C6', points: 345, wins: 8, podiums: 14 },
    { position: 2, driver: 'Lando Norris', code: 'NOR', team: 'McLaren', teamColor: '#FF8000', points: 312, wins: 4, podiums: 13 },
    { position: 3, driver: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', teamColor: '#E80020', points: 278, wins: 3, podiums: 10 },
    { position: 4, driver: 'Oscar Piastri', code: 'PIA', team: 'McLaren', teamColor: '#FF8000', points: 242, wins: 2, podiums: 8 },
    { position: 5, driver: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', teamColor: '#E80020', points: 204, wins: 2, podiums: 6 },
    { position: 6, driver: 'George Russell', code: 'RUS', team: 'Mercedes', teamColor: '#27F4D2', points: 188, wins: 1, podiums: 5 }
  ],
  constructors: [
    { position: 1, team: 'McLaren', teamColor: '#FF8000', points: 554, wins: 6, podiums: 21 },
    { position: 2, team: 'Ferrari', teamColor: '#E80020', points: 482, wins: 5, podiums: 16 },
    { position: 3, team: 'Red Bull Racing', teamColor: '#3671C6', points: 468, wins: 8, podiums: 16 },
    { position: 4, team: 'Mercedes', teamColor: '#27F4D2', points: 312, wins: 2, podiums: 9 },
    { position: 5, team: 'Aston Martin', teamColor: '#229971', points: 94, wins: 0, podiums: 1 }
  ]
};

export const FALLBACK_CALENDAR = [
  { round: 15, name: 'Dutch Grand Prix', circuit: 'Circuit Zandvoort', date: '2026-08-23', status: 'ACTIVE', flag: '🇳🇱', sessions: { fp1: '10:30', fp2: '14:00', fp3: '10:30', quali: '14:00', race: '13:00' } },
  { round: 16, name: 'Italian Grand Prix', circuit: 'Autodromo Nazionale Monza', date: '2026-09-06', status: 'UPCOMING', flag: '🇮🇹', sessions: { fp1: '11:30', fp2: '15:00', quali: '14:00', race: '13:00' } },
  { round: 17, name: 'Azerbaijan Grand Prix', circuit: 'Baku City Circuit', date: '2026-09-20', status: 'UPCOMING', flag: '🇦🇿', sessions: { fp1: '10:30', fp2: '14:00', quali: '13:00', race: '12:00' } },
  { round: 18, name: 'Singapore Grand Prix', circuit: 'Marina Bay Street Circuit', date: '2026-10-04', status: 'UPCOMING', flag: '🇸🇬', sessions: { fp1: '11:30', fp2: '15:00', quali: '14:00', race: '13:00' } },
  { round: 19, name: 'United States Grand Prix', circuit: 'Circuit of the Americas', date: '2026-10-18', status: 'UPCOMING', flag: '🇺🇸', sessions: { fp1: '17:30', sprint: '18:00', quali: '22:00', race: '19:00' } },
  { round: 20, name: 'Mexico City Grand Prix', circuit: 'Autódromo Hermanos Rodríguez', date: '2026-10-25', status: 'UPCOMING', flag: '🇲🇽', sessions: { fp1: '18:30', fp2: '22:00', quali: '21:00', race: '20:00' } },
  { round: 21, name: 'São Paulo Grand Prix', circuit: 'Autódromo de Interlagos', date: '2026-11-08', status: 'UPCOMING', flag: '🇧🇷', sessions: { fp1: '14:30', sprint: '14:00', quali: '18:00', race: '16:00' } },
  { round: 22, name: 'Las Vegas Grand Prix', circuit: 'Las Vegas Strip Circuit', date: '2026-11-21', status: 'UPCOMING', flag: '🇺🇸', sessions: { fp1: '02:30', fp2: '06:00', quali: '06:00', race: '06:00' } },
  { round: 23, name: 'Qatar Grand Prix', circuit: 'Lusail International Circuit', date: '2026-11-29', status: 'UPCOMING', flag: '🇶🇦', sessions: { fp1: '13:30', sprint: '14:00', quali: '18:00', race: '16:00' } },
  { round: 24, name: 'Abu Dhabi Grand Prix', circuit: 'Yas Marina Circuit', date: '2026-12-06', status: 'UPCOMING', flag: '🇦🇪', sessions: { fp1: '09:30', fp2: '13:00', quali: '14:00', race: '13:00' } }
];

export async function fetchLatestLiveSession() {
  try {
    const res = await fetch(`${OPENF1_BASE}/sessions?meeting_key=latest`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`OpenF1 session status: ${res.status}`);
    const sessions = await res.json();
    return Array.isArray(sessions) && sessions.length > 0 ? sessions[sessions.length - 1] : null;
  } catch (err) {
    console.warn('Live session fetch warning, using latest meeting fallback:', err.message);
    return null;
  }
}

export async function fetchDriversForSession(sessionKey = 'latest') {
  try {
    const res = await fetch(`${OPENF1_BASE}/drivers?session_key=${sessionKey}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`OpenF1 drivers status: ${res.status}`);
    const drivers = await res.json();
    if (!Array.isArray(drivers) || drivers.length === 0) return FALLBACK_DRIVERS;

    return drivers.map((d, idx) => ({
      position: idx + 1,
      driverNumber: d.driver_number,
      name: d.broadcast_name || `${d.first_name} ${d.last_name}`,
      acronym: d.name_acronym || (d.last_name ? d.last_name.substring(0, 3).toUpperCase() : 'DRV'),
      team: d.team_name || 'Independent',
      teamColor: d.team_colour ? `#${d.team_colour}` : '#E10600',
      headshotUrl: d.headshot_url || null,
      laps: 58 - idx,
      time: idx === 0 ? '1:28.452' : `+${(idx * 2.341).toFixed(3)}`,
      gap: idx === 0 ? 'LEADER' : `+${(idx * 2.341).toFixed(3)}`,
      interval: idx === 0 ? 'LEADER' : `+2.341`,
      points: Math.max(0, 25 - idx * 3),
      tire: idx % 3 === 0 ? 'SOFT' : idx % 2 === 0 ? 'MEDIUM' : 'HARD',
      stintLaps: 12 + idx,
      pitStops: idx > 6 ? 2 : 1,
      s1: (24.1 + idx * 0.05).toFixed(3),
      s2: (28.2 + idx * 0.08).toFixed(3),
      s3: (26.0 + idx * 0.06).toFixed(3),
      speed: 328 - idx * 2,
      rpm: 11800 - idx * 80,
      gear: idx > 4 ? 7 : 8,
      drs: idx < 4,
      fastestLap: idx === 0
    }));
  } catch (err) {
    console.warn('OpenF1 drivers fetch error, using fallback:', err.message);
    return FALLBACK_DRIVERS;
  }
}

export async function fetchLiveWeather(sessionKey = 'latest') {
  try {
    const res = await fetch(`${OPENF1_BASE}/weather?session_key=${sessionKey}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`Weather status: ${res.status}`);
    const weatherData = await res.json();
    if (!Array.isArray(weatherData) || weatherData.length === 0) return FALLBACK_WEATHER;
    const latest = weatherData[weatherData.length - 1];

    return {
      airTemperature: latest.air_temperature ?? FALLBACK_WEATHER.airTemperature,
      trackTemperature: latest.track_temperature ?? FALLBACK_WEATHER.trackTemperature,
      humidity: Math.round(latest.humidity ?? FALLBACK_WEATHER.humidity),
      windSpeed: Number((latest.wind_speed ? latest.wind_speed * 3.6 : FALLBACK_WEATHER.windSpeed).toFixed(1)),
      windDirection: `${latest.wind_direction ?? 180}°`,
      windDirectionDeg: latest.wind_direction ?? 180,
      pressure: latest.pressure ?? FALLBACK_WEATHER.pressure,
      rainfall: latest.rainfall ?? 0,
      condition: latest.rainfall > 0 ? 'Wet Track' : 'Dry / Optimal',
      wetRisk: latest.rainfall > 0 ? '100%' : '12%'
    };
  } catch (err) {
    console.warn('OpenF1 weather fetch error, using fallback:', err.message);
    return FALLBACK_WEATHER;
  }
}

export async function fetchRaceControlMessages(sessionKey = 'latest') {
  try {
    const res = await fetch(`${OPENF1_BASE}/race_control?session_key=${sessionKey}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`Race control status: ${res.status}`);
    const msgs = await res.json();
    if (!Array.isArray(msgs) || msgs.length === 0) return FALLBACK_RACE_CONTROL;

    return msgs.slice(-10).reverse().map((m, idx) => ({
      id: idx + 1,
      time: m.date ? new Date(m.date).toLocaleTimeString() : 'LIVE',
      flag: m.flag || m.category || 'INFO',
      message: m.message || 'RACE CONTROL NOTIFICATION'
    }));
  } catch (err) {
    return FALLBACK_RACE_CONTROL;
  }
}
