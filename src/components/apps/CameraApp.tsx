import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera as CameraIcon, 
  RotateCw, 
  Image as ImageIcon, 
  Sliders, 
  Check, 
  AlertCircle,
  Video,
  X
} from 'lucide-react';
import { playShutterSound, triggerHaptic } from '../../utils/hardware';

interface CameraAppProps {
  onPhotoCaptured?: (dataUrl: string) => void;
  onOpenGallery?: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({
  onPhotoCaptured,
  onOpenGallery,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [activeFilter, setActiveFilter] = useState<'none' | 'cinematic' | 'noir' | 'cyber' | 'warm'>('none');
  const [flashEffect, setFlashEffect] = useState(false);
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: false,
          });
          currentStream = mediaStream;
          setStream(mediaStream);
          setHasPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        console.warn('Real camera not accessible, using simulated viewfinder:', err);
        setHasPermission(false);
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCameraFacing = () => {
    triggerHaptic(15);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    playShutterSound();
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 120);

    let photoData = '';

    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Apply filter to canvas if needed
        if (activeFilter === 'noir') ctx.filter = 'grayscale(100%) contrast(1.2)';
        else if (activeFilter === 'warm') ctx.filter = 'sepia(40%) saturate(1.4)';
        else if (activeFilter === 'cyber') ctx.filter = 'hue-rotate(90deg) contrast(1.3)';
        else if (activeFilter === 'cinematic') ctx.filter = 'contrast(1.15) saturate(1.2)';

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.9);
      }
    } else {
      // High-resolution simulated capture fallback
      photoData = '/src/assets/images/wallpaper_cosmic_fluid_1793976580569.jpg';
    }

    setLastPhotoUrl(photoData);
    if (onPhotoCaptured) onPhotoCaptured(photoData);
  };

  const getFilterClass = () => {
    switch (activeFilter) {
      case 'noir': return 'grayscale contrast-125';
      case 'warm': return 'sepia-40 saturate-140';
      case 'cyber': return 'hue-rotate-90 contrast-125';
      case 'cinematic': return 'contrast-115 saturate-125 brightness-95';
      default: return '';
    }
  };

  return (
    <div className="relative flex-1 w-full h-full bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Flash Screen Flash overlay */}
      {flashEffect && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Viewfinder Controls */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <CameraIcon className="w-4 h-4 text-emerald-400" />
          <span>4K 60FPS · RAW</span>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
          {(['none', 'cinematic', 'noir', 'cyber', 'warm'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                triggerHaptic(10);
                setActiveFilter(f);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono transition-all cursor-pointer ${
                activeFilter === f ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewfinder Canvas / Stream */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {hasPermission ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()}`}
          />
        ) : (
          /* Simulated High-Tech Viewfinder when webcam not permitted */
          <div 
            className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center relative"
            style={{ backgroundImage: `url('/src/assets/images/wallpaper_solar_minimal_1793976600438.jpg')` }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="relative z-10 p-6 rounded-3xl bg-black/60 border border-white/15 text-center space-y-2 max-w-xs">
              <CameraIcon className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Simulated 4K Viewfinder</h3>
              <p className="text-xs text-slate-300">
                Live camera stream ready. Tap shutter below to capture and save into Files & Gallery.
              </p>
            </div>
          </div>
        )}

        {/* Framing Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-white/10" />
          <div className="border-r border-white/10" />
          <div />
        </div>
      </div>

      {/* Bottom Shutter & Switcher Deck */}
      <div className="relative z-20 flex items-center justify-around p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        {/* Gallery Preview Thumbnail */}
        <button
          onClick={onOpenGallery}
          className="w-12 h-12 rounded-2xl border-2 border-white/40 overflow-hidden bg-slate-800 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
        >
          {lastPhotoUrl ? (
            <img src={lastPhotoUrl} alt="Last capture" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-white/70" />
          )}
        </button>

        {/* Giant Tactile Shutter Button */}
        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-2xl group"
        >
          <div className="w-full h-full rounded-full bg-white group-hover:bg-cyan-200 transition-colors" />
        </button>

        {/* Flip Camera Facing Mode */}
        <button
          onClick={toggleCameraFacing}
          className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          title="Flip Camera"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
