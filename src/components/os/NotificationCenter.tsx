import React from 'react';
import { Bell, Trash2, X, MessageSquare, PhoneCall, BatteryCharging, CheckCircle2 } from 'lucide-react';
import { OSNotification, AppId } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: OSNotification[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onLaunchApp: (app: AppId) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onDismiss,
  onLaunchApp,
}) => {
  if (!isOpen) return null;

  const getAppIcon = (appId: AppId) => {
    switch (appId) {
      case 'messages':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'phone':
        return <PhoneCall className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div 
      className="absolute inset-0 z-50 bg-black/65 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-start select-none animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm mx-auto space-y-4 pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-200">
              NOTIFICATIONS ({notifications.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  triggerHaptic(15);
                  onClearAll();
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
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

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">All caught up</p>
            <p className="text-xs text-slate-500">No new notifications in AetherOS</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onClose();
                  onLaunchApp(n.appId);
                }}
                className="group relative p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                      {getAppIcon(n.appId)}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{n.appName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic(10);
                        onDismiss(n.id);
                      }}
                      className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-1.5 pl-8">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
