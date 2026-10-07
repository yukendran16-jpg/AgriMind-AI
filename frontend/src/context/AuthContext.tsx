import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DeviceSession } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('agrimind_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'usr_farmer_01',
      email: 'farmer@agrimind.ai',
      fullName: 'Ramesh Patel',
      role: 'farmer',
      isVerified: true,
      isWizardCompleted: true,
      language: 'en',
      farmName: 'Green Valley Farms',
      farmSizeAcres: 12.5,
      cropTypes: ['Tomato', 'Cotton', 'Wheat'],
      state: 'Gujarat',
      district: 'Anand',
      village: 'Vasna'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agrimind_token') || 'mock_jwt_access_token_production';
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('agrimind_refresh_token') || 'mock_jwt_refresh_token_production';
  });

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
    localStorage.setItem('agrimind_token', newToken);
    localStorage.setItem('agrimind_refresh_token', newRefreshToken);
    localStorage.setItem('agrimind_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('agrimind_token');
    localStorage.removeItem('agrimind_refresh_token');
    localStorage.removeItem('agrimind_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('agrimind_user', JSON.stringify(updated));
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, isAuthenticated: !!token, login, logout, updateUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
