import React from 'react';
import { Droplets, Thermometer, Wind, Clock } from 'lucide-react';

export default function Sensores({ data }) {
  const sensors = [
    {
      label: 'Umidade do Solo',
      value: data.soil_moisture !== '--' ? `${data.soil_moisture}%` : '--',
      icon: <Droplets size={24} />,
      color: 'blue',
      desc: 'Sensor capacitivo — GPIO34',
      min: 0, max: 100,
      current: data.soil_moisture
    },
    {
      label: 'Temperatura do Ar',
      value: data.air_temperature !== '--' ? `${data.air_temperature}°C` : '--',
      icon: <Thermometer size={24} />,
      color: 'orange',
      desc: 'DHT22 — GPIO15',
      min: 0, max: 50,
      current: data.air_temperature
    },
    {
      label: 'Umidade do Ar',
      value: data.air_humidity !== '--' ? `${data.air_humidity}%` : '--',
      icon: <Wind size={24} />,
      color: 'purple',
      desc: 'DHT22 — GPIO15',
      min: 0, max: 100,
      current: data.air_humidity
    },
    {
      label: 'Última Atualização',
      value: data.timestamp ? new Date(data.timestamp).toLocaleTimeString('pt-BR') : '--',
      icon: <Clock size={24} />,
      color: 'green',
      desc: 'Publicação MQTT a cada 5s',
      min: null, max: null,
      current: null
    }
  ];

  const colorMap = {
    blue:   { bg: '#0c2a4a', color: '#38bdf8', bar: '#38bdf8' },
    orange: { bg: '#2e1a0d', color: '#fb923c', bar: '#fb923c' },
    purple: { bg: '#1e1a3a', color: '#a78bfa', bar: '#a78bfa' },
    green:  { bg: '#0d2e1a', color: '#4ade80', bar: '#4ade80' }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>
        Detalhes dos Sensores
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {sensors.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={i} style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ background: c.bg, color: c.color, padding: 10, borderRadius: 10 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
                </div>
              </div>
              {s.min !== null && (
                <div>
                  <div style={{ background: '#1e2a45', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${((s.current - s.min) / (s.max - s.min)) * 100}%`,
                      background: c.bar,
                      borderRadius: 4,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 4 }}>
                    <span>{s.min}</span>
                    <span style={{ color: '#64748b' }}>{s.desc}</span>
                    <span>{s.max}</span>
                  </div>
                </div>
              )}
              {s.min === null && (
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}