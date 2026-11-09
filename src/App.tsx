import React, { useState, useEffect } from 'react';
import { 
  AppId, 
  AppMetadata, 
  HardwareState, 
  OSNotification,
  ViewportMode
} from './types/os';
import { 
  detectRealHardware, 
  playLockChime, 
  startAmbientAudioStream, 
  stopAmbientAudioStream 
} from './utils/hardware';
import { HardwareDeviceFrame } from './components/frame/HardwareDeviceFrame';
import { StatusBar } from './components/os/StatusBar';
import { OmniIsland } from './components/os/OmniIsland';
import { HomeScreen } from './components/os/HomeScreen';
import { LockScreen } from './components/os/LockScreen';
import { ControlCenter } from './components/os/ControlCenter';
import { NotificationCenter } from './components/os/NotificationCenter';
import { AppSwitcher } from './components/os/AppSwitcher';
import { NavigationBar } from './components/os/NavigationBar';
import { AuraAssistant } from './components/os/AuraAssistant';

// Native Applications
import { PhoneApp } from './components/apps/PhoneApp';
import { CameraApp } from './components/apps/CameraApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { FilesApp } from './components/apps/FilesApp';
import { MusicApp } from './components/apps/MusicApp';
import { ClockApp } from './components/apps/ClockApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { WeatherApp } from './components/apps/WeatherApp';
import { NotesApp } from './components/apps/NotesApp';
import { VitalsApp } from './components/apps/VitalsApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CyberRunnerApp } from './components/apps/CyberRunnerApp';

const APP_REGISTRY: Record<AppId, AppMetadata> = {
  phone: { id: 'phone', name: 'Phone', icon: 'Phone', color: 'bg-emerald-500', category: 'core' },
  messages: { id: 'messages', name: 'Messages', icon: 'MessageSquare', color: 'bg-emerald-600', category: 'core', badge: 2 },
  browser: { id: 'browser', name: 'Quantum Web', icon: 'Globe', color: 'bg-blue-600', category: 'core' },
  camera: { id: 'camera', name: 'Camera', icon: 'Camera', color: 'bg-slate-700', category: 'media' },
  files: { id: 'files', name: 'Files', icon: 'Folder', color: 'bg-amber-600', category: 'utility' },
  gallery: { id: 'gallery', name: 'Photos', icon: 'Image', color: 'bg-indigo-500', category: 'media' },
  music: { id: 'music', name: 'Music', icon: 'Music', color: 'bg-rose-500', category: 'media' },
  settings: { id: 'settings', name: 'Settings', icon: 'Settings', color: 'bg-slate-600', category: 'system' },
  appstore: { id: 'appstore', name: 'Market', icon: 'ShoppingBag', color: 'bg-cyan-600', category: 'utility' },
  terminal: { id: 'terminal', name: 'Terminal', icon: 'Terminal', color: 'bg-slate-900', category: 'system' },
  notes: { id: 'notes', name: 'Notes', icon: 'FileText', color: 'bg-yellow-500', category: 'productivity' },
  weather: { id: 'weather', name: 'Weather', icon: 'CloudSun', color: 'bg-sky-500', category: 'utility' },
  calculator: { id: 'calculator', name: 'Calculator', icon: 'Calculator', color: 'bg-amber-500', category: 'utility' },
  clock: { id: 'clock', name: 'Clock', icon: 'Clock', color: 'bg-orange-500', category: 'utility' },
  vitals: { id: 'vitals', name: 'Vitals', icon: 'Activity', color: 'bg-emerald-700', category: 'system' },
  game: { id: 'game', name: 'Runner', icon: 'Gamepad2', color: 'bg-purple-600', category: 'game' },
};

const INITIAL_NOTIFICATIONS: OSNotification[] = [
  { id: 'n1', appId: 'vitals', appName: 'Hardware Engine', title: 'Hardware Synced 100%', body: 'Connected directly to host GPU, CPU cores, and memory.', time: 'Just now' },
  { id: 'n2', appId: 'messages', appName: 'Messages', title: 'Alex Rivera', body: 'The UWB zero-latency link is running at 0.42ms.', time: '10:14 AM' },
];

