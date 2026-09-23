export type UserRole = 'farmer' | 'officer' | 'govt' | 'researcher' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  isVerified: boolean;
  isWizardCompleted: boolean;
  avatarUrl?: string;
  language?: string;
  address?: string;
  state?: string;
  district?: string;
  village?: string;
  farmName?: string;
  farmSizeAcres?: number;
  cropTypes?: string[];
  latitude?: number;
  longitude?: number;
  notificationPreferences?: Record<string, boolean>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DeviceSession {
  id: string;
  device_name: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  country?: string;
  login_time: string;
  last_active: string;
  is_current: boolean;
}

export interface WizardData {
  step1: {
    fullName: string;
    phoneNumber?: string;
    language: string;
  };
  step2: {
    farmName: string;
    farmSizeAcres: number;
    address: string;
    state: string;
    district: string;
    village?: string;
  };
  step3: {
    cropTypes: string[];
  };
  step4: {
    latitude?: number;
    longitude?: number;
  };
  step5: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pestWarnings: boolean;
    weatherUpdates: boolean;
    marketPrices: boolean;
  };
}
