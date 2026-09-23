import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Activity, MapPin, Bot, Layers, LogOut, Laptop, Sparkles, UserCheck, Shield, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'twin', label: 'Digital Farm Twin', icon: Layers },
    { id: 'simulation', label: 'Decision Simulator', icon: Cpu },
    { id: 'dashboard', label: 'Mission Dashboard', icon: Activity },
    { id: 'scan', label: 'Disease Scanner (XAI)', icon: Sprout },
    { id: 'outbreak', label: 'GIS Outbreak Map', icon: MapPin },
    { id: 'agents', label: 'Multi-Agent Mesh', icon: Bot },
  ];


  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin': return '#e74c3c';
      case 'officer': return '#f39c12';
      case 'govt': return '#9b59b6';
      case 'researcher': return '#3498db';
      default: return '#2ecc71';
    }
  };

  return (
    <header className="glass-panel" style={{ margin: '16px 24px', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '16px', zIndex: 1000, borderRadius: '16px', border: '1px solid rgba(46, 204, 113, 0.2)', background: 'rgba(5, 11, 8, 0.85)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
          <Sprout size={26} color="#05140a" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ecf0f1', lineHeight: 1.1 }}>AgriMind OS</h1>
          <span style={{ fontSize: '0.7rem', color: '#2ecc71', fontWeight: 700, letterSpacing: '1px' }}>ENTERPRISE MULTI-AGENT SYSTEM</span>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: isActive ? 'rgba(46, 204, 113, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(46, 204, 113, 0.4)' : '1px solid transparent',
                color: isActive ? '#2ecc71' : '#95a5a6',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 12px', background: '#09150d', borderRadius: '10px', border: '1px solid #1e3a29' }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: '#05140a', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{user?.fullName || 'Agri User'}</div>
            <div style={{ fontSize: '0.7rem', color: getRoleBadgeColor(user?.role), fontWeight: 800, textTransform: 'uppercase' }}>
              {user?.role || 'FARMER'}
            </div>
          </div>
        </div>

        {showProfileMenu && (
          <div style={{ position: 'absolute', right: 0, top: '48px', width: '240px', background: '#09150d', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 2000 }}>
            <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #1e3a29', fontSize: '0.8rem', color: '#95a5a6' }}>
              {user?.email}
            </div>

            <button
              onClick={() => { setShowProfileMenu(false); navigate('/wizard'); }}
              style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: '#ecf0f1', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
            >
              <Sparkles size={16} color="#2ecc71" /> Re-run Setup Wizard
            </button>

            <button
              onClick={() => { setShowProfileMenu(false); navigate('/devices'); }}
              style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: '#ecf0f1', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
            >
              <Laptop size={16} color="#3498db" /> Active Device Sessions
            </button>

            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1e3a29' }}>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ width: '100%', padding: '8px', background: 'rgba(231,76,60,0.15)', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem' }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
