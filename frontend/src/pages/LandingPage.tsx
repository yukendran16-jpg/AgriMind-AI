import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ShieldCheck, Cpu, ArrowRight, Activity, Users, Award, LineChart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #0d2116 0%, #050b08 100%)', color: '#fff', overflowX: 'hidden' }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid rgba(46, 204, 113, 0.15)', backdropFilter: 'blur(10px)', background: 'rgba(5, 11, 8, 0.8)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(46,204,113,0.4)' }}>
            <Sprout size={26} color="#05140a" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff, #2ecc71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AgriMind AI
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#2ecc71', fontWeight: 700, letterSpacing: '2px' }}>ENTERPRISE EDITION</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '8px', color: '#05140a', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Go to Dashboard ({user?.role?.toUpperCase()}) <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1e3a29', borderRadius: '8px', color: '#2ecc71', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '8px', color: '#05140a', fontWeight: 800, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', color: '#2ecc71', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px' }}>
          <Cpu size={16} /> Enterprise Multi-Role Agricultural Operating System
        </div>

        <h1 style={{ fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', background: 'linear-gradient(180deg, #ffffff 0%, #bdc3c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Predict. Explain. Prevent. Optimize.
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#95a5a6', maxWidth: '760px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          Next-Generation Agricultural AI Platform with Role-Based Governance, Multi-Step Farm Setup, Real-Time Geo-Intelligence, and Enterprise Security.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', border: 'none', borderRadius: '12px', color: '#05140a', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 30px rgba(46,204,113,0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            Get Started Now <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '16px 32px', background: 'rgba(18, 26, 22, 0.8)', border: '1px solid #1e3a29', borderRadius: '12px', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Enterprise Login
          </button>
        </div>
      </section>

      {/* Role-Based Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '36px', color: '#2ecc71' }}>
          Tailored Workspaces for Every Role
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { role: 'Farmer', desc: 'Digital twin crop simulation, instant leaf lesion diagnosis, local mandi prices, and task schedules.', icon: Sprout },
            { role: 'Agricultural Officer', desc: 'District risk heatmaps, field advisory publishing, outbreak alerts, and farm inspection queues.', icon: Activity },
            { role: 'Government Officer', desc: 'Statewide yield prediction, drought risk assessment, subsidy policy management, and food security audits.', icon: Award },
            { role: 'Researcher', desc: 'Raw agro-sensor time series data, model benchmarking, custom vision dataset access, and peer validation.', icon: LineChart },
            { role: 'Administrator', desc: 'User RBAC control, session revocation, security logs, Argon2 parameter policy, and API key limits.', icon: ShieldCheck },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.role}
                className="glass-panel"
                style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(46, 204, 113, 0.15)', background: 'rgba(18, 26, 22, 0.7)', transition: 'transform 0.2s' }}
              >
                <div style={{ background: 'rgba(46, 204, 113, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <IconComponent size={24} color="#2ecc71" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{item.role}</h3>
                <p style={{ fontSize: '0.85rem', color: '#95a5a6', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
