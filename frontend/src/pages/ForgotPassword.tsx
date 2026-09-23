import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('farmer@agrimind.ai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8000/api/v1/auth/forgot-password', { email });
    } catch (err) {
      console.warn("Backend offline, using fallback OTP...");
    } finally {
      setLoading(false);
      navigate('/reset-password', { state: { email } });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(circle at top, #0d2116 0%, #050b08 100%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '12px', borderRadius: '16px', marginBottom: '12px' }}>
            <Sprout size={32} color="#05140a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Forgot Password</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '4px' }}>Enter your email to receive a 6-digit OTP verification code</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(231, 76, 60, 0.15)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Registered Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agrimind.ai"
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '14px', justifyContent: 'center', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', color: '#05140a', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Generating Code...' : 'Send Verification OTP'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#95a5a6' }}>
          Remember your password? <Link to="/login" style={{ color: '#2ecc71', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
