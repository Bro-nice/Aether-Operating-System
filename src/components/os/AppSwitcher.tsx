import React from 'react';
import { Layers, X, SplitSquareVertical, Trash2, Check } from 'lucide-react';
import { AppId, AppMetadata } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  openApps: AppId[];
  activeApp: AppId | null;
  onSelectApp: (app: AppId) => void;
  onCloseApp: (app: AppId) => void;
  onClearAllApps: () => void;
  appMetadata: Record<AppId, AppMetadata>;
  onEnableSplitScreen: (app1: AppId, app2: AppId) => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({
  isOpen,
  onClose,
  openApps,
  activeApp,
  onSelectApp,
  onCloseApp,
  onClearAllApps,
  appMetadata,
  onEnableSplitScreen,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 z-50 bg-black/75 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Header */}
      <div 
        className="flex items-center justify-between text-white pt-6 pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-200">
            MULTITASKING CAROUSEL ({openApps.length} ACTIVE)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {openApps.length > 0 && (
            <button
              onClick={() => {
                triggerHaptic([20, 30]);
                onClearAllApps();
              }}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Close All</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D App Cards Horizontal Carousel */}
      <div 
        className="my-auto w-full flex items-center gap-4 overflow-x-auto py-6 px-2 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {openApps.length === 0 ? (
          <div className="w-full text-center py-12 text-slate-400">
            <p className="text-sm font-semibold text-slate-300">No applications running</p>
            <p className="text-xs text-slate-500 mt-1">Tap any app on the home screen to launch</p>
          </div>
        ) : (
          openApps.map((appId, index) => {
            const meta = appMetadata[appId];
            return (
              <div
                key={appId}
                className="relative flex-shrink-0 w-64 h-96 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between p-4 hover:scale-105 transition-all cursor-pointer group"
                onClick={() => {
                  triggerHaptic(15);
                  onSelectApp(appId);
                }}
              >
                {/* App Card Header */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] ${meta?.color || 'bg-cyan-500'} text-white`}>
                      {meta?.name[0] || 'A'}
                    </div>
                    <span className="font-bold text-white">{meta?.name || appId}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(10);
                      onCloseApp(appId);
                    }}
                    className="p-1 rounded-full bg-white/10 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Simulated Live Viewport Preview */}
                <div className="my-auto flex flex-col items-center justify-center text-center p-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl ${meta?.color || 'bg-cyan-500'} text-white shadow-xl mb-3`}>
                    {meta?.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-white">{meta?.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono mt-1">Process PID #{100 + index} · Active</span>
                </div>

                {/* Bottom App Actions: Split Screen */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono">Running</span>
                  {openApps.length >= 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic(20);
                        const otherApp = openApps.find(a => a !== appId) || 'browser';
                        onEnableSplitScreen(appId, otherApp);
                      }}
                      className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 cursor-pointer"
                      title="Run in Split Screen"
                    >
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                      <span>Split Screen</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Swipe up prompt */}
      <div className="text-center pb-6 text-xs text-slate-400 font-mono">
        Swipe up on any card to close · Tap to switch
      </div>
    </div>
  );
};
