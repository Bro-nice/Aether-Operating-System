import React, { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Search, 
  Compass, 
  Thermometer 
} from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

const CITIES = [
  { name: 'San Francisco', temp: 72, condition: 'Partly Cloudy', high: 76, low: 58, humidity: 64, wind: '12 mph', uv: 5 },
  { name: 'London', temp: 58, condition: 'Light Rain', high: 62, low: 48, humidity: 82, wind: '18 mph', uv: 2 },
  { name: 'Tokyo', temp: 68, condition: 'Sunny & Clear', high: 72, low: 55, humidity: 50, wind: '8 mph', uv: 6 },
  { name: 'New York', temp: 64, condition: 'Clear Sky', high: 68, low: 52, humidity: 55, wind: '10 mph', uv: 4 },
];

export const WeatherApp: React.FC = () => {
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const city = CITIES[selectedCityIdx];

  const handleSwitchCity = () => {
    triggerHaptic(15);
    setSelectedCityIdx((selectedCityIdx + 1) % CITIES.length);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-y-auto space-y-4">
      {/* Current City Hero */}
      <div 
        onClick={handleSwitchCity}
        className="p-6 rounded-3xl bg-gradient-to-b from-cyan-950/60 to-slate-900/80 border border-white/10 text-center space-y-2 cursor-pointer shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-cyan-300">Tap to cycle cities</span>
          <span>Updated just now</span>
        </div>

        <h1 className="text-2xl font-black text-white">{city.name}</h1>
        <div className="flex items-center justify-center gap-3">
          <CloudSun className="w-16 h-16 text-amber-400" />
          <span className="text-6xl font-black tabular-nums tracking-tighter text-white">
            {city.temp}°
          </span>
        </div>

        <p className="text-sm font-semibold text-cyan-200">{city.condition}</p>
        <p className="text-xs text-slate-400">H: {city.high}° · L: {city.low}°</p>
      </div>

      {/* Hourly Forecast Carousel */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Hourly Trajectory
        </span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { hour: 'Now', temp: 72 },
            { hour: '10 AM', temp: 73 },
            { hour: '11 AM', temp: 75 },
            { hour: '12 PM', temp: 76 },
            { hour: '1 PM', temp: 76 },
            { hour: '2 PM', temp: 74 },
            { hour: '3 PM', temp: 71 },
          ].map((h, i) => (
            <div key={i} className="flex-shrink-0 w-16 p-3 rounded-2xl bg-slate-900/70 border border-white/5 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">{h.hour}</span>
              <CloudSun className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-xs font-bold text-white tabular-nums">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Humidity</span>
            <span className="text-sm font-bold text-white">{city.humidity}%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
          <Wind className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Wind Speed</span>
            <span className="text-sm font-bold text-white">{city.wind}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
