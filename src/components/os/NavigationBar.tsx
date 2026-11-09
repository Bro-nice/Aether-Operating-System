import React from 'react';
import { ChevronLeft, Circle, Square } from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

interface NavigationBarProps {
  mode: 'gestures' | 'buttons';
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  mode,
  onHome,
  onBack,
  onRecents,
}) => {
  return (
    <nav 
      aria-label="System Navigation"
      className="relative w-full h-8 flex items-center justify-center z-40 select-none pb-1 pointer-events-auto"
    >
      {mode === 'gestures' ? (
        /* Fluid Gesture Home Pill */
        <button
          onClick={() => {
            triggerHaptic(15);
            onHome();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            triggerHaptic([20, 25]);
            onRecents();
          }}
          className="w-32 h-1.5 rounded-full bg-white/60 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
          title="Tap for Home · Long click for App Switcher"
        />
      ) : (
        /* Classic 3-Button Navigation Bar */
        <div className="w-full max-w-xs flex items-center justify-around text-white/70">
          <button
            onClick={() => {
              triggerHaptic(15);
              onBack();
            }}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              onHome();
            }}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="Home"
          >
            <Circle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHaptic(20);
              onRecents();
            }}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="Recent Apps"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};
