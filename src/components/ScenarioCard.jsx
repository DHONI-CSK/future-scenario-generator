import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';

const SEVERITY_COLORS = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24' };
const MAGNITUDE_COLORS = { massive: '#34d399', high: '#60a5fa', medium: '#a78bfa' };

export default function ScenarioCard({ scenario: s, selected, onToggleSelect, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card-hover scenario-card-enter"
      style={{
        ...styles.card,
        background: s.bgGradient,
        borderColor: selected ? s.color : 'rgba(255,255,255,0.06)',
        boxShadow: selected
          ? `0 0 0 1px ${s.color}, 0 0 40px ${s.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 0 20px ${s.glowColor}, 0 4px 24px rgba(0,0,0,0.3)`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Top accent line */}
      <div style={{ ...styles.accentLine, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={{ ...styles.iconRing, borderColor: s.color + '40', boxShadow: `0 0 20px ${s.glowColor}` }}>
            <span style={{ ...styles.iconSymbol, color: s.color }}>{s.icon}</span>
          </div>
          <div>
            <div style={styles.labelRow}>
              <h3 style={{ ...styles.label, color: s.color }}>{s.label}</h3>
              <span style={{ ...styles.sublabel }}>{s.sublabel}</span>
            </div>
            <p style={styles.tagline}>{s.tagline}</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          {/* Probability arc */}
          <div style={styles.probContainer}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="26" cy="26" r="22" fill="none"
                stroke={s.color} strokeWidth="3"
                strokeDasharray={`${(s.probability / 100) * 138} 138`}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
                style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}
              />
            </svg>
            <div style={styles.probText}>
              <span style={{ ...styles.probNum, color: s.color }}>{s.probability}%</span>
            </div>
          </div>

          <div style={styles.metaStack}>
            <div style={styles.metaBadge}>
              <span style={styles.metaLabel}>Timeframe</span>
              <span style={{ ...styles.metaValue, color: s.color }}>{s.timeframe}</span>
            </div>
            <div style={styles.metaBadge}>
              <span style={styles.metaLabel}>Disruption</span>
              <div style={styles.disruptBar}>
                <div style={{
                  ...styles.disruptFill,
                  width: `${s.disruptionScore}%`,
                  background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                }} />
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <label style={styles.compareLabel}>
              <input type="checkbox" checked={selected} onChange={onToggleSelect} style={{ accentColor: s.color }} />
              <span>Compare</span>
            </label>
            <button onClick={() => setExpanded(e => !e)} style={{ ...styles.expandBtn, borderColor: s.color + '30' }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div style={{ ...styles.narrative, borderLeftColor: s.color + '60' }}>
        <BookOpen size={13} color={s.color} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={styles.narrativeText}><em>{s.narrative}</em></p>
      </div>

      {/* Insight */}
      <div style={styles.insight}>
        <Lightbulb size={13} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={styles.insightText}>{s.insight.text}</p>
        <span style={{ ...styles.insightType, color: s.color }}>{s.insight.type}</span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={styles.expandedContent}>
          <div style={styles.columns}>
            <div style={styles.column}>
              <div style={styles.sectionHeader}>
                <AlertTriangle size={13} color="#f87171" />
                <span style={{ color: '#f87171', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Risk Vectors
                </span>
              </div>
              <div style={styles.itemList}>
                {s.risks.map((r, i) => (
                  <div key={i} style={styles.riskItem}>
                    <span style={{ ...styles.severityDot, background: SEVERITY_COLORS[r.severity] }} />
                    <span style={styles.itemText}>{r.text}</span>
                    <span style={{ ...styles.severityTag, color: SEVERITY_COLORS[r.severity], borderColor: SEVERITY_COLORS[r.severity] + '40' }}>
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.column}>
              <div style={styles.sectionHeader}>
                <TrendingUp size={13} color="#34d399" />
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Opportunity Vectors
                </span>
              </div>
              <div style={styles.itemList}>
                {s.opportunities.map((o, i) => (
                  <div key={i} style={styles.riskItem}>
                    <span style={{ ...styles.severityDot, background: MAGNITUDE_COLORS[o.magnitude] }} />
                    <span style={styles.itemText}>{o.text}</span>
                    <span style={{ ...styles.severityTag, color: MAGNITUDE_COLORS[o.magnitude], borderColor: MAGNITUDE_COLORS[o.magnitude] + '40' }}>
                      {o.magnitude}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid', borderRadius: 18, padding: '0 0 20px',
    marginBottom: 20, overflow: 'hidden', position: 'relative',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
  },
  accentLine: { height: 2, width: '100%', marginBottom: 20 },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: '0 20px', marginBottom: 14, flexWrap: 'wrap', gap: 12,
  },
  headerLeft: { display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 },
  iconRing: {
    width: 48, height: 48, borderRadius: '50%', border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    background: 'rgba(0,0,0,0.3)',
  },
  iconSymbol: { fontSize: 20, fontWeight: 900 },
  labelRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  label: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' },
  sublabel: { fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' },
  tagline: { fontSize: 13, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 },
  probContainer: { position: 'relative', width: 52, height: 52 },
  probText: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  probNum: { fontSize: 11, fontWeight: 800 },
  metaStack: { display: 'flex', flexDirection: 'column', gap: 6 },
  metaBadge: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaLabel: { fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' },
  metaValue: { fontSize: 12, fontWeight: 700 },
  disruptBar: { width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  disruptFill: { height: '100%', borderRadius: 2, transition: 'width 0.6s ease' },
  actions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  compareLabel: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 11, color: '#64748b', cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  expandBtn: {
    background: 'rgba(15,23,42,0.8)', border: '1px solid',
    borderRadius: 8, color: '#64748b', cursor: 'pointer',
    padding: '5px 8px', display: 'flex', alignItems: 'center',
    transition: 'all 0.2s',
  },
  narrative: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    margin: '0 20px 12px', padding: '10px 14px',
    background: 'rgba(0,0,0,0.2)', borderRadius: 10,
    borderLeft: '2px solid',
  },
  narrativeText: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  insight: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    margin: '0 20px', padding: '10px 14px',
    background: 'rgba(251,191,36,0.05)', borderRadius: 10,
    border: '1px solid rgba(251,191,36,0.1)',
  },
  insightText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, flex: 1 },
  insightType: {
    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', flexShrink: 0, marginTop: 2,
    border: '1px solid', borderRadius: 4, padding: '2px 5px',
    borderColor: 'currentColor',
  },
  expandedContent: { margin: '16px 20px 0' },
  columns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  column: { background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: 14 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  itemList: { display: 'flex', flexDirection: 'column', gap: 8 },
  riskItem: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  severityDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  itemText: { fontSize: 12, color: '#94a3b8', lineHeight: 1.5, flex: 1 },
  severityTag: {
    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', border: '1px solid', borderRadius: 4,
    padding: '1px 5px', flexShrink: 0, marginTop: 2,
  },
};
