import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!username || !password) return setMessage('Preencha usuário e senha.');
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/login/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, senha: password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(body.message || 'Falha no login');
      } else {
        const user = await res.json();
        // persist auth in localStorage
        try { localStorage.setItem('app_auth', JSON.stringify(user)); } catch (err) {}
        // persist a simple profile so header can show a name/avatar if desired
        try {
          const profile = { name: user.nome || user.user || 'Usuário', avatarUrl: null };
          localStorage.setItem('app_user_profile', JSON.stringify(profile));
          // notify other tabs/components
          try { window.dispatchEvent(new CustomEvent('profile:changed', { detail: profile })); } catch (e) {}
        } catch (err) {}
        setMessage('Login realizado');
        setTimeout(() => navigate('/welcome'), 300);
      }
    } catch (err) {
      setMessage('Erro de conexão');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-container">
      <div className="schedulepage-bg" />
      <div className="schedulepage-overlay" />
      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Usuário</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="usuario" />
          <label>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="senha" />
          {message && <div className="auth-message">{message}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <div className='anchors-div'>
          <a className='anchors' href="/forgot-password">Esqueceu a senha?</a>
          <a className='anchors' href="/signup">Criar conta</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
