import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Trophy, Zap } from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

export const CyberRunnerApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(140);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameState = useRef({
    playerY: 180,
    velocity: 0,
    isJumping: false,
    obstacles: [] as { x: number; width: number; height: number }[],
    frame: 0,
    score: 0,
  });

  const jump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    if (!gameState.current.isJumping) {
      gameState.current.velocity = -11;
      gameState.current.isJumping = true;
      triggerHaptic(15);
    }
  };

  const startGame = () => {
    gameState.current = {
      playerY: 180,
      velocity: 0,
      isJumping: false,
      obstacles: [{ x: 340, width: 22, height: 35 }],
      frame: 0,
      score: 0,
    };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    triggerHaptic(20);
  };

  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const state = gameState.current;
      state.frame++;

      // Gravity
      state.velocity += 0.65;
      state.playerY += state.velocity;
      if (state.playerY >= 180) {
        state.playerY = 180;
        state.velocity = 0;
        state.isJumping = false;
      }

      // Move obstacles
      for (let i = 0; i < state.obstacles.length; i++) {
        state.obstacles[i].x -= 4.5;
      }

      // Add new obstacle
      if (state.frame % 85 === 0) {
        const height = 25 + Math.random() * 25;
        state.obstacles.push({ x: 360, width: 22, height });
      }

      // Filter passed obstacles
      if (state.obstacles.length > 0 && state.obstacles[0].x < -30) {
        state.obstacles.shift();
        state.score += 10;
        setScore(state.score);
        if (state.score > highScore) setHighScore(state.score);
      }

      // Collision detection
      const playerBox = { x: 45, y: state.playerY, width: 24, height: 28 };
      for (const obs of state.obstacles) {
        if (
          playerBox.x < obs.x + obs.width &&
          playerBox.x + playerBox.width > obs.x &&
          playerBox.y + playerBox.height > 210 - obs.height
        ) {
          triggerHaptic([30, 40, 30]);
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 210);
      ctx.lineTo(canvas.width, 210);
      ctx.stroke();

      // Floor grid speed lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      const offset = (state.frame * 4) % 40;
      for (let x = -offset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 210);
        ctx.lineTo(x - 20, 240);
        ctx.stroke();
      }

      // Draw Player (Neon Kinetic Runner)
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillRect(playerBox.x, playerBox.y, playerBox.width, playerBox.height);
      ctx.shadowBlur = 0;

      // Draw Obstacles (Cyber Spikes)
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      for (const obs of state.obstacles) {
        ctx.fillRect(obs.x, 210 - obs.height, obs.width, obs.height);
      }
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, highScore]);

  return (
    <div 
      onClick={jump}
      className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-cyan-400">
          <Gamepad2 className="w-4 h-4" />
          <span>CYBER RUNNER 120Hz</span>
        </div>

        <div className="flex items-center gap-4 font-mono">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            {highScore}
          </span>
          <span className="text-white font-bold text-sm tabular-nums">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="my-auto flex flex-col items-center justify-center relative">
        <canvas
          ref={canvasRef}
          width={360}
          height={240}
          className="rounded-2xl border border-cyan-500/30 bg-black/80 shadow-2xl w-full max-w-sm"
        />

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl space-y-2">
            <Zap className="w-10 h-10 text-cyan-400 animate-bounce" />
            <span className="text-sm font-bold text-white">Tap Anywhere to Sprint</span>
            <span className="text-[10px] text-slate-400 font-mono">120 FPS GPU Accelerated</span>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl space-y-3">
            <span className="text-base font-black text-rose-500">SYSTEM CRASH: GAME OVER</span>
            <span className="text-xs font-mono text-white">Score: {score}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Run</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-[10px] text-slate-500 font-mono">
        Tap screen to leap over energy spikes · Synchronized with GPU
      </div>
    </div>
  );
};
