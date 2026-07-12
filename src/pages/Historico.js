import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export default function Historico() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('https://irrigation-backend-production-219a.up.railway.app/api/history');
        const data = await response.json();

        const formatted = data.reverse().map(row => ({
          time: new Date(row.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          umidade: row.soil_moisture,
          temperatura: row.air_temperature,
          decisao: row.decision === 'irrigar' ? 1 : 0,
          confianca: row.confidence,
          decLabel: row.decision === 'irrigar' ? 'Irrigar' : 'Nao Irrigar'
        }));

        setHistory(formatted);
      } catch (err) {
        console.error('Erro ao buscar historico:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return React.createElement('p', { style: { color: '#64748b', fontSize: 13 } }, 'Carregando historico...');
  }

  if (history.length === 0) {
    return React.createElement('p', { style: { color: '#64748b', fontSize: 13 } }, 'Nenhum dado no historico ainda.');
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>
        Historico de Leituras
      </h2>

      <div style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>Umidade do Solo e Temperatura</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
            <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
            <Line type="monotone" dataKey="umidade" stroke="#38bdf8" strokeWidth={2} dot={false} name="Umidade %" />
            <Line type="monotone" dataKey="temperatura" stroke="#fb923c" strokeWidth={2} dot={false} name="Temp C" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>Decisoes do ML — 1 Irrigar, 0 Nao Irrigar</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
            <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[0, 1]} ticks={[0, 1]} />
            <Tooltip
              contentStyle={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="decisao" fill="#38bdf8" name="Decisao" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>Ultimas Leituras</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #1e2a45' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Hora</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Solo</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Temp</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Decisao</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Confianca</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(-10).reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e2a45', color: '#94a3b8' }}>
                <td style={{ padding: '8px 12px' }}>{row.time}</td>
                <td style={{ padding: '8px 12px' }}>{row.umidade}%</td>
                <td style={{ padding: '8px 12px' }}>{row.temperatura}C</td>
                <td style={{ padding: '8px 12px', color: row.decisao === 1 ? '#38bdf8' : '#4ade80' }}>
                  {row.decLabel}
                </td>
                <td style={{ padding: '8px 12px' }}>{row.confianca}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}