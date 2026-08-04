import React from 'react'
import { Sprout, Activity, MapPin, Bot, Settings, ShieldAlert } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'scan', label: 'Disease Scanner (XAI)', icon: Sprout },
    { id: 'outbreak', label: 'GIS Outbreak Map', icon: MapPin },
    { id: 'agents', label: 'Multi-Agent Mesh', icon: Bot },
  ]

  return (
    <header className="glass-panel" style={{ margin: '16px 24px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '16px', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
          <Sprout size={28} color="#05140a" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ecf0f1', lineHeight: 1.1 }}>AgriMind AI</h1>
          <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 600, letterSpacing: '0.05em' }}>PREDICT. EXPLAIN. PREVENT. OPTIMIZE.</span>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: isActive ? 'rgba(46, 204, 113, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(46, 204, 113, 0.4)' : '1px solid transparent',
                color: isActive ? '#2ecc71' : '#95a5a6',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ramesh Patel</div>
          <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Lead Farmer • Kheda</div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3498db, #2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
          RP
        </div>
      </div>
    </header>
  )
}
