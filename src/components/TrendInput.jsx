import React, { useState } from 'react';
import { Plus, X, Zap, Cpu, Leaf, Atom, Users, Coins, Dna } from 'lucide-react';

const PRESET_TRENDS = [
  { name: 'Artificial Intelligence', impact: 9, icon: <Cpu size={12} /> },
  { name: 'Climate Change', impact: 8, icon: <Leaf size={12} /> },
  { name: 'Quantum Computing', impact: 7, icon: <Atom size={12} /> },
  { name: 'Demographic Shifts', impact: 6, icon: <Users size={12} /> },
  { name: 'Decentralized Finance', impact: 7, icon: <Coins size={12} /> },
  { name: 'Biotech & Gene Editing', impact: 8, icon: <Dna size={12} /> },
];

export default function TrendInput({ trends, onAdd, onRemove, onGenerate, generating }) {
  const [name, setName] = useState('');
  const [impact, setImpact] = useState(5);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), impact: Number(impact) });
    setName('');
    setImpact(5);
  };

  const addPreset = (preset) => {
    if (!trends.find(t => t.name === preset.name)) onAdd({ name: preset.name, impact: preset.impact });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Signal Detection</h2>
          <p style={styles.subtitle}>Feed the engine with current trends to model future probability space</p>
        </div>
        <div style={styles.trendCount}>
          <span style={styles.trendCountNum}>{trends.length}</span>
          <span style={styles.trendCountLabel}>signals</span>
        </div>
      </div>

      {/* Presets */}
      <div style={styles.presetSection}>
        <span style={styles.presetLabel}>⚡ Quick signals</span>
        <div style={styles.presets}>
          {PRESET_TRENDS.map(p => {
            const active = !!trends.find(t => t.name === p.name);
            return (
              <button
                key={p.name}
                className="preset-btn"
                onClick={() => addPreset(p)}
                disabled={active}
                style={{ ...styles.presetBtn, opacity: active ? 0.35 : 1 }}
              >
                {p.icon}
                {p.name}
                <span style={{ ...styles.impactDot, background: impactColor(p.impact) }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Name a trend shaping the future..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <div style={styles.sliderGroup}>
          <div style={styles.sliderHeader}>
            <span style={styles.sliderLabel}>Impact magnitude</span>
            <span style={{ ...styles.impactValue, color: impactColor(impact) }}>
              {impact < 4 ? 'Low' : impact < 7 ? 'Medium' : impact < 9 ? 'High' : 'Critical'} · {impact}/10
            </span>
          </div>
          <div style={styles.sliderTrack}>
            <input
              type="range" min="1" max="10" value={impact}
              onChange={e => setImpact(e.target.value)}
              style={{ ...styles.slider, accentColor: impactColor(impact) }}
            />
          </div>
        </div>
        <button onClick={handleAdd} style={styles.addBtn} disabled={!name.trim()}>
          <Plus size={15} /> Add Signal
        </button>
      </div>

      {/* Active trends */}
      {trends.length > 0 && (
        <div style={styles.trendList}>
          {trends.map((t, i) => (
            <div key={i} style={{ ...styles.trendTag, borderColor: impactColor(t.impact) + '60' }}>
              <span style={{ ...styles.trendDot, background: impactColor(t.impact) }} />
              <span style={styles.trendName}>{t.name}</span>
              <span style={{ ...styles.trendImpact, color: impactColor(t.impact) }}>{t.impact}</span>
              <button onClick={() => onRemove(i)} style={styles.removeBtn}>
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={trends.length === 0 || generating}
        className="glow-btn"
        style={{
          ...styles.generateBtn,
          opacity: trends.length === 0 ? 0.35 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        {generating ? (
          <>
            <span style={styles.spinner} /> Modeling probability space...
          </>
        ) : (
          <>
            <Zap size={18} style={{ filter: 'drop-shadow(0 0 6px #a78bfa)' }} />
            Generate Future Scenarios
          </>
        )}
      </button>
    </div>
  );
}

function impactColor(v) {
  if (v >= 9) return '#f87171';
  if (v >= 7) return '#fb923c';
  if (v >= 5) return '#fbbf24';
  return '#34d399';
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(10,14,26,0.98) 100%)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 20,
    padding: 28,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 0 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3 },
  trendCount: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 12, padding: '8px 16px',
  },
  trendCountNum: { fontSize: 24, fontWeight: 800, color: '#a78bfa', lineHeight: 1 },
  trendCountLabel: { fontSize: 10, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' },
  presetSection: { marginBottom: 20 },
  presetLabel: { fontSize: 11, color: '#475569', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' },
  presets: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  presetBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.8)',
    borderRadius: 20, color: '#94a3b8', fontSize: 12, padding: '6px 14px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  impactDot: { width: 6, height: 6, borderRadius: '50%', marginLeft: 2 },
  inputRow: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 },
  input: {
    flex: 1, minWidth: 200,
    background: 'rgba(15,23,42,0.8)',
    border: '1px solid rgba(51,65,85,0.8)',
    borderRadius: 10, padding: '11px 16px',
    color: '#f1f5f9', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
  },
  sliderGroup: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 },
  sliderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sliderLabel: { fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' },
  impactValue: { fontSize: 11, fontWeight: 700 },
  sliderTrack: { position: 'relative' },
  slider: { width: '100%' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(79,70,229,0.8)', border: '1px solid rgba(99,102,241,0.5)',
    borderRadius: 10, color: '#fff', padding: '11px 18px',
    cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  trendList: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  trendTag: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'rgba(15,23,42,0.9)', border: '1px solid',
    borderRadius: 20, padding: '5px 12px',
  },
  trendDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  trendName: { fontSize: 13, color: '#e2e8f0' },
  trendImpact: { fontSize: 11, fontWeight: 800 },
  removeBtn: {
    background: 'none', border: 'none', color: '#475569',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    padding: 2, borderRadius: 4,
  },
  generateBtn: {
    display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
    border: '1px solid rgba(139,92,246,0.4)',
    borderRadius: 12, color: '#fff', padding: '15px',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  spinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin-slow 0.8s linear infinite',
  },
};
