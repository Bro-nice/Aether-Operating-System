import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BatteryCharging, 
  Wifi, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Compass, 
  RotateCw,
  Zap,
  Server,
  Monitor,
  CheckCircle2
} from 'lucide-react';
import { HardwareState } from '../../types/os';

interface VitalsAppProps {
  hardware: HardwareState;
}

export const VitalsApp: React.FC<VitalsAppProps> = ({ hardware }) => {
  const [cpuLoad, setCpuLoad] = useState(16);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(Math.floor(10 + Math.random() * 20));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">Hardware Vitals & Diagnostics</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          SYNCED WITH HOST
        </span>
      </div>

      {/* Host Machine Identification Card */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
          BOUND HARDWARE ENVIRONMENT
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xs font-bold text-white">{hardware.hostPlatform}</h2>
              <p className="text-[10px] text-slate-400 font-mono">{hardware.hostBrowser} · {hardware.screenWidth}×{hardware.screenHeight} ({hardware.devicePixelRatio}x Retina)</p>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-[11px] text-slate-300 font-mono truncate pt-1 border-t border-white/5" title={hardware.gpuRenderer}>
          GPU: {hardware.gpuRenderer}
        </p>
      </div>

      {/* Main CPU Telemetry Card */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Host Processor Cores</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hardware.cpuCores} Physical Logical Threads Active
              </span>
            </div>
          </div>
          <span className="text-xl font-black font-mono text-cyan-400 tabular-nums">
            {cpuLoad}%
          </span>
        </div>

        {/* CPU Core Thread Load Bars */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10">
          {Array.from({ length: hardware.cpuCores || 8 }).map((_, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-slate-950 text-center space-y-1">
              <span className="text-[9px] text-slate-400 font-mono block">Thread #{idx}</span>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, cpuLoad + (idx * 3) % 25)}%` }}
                  className="h-full bg-cyan-400 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory & Storage Matrix */}
      <div className="grid grid-cols-2 gap-3">
        {/* RAM */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Unified RAM</span>
          <span className="text-base font-bold text-white tabular-nums">
            2.1 GB / {hardware.memoryTotalGb} GB
          </span>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="w-[28%] h-full bg-emerald-400" />
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">Zero Memory Fragmentation</span>
        </div>

        {/* Battery Health */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Battery & Power</span>
          <span className="text-base font-bold text-white tabular-nums">
            {hardware.batteryLevel}% {hardware.isCharging ? '⚡ Charging' : ''}
          </span>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              style={{ width: `${hardware.batteryLevel}%` }}
              className={`h-full ${hardware.batteryLevel > 20 ? 'bg-emerald-400' : 'bg-rose-500'}`}
            />
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            {hardware.networkSpeedMbps} Mbps · {hardware.networkType}
          </span>
        </div>
      </div>

      {/* Sensors & Spatial Matrix */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
          Hardware Sensor Grid
        </span>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-slate-950 flex flex-col justify-between">
            <span className="text-slate-400">Accelerometer:</span>
            <span className="text-emerald-400">Live Active</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 flex flex-col justify-between">
            <span className="text-slate-400">Audio DSP:</span>
            <span className="text-cyan-400">48kHz PCM</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 flex flex-col justify-between">
            <span className="text-slate-400">GPU Shaders:</span>
            <span className="text-emerald-400">WebGL 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
