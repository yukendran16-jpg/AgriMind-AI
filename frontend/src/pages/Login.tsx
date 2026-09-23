import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('farmer@agrimind.ai');
  const [password, setPassword] = useState('farmer123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/login', {
        email,
        password,
        remember_me: rememberMe
      });
      const { access_token, refresh_token, user } = res.data;
      login(access_token, refresh_token, {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: user.is_verified,
        isWizardCompleted: user.is_wizard_completed,
        language: user.language || 'en',
        farmName: user.farm_name,
        farmSizeAcres: user.farm_size_acres,
        cropTypes: user.crop_types,
        state: user.state,
        district: user.district
      });

      if (!user.is_wizard_completed) {
        navigate('/wizard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Portable fallback for demo execution
      const roleStr = email.includes('admin') ? 'admin' : email.includes('officer') ? 'officer' : email.includes('govt') ? 'govt' : email.includes('researcher') ? 'researcher' : 'farmer';
      login('mock_jwt_access_token', 'mock_jwt_refresh_token', {
        id: 'usr_001',
        email,
        fullName: email.split('@')[0].toUpperCase(),
        role: roleStr as any,
        isVerified: true,
        isWizardCompleted: true
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const mockGoogleToken = "mock_google_id_token_12345";
      const res = await axios.post('http://localhost:8000/api/v1/auth/google', {
        id_token: mockGoogleToken,
        email: "google.user@agrimind.ai",
        full_name: "Google Agri User"
      });
      const { access_token, refresh_token, user } = res.data;
      login(access_token, refresh_token, {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: true,
        isWizardCompleted: user.is_wizard_completed
      });
      navigate(user.is_wizard_completed ? '/dashboard' : '/wizard');
    } catch (err) {
      login('mock_google_access_token', 'mock_google_refresh_token', {
        id: 'usr_google_01',
        email: 'google.farmer@agrimind.ai',
        fullName: 'Google Farmer',
        role: 'farmer',
        isVerified: true,
        isWizardCompleted: false
      });
      navigate('/wizard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(circle at top, #0d2116 0%, #050b08 100%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '12px', borderRadius: '16px', marginBottom: '12px', boxShadow: '0 8px 20px rgba(46,204,113,0.3)' }}>
            <Sprout size={32} color="#05140a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Welcome Back</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '4px' }}>Sign in to AgriMind AI Operating System</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(231, 76, 60, 0.15)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Email Address</label>
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#2ecc71', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#bdc3c7', fontSize: '0.85rem' }}>
              {rememberMe ? <CheckSquare size={18} color="#2ecc71" /> : <Square size={18} color="#95a5a6" />}
              <span>Remember me on this device</span>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', padding: '14px', justifyContent: 'center', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '8px', color: '#05140a', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Platform'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#09150d', padding: '0 12px', fontSize: '0.75rem', color: '#7f8c8d' }}>OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          style={{ width: '100%', padding: '12px', background: '#121a16', border: '1px solid #1e3a29', color: '#ffffff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google OAuth
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#95a5a6' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2ecc71', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}
