
export type UserRole = 'admin' | 'user';

export type Rarity = 'Common' | 'Rare' | 'Legendary';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  status: 'active' | 'banned';
  avatar?: string;
  createdAt: number;
}

export interface GearSet {
  id: string;
  userId: string;
  name: string;
  rod: string;
  reel?: string;
  line: string;
  hook: string;
}

export interface FishingSpot {
  id: string;
  userId: string;
  name: string;
  type: string;
}

export interface ExifData {
  pressure: number; // hPa
  tide: string; // e.g., 'Low', 'High', 'Ebbing'
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface FishRecord {
  id: string;
  userId: string;
  species: string;
  length: number; // cm
  weight: number; // kg
  rarity: Rarity;
  imageUrl?: string;
  exifData: ExifData;
  // Reference Layer
  gearSetId: string;
  gearSetName: string; 
  spotId: string;
  spotName: string; 
  // Snapshot Layer
  gearSnapshot: {
    rod: string;
    reel?: string;
    line: string;
    hook: string;
  };
  tags: string[];
  note: string;
  manualWeather?: string; // For backfill mode
  timestamp: number;
}

export interface SystemMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: number;
  isRead: boolean;
}

export enum AppEvent {
  RECORD_ADDED = 'RECORD_ADDED',
  NEW_SYSTEM_MSG = 'NEW_SYSTEM_MSG',
  AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED'
}
