import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Droplets, Thermometer, Wind, Zap, Leaf } from 'lucide-react';
import Sensores from './pages/Sensores';
import Clima from './pages/Clima';
import Historico from './pages/Historico';
import './App.css';

export default function App() {
  const [page, setPage] = useState('visao');
  const [data, setData] = useState({
    soil_moisture: '--',
    air_temperature: '--',
    air_humidity: '--',
    rain_last_6h: 0,
    rain_next_6h: 0,
    decision: '--',
    confidence: 0,
  });

  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('--');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/latest');
        if (!response.ok) return;
        const json = await response.json();
        setConnected(true);

        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        setData({
          soil_moisture:   json.soil_moisture,
          air_temperature: json.air_temperature,
          air_humidity:    json.air_humidity,
          rain_last_6h:    json.rain_last_6h,
          rain_next_6h:    json.rain_next_6h,
          decision:        json.decision,
          confidence:      json.confidence,
          timestamp:       json.timestamp
        });

        setLastUpdate(timeStr);

        setHistory(prev => {
          const next = [...prev, {
            time:        timeStr,
            umidade:     json.soil_moisture,
            temperatura: json.air_temperature,
          }];
          return next.slice(-12);
        });

        if (json.soil_moisture < 20) {
          setAlerts(prev => [{
            type: 'red',
            text: `Solo crítico: ${json.soil_moisture}% de umidade`,
            time: timeStr
          }, ...prev].slice(0, 5));
        } else if (json.decision === 'irrigar') {
          setAlerts(prev => [{
            type: 'yellow',
            text: `Irrigação recomendada — solo em ${json.soil_moisture}%`,
            time: timeStr
          }, ...prev].slice(0, 5));
        }

      } catch (err) {
        setConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'visao',    label: 'Visão Geral', icon: <Droplets size={16} /> },
    { id: 'sensores', label: 'Sensores',    icon: <Thermometer size={16} /> },
    { id: 'clima',    label: 'Clima',       icon: <Wind size={16} /> },
    { id: 'historico',label: 'Histórico',   icon: <Zap size={16} /> },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Leaf size={22} color="#38bdf8" />
          <div>
            <span>AgroFlow</span>
            <small>IRRIGATION</small>
          </div>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li
              key={item.id}
              className={page === item.id ? 'active' : ''}
              onClick={() => setPage(item.id)}
            >
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>Olá, Andressa! 👋</h1>
            <p>Aqui está o resumo do sistema hoje.</p>
          </div>
          <div className="status-badge" style={{ borderColor: connected ? '#166534' : '#7f1d1d', background: connected ? '#0d2e1a' : '#2d0d0d' }}>
            <span className="status-dot" style={{ background: connected ? '#4ade80' : '#f87171' }}></span>
            <span style={{ color: connected ? '#4ade80' : '#f87171' }}>
              {connected ? `Sistema Online — ${lastUpdate}` : 'Aguardando dados...'}
            </span>
          </div>
        </div>

        {/* Páginas */}
        {page === 'sensores' && <Sensores data={data} />}
        {page === 'clima'    && <Clima data={data} />}
        {page === 'historico'&& <Historico />}

        {/* Visão Geral */}
        {page === 'visao' && (
          <>
            <div className="cards">
              <div className="card">
                <div className="card-header">
                  <span className="card-label">Umidade do Solo</span>
                  <div className="card-icon blue"><Droplets size={18} /></div>
                </div>
                <div className="card-value">{data.soil_moisture !== '--' ? `${data.soil_moisture}%` : '--'}</div>
                <div className="card-sub">Leitura atual do sensor</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-label">Temperatura</span>
                  <div className="card-icon orange"><Thermometer size={18} /></div>
                </div>
                <div className="card-value">{data.air_temperature !== '--' ? `${data.air_temperature}°C` : '--'}</div>
                <div className="card-sub">Temperatura do ar</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-label">Umidade do Ar</span>
                  <div className="card-icon purple"><Wind size={16} /></div>
                </div>
                <div className="card-value">{data.air_humidity !== '--' ? `${data.air_humidity}%` : '--'}</div>
                <div className="card-sub">Umidade relativa</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-label">Decisão do ML</span>
                  <div className="card-icon green"><Zap size={18} /></div>
                </div>
                <div className={`card-decision ${data.decision}`}>
                  {data.decision === 'irrigar' ? '🚿 IRRIGAR' : data.decision === 'nao_irrigar' ? '⏸️ NÃO IRRIGAR' : '--'}
                </div>
                <div className="card-sub">Confiança: {data.confidence}%</div>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${data.confidence}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bottom-grid">
              <div className="chart-card">
                <h3>Histórico — Umidade do Solo e Temperatura</h3>
                {history.length === 0 ? (
                  <p style={{ color: '#475569', fontSize: 13, marginTop: 16 }}>Aguardando dados do ESP32...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
                      <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 8 }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Line type="monotone" dataKey="umidade" stroke="#38bdf8" strokeWidth={2} dot={false} name="Umidade %" />
                      <Line type="monotone" dataKey="temperatura" stroke="#fb923c" strokeWidth={2} dot={false} name="Temp °C" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="alerts-card">
                <h3>Alertas Recentes</h3>
                {alerts.length === 0 && (
                  <p style={{ color: '#475569', fontSize: 13 }}>Nenhum alerta ainda.</p>
                )}
                {alerts.map((a, i) => (
                  <div className="alert-item" key={i}>
                    <div className={`alert-dot ${a.type}`}></div>
                    <div>
                      <div className="alert-text">{a.text}</div>
                      <div className="alert-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}