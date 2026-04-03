// Scenario generation engine

const SCENARIO_TEMPLATES = {
  optimistic: {
    label: 'The Flourishing',
    sublabel: 'Optimistic Future',
    color: '#34d399',
    bgGradient: 'linear-gradient(135deg, #022c22 0%, #041a12 100%)',
    borderColor: '#059669',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    icon: '✦',
    emoji: '🌱',
    multiplier: 1.4,
    tagline: 'Convergence unlocks a new era of human potential',
  },
  baseline: {
    label: 'The Drift',
    sublabel: 'Baseline Future',
    color: '#60a5fa',
    bgGradient: 'linear-gradient(135deg, #0c1a3a 0%, #060e22 100%)',
    borderColor: '#2563eb',
    glowColor: 'rgba(96, 165, 250, 0.15)',
    icon: '◈',
    emoji: '🌊',
    multiplier: 1.0,
    tagline: 'Incremental change shapes a familiar but altered world',
  },
  pessimistic: {
    label: 'The Fracture',
    sublabel: 'Pessimistic Future',
    color: '#f87171',
    bgGradient: 'linear-gradient(135deg, #2d0a0a 0%, #1a0505 100%)',
    borderColor: '#dc2626',
    glowColor: 'rgba(248, 113, 113, 0.15)',
    icon: '⚡',
    emoji: '🌩️',
    multiplier: 0.6,
    tagline: 'Compounding failures cascade into systemic breakdown',
  },
  wildcard: {
    label: 'The Singularity',
    sublabel: 'Wildcard Future',
    color: '#c084fc',
    bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #0d0518 100%)',
    borderColor: '#9333ea',
    glowColor: 'rgba(192, 132, 252, 0.15)',
    icon: '◉',
    emoji: '🌀',
    multiplier: 1.8,
    tagline: 'A black swan event rewrites the rules of civilization',
  },
};

const RISK_POOL = [
  { text: 'Market saturation collapses growth velocity by 60%', severity: 'critical' },
  { text: 'Regulatory superstorms halt deployment across 40+ nations', severity: 'high' },
  { text: 'Talent wars leave 70% of initiatives understaffed', severity: 'high' },
  { text: 'Geopolitical fractures sever critical supply arteries', severity: 'critical' },
  { text: 'Zero-day vulnerabilities expose billions to systemic risk', severity: 'critical' },
  { text: 'Public trust collapses after a high-profile catastrophe', severity: 'high' },
  { text: 'Energy infrastructure buckles under exponential demand', severity: 'medium' },
  { text: 'Capital flight triggers a decade-long innovation drought', severity: 'high' },
  { text: 'Competing standards splinter the ecosystem irreparably', severity: 'medium' },
  { text: 'Climate feedback loops accelerate beyond model predictions', severity: 'critical' },
  { text: 'Automation displaces labor faster than retraining can absorb', severity: 'high' },
  { text: 'Misinformation cascades destabilize democratic institutions', severity: 'critical' },
];

const OPPORTUNITY_POOL = [
  { text: 'First-mover dynasties capture 80% of emerging market value', magnitude: 'massive' },
  { text: 'Data economies generate $10T in previously invisible wealth', magnitude: 'massive' },
  { text: 'Operational costs implode — 50% reduction becomes the floor', magnitude: 'high' },
  { text: 'Cross-sector fusion births entirely new industry categories', magnitude: 'high' },
  { text: '3 billion underserved people gain access to transformative tools', magnitude: 'massive' },
  { text: 'Network effects compound into winner-take-most dynamics', magnitude: 'high' },
  { text: 'Regulatory moats protect early entrants for a decade', magnitude: 'medium' },
  { text: 'Talent density triggers a Cambrian explosion of breakthroughs', magnitude: 'high' },
  { text: 'Behavioral shifts unlock demand curves no model predicted', magnitude: 'medium' },
  { text: 'Technology convergence multiplies value by orders of magnitude', magnitude: 'massive' },
  { text: 'Longevity breakthroughs extend productive human lifespans by 20 years', magnitude: 'massive' },
  { text: 'Decentralized systems redistribute power from institutions to individuals', magnitude: 'high' },
];

const NARRATIVE_POOL = [
  'It begins not with a bang, but with a thousand quiet decisions made simultaneously across the globe.',
  'The historians will argue about when exactly the inflection point arrived — but those living through it will know.',
  'What looks like chaos from inside the transition is, in retrospect, the birth of a new order.',
  'The organizations that survive this era will be those that learned to navigate uncertainty as a core competency.',
  'Every major civilization shift has felt like collapse to those in the middle of it. This one is no different.',
  'The gap between those who adapt and those who resist will define the next generation of winners and losers.',
  'We are not predicting the future — we are mapping the probability space of decisions not yet made.',
  'The most dangerous assumption is that tomorrow will resemble yesterday. It will not.',
  'Power in this scenario flows not to the strongest, but to the most adaptable.',
  'The window is narrow. The stakes are civilizational. The choices are yours.',
];

