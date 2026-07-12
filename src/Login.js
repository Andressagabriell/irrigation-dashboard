import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Leaf } from 'lucide-react';

const supabase = createClient(
  'https://ppfhghmhcnuztxtsonsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZmhnaG1oY251enR4dHNvbnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MjE1MTAsImV4cCI6MjA5OTI5NzUxMH0.wymZTk-1oMcfXrAt5NaY4q2c6TEHn_Q_gvh197wX440'
);

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha incorretos.');
    } else {
      onLogin();
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#0d1225',
        border: '1px solid #1e2a45',
        borderRadius: 16,
        padding: 40,
        width: 360
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Leaf size={28} color="#38bdf8" />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#38bdf8' }}>AgroFlow</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>IRRIGATION SYSTEM</div>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
          Bem-vinda, Andressa!
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
          Entre com suas credenciais para acessar o sistema.
        </p>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: '100%',
              background: '#0a0e1a',
              border: '1px solid #1e2a45',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#f1f5f9',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Senha */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
            SENHA
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              background: '#0a0e1a',
              border: '1px solid #1e2a45',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#f1f5f9',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Erro */}
        {error && (
          <div style={{
            background: '#2d0d0d',
            border: '1px solid #7f1d1d',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#f87171',
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: '#38bdf8',
            color: '#0a0e1a',
            border: 'none',
            borderRadius: 8,
            padding: '12px',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}