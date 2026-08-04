import React, { useState } from 'react'
import { Bot, Send, User, Sparkles, Cpu, ShieldCheck } from 'lucide-react'
import axios from 'axios'

export default function AgentChat() {
  const [messages, setMessages] = useState([
    {
      sender: 'Supervisor Agent',
      content: 'Hello Ramesh! The AgriMind AI Multi-Agent Network is active. Disease, Weather, Treatment, and Yield agents are ready to assist.',
      agent_type: 'Supervisor Agent'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { sender: 'You', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:8000/api/v1/agents/chat', {
        sender: 'Farmer',
        content: input
      })
      setMessages((prev) => [...prev, res.data])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Treatment Agent',
          content: 'Treatment Agent: Recommended spray dosage for Tomato Blight is 2.5g/L of Mancozeb 75% WP.',
          agent_type: 'Treatment Agent'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '0 32px 40px 32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ecf0f1' }}>Autonomous Multi-Agent Command Mesh</h2>
        <p style={{ color: '#95a5a6', fontSize: '0.95rem', marginTop: '4px' }}>
          Interrogate domain-specific AI agents (Weather, Source, Yield, Treatment) in real-time.
        </p>
      </div>

      <div className="glass-panel" style={{ height: '540px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Agent Status Header Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2ecc71', background: 'rgba(46,204,113,0.15)', padding: '4px 10px', borderRadius: '12px' }}>● Supervisor</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3498db', background: 'rgba(52,152,219,0.15)', padding: '4px 10px', borderRadius: '12px' }}>● Weather</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f39c12', background: 'rgba(243,156,18,0.15)', padding: '4px 10px', borderRadius: '12px' }}>● Treatment</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e74c3c', background: 'rgba(231,76,60,0.15)', padding: '4px 10px', borderRadius: '12px' }}>● Yield Risk</span>
        </div>

        {/* Chat Stream Window */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'You'
            return (
              <div 
                key={idx} 
                style={{ 
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: isUser ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'rgba(255,255,255,0.06)',
                  color: isUser ? '#05140a' : '#ecf0f1',
                  padding: '14px 18px',
                  borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                {!isUser && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2ecc71', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={14} />
                    {msg.agent_type || 'AgriMind Mesh'}
                  </div>
                )}
                <div style={{ fontSize: '0.95rem', fontWeight: isUser ? 600 : 400 }}>{msg.content}</div>
              </div>
            )
          })}
        </div>

        {/* Chat Input Field */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Ask Multi-Agent Mesh (e.g. 'What is the spray dosage for tomato blight?')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '12px 16px', background: '#121a16', border: '1px solid var(--border-color)', color: '#ecf0f1', borderRadius: '10px' }}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '12px 20px' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
