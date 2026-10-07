import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

export default function OTPVerify() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp_input_${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      if (user) {
        updateUser({ ...user, isVerified: true });
      }
      setVerifying(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '14px', borderRadius: '16px', marginBottom: '16px' }}>
          <ShieldCheck size={36} color="#05140a" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Two-Factor Verification</h2>
        <p style={{ color: '#95a5a6', fontSize: '0.85rem', marginTop: '6px', marginBottom: '24px' }}>
          Enter 4-digit verification code sent to <strong>{user?.email || 'your device'}</strong>
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp_input_${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                style={{
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  background: '#121a16',
                  border: '1px solid var(--border-color)',
                  color: '#2ecc71',
                  borderRadius: '12px'
                }}
              />
            ))}
          </div>

          <button className="btn-primary" type="submit" disabled={verifying || otp.some(d => !d)} style={{ padding: '14px', justifyContent: 'center' }}>
            {verifying ? 'Verifying Code...' : 'Complete Account Setup'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: '#95a5a6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          Didn't receive code? <span style={{ color: '#2ecc71', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><RotateCcw size={12} /> Resend OTP</span>
        </div>
      </div>
    </div>
  );
}
