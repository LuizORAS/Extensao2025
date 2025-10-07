import React, { useState } from 'react';
import './Login.css';
import Footer from './Footer';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!email) return setMsg('Informe o email cadastrado.');
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMsg(body.message || 'Erro ao enviar solicitação.');
      } else {
        setMsg('Verifique seu email para instruções.');
        setEmail('');
      }
    } catch (err) {
      setMsg('Erro de conexão');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-container">
      <div className="schedulepage-bg" />
      <div className="schedulepage-overlay" />
      <div className="auth-card">
        <h2>Recuperar senha</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email cadastrado</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          {msg && <div className="auth-message">{msg}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar instruções'}</button>
        </form>
        <a className='anchors' href="/login">Voltar para login</a>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
