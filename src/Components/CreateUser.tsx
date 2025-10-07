import React, { useState } from 'react';
import './Login.css';
import Footer from './Footer';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const CreateUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!email || !username || !password || !confirm) return setMsg('Preencha todos os campos.');
    if (!validateEmail(email)) return setMsg('Email inválido.');
    if (password !== confirm) return setMsg('Senhas não batem.');
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMsg(body.message || 'Erro ao criar usuário');
      } else {
        setMsg('Usuário criado com sucesso');
        setEmail(''); setUsername(''); setPassword(''); setConfirm('');
      }
    } catch (err) {
      setMsg('Erro de conexão');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-container">
      <div className="schedulepage-bg" />
      <div className="schedulepage-overlay" />
      <div className="auth-card signup">
        <h2>Criar Usuário</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          <label>Usuário</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="usuario" />
          <label>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="senha" />
          <label>Confirmar senha</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="confirme a senha" />
          {msg && <div className="auth-message">{msg}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Criar Usuário'}</button>
        </form>
        <a className='anchors' href="/login">Voltar para login</a>
      </div>
      <Footer />
    </div>
  );
};

export default CreateUser;
