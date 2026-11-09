export type AppId = 
  | 'phone' 
  | 'camera' 
  | 'messages' 
  | 'browser' 
  | 'files' 
  | 'gallery' 
  | 'music' 
  | 'settings' 
  | 'appstore' 
  | 'terminal' 
  | 'notes' 
  | 'weather' 
  | 'calculator' 
  | 'clock' 
  | 'vitals'
  | 'game';

export interface AppMetadata {
  id: AppId;
  name: string;
  icon: string;
  color: string;
  category: 'core' | 'media' | 'utility' | 'system' | 'productivity' | 'game';
  badge?: number;
  isRemovable?: boolean;
}

export type ViewportMode = 'native_full' | 'chassis_pocket' | 'desktop_windowed';

export interface HardwareState {
  batteryLevel: number; // 0 - 100
  isCharging: boolean;
  isOnline: boolean;
  networkType: '6G / Wi-Fi 7' | '5G Ultra' | 'Offline';
  networkSpeedMbps: number;
  cpuCores: number;
  memoryTotalGb: number;
  memoryUsedMb: number;
  gpuRenderer: string;
  hostPlatform: string;
  hostBrowser: string;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  deviceTiltX: number; // -45 to 45 degrees
  deviceTiltY: number; // -45 to 45 degrees
  geolocationCity: string;
  geolocationCoords: string;
  screenBrightness: number; // 10 - 100
  volumeLevel: number; // 0 - 100
  isMuted: boolean;
  flashlightOn: boolean;
  nightLightOn: boolean;
  airplaneMode: boolean;
  bluetoothOn: boolean;
  locationOn: boolean;
  doNotDisturb: boolean;
  micMutedByHardware: boolean;
  cameraMutedByHardware: boolean;
  deviceOrientation: 'portrait' | 'landscape';
}

export interface OSNotification {
  id: string;
  appId: AppId;
  appName: string;
  title: string;
  body: string;
  time: string;
  avatar?: string;
  isRead?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'image' | 'audio' | 'document' | 'code';
  sizeBytes: number;
  updatedAt: string;
  content?: string;
  dataUrl?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  isFavorite?: boolean;
}

export interface MessageItem {
  id: string;
  contactId: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  days: string[];
  isEnabled: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  coverGradient: string;
  genre: string;
}
