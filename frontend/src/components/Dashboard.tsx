import React, { useState } from 'react';
import { 
  Heart, Sun, CloudRain, Wind, AlertTriangle, ShieldCheck, 
  TrendingUp, Calendar, Upload, Sparkles, MapPin, CheckCircle2, 
  ArrowUpRight, Cpu, Layers, Eye
} from 'lucide-react';

interface DashboardProps {
  diagnosisResult?: any;
  setActiveTab?: (tab: string) => void;
}

export default function Dashboard({ diagnosisResult, setActiveTab }: DashboardProps) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Apply Mancozeb 75% WP spray on Plot B (Tomato)', time: '07:30 AM', completed: false, tag: 'Treatment' },
    { id: 2, text: 'Calibrate IoT soil moisture sensor probe #4', time: '11:00 AM', completed: true, tag: 'IoT' },
    { id: 3, text: 'Check lower foliage canopy for chlorotic halos', time: '04:00 PM', completed: false, tag: 'Inspection' }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div style={{ padding: '0 32px 40px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Banner Executive AI OS Briefing */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(18, 28, 22, 0.8) 0%, rgba(10, 15, 13, 0.95) 100%)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '1px solid #2ecc71', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '12px' }}>
              ● LIVE DIGITAL TWIN SYNCED
            </span>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>Kheda District • Field Plot B</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ecf0f1', marginTop: '6px' }}>AgriMind OS Mission Control</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.95rem' }}>AI Supervisor: Weather risk is CRITICAL. Rain expected in 48 hours.</p>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => setActiveTab && setActiveTab('scan')} 
          style={{ padding: '14px 24px', fontSize: '0.95rem' }}
        >
          <Upload size={20} /> Quick Leaf Scan (XAI)
        </button>
      </div>

      {/* Animated KPI Score Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {/* Farm Health Score KPI */}
        <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6', fontWeight: 600 }}>Farm Health Index</span>
            <Heart color="#2ecc71" size={22} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2ecc71', margin: '8px 0' }}>88.4 / 100</div>
          <div style={{ fontSize: '0.75rem', color: '#95a5a6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} color="#2ecc71" /> +3.2% vs last week (Optimal)
          </div>
        </div>

        {/* Today Weather Intelligence KPI */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6', fontWeight: 600 }}>Weather Intelligence</span>
            <CloudRain color="#3498db" size={22} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ecf0f1', margin: '8px 0' }}>27.4°C</div>
          <div style={{ fontSize: '0.75rem', color: '#3498db', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>84% Humidity</span> • <span>Wind: 14 km/h</span>
          </div>
        </div>

        {/* Disease Risk Level KPI */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6', fontWeight: 600 }}>Fungal Pathogen Risk</span>
            <AlertTriangle color="#f39c12" size={22} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f39c12', margin: '8px 0' }}>HIGH</div>
          <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>High moisture accelerates spore germination</div>
        </div>

        {/* Expected Yield Forecast KPI */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6', fontWeight: 600 }}>Yield Protection</span>
            <TrendingUp color="#2ecc71" size={22} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ecf0f1', margin: '8px 0' }}>94.8%</div>
          <div style={{ fontSize: '0.75rem', color: '#2ecc71' }}>Expected Revenue Saved: $2,840</div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Left Column: Digital Twin & AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Digital Twin Interactive Map Preview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers color="#2ecc71" size={22} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Digital Twin Plot Layers</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-low">Plot A: Healthy</span>
                <span className="badge badge-medium">Plot B: Monitor</span>
              </div>
            </div>
            <div style={{ width: '100%', height: '280px', borderRadius: '12px', background: 'radial-gradient(circle at center, #162a1f 0%, #0a0f0d 100%)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(#2ecc71 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <Cpu size={40} color="#2ecc71" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Interactive Field GIS Coordinates</div>
                <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Latitude: 22.7500 N • Longitude: 72.6833 E</div>
              </div>
            </div>
          </div>

          {/* AI Supervisor Recommendations Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles color="#f39c12" size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Supervisor AI Precision Strategy</h3>
            </div>
            <div style={{ background: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.3)', padding: '18px', borderRadius: '12px', marginBottom: '16px' }}>
              <h4 style={{ color: '#f39c12', fontSize: '1rem', fontWeight: 700 }}>Action Required: Fungicide Spray Before Friday Rain</h4>
              <p style={{ fontSize: '0.85rem', color: '#bdc3c7', marginTop: '6px' }}>
                Based on humidity levels (84%) and 42 nearby tomato blight reports in Kheda, apply Mancozeb 75% WP @ 2.5g/L immediately.
              </p>
            </div>
          </div>

          {/* Recent Diagnostics History */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Recent Scan Telemetry</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#95a5a6', fontSize: '0.85rem' }}>
                  <th style={{ padding: '10px' }}>Target Crop</th>
                  <th style={{ padding: '10px' }}>Diagnosis</th>
                  <th style={{ padding: '10px' }}>Severity %</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>Tomato</td>
                  <td style={{ padding: '10px', color: '#ecf0f1' }}>Early Blight</td>
                  <td style={{ padding: '10px', color: '#f39c12', fontWeight: 700 }}>34.2%</td>
                  <td style={{ padding: '10px' }}><span className="badge badge-medium">Action Pending</span></td>
                </tr>
                <tr style={{ fontSize: '0.9rem' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>Potato</td>
                  <td style={{ padding: '10px', color: '#ecf0f1' }}>Healthy Canopy</td>
                  <td style={{ padding: '10px', color: '#2ecc71', fontWeight: 700 }}>0.0%</td>
                  <td style={{ padding: '10px' }}><span className="badge badge-low">Verified</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Today's Tasks */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Calendar color="#2ecc71" size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Today's Agronomic Tasks</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: '10px', 
                    background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.3)', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <CheckCircle2 size={18} color={task.completed ? '#2ecc71' : '#95a5a6'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#95a5a6' : '#ecf0f1' }}>
                      {task.text}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#95a5a6', marginTop: '2px' }}>{task.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Outbreak Alert Widget */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin color="#e74c3c" size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Regional Outbreak Alert</h3>
            </div>
            <div style={{ background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-high">High Alert</span>
                <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>12 km Radius</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ecf0f1', marginTop: '8px' }}>Tomato Early Blight Density</h4>
              <p style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '4px' }}>
                42 confirmed cases reported in Kheda District within the last 48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
