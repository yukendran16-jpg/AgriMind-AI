import React, { useState } from 'react'
import { Upload, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Zap } from 'lucide-react'
import axios from 'axios'

export default function ScanDisease({ setDiagnosisResult, setActiveTab }) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [acreage, setAcreage] = useState(2.5)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0]
    if (uploaded) {
      setFile(uploaded)
      setPreview(URL.createObjectURL(uploaded))
    }
  }

  const handleScanSubmit = async () => {
    if (!file) {
      alert("Please upload or capture a crop leaf image first.")
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('crop', selectedCrop)
    formData.append('acreage', acreage)

    try {
      const res = await axios.post('http://localhost:8000/api/v1/disease/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setDiagnosisResult(res.data)
      setActiveTab('dashboard')
    } catch (err) {
      console.error(err)
      alert("Error processing AI diagnosis. Ensure Python backend is running on port 8000.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '0 32px 40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ecf0f1' }}>Multi-Modal Disease Diagnostic AI</h2>
        <p style={{ color: '#95a5a6', fontSize: '1rem', marginTop: '6px' }}>
          Upload a high-resolution leaf image to trigger computer vision analysis, GradCAM explainability, and multi-agent loss estimation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column - Image Upload Area */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '100%', 
              height: '320px', 
              border: '2px dashed var(--border-glow)', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(0,0,0,0.2)'
            }}
            onClick={() => document.getElementById('imageUploadInput').click()}
          >
            {preview ? (
              <img src={preview} alt="Leaf Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Upload size={48} color="#2ecc71" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Drag & Drop Leaf Photo</h4>
                <p style={{ fontSize: '0.85rem', color: '#95a5a6', marginTop: '4px' }}>Supports PNG, JPG up to 15MB</p>
              </div>
            )}
            <input 
              id="imageUploadInput" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div style={{ width: '100%', marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#bdc3c7', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Target Crop</label>
              <select 
                value={selectedCrop} 
                onChange={(e) => setSelectedCrop(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
              >
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Corn">Corn</option>
                <option value="Rice">Rice (Future)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#bdc3c7', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Farm Acreage (Acres)</label>
              <input 
                type="number" 
                value={acreage} 
                onChange={(e) => setAcreage(parseFloat(e.target.value))} 
                style={{ width: '100%', padding: '10px 14px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleScanSubmit} 
            disabled={loading}
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? <Sparkles className="animate-spin" size={20} /> : <Zap size={20} />}
            {loading ? 'Executing Multi-Agent Reasoning Pipeline...' : 'Run Explainable AI Diagnosis'}
          </button>
        </div>

        {/* Right Column - Explainability Features Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Sparkles color="#f39c12" size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>GradCAM Visual Heatmap</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              Our Computer Vision model never just outputs a text label. It overlays neural layer activation heatmaps directly over the leaf surface, proving exactly why the prediction was made.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <AlertTriangle color="#e74c3c" size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1-30 Day Infection Forecast</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              Dynamic differential growth curves model fungal spore germination based on local humidity, predicting exact foliar infection progression across 30 days.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck color="#2ecc71" size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Precision Dosage Calculation</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              Calculates exact active chemical spray volumes (Liters/Acre) and dilution ratios to eliminate chemical waste and protect ecosystem health.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
