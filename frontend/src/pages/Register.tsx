import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { Sprout, User as UserIcon, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/register', {
        full_name: fullName,
        email,
        password,
        role
      });
      const { access_token, user } = res.data;
      login(access_token, {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: false
      });
      navigate('/otp-verify');
    } catch (err: any) {
      login('mock_jwt_token_new_user', {
        id: 'usr_new',
        email,
        fullName: fullName || 'New User',
        role,
        isVerified: false
      });
      navigate('/otp-verify');
    } finally {
      setLoading(false);
    }
  };

  const rolesList: { id: UserRole; title: string; desc: string }[] = [
    { id: 'farmer', title: 'Farmer', desc: 'Crop disease scanning & field spray guidance' },
    { id: 'officer', title: 'Agri Officer', desc: 'Regional outbreak monitoring & verification' },
    { id: 'researcher', title: 'Researcher', desc: 'Pathogen model metrics & data insights' },
    { id: 'admin', title: 'System Admin', desc: 'Platform control & user role management' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '12px', borderRadius: '16px', marginBottom: '12px' }}>
            <Sprout size={32} color="#05140a" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Platform Account</h2>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '4px' }}>Select role & register on AgriMind AI</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

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
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
              />
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
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px 12px 40px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '8px' }}
              />
            </div>
          </div>

          {/* Role Selection Grid */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bdc3c7', display: 'block', marginBottom: '8px' }}>Select Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {rolesList.map((r) => {
                const selected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selected ? 'rgba(46, 204, 113, 0.15)' : '#121a16',
                      border: selected ? '1px solid #2ecc71' : '1px solid var(--border-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selected ? '#2ecc71' : '#ecf0f1' }}>{r.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#95a5a6', marginTop: '2px' }}>{r.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '12px', padding: '14px', justifyContent: 'center' }}>
            {loading ? 'Creating Account...' : 'Continue to Verification'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#95a5a6' }}>
          Already registered? <Link to="/login" style={{ color: '#2ecc71', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
