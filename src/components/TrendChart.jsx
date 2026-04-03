import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

export default function TrendChart({ scenarios }) {
  const [activeTrend, setActiveTrend] = useState(null);
  if (!scenarios.length) return null;

  const trendNames = scenarios[0].trendData.map(t => t.name);
  const years = scenarios[0].trendData[0]?.data.map(d => d.year) || [];

  // One chart per scenario type
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Trajectory Projections</h3>
          <p style={styles.subtitle}>Impact index across all scenarios · {years[0]}–{years[years.length - 1]}</p>
        </div>
        <div style={styles.trendFilters}>
          {trendNames.map(name => (
            <button
              key={name}
              onClick={() => setActiveTrend(activeTrend === name ? null : name)}
              style={{
                ...styles.filterBtn,
                background: activeTrend === name ? 'rgba(99,102,241,0.2)' : 'rgba(15,23,42,0.8)',
                borderColor: activeTrend === name ? '#6366f1' : 'rgba(51,65,85,0.6)',
                color: activeTrend === name ? '#a78bfa' : '#64748b',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {scenarios.map(scenario => {
          const chartData = years.map((year, yi) => {
            const row = { year };
            scenario.trendData.forEach(td => {
              if (!activeTrend || td.name === activeTrend) {
                row[td.name] = td.data[yi]?.value;
              }
            });
            return row;
          });

          const visibleTrends = activeTrend
            ? scenario.trendData.filter(t => t.name === activeTrend)
            : scenario.trendData;

          return (
            <div key={scenario.type} style={{
              ...styles.chartCard,
              borderColor: scenario.color + '30',
              boxShadow: `0 0 20px ${scenario.glowColor}`,
            }}>
              <div style={styles.chartHeader}>
                <span style={{ ...styles.chartIcon, color: scenario.color }}>{scenario.icon}</span>
                <span style={{ ...styles.chartLabel, color: scenario.color }}>{scenario.label}</span>
                <span style={styles.chartProb}>{scenario.probability}% likely</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {visibleTrends.map((td, i) => (
                      <linearGradient key={td.name} id={`grad-${scenario.type}-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={scenario.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={scenario.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" stroke="#1e293b" tick={{ fill: '#475569', fontSize: 10 }} />
                  <YAxis stroke="#1e293b" tick={{ fill: '#475569', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a', border: `1px solid ${scenario.color}40`,
                      borderRadius: 8, fontSize: 12,
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                    itemStyle={{ color: scenario.color }}
                  />
                  {visibleTrends.map((td, i) => (
                    <Area
                      key={td.name}
                      type="monotone"
                      dataKey={td.name}
                      stroke={scenario.color}
                      strokeWidth={2}
                      fill={`url(#grad-${scenario.type}-${i})`}
                      strokeOpacity={0.9}
                      dot={false}
                      activeDot={{ r: 4, fill: scenario.color }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(10,14,26,0.98) 100%)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 20, padding: 28, marginBottom: 24,
    backdropFilter: 'blur(20px)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3 },
  trendFilters: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filterBtn: {
    border: '1px solid', borderRadius: 20, fontSize: 11,
    padding: '4px 12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500,
  },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  chartCard: {
    background: 'rgba(0,0,0,0.3)', border: '1px solid',
    borderRadius: 14, padding: '14px 14px 8px',
  },
  chartHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  chartIcon: { fontSize: 16, fontWeight: 900 },
  chartLabel: { fontSize: 14, fontWeight: 700, flex: 1 },
  chartProb: { fontSize: 11, color: '#475569' },
};
