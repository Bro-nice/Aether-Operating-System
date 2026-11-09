import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, AlarmClock, Timer, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { AlarmItem } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

const INITIAL_ALARMS: AlarmItem[] = [
  { id: 'a1', time: '06:30', label: 'Morning Deep Focus', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], isEnabled: true },
  { id: 'a2', time: '07:15', label: 'Workout Routine', days: ['Mon', 'Wed', 'Fri'], isEnabled: false },
  { id: 'a3', time: '22:30', label: 'Screen Disconnect & Wind Down', days: ['Everyday'], isEnabled: true },
];

export const ClockApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alarm' | 'stopwatch' | 'timer' | 'world'>('alarm');
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);

  // Stopwatch state
  const [swTimeMs, setSwTimeMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTimeMs(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  const toggleAlarm = (id: string) => {
    triggerHaptic(15);
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${centis < 10 ? '0' : ''}${centis}`;
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Tab Selector Header */}
      <div className="flex items-center justify-around pb-2 border-b border-white/10 text-xs">
        <button
          onClick={() => setActiveTab('alarm')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'alarm' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlarmClock className="w-3.5 h-3.5" />
          <span>Alarms</span>
        </button>

        <button
          onClick={() => setActiveTab('stopwatch')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'stopwatch' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Stopwatch</span>
        </button>

        <button
          onClick={() => setActiveTab('world')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'world' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          <span>World</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto py-3">
        {activeTab === 'alarm' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-white">System Alarms</h3>
              <button 
                onClick={() => {
                  const newAlarm: AlarmItem = {
                    id: Date.now().toString(),
                    time: '08:00',
                    label: 'New Alarm',
                    days: ['Everyday'],
                    isEnabled: true,
                  };
                  setAlarms([newAlarm, ...alarms]);
                }}
                className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {alarms.map(alarm => (
                <div
                  key={alarm.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className={`text-2xl font-bold font-mono ${alarm.isEnabled ? 'text-white' : 'text-slate-500'}`}>
                      {alarm.time}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {alarm.label} · {alarm.days.join(', ')}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={alarm.isEnabled}
                    onChange={() => toggleAlarm(alarm.id)}
                    className="w-5 h-5 accent-cyan-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stopwatch' && (
          <div className="flex flex-col items-center justify-between h-full py-4 space-y-6">
            <div className="my-auto text-center space-y-2">
              <span className="text-5xl font-black font-mono text-cyan-400 tabular-nums tracking-tight">
                {formatStopwatch(swTimeMs)}
              </span>
              <p className="text-xs text-slate-400">High Precision Hardware Counter</p>
            </div>

            {/* Stopwatch Actions */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  if (swRunning) {
                    setLaps([swTimeMs, ...laps]);
                  } else {
                    setSwTimeMs(0);
                    setLaps([]);
                  }
                }}
                className="w-16 h-16 rounded-full bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center cursor-pointer active:scale-90"
              >
                {swRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  setSwRunning(!swRunning);
                }}
                className={`w-18 h-18 rounded-full flex items-center justify-center text-slate-950 font-bold transition-all active:scale-90 cursor-pointer shadow-xl ${
                  swRunning ? 'bg-rose-500 text-white' : 'bg-emerald-400'
                }`}
              >
                {swRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="w-full max-h-36 overflow-y-auto space-y-1.5 pt-2 border-t border-white/10">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-mono text-slate-300 px-2">
                    <span>Lap {laps.length - idx}</span>
                    <span>{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'world' && (
          <div className="space-y-2.5">
            {[
              { city: 'San Francisco', offset: 'Local Time', time: '09:41 AM' },
              { city: 'London', offset: '+8 hrs', time: '05:41 PM' },
              { city: 'Tokyo', offset: '+17 hrs', time: '02:41 AM' },
              { city: 'Berlin', offset: '+9 hrs', time: '06:41 PM' },
            ].map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{w.city}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{w.offset}</span>
                </div>
                <span className="text-base font-bold font-mono text-cyan-300">{w.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
