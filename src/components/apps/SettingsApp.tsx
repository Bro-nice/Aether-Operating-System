import React, { useState } from 'react';
import { 
  Settings, 
  Smartphone, 
  Wifi, 
  Sun, 
  Volume2, 
  ShieldCheck, 
  Layers, 
  RotateCw, 
  Palette, 
  ChevronRight,
  ArrowLeft,
  Check,
  Cpu,
  Battery
} from 'lucide-react';
import { HardwareState } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface SettingsAppProps {
  hardware: HardwareState;
  onUpdateHardware: (partial: Partial<HardwareState>) => void;
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  navigationMode: 'gestures' | 'buttons';
  onChangeNavigationMode: (mode: 'gestures' | 'buttons') => void;
  onRebootOS?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  hardware,
  onUpdateHardware,
  currentWallpaper,
  onSelectWallpaper,
  navigationMode,
  onChangeNavigationMode,
  onRebootOS,
}) => {
  const [activeSection, setActiveSection] = useState<'root' | 'about' | 'display' | 'sound' | 'security' | 'navigation'>('root');

  const wallpapers = [
    { name: 'Cosmic Fluid', url: '/src/assets/images/wallpaper_cosmic_fluid_1793976580569.jpg' },
    { name: 'Solar Dune', url: '/src/assets/images/wallpaper_solar_minimal_1793976600438.jpg' },
  ];

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-y-auto space-y-4">
      {/* Settings Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs">
        {activeSection !== 'root' ? (
          <button
            onClick={() => setActiveSection('root')}
            className="p-1 text-cyan-400 hover:text-white cursor-pointer mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <Settings className="w-4 h-4 text-cyan-400" />
        )}
        <h1 className="font-bold text-white text-sm capitalize">
          {activeSection === 'root' ? 'System Settings' : activeSection}
        </h1>
      </div>

      {/* Main Settings Menu */}
      {activeSection === 'root' && (
        <div className="space-y-2.5">
          {/* About Device Card Banner */}
          <div 
            onClick={() => {
              triggerHaptic(10);
              setActiveSection('about');
            }}
            className="p-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-between cursor-pointer transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Aether Phone Pro</h2>
                <span className="text-[11px] text-slate-400 font-mono">AetherOS v15.2 LTS · ARM64</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>

          {/* Settings Categories */}
          <div className="space-y-1.5 pt-2">
            {[
              { id: 'display', label: 'Display & Wallpapers', desc: 'Theme, Brightness, Wallpaper gallery', icon: Sun, color: 'text-amber-400' },
              { id: 'sound', label: 'Sound & Haptics', desc: 'Volume, Ringtone, Vibration feedback', icon: Volume2, color: 'text-cyan-400' },
              { id: 'navigation', label: 'System Navigation', desc: 'Fluid Gestures or 3-Button Bar', icon: Layers, color: 'text-purple-400' },
              { id: 'security', label: 'Security & Enclave', desc: 'Passcode, Face ID, Hardware Switches', icon: ShieldCheck, color: 'text-emerald-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    triggerHaptic(10);
                    setActiveSection(item.id as any);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Section: About Device */}
      {activeSection === 'about' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Device Name:</span>
              <span className="text-white font-bold">Aether Phone One</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">OS Version:</span>
              <span className="text-cyan-400 font-bold">AetherOS 15.2 (Kinetic Microkernel)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Kernel:</span>
              <span className="text-slate-200">Linux 6.12.4-aether-formal</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Processor:</span>
              <span className="text-slate-200">{hardware.cpuCores} Physical Cores (ARMv9.4)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Unified Memory:</span>
              <span className="text-slate-200">{hardware.memoryTotalGb} GB LPDDR5X</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Storage:</span>
              <span className="text-slate-200">256 GB Sovereign UFS 4.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Section: Display & Wallpapers */}
      {activeSection === 'display' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-white block">Wallpaper Gallery</span>
            <div className="grid grid-cols-2 gap-3">
              {wallpapers.map(w => (
                <div
                  key={w.name}
                  onClick={() => {
                    triggerHaptic(15);
                    onSelectWallpaper(w.url);
                  }}
                  className={`relative h-36 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    currentWallpaper === w.url ? 'border-cyan-400 scale-102 shadow-xl' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={w.url} alt={w.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-[10px] font-bold text-white">{w.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Section: System Navigation */}
      {activeSection === 'navigation' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-white block">Choose Navigation Experience</span>
          <div className="space-y-2.5">
            <div
              onClick={() => {
                triggerHaptic(15);
                onChangeNavigationMode('gestures');
              }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                navigationMode === 'gestures' ? 'bg-cyan-500/20 border-cyan-500/50 text-white' : 'bg-slate-900/60 border-white/5 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">Fluid Gesture Navigation</span>
                <span className="text-[10px] text-slate-400">Swipe pill at bottom to go home, hold for recent apps.</span>
              </div>
              {navigationMode === 'gestures' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>

            <div
              onClick={() => {
                triggerHaptic(15);
                onChangeNavigationMode('buttons');
              }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                navigationMode === 'buttons' ? 'bg-cyan-500/20 border-cyan-500/50 text-white' : 'bg-slate-900/60 border-white/5 text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">Classic 3-Button Navigation</span>
                <span className="text-[10px] text-slate-400">Traditional Back, Home, and Recents buttons for maximum accessibility.</span>
              </div>
              {navigationMode === 'buttons' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
