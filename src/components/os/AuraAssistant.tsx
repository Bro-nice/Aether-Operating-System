import React, { useState } from 'react';
import { Bot, Send, X, Mic, ArrowRight, Check } from 'lucide-react';
import { queryOSAssistant } from '../../services/api';
import { triggerHaptic } from '../../utils/hardware';
import { AppId } from '../../types/os';

interface AuraAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (app: AppId) => void;
  onToggleFlashlight: () => void;
  systemState: any;
}

export const AuraAssistant: React.FC<AuraAssistantProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  onToggleFlashlight,
  systemState,
}) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Open Camera and shoot photo',
    'Call Alex Rivera',
    'Turn on hardware flashlight',
    'Open System Settings',
    'Launch Terminal and run neofetch',
  ];

  const handleSubmit = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim() || isThinking) return;

    triggerHaptic(15);
    setIsThinking(true);
    setResponse(null);

    try {
      const res = await queryOSAssistant(prompt, systemState);
      setResponse(res.reply);

      // Execute OS action
      if (res.action === 'OPEN_APP' && res.target) {
        setTimeout(() => {
          onClose();
          onLaunchApp(res.target as AppId);
        }, 800);
      } else if (res.action === 'TOGGLE_FLASHLIGHT') {
        onToggleFlashlight();
      }
    } catch (e) {
      setResponse('I encountered an error executing this system directive.');
    } finally {
      setIsThinking(false);
      setQuery('');
    }
  };

  return (
    <div 
      className="absolute inset-0 z-50 bg-black/70 backdrop-blur-2xl flex flex-col justify-end p-4 select-none animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white tracking-wide">AURA OS INTELLIGENCE</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Glowing Neural Orb */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_50px_rgba(56,189,248,0.5)] flex items-center justify-center animate-pulse">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <p className="text-xs text-slate-300 font-medium text-center mt-3">
            {isThinking ? 'Analyzing hardware intent...' : response || 'How can Aura assist your workflow?'}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        {!response && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.slice(0, 3).map((p, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(p)}
                className="px-2.5 py-1 text-[11px] rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-cyan-300 border border-white/5 transition-all cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type or speak OS command..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 pr-10"
            autoFocus
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!query.trim() || isThinking}
            className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 absolute right-2 top-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
