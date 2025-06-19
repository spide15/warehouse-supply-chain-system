import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = ({ token }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(true);
  const send = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    const res = await axios.post('http://localhost:5000/api/chat', { message: input }, { headers: { Authorization: `Bearer ${token}` } });
    setMessages(msgs => [...msgs, { from: 'bot', text: res.data.answer }]);
    setInput('');
  };
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, background: '#1976d2', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 28, boxShadow: '0 2px 12px #0002', cursor: 'pointer' }}>💬</button>
  );
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #eee', fontWeight: 600, color: '#1976d2' }}>
        <span>Chatbot</span>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }} title="Close">✖</button>
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto', padding: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'bot' ? 'left' : 'right', margin: '6px 0' }}>
            <span style={{ background: m.from === 'bot' ? '#e3f2fd' : '#c8e6c9', borderRadius: 8, padding: '6px 12px', display: 'inline-block' }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #eee' }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, border: 'none', padding: 8, borderRadius: 0 }} placeholder="Type your question..." />
        <button onClick={send} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 0, padding: '0 16px', fontWeight: 600 }}>Send</button>
        <button onClick={() => setMessages([{ from: 'bot', text: 'Hi! How can I help you?' }])} style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 0, padding: '0 12px', fontWeight: 600, marginLeft: 4 }} title="Clear chat">🗑️</button>
      </div>
    </div>
  );
};
export default Chatbot;
