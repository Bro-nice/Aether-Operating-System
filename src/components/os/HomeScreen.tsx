import React, { useState } from 'react';
import { 
  Phone, 
  Camera, 
  MessageSquare, 
  Globe, 
  Folder, 
  Image, 
  Music, 
  Settings, 
  ShoppingBag, 
  Terminal, 
  FileText, 
  CloudSun, 
  Calculator, 
  Clock, 
  Activity,
  Search,
  Bot,
  Gamepad2,
  Layers,
  Cpu,
  BatteryCharging
} from 'lucide-react';
import { AppId, AppMetadata, HardwareState } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface HomeScreenProps {
  appMetadata: Record<AppId, AppMetadata>;
  onLaunchApp: (app: AppId) => void;
  hardware: HardwareState;
  onOpenControlCenter: () => void;
  onOpenNotifications: () => void;
  onOpenAssistant: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  appMetadata,
  onLaunchApp,
  hardware,
  onOpenControlCenter,
  onOpenNotifications,
  onOpenAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getAppIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Phone': return <Phone className="w-6 h-6 text-white" />;
      case 'Camera': return <Camera className="w-6 h-6 text-white" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-white" />;
      case 'Globe': return <Globe className="w-6 h-6 text-white" />;
      case 'Folder': return <Folder className="w-6 h-6 text-white" />;
      case 'Image': return <Image className="w-6 h-6 text-white" />;
      case 'Music': return <Music className="w-6 h-6 text-white" />;
      case 'Settings': return <Settings className="w-6 h-6 text-white" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-white" />;
      case 'Terminal': return <Terminal className="w-6 h-6 text-white" />;
      case 'FileText': return <FileText className="w-6 h-6 text-white" />;
      case 'CloudSun': return <CloudSun className="w-6 h-6 text-white" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-white" />;
      case 'Clock': return <Clock className="w-6 h-6 text-white" />;
      case 'Activity': return <Activity className="w-6 h-6 text-white" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-white" />;
      default: return <Layers className="w-6 h-6 text-white" />;
    }
  };

  const allApps = Object.values(appMetadata);
  const dockApps: AppId[] = ['phone', 'messages', 'browser', 'camera'];
  const gridApps = allApps.filter(app => !dockApps.includes(app.id));

  const filteredApps = gridApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 w-full flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto pb-6">
      {/* Top OS Interactive Widgets */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {/* Widget 1: Weather & Date Live Widget */}
          <div 
            onClick={() => onLaunchApp('weather')}
            className="p-3.5 rounded-3xl bg-slate-900/65 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-all cursor-pointer shadow-xl flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <CloudSun className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-cyan-300">San Francisco</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-white tabular-nums">72°</span>
              <p className="text-[11px] text-slate-300 font-medium">Partly Cloudy · H:76° L:58°</p>
            </div>
          </div>

          {/* Widget 2: Real Hardware Telemetry Widget */}
          <div 
            onClick={() => onLaunchApp('vitals')}
            className="p-3.5 rounded-3xl bg-slate-900/65 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-all cursor-pointer shadow-xl flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{hardware.batteryLevel}%</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs font-bold text-white block">Hardware Synchronized</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {hardware.cpuCores} Cores · {hardware.memoryTotalGb}GB RAM
              </p>
            </div>
          </div>
        </div>

        {/* Global Search & AI Prompt Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps, files, or ask Aura Assistant..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors pl-9 pr-9 backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <button
            onClick={onOpenAssistant}
            className="p-1 rounded-lg text-cyan-300 hover:text-cyan-200 absolute right-2.5 top-2 cursor-pointer"
            title="Invoke Aura AI Assistant"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Apps Grid (4 columns) */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                triggerHaptic(15);
                onLaunchApp(app.id);
              }}
              className="flex flex-col items-center gap-1.5 transition-transform active:scale-90 cursor-pointer group"
            >
              <div className="relative">
                {/* App Icon Tile */}
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all ${app.color} group-hover:scale-105`}
                >
                  {getAppIconComponent(app.icon)}
                </div>

                {/* Unread Badge Counter */}
                {app.badge && app.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {app.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-medium text-white/90 group-hover:text-white truncate max-w-[64px] drop-shadow-sm">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Bottom Glass Dock (4 Core Apps) */}
      <div className="w-full pt-2">
        <div className="w-full max-w-xs mx-auto p-2.5 rounded-3xl bg-white/15 border border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-around">
          {dockApps.map((appId) => {
            const app = appMetadata[appId];
            return (
              <button
                key={appId}
                onClick={() => {
                  triggerHaptic(15);
                  onLaunchApp(appId);
                }}
                className="relative flex flex-col items-center transition-transform active:scale-85 cursor-pointer"
                title={app.name}
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg ${app.color}`}>
                  {getAppIconComponent(app.icon)}
                </div>
                {app.badge && app.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {app.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
