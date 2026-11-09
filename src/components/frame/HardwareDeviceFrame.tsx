import React from 'react';
import { 
  Maximize, 
  Smartphone 
} from 'lucide-react';
import { HardwareState, ViewportMode } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface HardwareDeviceFrameProps {
  hardware: HardwareState;
  onUpdateHardware: (partial: Partial<HardwareState>) => void;
  onPowerButton: () => void;
  wallpaperUrl: string;
  viewportMode: ViewportMode;
  onChangeViewportMode: (mode: ViewportMode) => void;
  children: React.ReactNode;
}

export const HardwareDeviceFrame: React.FC<HardwareDeviceFrameProps> = ({
  hardware,
  onUpdateHardware,
  onPowerButton,
  wallpaperUrl,
  viewportMode,
  onChangeViewportMode,
  children,
}) => {
  const toggleFullscreen = () => {
    triggerHaptic(15);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const increaseVolume = () => {
    triggerHaptic(10);
    onUpdateHardware({ volumeLevel: Math.min(100, hardware.volumeLevel + 10), isMuted: false });
  };

  const decreaseVolume = () => {
    triggerHaptic(10);
    onUpdateHardware({ volumeLevel: Math.max(0, hardware.volumeLevel - 10) });
  };

  // Screen filters for brightness and night light
  const screenFilterStyle = {
    filter: `brightness(${hardware.screenBrightness / 100}) ${hardware.nightLightOn ? 'sepia(30%)' : ''}`,
  };

  // If user chose Full Native Viewport Mode (or is on real mobile screen):
  if (viewportMode === 'native_full') {
    return (
      <div 
        style={screenFilterStyle}
        className="fixed inset-0 w-screen h-screen bg-slate-950 flex flex-col overflow-hidden select-none"
      >
        {/* Real Wallpaper Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${wallpaperUrl})` }}
        />
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] pointer-events-none" />

        {/* Viewport Floating Mode Switcher Button (Top Right Float) */}
        <div className="absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onChangeViewportMode('chassis_pocket')}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 text-[10px] flex items-center gap-1 backdrop-blur-md cursor-pointer"
            title="Switch to Titanium Hardware Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chassis Mode</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 text-[10px] backdrop-blur-md cursor-pointer"
            title="Toggle Native Fullscreen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inner Content fills entire actual device screen */}
        <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Otherwise: Titanium Hardware Chassis Showcase Mode
  return (
    <div className="min-h-screen w-full bg-[#05070c] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-x-hidden">
      {/* Center Phone Chassis Container with Physical Titanium Hardware Edges */}
      <div className="relative my-auto flex items-center justify-center py-2">
        {/* Left Physical Hardware Buttons (Volume Up & Down) */}
        <div className="absolute -left-3 top-28 flex flex-col gap-3 z-30">
          <button
            onClick={increaseVolume}
            className="w-2.5 h-12 rounded-l-md bg-slate-700 hover:bg-slate-500 border border-slate-600 transition-all cursor-pointer active:scale-95 shadow-lg"
            title="Physical Volume Up"
          />
          <button
            onClick={decreaseVolume}
            className="w-2.5 h-12 rounded-l-md bg-slate-700 hover:bg-slate-500 border border-slate-600 transition-all cursor-pointer active:scale-95 shadow-lg"
            title="Physical Volume Down"
          />
        </div>

        {/* Right Physical Hardware Button (Power / Lock Key) */}
        <div className="absolute -right-3 top-24 z-30">
          <button
            onClick={onPowerButton}
            className="w-2.5 h-14 rounded-r-md bg-slate-700 hover:bg-rose-500 border border-slate-600 transition-all cursor-pointer active:scale-95 shadow-lg"
            title="Physical Power Key"
          />
        </div>

        {/* Outer Titanium Chassis Frame */}
        <div 
          className="relative w-[390px] sm:w-[410px] h-[830px] sm:h-[850px] rounded-[52px] p-2.5 bg-gradient-to-b from-[#252c39] via-[#141823] to-[#0c0f16] shadow-[0_0_80px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(56,189,248,0.2)] border-2 border-slate-700/60 transition-all flex flex-col overflow-hidden"
        >
          {/* Inner Display Screen with Wallpaper */}
          <div 
            style={screenFilterStyle}
            className="relative flex-1 w-full rounded-[44px] overflow-hidden flex flex-col bg-slate-950 bg-cover bg-center transition-all duration-300"
          >
            {/* Background Wallpaper Container */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${wallpaperUrl})` }}
            />

            {/* Subtle Screen Glass Sheen */}
            <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] pointer-events-none" />

            {/* Inner Interactive Viewport */}
            <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
