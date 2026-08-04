import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import ScanDisease from '../components/ScanDisease';
import OutbreakMap from '../components/OutbreakMap';
import AgentChat from '../components/AgentChat';
import DigitalTwin from './DigitalTwin';

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('twin');
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, marginTop: '16px' }}>
        {activeTab === 'dashboard' && <Dashboard diagnosisResult={diagnosisResult} setActiveTab={setActiveTab} />}
        {activeTab === 'twin' && <DigitalTwin />}
        {activeTab === 'scan' && <ScanDisease setDiagnosisResult={setDiagnosisResult} setActiveTab={setActiveTab} />}
        {activeTab === 'outbreak' && <OutbreakMap />}
        {activeTab === 'agents' && <AgentChat />}
      </main>

      <footer style={{ padding: '24px', textAlign: 'center', color: '#95a5a6', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        AgriMind AI © 2026 • Enterprise Agricultural Intelligence Engine • Powered by Clean Architecture & Multi-Agent Mesh
      </footer>
    </div>
  );
}
