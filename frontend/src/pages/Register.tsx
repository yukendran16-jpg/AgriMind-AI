import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { UserRole } from '../types/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/register', {
        email,
        password,
        full_name: fullName,
        phone_number: phoneNumber,
        role
      });
      const { access_token, refresh_token, user } = res.data;
      login(access_token, refresh_token, {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: user.is_verified,
        isWizardCompleted: false
      });
      navigate('/wizard');
    } catch (err: any) {
      // Portable demo fallback
      login('mock_access_token_reg', 'mock_refresh_token_reg', {
        id: `usr_${Date.now()}`,
        email: email || 'new.user@agrimind.ai',
        fullName: fullName || 'New Agri User',
        role: role,
        phoneNumber: phoneNumber || '+91 9876543210',
        isVerified: false,
        isWizardCompleted: false
      });
      navigate('/wizard');
    } finally {
      setLoading(false);
    }
  };

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'farmer', title: 'Farmer', desc: 'Crop digital twin, pest diagnosis, yield advice' },
    { role: 'officer', title: 'Agri Officer', desc: 'District health tracking & field advisories' },
    { role: 'govt', title: 'Govt Officer', desc: 'Regional crop statistics & subsidy policies' },
    { role: 'researcher', title: 'Researcher', desc: 'Agro datasets & AI model evaluation' },
    { role: 'admin', title: 'Administrator', desc: 'System management & security control' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(circle at top, #0d2116 0%, #050b08 100%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '36px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '12px', borderRadius: '16px', marginBottom: '12px' }}>
            <Sprout size={32} color="#05140a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Create Enterprise Account</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '4px' }}>Join the AgriMind AI Ecosystem</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(231, 76, 60, 0.15)', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Patel"
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@agrimind.ai"
                  style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#95a5a6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid #1e3a29', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '8px' }}>Select Platform Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              {rolesList.map((r) => (
                <div
                  key={r.role}
                  onClick={() => setRole(r.role)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === r.role ? '2px solid #2ecc71' : '1px solid #1e3a29',
                    background: role === r.role ? 'rgba(46, 204, 113, 0.12)' : '#121a16',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: role === r.role ? '#2ecc71' : '#ffffff' }}>{r.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#95a5a6', marginTop: '2px', lineHeight: 1.2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', padding: '14px', justifyContent: 'center', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '8px', color: '#05140a', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Creating Account...' : 'Continue to First Login Setup'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#95a5a6' }}>
          Already registered? <Link to="/login" style={{ color: '#2ecc71', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