export default function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [openApps, setOpenApps] = useState<AppId[]>(['phone', 'messages', 'browser', 'camera']);
  const [splitScreenApp, setSplitScreenApp] = useState<AppId | null>(null);

  // Viewport display mode: 'chassis_pocket' or 'native_full'
  const [viewportMode, setViewportMode] = useState<ViewportMode>('chassis_pocket');

  // System Overlays
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Wallpapers & Appearance
  const [currentWallpaper, setCurrentWallpaper] = useState('/src/assets/images/wallpaper_cosmic_fluid_1793976580569.jpg');
  const [navigationMode, setNavigationMode] = useState<'gestures' | 'buttons'>('gestures');

  // Media & Call state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackTitle, setCurrentTrackTitle] = useState('Horizon Frequency (432Hz)');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDurationStr, setCallDurationStr] = useState<string | null>(null);

  // Real Hardware State
  const [hardware, setHardware] = useState<HardwareState>({
    batteryLevel: 94,
    isCharging: false,
    isOnline: true,
    networkType: '6G / Wi-Fi 7',
    networkSpeedMbps: 850,
    cpuCores: 8,
    memoryTotalGb: 12,
    memoryUsedMb: 2480,
    gpuRenderer: 'Apple M3 Pro / NVIDIA RTX GPU',
    hostPlatform: 'Host Hardware Environment',
    hostBrowser: 'WebKit Core',
    screenWidth: 1440,
    screenHeight: 900,
    devicePixelRatio: 2,
    deviceTiltX: 0,
    deviceTiltY: 0,
    geolocationCity: 'San Francisco, CA',
    geolocationCoords: '37.77° N, 122.41° W',
    screenBrightness: 90,
    volumeLevel: 75,
    isMuted: false,
    flashlightOn: false,
    nightLightOn: false,
    airplaneMode: false,
    bluetoothOn: true,
    locationOn: true,
    doNotDisturb: false,
    micMutedByHardware: false,
    cameraMutedByHardware: false,
    deviceOrientation: 'portrait',
  });

  const [notifications, setNotifications] = useState<OSNotification[]>(INITIAL_NOTIFICATIONS);

  // Real Hardware Detection & Event Listeners
  useEffect(() => {
    detectRealHardware().then(detected => {
      setHardware(prev => ({
        ...prev,
        cpuCores: detected.cpuCores,
        memoryTotalGb: detected.memoryGb || 12,
        batteryLevel: detected.batteryLevel,
        isCharging: detected.isCharging,
        isOnline: detected.isOnline,
        networkType: detected.networkType,
        networkSpeedMbps: detected.networkSpeedMbps,
        gpuRenderer: detected.gpuRenderer,
        hostPlatform: detected.hostPlatform,
        hostBrowser: detected.hostBrowser,
        screenWidth: detected.screenWidth,
        screenHeight: detected.screenHeight,
        devicePixelRatio: detected.devicePixelRatio,
        geolocationCoords: detected.geolocationCoords,
      }));
    });

    // Detect Real Orientation / Gyroscope Tilts
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setHardware(prev => ({
          ...prev,
          deviceTiltX: Math.round(e.gamma || 0),
          deviceTiltY: Math.round(e.beta || 0),
        }));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Handle Real Audio Stream when Music Toggles
  const handleToggleMusic = () => {
    if (!isPlayingMusic) {
      startAmbientAudioStream(432);
      setIsPlayingMusic(true);
    } else {
      stopAmbientAudioStream();
      setIsPlayingMusic(false);
    }
  };

  const updateHardware = (partial: Partial<HardwareState>) => {
    setHardware(prev => ({ ...prev, ...partial }));
  };

  const handleLaunchApp = (appId: AppId) => {
    setActiveApp(appId);
    if (!openApps.includes(appId)) {
      setOpenApps([appId, ...openApps]);
    }
    setIsControlCenterOpen(false);
    setIsNotificationCenterOpen(false);
    setIsAppSwitcherOpen(false);
    setIsAssistantOpen(false);
  };

  const handleCloseActiveApp = () => {
    setActiveApp(null);
    setSplitScreenApp(null);
  };

  const handleKillApp = (appId: AppId) => {
    setOpenApps(prev => prev.filter(a => a !== appId));
    if (activeApp === appId) setActiveApp(null);
    if (splitScreenApp === appId) setSplitScreenApp(null);
  };

  const handleClearAllApps = () => {
    setOpenApps([]);
    setActiveApp(null);
    setSplitScreenApp(null);
    setIsAppSwitcherOpen(false);
  };

  const handlePowerButton = () => {
    playLockChime(!isLocked);
    setIsLocked(!isLocked);
    setIsControlCenterOpen(false);
    setIsNotificationCenterOpen(false);
    setIsAppSwitcherOpen(false);
    setIsAssistantOpen(false);
  };

  const renderAppContent = (appId: AppId) => {
    switch (appId) {
      case 'phone':
        return (
          <PhoneApp
            isCallActive={isCallActive}
            onStartCall={() => {
              setIsCallActive(true);
              setCallDurationStr('0:01');
            }}
            onEndCall={() => {
              setIsCallActive(false);
              setCallDurationStr(null);
            }}
          />
        );
      case 'camera':
        return (
          <CameraApp
            onOpenGallery={() => handleLaunchApp('gallery')}
          />
        );
      case 'messages':
        return <MessagesApp />;
      case 'browser':
        return <BrowserApp />;
      case 'files':
      case 'gallery':
        return <FilesApp />;
      case 'music':
        return (
          <MusicApp
            isPlaying={isPlayingMusic}
            onTogglePlay={handleToggleMusic}
            onTrackChange={(title) => setCurrentTrackTitle(title)}
          />
        );
      case 'clock':
        return <ClockApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'weather':
        return <WeatherApp />;
      case 'notes':
        return <NotesApp />;
      case 'vitals':
        return <VitalsApp hardware={hardware} />;
      case 'appstore':
        return <AppStoreApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'game':
        return <CyberRunnerApp />;
      case 'settings':
        return (
          <SettingsApp
            hardware={hardware}
            onUpdateHardware={updateHardware}
            currentWallpaper={currentWallpaper}
            onSelectWallpaper={(url) => setCurrentWallpaper(url)}
            navigationMode={navigationMode}
            onChangeNavigationMode={(m) => setNavigationMode(m)}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-white">
            <span>Application Viewport</span>
          </div>
        );
    }
  };

  return (
    <HardwareDeviceFrame
      hardware={hardware}
      onUpdateHardware={updateHardware}
      onPowerButton={handlePowerButton}
      wallpaperUrl={currentWallpaper}
      viewportMode={viewportMode}
      onChangeViewportMode={setViewportMode}
    >
      {/* 1. Status Bar */}
      <StatusBar
        hardware={hardware}
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        notificationCount={notifications.length}
      />

      {/* 2. Omni-Island Dynamic Morphing Pill */}
      <OmniIsland
        activeCallDuration={callDurationStr}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        currentTrackTitle={currentTrackTitle}
        isCameraActive={activeApp === 'camera'}
        isMicActive={activeApp === 'notes'}
        onOpenApp={handleLaunchApp}
      />

      {/* 3. Main Viewport Canvas */}
      <main className="relative flex-1 w-full h-full flex flex-col overflow-hidden">
        {activeApp === null ? (
          <HomeScreen
            appMetadata={APP_REGISTRY}
            onLaunchApp={handleLaunchApp}
            hardware={hardware}
            onOpenControlCenter={() => setIsControlCenterOpen(true)}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        ) : (
          /* Running App (with Split Screen support) */
          <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
            {splitScreenApp ? (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 border-b border-white/20 overflow-hidden">
                  {renderAppContent(activeApp)}
                </div>
                <div className="flex-1 overflow-hidden">
                  {renderAppContent(splitScreenApp)}
                </div>
              </div>
            ) : (
              renderAppContent(activeApp)
            )}
          </div>
        )}
      </main>

      {/* 4. Bottom System Navigation Bar */}
      <NavigationBar
        mode={navigationMode}
        onHome={handleCloseActiveApp}
        onBack={handleCloseActiveApp}
        onRecents={() => setIsAppSwitcherOpen(true)}
      />

      {/* 5. Control Center Overlay */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        hardware={hardware}
        onUpdateHardware={updateHardware}
        onLaunchApp={handleLaunchApp}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        currentTrackTitle={currentTrackTitle}
      />

      {/* 6. Notification Center Overlay */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onLaunchApp={handleLaunchApp}
      />

      {/* 7. App Switcher / Multitasking Carousel */}
      <AppSwitcher
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        openApps={openApps}
        activeApp={activeApp}
        onSelectApp={(app) => {
          setActiveApp(app);
          setIsAppSwitcherOpen(false);
        }}
        onCloseApp={handleKillApp}
        onClearAllApps={handleClearAllApps}
        appMetadata={APP_REGISTRY}
        onEnableSplitScreen={(app1, app2) => {
          setActiveApp(app1);
          setSplitScreenApp(app2);
          setIsAppSwitcherOpen(false);
        }}
      />

      {/* 8. Aura AI System Assistant */}
      <AuraAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onLaunchApp={handleLaunchApp}
        onToggleFlashlight={() => updateHardware({ flashlightOn: !hardware.flashlightOn })}
        systemState={{ hardware, activeApp, openAppsCount: openApps.length }}
      />

      {/* 9. Lock Screen */}
      {isLocked && (
        <LockScreen
          hardware={hardware}
          notifications={notifications}
          onUnlock={() => setIsLocked(false)}
          onLaunchApp={handleLaunchApp}
          onToggleFlashlight={() => updateHardware({ flashlightOn: !hardware.flashlightOn })}
          wallpaperUrl={currentWallpaper}
        />
      )}
    </HardwareDeviceFrame>
  );
}
