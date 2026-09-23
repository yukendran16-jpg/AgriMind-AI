import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, BarChart2, TrendingUp, ShieldCheck, Activity, Award, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff' }}>Regional Agro-Analytics & Yield Intelligence</h1>
          <p style={{ color: '#95a5a6', fontSize: '0.95rem' }}>Macro-economic crop yield forecasts, disease vector density, and climate resilience tracking.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '10px', color: '#05140a', fontWeight: 800, cursor: 'pointer' }}
        >
          Return to Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <span style={{ fontSize: '0.8rem', color: '#95a5a6', fontWeight: 700 }}>STATEWIDE YIELD PREDICTION</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2ecc71', margin: '8px 0' }}>+14.2%</div>
          <span style={{ fontSize: '0.75rem', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> 4.2 Tons / Hectare Average
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <span style={{ fontSize: '0.8rem', color: '#95a5a6', fontWeight: 700 }}>DISEASE SUPPRESSION INDEX</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3498db', margin: '8px 0' }}>91.6%</div>
          <span style={{ fontSize: '0.75rem', color: '#3498db', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Early Intervention Successful
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <span style={{ fontSize: '0.8rem', color: '#95a5a6', fontWeight: 700 }}>WATER EFFICIENCY GAIN</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f39c12', margin: '8px 0' }}>-22.5%</div>
          <span style={{ fontSize: '0.75rem', color: '#f39c12', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDownRight size={14} /> Reduced Runoff Waste
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <span style={{ fontSize: '0.8rem', color: '#95a5a6', fontWeight: 700 }}>SAVED REVENUE ESTIMATE</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2ecc71', margin: '8px 0' }}>$14,820</div>
          <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>Across 15.0 Cultivated Acres</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div className="glass-panel" style={{ padding: '28px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: '#2ecc71' }}>Annual Yield & Protection Trends</h3>
          <div style={{ height: '260px', display: 'flex', alignItems: 'flex-end', gap: '24px', borderBottom: '1px solid #1e3a29', paddingBottom: '12px' }}>
            {[
              { year: '2022', yield: 60 },
              { year: '2023', yield: 72 },
              { year: '2024', yield: 84 },
              { year: '2025', yield: 91 },
              { year: '2026 (AI)', yield: 98 }
            ].map((d) => (
              <div key={d.year} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: `${d.yield * 2.2}px`, background: 'linear-gradient(180deg, #2ecc71, #27ae60)', borderRadius: '8px 8px 0 0', transition: 'height 0.5s' }} />
                <span style={{ fontSize: '0.8rem', color: '#bdc3c7', display: 'block', marginTop: '8px', fontWeight: 700 }}>{d.year}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '28px', background: '#09150d', border: '1px solid #1e3a29' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: '#3498db' }}>Pathogen Risk Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tomato Early Blight</span>
              <span style={{ fontWeight: 800, color: '#f39c12' }}>42.5% Risk</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Potato Late Blight</span>
              <span style={{ fontWeight: 800, color: '#e74c3c' }}>28.0% Risk</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Corn Leaf Blight</span>
              <span style={{ fontWeight: 800, color: '#2ecc71' }}>14.2% Risk</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Chilli Leaf Curl Virus</span>
              <span style={{ fontWeight: 800, color: '#2ecc71' }}>9.1% Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
