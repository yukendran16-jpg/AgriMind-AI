import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '12px', borderRadius: '16px', marginBottom: '12px' }}>
            <Sprout size={32} color="#05140a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Reset Password</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '4px' }}>We'll send password recovery instructions</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Check Your Email</h4>
            <p style={{ color: '#95a5a6', fontSize: '0.85rem', marginBottom: '24px' }}>
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center' }}>
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Registered Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agrimind.ai"
                  style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '14px', justifyContent: 'center' }}>
              {loading ? 'Sending Request...' : 'Send Reset Instructions'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#95a5a6' }}>
          Remember your password? <Link to="/login" style={{ color: '#2ecc71', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
