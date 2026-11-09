import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Search, 
  ShieldCheck, 
  Star, 
  Share2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

const BOOKMARKS = [
  { title: 'Linux Kernel Archives', url: 'https://kernel.org', snippet: 'The Linux Kernel Organization archives and documentation.' },
  { title: 'AetherOS Whitepaper', url: 'https://aetheros.org/manifesto', snippet: 'Formal specifications for the capability-based microkernel.' },
  { title: 'Open Source Initiative', url: 'https://opensource.org', snippet: 'Stewards of the Open Source Definition.' },
  { title: 'Mozilla Developer Network', url: 'https://developer.mozilla.org', snippet: 'Resources for developers, by developers.' },
];

export const BrowserApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://aetheros.org/manifesto');
  const [currentUrl, setCurrentUrl] = useState('https://aetheros.org/manifesto');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    }
    triggerHaptic(15);
    setIsLoading(true);
    setCurrentUrl(target);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleOpenBookmark = (url: string) => {
    setUrlInput(url);
    setCurrentUrl(url);
    triggerHaptic(15);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden">
      {/* Browser Navigation Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-white/10 space-y-2">
        <form onSubmit={handleNavigate} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenBookmark('https://aetheros.org/manifesto')}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Omnibar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter web address..."
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none truncate font-mono text-[11px]"
            />
          </div>
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Web Sandbox Header */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-cyan-300">Sandbox Isolation: Strict</span>
            <span className="text-emerald-400">Ad-Trackers Blocked (14)</span>
          </div>
          <h2 className="text-base font-bold text-white">Quantum Web Reader</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Viewing: <span className="font-mono text-cyan-300">{currentUrl}</span>
          </p>
        </div>

        {/* Bookmarks Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Curated Knowledge & Open Standards
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BOOKMARKS.map((b, i) => (
              <div
                key={i}
                onClick={() => handleOpenBookmark(b.url)}
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 cursor-pointer transition-all active:scale-[0.98] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{b.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{b.snippet}</p>
                <span className="text-[9px] font-mono text-slate-500 block truncate">{b.url}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
