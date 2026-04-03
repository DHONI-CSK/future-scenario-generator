import React, { useState, useEffect } from 'react';
import TrendInput from './components/TrendInput.jsx';
import ScenarioCard from './components/ScenarioCard.jsx';
import ScenarioComparison from './components/ScenarioComparison.jsx';
import TrendChart from './components/TrendChart.jsx';
import Starfield from './components/Starfield.jsx';
import { generateScenarios, analyzeTrends } from './utils/scenarioEngine.js';

const TABS = [
  { id: 'scenarios', label: 'Scenarios', icon: '◈' },
  { id: 'graph', label: 'Trajectories', icon: '∿' },
  { id: 'compare', label: 'Compare', icon: '⊕' },
];

export default function App() {
  const [trends, setTrends] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('scenarios');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setScenarios([]);
    setTimeout(() => {
      const s = generateScenarios(trends);
      const a = analyzeTrends(trends);
      setScenarios(s);
      setAnalysis(a);
      setSelectedTypes([]);
      setActiveTab('scenarios');
      setGenerating(false);
      setGenerated(true);
    }, 900);
  };

  const toggleSelect = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const selectedScenarios = scenarios.filter(s => selectedTypes.includes(s.type));

  return (
    <div style={styles.app}>
      <Starfield />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <div style={styles.logoOrb}>
              <span style={styles.logoOrbInner}>🔮</span>
            </div>
            <div>
              <h1 className="shimmer-text" style={styles.logoTitle}>Future Scenario Generator</h1>
              <p style={styles.logoSub}>
                Signal Analysis · Probability Modeling · Strategic Foresight
              </p>
            </div>
          </div>

          {analysis && (
            <div style={styles.statsRow}>
              {[
                { label: 'Avg Impact', value: `${analysis.avgImpact}/10`, color: '#a78bfa' },
                { label: 'Volatility', value: analysis.volatility, color: '#f87171' },
                { label: 'Outlook', value: analysis.outlook, color: '#34d399' },
                { label: 'Horizon', value: analysis.horizon, color: '#60a5fa' },
                { label: 'Convergence', value: `${analysis.convergenceScore}%`, color: '#fbbf24' },
              ].map(stat => (
                <div key={stat.label} style={styles.stat}>
                  <span style={styles.statLabel}>{stat.label}</span>
                  <span style={{ ...styles.statValue, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main style={styles.main}>
        <TrendInput
          trends={trends}
          onAdd={t => setTrends(prev => [...prev, t])}
          onRemove={i => setTrends(prev => prev.filter((_, idx) => idx !== i))}
          onGenerate={handleGenerate}
          generating={generating}
        />

        {/* Loading state */}
        {generating && (
          <div style={styles.loadingState}>
            <div style={styles.loadingOrb} />
            <p style={styles.loadingText}>Modeling probability space across {trends.length} signal{trends.length !== 1 ? 's' : ''}...</p>
            <p style={styles.loadingSub}>Generating 4 distinct futures</p>
          </div>
        )}

        {/* Results */}
        {scenarios.length > 0 && !generating && (
          <div style={styles.results}>
            {/* Tabs */}
            <div style={styles.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.tabActive : {}),
                  }}
                >
                  <span style={styles.tabIcon}>{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'compare' && selectedTypes.length > 0 && (
                    <span style={styles.tabBadge}>{selectedTypes.length}</span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'scenarios' && (
              <div>
                {scenarios.map((s, i) => (
                  <ScenarioCard
                    key={s.type}
                    scenario={s}
                    index={i}
                    selected={selectedTypes.includes(s.type)}
                    onToggleSelect={() => toggleSelect(s.type)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'graph' && <TrendChart scenarios={scenarios} />}
            {activeTab === 'compare' && <ScenarioComparison scenarios={selectedScenarios} />}
          </div>
        )}

        {/* Empty state */}
        {!generated && !generating && (
          <div style={styles.emptyState}>
            <div style={styles.emptyOrb}>
              <span style={{ fontSize: 40 }}>🔮</span>
            </div>
            <p style={styles.emptyTitle}>The future is unwritten</p>
            <p style={styles.emptySub}>
              Add signals above to begin modeling what comes next
            </p>
            <div style={styles.emptyHints}>
              {['Add 2–5 trends for best results', 'Higher impact = more divergent scenarios', 'Use Compare to find strategic gaps'].map(h => (
                <span key={h} style={styles.emptyHint}>◦ {h}</span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', background: '#020408', position: 'relative' },
  header: {
    position: 'relative', zIndex: 10,
    background: 'linear-gradient(180deg, rgba(10,14,26,0.98) 0%, rgba(2,4,8,0.95) 100%)',
    borderBottom: '1px solid rgba(99,102,241,0.15)',
    padding: '18px 0',
    backdropFilter: 'blur(20px)',
  },
  headerInner: {
    maxWidth: 960, margin: '0 auto', padding: '0 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 14 },
  logoOrb: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 100%)',
    border: '1px solid rgba(99,102,241,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 20px rgba(99,102,241,0.2)',
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  logoOrbInner: { fontSize: 22 },
  logoTitle: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' },
  logoSub: { fontSize: 11, color: '#334155', marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' },
  statsRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  stat: {
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10, padding: '7px 12px',
    display: 'flex', flexDirection: 'column', gap: 2,
    backdropFilter: 'blur(10px)',
  },
  statLabel: { fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' },
  statValue: { fontSize: 13, fontWeight: 800 },
  main: { maxWidth: 960, margin: '0 auto', padding: '28px 24px', position: 'relative', zIndex: 1 },
  results: { marginTop: 24 },
  tabs: {
    display: 'flex', gap: 4, marginBottom: 20,
    background: 'rgba(15,23,42,0.8)', borderRadius: 14, padding: 5,
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
  },
  tab: {
    flex: 1, background: 'none', border: 'none', borderRadius: 10,
    color: '#475569', padding: '10px 16px', cursor: 'pointer', fontSize: 13,
    fontWeight: 600, transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    letterSpacing: '0.02em',
  },
  tabActive: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
    color: '#a78bfa',
    boxShadow: '0 0 20px rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  tabIcon: { fontSize: 14 },
  tabBadge: {
    background: '#6366f1', color: '#fff', borderRadius: 10,
    fontSize: 10, padding: '1px 6px', fontWeight: 800,
  },
  loadingState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '60px 24px', gap: 12,
  },
  loadingOrb: {
    width: 60, height: 60, borderRadius: '50%',
    border: '2px solid rgba(99,102,241,0.3)',
    borderTopColor: '#6366f1',
    animation: 'spin-slow 1s linear infinite',
    boxShadow: '0 0 30px rgba(99,102,241,0.3)',
  },
  loadingText: { fontSize: 16, color: '#94a3b8', fontWeight: 600 },
  loadingSub: { fontSize: 13, color: '#334155' },
  emptyState: {
    textAlign: 'center', padding: '60px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    marginTop: 24,
  },
  emptyOrb: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'float 4s ease-in-out infinite',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 20, color: '#475569', fontWeight: 700 },
  emptySub: { fontSize: 14, color: '#334155' },
  emptyHints: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 },
  emptyHint: { fontSize: 12, color: '#1e293b' },
};
