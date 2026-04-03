import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const DIMENSIONS = ['Probability', 'Disruption', 'Speed', 'Resilience', 'Opportunity', 'Risk'];

function getRadarValue(scenario, dimIndex) {
  const seed = scenario.type.length;
  const x = Math.sin(seed * 127 + dimIndex * 311) * 10000;
  return Math.round(40 + (x - Math.floor(x)) * 60);
}

export default function ScenarioComparison({ scenarios }) {
  if (scenarios.length < 2) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>◈</span>
        <p style={{ color: '#475569', fontSize: 14 }}>
          Select at least 2 scenarios using the "Compare" checkbox to activate multi-dimensional analysis.
        </p>
      </div>
    );
  }

  const radarData = DIMENSIONS.map((dim, di) => {
    const row = { dimension: dim };
    scenarios.forEach(s => { row[s.label] = getRadarValue(s, di); });
    return row;
  });

  const barData = [
    { metric: 'Probability', ...Object.fromEntries(scenarios.map(s => [s.label, s.probability])) },
    { metric: 'Disruption', ...Object.fromEntries(scenarios.map(s => [s.label, s.disruptionScore])) },
    { metric: 'Risks', ...Object.fromEntries(scenarios.map(s => [s.label, s.risks.length * 20])) },
    { metric: 'Opportunities', ...Object.fromEntries(scenarios.map(s => [s.label, s.opportunities.length * 20])) },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Multi-Dimensional Analysis</h3>
        <p style={styles.subtitle}>Comparing {scenarios.length} futures across {DIMENSIONS.length} axes</p>
      </div>

      <div style={styles.chartsRow}>
        {/* Radar */}
        <div style={styles.chartBox}>
          <p style={styles.chartTitle}>Scenario Fingerprints</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {scenarios.map(s => (
                <Radar
                  key={s.type} name={s.label} dataKey={s.label}
                  stroke={s.color} fill={s.color} fillOpacity={0.12} strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div style={styles.chartBox}>
          <p style={styles.chartTitle}>Metric Comparison</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} stroke="#1e293b" />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} stroke="#1e293b" />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {scenarios.map(s => (
                <Bar key={s.type} dataKey={s.label} fill={s.color} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison table */}
      <div style={styles.table}>
        <div style={styles.tableHead}>
          <div style={styles.tableCell} />
          {scenarios.map(s => (
            <div key={s.type} style={{ ...styles.tableCell, ...styles.tableHeadCell }}>
              <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
              <span style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.label}</span>
            </div>
          ))}
        </div>
        {[
          { label: 'Probability', render: s => `${s.probability}%` },
          { label: 'Timeframe', render: s => s.timeframe },
          { label: 'Disruption Score', render: s => `${s.disruptionScore}/100` },
          { label: 'Risk Vectors', render: s => `${s.risks.length} identified` },
          { label: 'Opportunities', render: s => `${s.opportunities.length} identified` },
          { label: 'Insight Type', render: s => s.insight.type },
        ].map(row => (
          <div key={row.label} style={styles.tableRow}>
            <div style={{ ...styles.tableCell, color: '#475569', fontSize: 12 }}>{row.label}</div>
            {scenarios.map(s => (
              <div key={s.type} style={{ ...styles.tableCell, color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>
                {row.render(s)}
              </div>
            ))}
          </div>
        ))}
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
  header: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  chartBox: { background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: 16 },
  chartTitle: { fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 },
  empty: {
    background: 'rgba(15,23,42,0.8)', border: '1px dashed rgba(51,65,85,0.6)',
    borderRadius: 20, padding: 40, textAlign: 'center', marginBottom: 24,
  },
  table: { borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' },
  tableHead: { display: 'flex', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tableHeadCell: { display: 'flex', alignItems: 'center', gap: 6 },
  tableRow: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  tableCell: { flex: 1, padding: '10px 16px', fontSize: 13 },
};
