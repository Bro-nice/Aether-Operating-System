import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryCharging, 
  Radio, 
  ShieldCheck, 
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { HardwareState } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface StatusBarProps {
  hardware: HardwareState;
  onOpenControlCenter: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  hardware,
  onOpenControlCenter,
  onOpenNotifications,
  notificationCount,
}) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full z-40 px-5 pt-3 pb-1 flex items-center justify-between text-xs font-medium text-slate-300 select-none">
      {/* Left Slot: Time & Notifications Trigger */}
      <button 
        onClick={() => {
          triggerHaptic(10);
          onOpenNotifications();
        }}
        className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
        title="Tap for Notification Center"
      >
        <span className="font-bold text-white tracking-tight tabular-nums text-sm">
          {time}
        </span>
        {notificationCount > 0 && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
            <Bell className="w-2.5 h-2.5" />
            <span>{notificationCount}</span>
          </div>
        )}
      </button>

      {/* Center: Dynamic Island Slot (rendered separately in OmniIsland) */}
      <div className="w-16" />

      {/* Right Slot: Network, Control Center Trigger & Battery */}
      <div className="flex items-center gap-2.5">
        {/* Network & 6G Icon */}
        <div className="flex items-center gap-1 text-slate-300">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[9px] font-mono font-semibold">6G</span>
        </div>

        {/* Battery with Tabular Percentage */}
        <div className="flex items-center gap-1 text-slate-200">
          <span className="text-[10px] tabular-nums font-mono">{hardware.batteryLevel}%</span>
          <div className="w-4 h-2 border border-slate-400 rounded-sm p-[1px] flex items-center">
            <div 
              style={{ width: `${hardware.batteryLevel}%` }}
              className={`h-full rounded-[1px] ${hardware.batteryLevel > 20 ? 'bg-emerald-400' : 'bg-rose-500'}`} 
            />
          </div>
        </div>

        {/* Control Center Pull Down Icon */}
        <button
          onClick={() => {
            triggerHaptic(15);
            onOpenControlCenter();
          }}
          className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Open Control Center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
