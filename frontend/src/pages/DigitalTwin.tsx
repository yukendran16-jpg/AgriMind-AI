import React, { useState } from 'react';
import { 
  Layers, MapPin, Activity, Cpu, CloudRain, Sun, AlertTriangle, 
  CheckCircle2, RefreshCw, Eye, ShieldCheck, Play, Pause, FastForward
} from 'lucide-react';

export default function DigitalTwin() {
  const [activeLayer, setActiveLayer] = useState<'health' | 'disease' | 'weather' | 'risk'>('health');
  const [selectedPlot, setSelectedPlot] = useState<string>('plot_b');
  const [timelineDay, setTimelineDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const plotsData = [
    { id: 'plot_a', name: 'Plot A - Tomato (Hybrid)', area: '1.2 Hectares', healthScore: 94, status: 'Optimal', risk: 'Low', pathogen: 'None Detected' },
    { id: 'plot_b', name: 'Plot B - Tomato (Roma)', area: '0.8 Hectares', healthScore: 71, status: 'Infected', risk: 'High', pathogen: 'Early Blight (34.2%)' },
    { id: 'plot_c', name: 'Plot C - Potato (Kufri)', area: '1.5 Hectares', healthScore: 98, status: 'Optimal', risk: 'Low', pathogen: 'None Detected' },
  ];

  const currentPlot = plotsData.find(p => p.id === selectedPlot) || plotsData[1];

  return (
    <div style={{ padding: '0 32px 40px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-low">● REAL-TIME IOT TELEMETRY ACTIVE</span>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>GPS: 22.7500° N, 72.6833° E</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ecf0f1', marginTop: '6px' }}>Digital Farm Twin OS</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.95rem' }}>Multi-layer spatial simulation & plant lifecycle health tracker</p>
        </div>

        {/* Layer Selector Bar */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'health', label: 'NDVI Health', icon: Activity },
            { id: 'disease', label: 'Disease Vectors', icon: AlertTriangle },
            { id: 'weather', label: 'Weather Overlay', icon: CloudRain },
            { id: 'risk', label: 'Risk Heatmap', icon: Layers }
          ].map(layer => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                style={{
                  background: isActive ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
                  border: isActive ? '1px solid #2ecc71' : '1px solid transparent',
                  color: isActive ? '#2ecc71' : '#95a5a6',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} /> {layer.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas & Side Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '28px' }}>
        {/* Left Column: Interactive GIS Digital Twin Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ height: '480px', padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'radial-gradient(circle at center, #12241a 0%, #0a0f0d 100%)' }}>
            {/* Grid Mesh Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#2ecc71 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Top Canvas Controls */}
            <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2ecc71', background: 'rgba(46,204,113,0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid #2ecc71' }}>
                Active Layer: <span style={{ textTransform: 'uppercase' }}>{activeLayer}</span>
              </span>
              <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Field Resolution: 0.5m / pixel</div>
            </div>

            {/* Interactive Plots Simulation Render */}
            <div style={{ zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: 'auto 0' }}>
              {plotsData.map(plot => {
                const isSelected = selectedPlot === plot.id;
                let borderColor = '#2ecc71';
                let bgGradient = 'rgba(46, 204, 113, 0.1)';

                if (activeLayer === 'disease' && plot.status === 'Infected') {
                  borderColor = '#e74c3c';
                  bgGradient = 'rgba(231, 76, 60, 0.25)';
                } else if (activeLayer === 'risk' && plot.risk === 'High') {
                  borderColor = '#f39c12';
                  bgGradient = 'rgba(243, 156, 18, 0.2)';
                }

                return (
                  <div
                    key={plot.id}
                    onClick={() => setSelectedPlot(plot.id)}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      background: isSelected ? bgGradient : 'rgba(0,0,0,0.4)',
                      border: isSelected ? `2px solid ${borderColor}` : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ecf0f1' }}>{plot.name.split('-')[0]}</span>
                      <span className={`badge badge-${plot.risk === 'High' ? 'high' : 'low'}`}>{plot.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Area: {plot.area}</div>
                    <div style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: 800, color: borderColor }}>
                      Health: {plot.healthScore}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Animated Lifecycle Timeline Scrubber */}
            <div style={{ zIndex: 2, background: 'rgba(0,0,0,0.5)', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#bdc3c7' }}>Lifecycle Simulation Timeline: Day +{timelineDay}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'transparent', border: 'none', color: '#2ecc71', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button onClick={() => setTimelineDay((timelineDay + 5) % 35)} style={{ background: 'transparent', border: 'none', color: '#95a5a6', cursor: 'pointer' }}>
                    <FastForward size={18} />
                  </button>
                </div>
              </div>
              <input 
                type="range" 
                min={0} 
                max={30} 
                value={timelineDay} 
                onChange={(e) => setTimelineDay(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#2ecc71' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Selected Plot Telemetry & Plant Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: '#ecf0f1' }}>Plot Telemetry Inspector</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Active Crop Variety</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2ecc71' }}>{currentPlot.name}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Pathogen Status</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: currentPlot.risk === 'High' ? '#e74c3c' : '#2ecc71' }}>
                  {currentPlot.pathogen}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Soil Nitrogen & Moisture</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ecf0f1' }}>N: 42 mg/kg • Moisture: 68%</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Satellite NDVI Stress Index</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#3498db' }}>0.74 (Optimal Canopy)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