const INSIGHT_POOL = [
  { text: 'The window for strategic positioning is closing — early movers will write the rules everyone else follows.', type: 'strategic' },
  { text: 'Adoption curves reveal a 2–3 year lag between breakthrough and mainstream integration. That gap is your runway.', type: 'timing' },
  { text: 'Organizations investing in adaptability now will outperform those optimizing for current conditions by 3x.', type: 'strategic' },
  { text: 'The greatest risk is not moving too fast — it is waiting for certainty that will never arrive.', type: 'risk' },
  { text: 'The range of plausible outcomes is 4x wider than most stakeholders currently model.', type: 'uncertainty' },
  { text: 'Human factors — trust, culture, behavior — will determine outcomes more than any technology.', type: 'human' },
  { text: 'The optimistic and pessimistic trajectories diverge most sharply at the 5-year mark. That is your decision horizon.', type: 'timing' },
  { text: 'Resilience is not a contingency plan. It must be architected into the baseline from day one.', type: 'strategic' },
  { text: 'The entities that thrive will be those that treat uncertainty as a feature, not a bug.', type: 'strategic' },
  { text: 'Convergence of multiple high-impact trends creates non-linear outcomes that linear models cannot capture.', type: 'complexity' },
];

function seededRand(seed, index) {
  const x = Math.sin(seed * 9301 + index * 49297 + 233720) * 10000;
  return x - Math.floor(x);
}

function pickItems(pool, count, seed) {
  const indices = [];
  const used = new Set();
  let i = 0;
  while (indices.length < count) {
    const idx = Math.floor(seededRand(seed, i++) * pool.length);
    if (!used.has(idx)) { used.add(idx); indices.push(idx); }
  }
  return indices.map(i => pool[i]);
}

function generateTrendData(trend, type, years = 7) {
  const base = trend.impact * 10;
  const mult = SCENARIO_TEMPLATES[type].multiplier;
  const seed = trend.name.length + trend.impact;
  let prev = base;
  return Array.from({ length: years }, (_, i) => {
    const noise = seededRand(seed + i, i) * 0.3 - 0.1;
    const growth = mult * (1 + i * 0.2 + noise);
    prev = Math.round(base * growth);
    return { year: new Date().getFullYear() + i, value: Math.max(5, prev) };
  });
}

export function generateScenarios(trends) {
  if (!trends.length) return [];
  const seed = trends.reduce((acc, t) => acc + t.name.charCodeAt(0) + t.impact, 0);
  const avgImpact = trends.reduce((a, t) => a + t.impact, 0) / trends.length;

  return Object.entries(SCENARIO_TEMPLATES).map(([type, meta], ti) => {
    const risks = pickItems(RISK_POOL, 4, seed + ti * 7);
    const opportunities = pickItems(OPPORTUNITY_POOL, 4, seed + ti * 13);
    const insight = INSIGHT_POOL[Math.floor(seededRand(seed + ti, 3) * INSIGHT_POOL.length)];
    const narrative = NARRATIVE_POOL[Math.floor(seededRand(seed + ti, 5) * NARRATIVE_POOL.length)];

    const trendData = trends.map(t => ({
      name: t.name,
      data: generateTrendData(t, type),
    }));

    const probability = type === 'baseline' ? 45 : type === 'optimistic' ? 25 : type === 'pessimistic' ? 20 : 10;
    const timeframe = type === 'wildcard' ? '3–7 years' : avgImpact > 7 ? '1–3 years' : '3–5 years';
    const disruptionScore = Math.round(30 + seededRand(seed + ti, 9) * 70);

    return { type, ...meta, risks, opportunities, insight, narrative, trendData, probability, timeframe, disruptionScore };
  });
}

export function analyzeTrends(trends) {
  if (!trends.length) return null;
  const avgImpact = trends.reduce((a, t) => a + t.impact, 0) / trends.length;
  const dominant = trends.reduce((a, b) => a.impact > b.impact ? a : b, trends[0]);
  const seed = trends.reduce((acc, t) => acc + t.name.charCodeAt(0), 0);
  const convergenceScore = Math.round(40 + seededRand(seed, 7) * 60);

  return {
    avgImpact: avgImpact.toFixed(1),
    highImpactCount: trends.filter(t => t.impact >= 7).length,
    dominantTrend: dominant.name,
    volatility: avgImpact > 7 ? 'Extreme' : avgImpact > 4 ? 'High' : 'Moderate',
    outlook: avgImpact > 6 ? 'Transformative' : avgImpact > 3 ? 'Evolutionary' : 'Incremental',
    convergenceScore,
    horizon: avgImpact > 7 ? '2026–2029' : '2027–2032',
  };
}
