import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Flashlight, 
  Camera, 
  BatteryCharging, 
  ShieldCheck,
  ChevronUp,
  ScanFace
} from 'lucide-react';
import { HardwareState, OSNotification, AppId } from '../../types/os';
import { playLockChime, playDtmfTone, triggerHaptic } from '../../utils/hardware';

interface LockScreenProps {
  hardware: HardwareState;
  notifications: OSNotification[];
  onUnlock: () => void;
  onLaunchApp: (app: AppId) => void;
  onToggleFlashlight: () => void;
  wallpaperUrl: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  hardware,
  notifications,
  onUnlock,
  onLaunchApp,
  onToggleFlashlight,
  wallpaperUrl,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');
  const [dateStr, setDateStr] = useState('Monday, November 9');
  const [pinCode, setPinCode] = useState('');
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isFaceScanning, setIsFaceScanning] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyPress = (num: string) => {
    playDtmfTone(num, 80);
    if (pinCode.length < 4) {
      const nextPin = pinCode + num;
      setPinCode(nextPin);
      if (nextPin.length === 4) {
        // Accept '0000' or any 4 digits for demo convenience
        setTimeout(() => {
          playLockChime(false);
          onUnlock();
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    triggerHaptic(10);
    setPinCode(prev => prev.slice(0, -1));
  };

  const triggerFaceUnlock = () => {
    setIsFaceScanning(true);
    triggerHaptic([15, 20]);
    setTimeout(() => {
      setIsFaceScanning(false);
      playLockChime(false);
      onUnlock();
    }, 900);
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col justify-between p-6 select-none overflow-hidden bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
    >
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      {/* Top Header: Security status & Lock icon */}
      <div className="relative z-10 flex items-center justify-between pt-8 text-white/90">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aether Enclave Secured</span>
        </div>

        <button 
          onClick={triggerFaceUnlock}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium cursor-pointer transition-all active:scale-95"
        >
          <ScanFace className={`w-3.5 h-3.5 text-cyan-300 ${isFaceScanning ? 'animate-pulse text-cyan-400' : ''}`} />
          <span>{isFaceScanning ? 'Scanning Face...' : 'Face ID'}</span>
        </button>
      </div>

      {/* Center Clock and Date */}
      {!showPinPad ? (
        <div className="relative z-10 flex flex-col items-center my-auto space-y-2">
          <span className="text-xs font-medium text-white/80 tracking-widest uppercase">
            {dateStr}
          </span>
          <h1 className="text-7xl sm:text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-xl">
            {timeStr}
          </h1>

          {/* Battery Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs text-white/90 border border-white/10">
            {hardware.isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
            <span>{hardware.batteryLevel}% {hardware.isCharging ? 'Charging' : 'Battery'}</span>
          </div>

          {/* Notifications Carousel on Lock Screen */}
          {notifications.length > 0 && (
            <div className="w-full max-w-sm mt-6 space-y-2">
              {notifications.slice(0, 2).map(n => (
                <div 
                  key={n.id}
                  onClick={() => {
                    onUnlock();
                    onLaunchApp(n.appId);
                  }}
                  className="p-3.5 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 text-white flex items-start gap-3 cursor-pointer hover:bg-black/60 transition-all active:scale-[0.98]"
                >
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {n.appName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-100">{n.appName}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{n.title}</p>
                    <p className="text-xs text-slate-300 truncate">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Swipe / Tap to Unlock */}
          <button
            onClick={() => setShowPinPad(true)}
            className="mt-6 flex flex-col items-center gap-1 text-white/75 hover:text-white transition-colors cursor-pointer animate-bounce pt-4"
          >
            <ChevronUp className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-wider uppercase">Swipe or Tap to Unlock</span>
          </button>
        </div>
      ) : (
        /* PIN Keypad Screen */
        <div className="relative z-10 flex flex-col items-center my-auto space-y-4 animate-fade-in w-full max-w-xs">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-white">Enter Passcode</h2>
            <p className="text-xs text-slate-300">Default PIN: 0000</p>
          </div>

          {/* PIN Dots */}
          <div className="flex items-center gap-4 py-2">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  pinCode.length > i 
                    ? 'bg-white border-white scale-110 shadow-lg' 
                    : 'bg-white/20 border-white/40'
                }`}
              />
            ))}
          </div>

          {/* Numpad 3x4 */}
          <div className="grid grid-cols-3 gap-3 w-full pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'FaceID', '0', 'Del'].map(key => {
              if (key === 'FaceID') {
                return (
                  <button
                    key={key}
                    onClick={triggerFaceUnlock}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-cyan-300 mx-auto transition-all active:scale-90 cursor-pointer"
                  >
                    <ScanFace className="w-5 h-5" />
                  </button>
                );
              }
              if (key === 'Del') {
                return (
                  <button
                    key={key}
                    onClick={handleBackspace}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-medium text-white/80 mx-auto transition-all active:scale-90 cursor-pointer"
                  >
                    Delete
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="w-16 h-16 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white mx-auto transition-all active:scale-90 active:bg-white/35 cursor-pointer shadow-lg"
                >
                  <span className="text-2xl font-semibold leading-none">{key}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setShowPinPad(false);
              setPinCode('');
            }}
            className="text-xs text-white/70 hover:text-white pt-2 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Bottom Quick Launch Actions: Flashlight & Camera */}
      <div className="relative z-10 flex items-center justify-between pb-6 px-2">
        <button
          onClick={onToggleFlashlight}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-90 shadow-xl ${
            hardware.flashlightOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title="Flashlight"
        >
          <Flashlight className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            onUnlock();
            onLaunchApp('camera');
          }}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-90 shadow-xl"
          title="Camera"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
