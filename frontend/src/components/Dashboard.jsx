import React, { useState } from 'react'
import { Sparkles, Eye, TrendingUp, DollarSign, Droplet, ShieldAlert, CheckCircle } from 'lucide-react'

export default function Dashboard({ diagnosisResult }) {
  const [showHeatmap, setShowHeatmap] = useState(true)

  if (!diagnosisResult) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }} className="glass-panel">
        <Sparkles size={48} color="#2ecc71" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>No Active Scan Selected</h3>
        <p style={{ color: '#95a5a6', margin: '12px 0 24px 0' }}>
          Run an AI diagnostic scan or upload a crop leaf image to unlock explainable heatmaps, progression curves, and precision spray calculations.
        </p>
      </div>
    )
  }

  const { crop, disease_detected, confidence, severity_percentage, severity_level, gradcam_heatmap_url, symptoms, yield_loss_projection, treatment_recommendations, progression } = diagnosisResult

  return (
    <div style={{ padding: '0 32px 40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Overview */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge badge-${severity_level.toLowerCase()}`}>{severity_level} Severity</span>
            <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>Confidence: {(confidence * 100).toFixed(1)}%</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ecf0f1', marginTop: '6px' }}>{disease_detected}</h2>
          <p style={{ color: '#2ecc71', fontSize: '0.95rem', fontWeight: 600 }}>Target Crop: {crop}</p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Infection Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e74c3c' }}>{severity_percentage}%</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Financial Risk</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f39c12' }}>${yield_loss_projection.financial_risk_usd}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Left Column: GradCAM Explainability & Progression */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* GradCAM Heatmap Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye color="#2ecc71" size={22} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>GradCAM Explainability Overlay</h3>
              </div>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)} 
                style={{ background: 'rgba(46,204,113,0.15)', border: '1px solid #2ecc71', color: '#2ecc71', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
              >
                {showHeatmap ? 'Show Raw Photo' : 'Show GradCAM Heatmap'}
              </button>
            </div>
            <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={showHeatmap ? gradcam_heatmap_url : 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23d81?auto=format&fit=crop&w=800&q=80'} 
                alt="Diagnosis Visual" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#95a5a6', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <strong>AI Rationale:</strong> Red/Yellow hot zones highlight maximum layer activation points corresponding to concentric ring leaf lesions.
            </div>
          </div>

          {/* Progression Table & Forecast */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <TrendingUp color="#3498db" size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1-30 Day Disease Progression Curve</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#95a5a6', fontSize: '0.85rem' }}>
                  <th style={{ padding: '10px' }}>Timeline</th>
                  <th style={{ padding: '10px' }}>Projected Severity</th>
                  <th style={{ padding: '10px' }}>Expected Loss %</th>
                </tr>
              </thead>
              <tbody>
                {progression.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>Day {item.day}</td>
                    <td style={{ padding: '10px', color: item.severity > 50 ? '#e74c3c' : '#f39c12' }}>{item.severity}%</td>
                    <td style={{ padding: '10px', color: '#e74c3c', fontWeight: 700 }}>{item.expected_yield_loss}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Treatment & Spray Math */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Precision Spray Calculator Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Droplet color="#f39c12" size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Precision Spray Dosage Calculator</h3>
            </div>
            <div style={{ background: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.3)', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#f39c12', fontWeight: 700 }}>Chemical Active Volume</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ecf0f1' }}>
                {treatment_recommendations.precision_spray.spray_quantity_liters} Liters
              </div>
              <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '4px' }}>
                Mix in {treatment_recommendations.precision_spray.dilution_water_liters}L clean water. {treatment_recommendations.precision_spray.timing}
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#2ecc71', marginBottom: '12px' }}>Organic & Bio-Control</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '20px' }}>
              {treatment_recommendations.organic_treatment.map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', marginBottom: '8px', color: '#bdc3c7' }}>
                  <CheckCircle size={16} color="#2ecc71" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {t}
                </li>
              ))}
            </ul>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#e74c3c', marginBottom: '12px' }}>Chemical Controls</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {treatment_recommendations.chemical_treatment.map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', marginBottom: '8px', color: '#bdc3c7' }}>
                  <CheckCircle size={16} color="#e74c3c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
