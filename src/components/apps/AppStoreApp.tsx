import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Download, 
  Check, 
  Star, 
  Search, 
  Gamepad2,
  Terminal,
  Cpu
} from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

interface StoreAppItem {
  id: string;
  name: string;
  developer: string;
  rating: number;
  category: string;
  desc: string;
  isInstalled: boolean;
  size: string;
}

const STORE_CATALOG: StoreAppItem[] = [
  { id: 'app_pixel_dash', name: 'Pixel Dash: Retro Runner', developer: 'Aura Arcade Labs', rating: 4.9, category: 'Games', desc: 'High-speed 120fps procedural cyberpunk infinite runner.', isInstalled: false, size: '24 MB' },
  { id: 'app_paint', name: 'Vector Studio Pro', developer: 'Creative Matrix', rating: 4.8, category: 'Creativity', desc: 'Pressure-sensitive vector illustration and spatial canvas sketching.', isInstalled: false, size: '42 MB' },
  { id: 'app_podcast', name: 'Resonance Podcasts', developer: 'Lossless Audio', rating: 4.7, category: 'Media', desc: 'Decentralized audio podcast client with silence removal.', isInstalled: true, size: '18 MB' },
  { id: 'app_crypto', name: 'Cold Hardware Vault', developer: 'Sovereign Enclave', rating: 5.0, category: 'Security', desc: 'Zero-knowledge deterministic biometric hardware keychain.', isInstalled: true, size: '8 MB' },
];

export const AppStoreApp: React.FC = () => {
  const [catalog, setCatalog] = useState<StoreAppItem[]>(STORE_CATALOG);
  const [installingId, setInstallingId] = useState<string | null>(null);

  const handleInstall = (id: string) => {
    triggerHaptic(20);
    setInstallingId(id);
    setTimeout(() => {
      setCatalog(prev => prev.map(a => a.id === id ? { ...a, isInstalled: true } : a));
      setInstallingId(null);
    }, 1200);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Aura App Market</span>
        </div>
        <span className="text-cyan-400 font-mono">100% Verified Sandboxes</span>
      </div>

      {/* Featured Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-purple-900/50 border border-white/10 space-y-2 shadow-xl">
        <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
          Featured of the Week
        </span>
        <h2 className="text-base font-bold text-white">Pixel Dash: Retro Runner</h2>
        <p className="text-xs text-slate-300">
          Native 120Hz GPU-rendered kinetic runner optimized for AetherOS compositor.
        </p>
      </div>

      {/* Catalog List */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Curated Software Catalog
        </span>
        {catalog.map(app => (
          <div
            key={app.id}
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center justify-between"
          >
            <div className="space-y-1 min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">{app.name}</span>
                <span className="text-[10px] font-mono text-cyan-400">{app.category}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{app.desc}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {app.rating}
                </span>
                <span>·</span>
                <span>{app.size}</span>
              </div>
            </div>

            <button
              onClick={() => !app.isInstalled && handleInstall(app.id)}
              disabled={app.isInstalled || installingId === app.id}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 ${
                app.isInstalled
                  ? 'bg-white/10 text-emerald-400'
                  : installingId === app.id
                  ? 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              }`}
            >
              {app.isInstalled ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Installed</span>
                </>
              ) : installingId === app.id ? (
                <span>Installing...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
