import React from 'react';
import { 
  Wifi, 
  Radio, 
  Bluetooth, 
  Plane, 
  Flashlight, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  BatteryLow, 
  Calculator, 
  Camera, 
  Play, 
  Pause, 
  SkipForward, 
  X,
  Clock,
  Mic
} from 'lucide-react';
import { HardwareState, AppId } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  hardware: HardwareState;
  onUpdateHardware: (partial: Partial<HardwareState>) => void;
  onLaunchApp: (app: AppId) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  currentTrackTitle?: string;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  hardware,
  onUpdateHardware,
  onLaunchApp,
  isPlayingMusic,
  onToggleMusic,
  currentTrackTitle = 'Horizon Frequency - 432Hz Ambient',
}) => {
  if (!isOpen) return null;

  const toggleToggle = (key: keyof HardwareState) => {
    triggerHaptic(15);
    onUpdateHardware({ [key]: !hardware[key] });
  };

  return (
    <div 
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-start select-none animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm mx-auto space-y-4 pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Bar */}
        <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300">
            CONTROL CENTER
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2x2 Network Cluster & Media Tile */}
        <div className="grid grid-cols-2 gap-3">
          {/* Network Cluster */}
          <div className="p-3.5 rounded-3xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => toggleToggle('isOnline')}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                hardware.isOnline ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/10 text-white/70'
              }`}
              title="Wi-Fi"
            >
              <Wifi className="w-4 h-4" />
              <span className="text-[10px] mt-1">Wi-Fi</span>
            </button>

            <button
              onClick={() => toggleToggle('bluetoothOn')}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                hardware.bluetoothOn ? 'bg-blue-500 text-white font-bold' : 'bg-white/10 text-white/70'
              }`}
              title="Bluetooth"
            >
              <Bluetooth className="w-4 h-4" />
              <span className="text-[10px] mt-1">Bluetooth</span>
            </button>

            <button
              onClick={() => toggleToggle('airplaneMode')}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                hardware.airplaneMode ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 text-white/70'
              }`}
              title="Airplane Mode"
            >
              <Plane className="w-4 h-4" />
              <span className="text-[10px] mt-1">Flight</span>
            </button>

            <button
              onClick={() => toggleToggle('locationOn')}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                hardware.locationOn ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/10 text-white/70'
              }`}
              title="Location Services"
            >
              <Radio className="w-4 h-4" />
              <span className="text-[10px] mt-1">GPS</span>
            </button>
          </div>

          {/* Mini Media Player Card */}
          <div className="p-3.5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">NOW PLAYING</span>
              <p className="text-xs font-bold text-white truncate mt-1">{currentTrackTitle}</p>
              <p className="text-[10px] text-slate-400">Aura Lossless Audio</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onToggleMusic}
                className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button 
                onClick={onToggleMusic}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Brightness & Volume Sliders */}
        <div className="grid grid-cols-2 gap-3">
          {/* Display Brightness Slider */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full text-xs text-slate-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="font-mono tabular-nums">{hardware.screenBrightness}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              value={hardware.screenBrightness}
              onChange={(e) => onUpdateHardware({ screenBrightness: parseInt(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Display Luminance</span>
          </div>

          {/* Volume Slider */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full text-xs text-slate-300">
              <button 
                onClick={() => onUpdateHardware({ isMuted: !hardware.isMuted })}
                className="cursor-pointer"
              >
                {hardware.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
              <span className="font-mono tabular-nums">{hardware.isMuted ? 'Muted' : `${hardware.volumeLevel}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hardware.isMuted ? 0 : hardware.volumeLevel}
              onChange={(e) => onUpdateHardware({ volumeLevel: parseInt(e.target.value), isMuted: false })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Master Volume</span>
          </div>
        </div>

        {/* 4x Quick Action Toggles */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => toggleToggle('flashlightOn')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              hardware.flashlightOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900/80 border border-white/10 text-white/80'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            <span className="text-[9px] mt-1">Torch</span>
          </button>

          <button
            onClick={() => toggleToggle('nightLightOn')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              hardware.nightLightOn ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-900/80 border border-white/10 text-white/80'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-[9px] mt-1">Night Light</span>
          </button>

          <button
            onClick={() => toggleToggle('doNotDisturb')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              hardware.doNotDisturb ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900/80 border border-white/10 text-white/80'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span className="text-[9px] mt-1">DND</span>
          </button>

          <button
            onClick={() => toggleToggle('batteryLevel')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              hardware.batteryLevel <= 20 ? 'bg-rose-600 text-white' : 'bg-slate-900/80 border border-white/10 text-white/80'
            }`}
          >
            <BatteryLow className="w-4 h-4" />
            <span className="text-[9px] mt-1">Saver</span>
          </button>
        </div>

        {/* Quick App Shortcuts Row */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onLaunchApp('calculator');
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] mt-1">Calc</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchApp('camera');
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] mt-1">Camera</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchApp('clock');
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] mt-1">Timer</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchApp('notes');
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-rose-400" />
            <span className="text-[9px] mt-1">Voice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
