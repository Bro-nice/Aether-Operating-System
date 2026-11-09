import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat, 
  Heart, 
  Music as MusicIcon,
  Disc3
} from 'lucide-react';
import { MusicTrack } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

const PLAYLIST: MusicTrack[] = [
  { id: 't1', title: 'Horizon Frequency (432Hz)', artist: 'Aura Sound Lab', durationSec: 214, coverGradient: 'from-cyan-500 to-blue-600', genre: 'Ambient Drone' },
  { id: 't2', title: 'Cybernetic Dusk', artist: 'Neural Synthetics', durationSec: 185, coverGradient: 'from-violet-500 to-indigo-700', genre: 'Synthwave' },
  { id: 't3', title: 'Solar Dune Wind', artist: 'Sovereign Audio', durationSec: 240, coverGradient: 'from-amber-500 to-rose-600', genre: 'Organic Soundscape' },
];

interface MusicAppProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onTrackChange?: (title: string) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  isPlaying,
  onTogglePlay,
  onTrackChange,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackSeconds, setPlaybackSeconds] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  const track = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackSeconds(prev => (prev + 1) % track.durationSec);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, track.durationSec]);

  const handleNext = () => {
    triggerHaptic(15);
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setPlaybackSeconds(0);
    if (onTrackChange) onTrackChange(PLAYLIST[nextIdx].title);
  };

  const handlePrev = () => {
    triggerHaptic(15);
    const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIdx);
    setPlaybackSeconds(0);
    if (onTrackChange) onTrackChange(PLAYLIST[prevIdx].title);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-5 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <span className="font-mono text-cyan-400 uppercase tracking-wider font-semibold">AURA LOSSLESS AUDIO</span>
        <span className="text-slate-400">FLAC 24-bit / 96kHz</span>
      </div>

      {/* Album Artwork & Rotating Disc */}
      <div className="my-auto flex flex-col items-center justify-center space-y-5">
        <div 
          className={`relative w-48 h-48 rounded-3xl bg-gradient-to-tr ${track.coverGradient} shadow-2xl flex items-center justify-center p-4 border border-white/20`}
        >
          <Disc3 className={`w-24 h-24 text-white/90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">{track.title}</h2>
          <p className="text-xs text-slate-400 font-medium">{track.artist} · {track.genre}</p>
        </div>

        {/* Live Audio Equalizer Frequency Bars */}
        <div className="flex items-end justify-center gap-1.5 h-8">
          {[40, 75, 30, 95, 60, 85, 45, 90, 65, 35, 80, 50].map((h, i) => (
            <div
              key={i}
              style={{ height: isPlaying ? `${h}%` : '15%' }}
              className="w-1 bg-cyan-400 rounded-full transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Progress Scrubber Bar */}
      <div className="space-y-1.5 pt-2">
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div 
            style={{ width: `${(playbackSeconds / track.durationSec) * 100}%` }}
            className="h-full bg-cyan-400 rounded-full transition-all"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{formatTime(playbackSeconds)}</span>
          <span>{formatTime(track.durationSec)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-around py-3">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 transition-colors cursor-pointer ${isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        <button 
          onClick={handlePrev}
          className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-xl transition-transform active:scale-90 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 ml-0.5 fill-slate-950" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <SkipForward className="w-6 h-6" />
        </button>

        <button className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
