import React, { useState } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleNum = (num: string) => {
    triggerHaptic(10);
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOp = (op: string) => {
    triggerHaptic(15);
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    triggerHaptic(10);
    setDisplay('0');
    setEquation('');
  };

  const handleEqual = () => {
    triggerHaptic(20);
    try {
      const fullExpr = equation + display;
      // Safe math evaluation
      const sanitized = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`'use strict'; return (${sanitized})`)();
      const resultStr = String(Math.round(result * 100000) / 100000);
      setHistory([`${fullExpr} = ${resultStr}`, ...history]);
      setDisplay(resultStr);
      setEquation('');
    } catch (err) {
      setDisplay('Error');
    }
  };

  const handlePercent = () => {
    triggerHaptic(10);
    const val = parseFloat(display) / 100;
    setDisplay(String(val));
  };

  const handleSqrt = () => {
    triggerHaptic(10);
    const val = Math.sqrt(parseFloat(display));
    setDisplay(String(Math.round(val * 100000) / 100000));
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Calculator Display Screen */}
      <div className="my-auto flex flex-col items-end justify-end px-4 py-6 space-y-1">
        <span className="text-sm font-mono text-cyan-400 min-h-[20px]">{equation}</span>
        <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white tabular-nums truncate max-w-full">
          {display}
        </span>
      </div>

      {/* Calculator Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto w-full pb-4">
        {[
          { label: 'C', onClick: handleClear, color: 'bg-slate-800 text-rose-400 font-bold' },
          { label: '√', onClick: handleSqrt, color: 'bg-slate-800 text-cyan-400' },
          { label: '%', onClick: handlePercent, color: 'bg-slate-800 text-cyan-400' },
          { label: '÷', onClick: () => handleOp('÷'), color: 'bg-amber-500/20 text-amber-400 font-bold' },
          
          { label: '7', onClick: () => handleNum('7'), color: 'bg-slate-900' },
          { label: '8', onClick: () => handleNum('8'), color: 'bg-slate-900' },
          { label: '9', onClick: () => handleNum('9'), color: 'bg-slate-900' },
          { label: '×', onClick: () => handleOp('×'), color: 'bg-amber-500/20 text-amber-400 font-bold' },

          { label: '4', onClick: () => handleNum('4'), color: 'bg-slate-900' },
          { label: '5', onClick: () => handleNum('5'), color: 'bg-slate-900' },
          { label: '6', onClick: () => handleNum('6'), color: 'bg-slate-900' },
          { label: '-', onClick: () => handleOp('-'), color: 'bg-amber-500/20 text-amber-400 font-bold' },

          { label: '1', onClick: () => handleNum('1'), color: 'bg-slate-900' },
          { label: '2', onClick: () => handleNum('2'), color: 'bg-slate-900' },
          { label: '3', onClick: () => handleNum('3'), color: 'bg-slate-900' },
          { label: '+', onClick: () => handleOp('+'), color: 'bg-amber-500/20 text-amber-400 font-bold' },

          { label: '0', onClick: () => handleNum('0'), color: 'bg-slate-900 col-span-2' },
          { label: '.', onClick: () => handleNum('.'), color: 'bg-slate-900' },
          { label: '=', onClick: handleEqual, color: 'bg-cyan-500 text-slate-950 font-bold' },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`h-14 rounded-2xl flex items-center justify-center text-xl font-semibold border border-white/5 transition-all active:scale-90 cursor-pointer shadow-md ${btn.color}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
