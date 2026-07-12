import React from 'react';
import { Cloud, Droplets, Wind, Sun } from 'lucide-react';

export default function Clima({ data }) {
  const cards = [
    {
      label: 'Chuva Últimas 6h',
      value: data.rain_last_6h !== undefined ? `${data.rain_last_6h}mm` : '--',
      icon: <Cloud size={24} />,
      color: 'blue',
      desc: 'Precipitação acumulada'
    },
    {
      label: 'Chuva Próximas 6h',
      value: data.rain_next_6h !== undefined ? `${data.rain_next_6h}mm` : '--',
      icon: <Droplets size={24} />,
      color: 'purple',
      desc: 'Previsão Open-Meteo'
    },
    {
      label: 'Umidade do Ar',
      value: data.air_humidity !== '--' ? `${data.air_humidity}%` : '--',
      icon: <Wind size={24} />,
      color: 'green',
      desc: 'Sensor DHT22'
    },
    {
      label: 'Temperatura',
      value: data.air_temperature !== '--' ? `${data.air_temperature}°C` : '--',
      icon: <Sun size={24} />,
      color: 'orange',
      desc: 'Sensor DHT22'
    }
  ];

  const colorMap = {
    blue:   { bg: '#0c2a4a', color: '#38bdf8' },
    orange: { bg: '#2e1a0d', color: '#fb923c' },
    purple: { bg: '#1e1a3a', color: '#a78bfa' },
    green:  { bg: '#0d2e1a', color: '#4ade80' }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: '#f1f5f9' }}>
        Dados Climáticos
      </h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
        Fonte: Open-Meteo API — São Sebastião da Grama, SP
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {cards.map((c, i) => {
          const col = colorMap[c.color];
          return (
            <div key={i} style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ background: col.bg, color: col.color, padding: 10, borderRadius: 10 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>{c.value}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Aviso clima */}
      <div style={{ background: '#0d1225', border: '1px solid #1e2a45', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>Análise Climática</h3>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
          {data.rain_next_6h > 5 ? (
            <p style={{ color: '#38bdf8' }}>
              🌧️ Previsão de chuva significativa nas próximas 6h ({data.rain_next_6h}mm). 
              O sistema vai priorizar <strong>não irrigar</strong> para evitar desperdício.
            </p>
          ) : data.rain_next_6h > 0 ? (
            <p style={{ color: '#fbbf24' }}>
              🌦️ Previsão de chuva leve nas próximas 6h ({data.rain_next_6h}mm). 
              O sistema vai considerar junto com a umidade do solo.
            </p>
          ) : (
            <p style={{ color: '#4ade80' }}>
              ☀️ Sem previsão de chuva nas próximas 6h. 
              O sistema vai basear a decisão na umidade do solo atual.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}