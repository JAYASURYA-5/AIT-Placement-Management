import React from 'react';

/* ─── Recent Activity ─────────────────────────────────────── */
const activities = [
  { id: 1, icon: '🏢', color: '#2563EB', bg: '#EEF5FF', text: 'Applied to Zoho Corporation', sub: 'Software Developer · 12 LPA', time: '2h ago', tag: 'Applied', tagColor: '#2563EB', tagBg: '#EEF5FF' },
  { id: 2, icon: '🎯', color: '#16A34A', bg: '#EEF8F1', text: 'Shortlisted by Infosys', sub: 'System Engineer · 9 LPA', time: '1d ago', tag: 'Shortlisted', tagColor: '#16A34A', tagBg: '#EEF8F1' },
  { id: 3, icon: '📝', color: '#D97706', bg: '#FEF9EB', text: 'Resume AI Review Completed', sub: 'Score: 82/100 — 3 improvements suggested', time: '2d ago', tag: 'Review', tagColor: '#D97706', tagBg: '#FEF9EB' },
  { id: 4, icon: '🎤', color: '#7C3AED', bg: '#F5F3FF', text: 'Mock Interview Scheduled', sub: 'With Placement Team · Room 204', time: '3d ago', tag: 'Interview', tagColor: '#7C3AED', tagBg: '#F5F3FF' },
  { id: 5, icon: '📚', color: '#E11D48', bg: '#FDF0F0', text: 'Completed Aptitude Module', sub: '45/50 questions correct · 90%', time: '4d ago', tag: 'Training', tagColor: '#E11D48', tagBg: '#FDF0F0' },
];

/* ─── Placement Journey Steps ─────────────────────────────── */
const journeySteps = [
  { id: 1, label: 'Profile Complete',  done: true,  current: false },
  { id: 2, label: 'Resume Uploaded',   done: true,  current: false },
  { id: 3, label: 'Applied to Drives', done: true,  current: false },
  { id: 4, label: 'Shortlisted',       done: true,  current: false },
  { id: 5, label: 'Interview Round',   done: false, current: true  },
  { id: 6, label: 'Offer Received',    done: false, current: false },
];

/* ─── Quick Actions ───────────────────────────────────────── */
const quickActions = [
  { id: 'resume',   label: 'Update Resume',       icon: '📄', color: '#4F46E5', bg: '#EEF2FF' },
  { id: 'mock',     label: 'Mock Interview',       icon: '🎤', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'aptitude', label: 'Practice Aptitude',   icon: '🧠', color: '#0284C7', bg: '#EFF6FF' },
  { id: 'notify',   label: 'Notifications',        icon: '🔔', color: '#D97706', bg: '#FEF9EB' },
  { id: 'docs',     label: 'My Documents',         icon: '📁', color: '#16A34A', bg: '#EEF8F1' },
  { id: 'profile',  label: 'Edit Profile',         icon: '👤', color: '#E11D48', bg: '#FDF0F0' },
];

/* ─── Top Recruiters ──────────────────────────────────────── */
const recruiters = [
  { id: 1, name: 'Zoho Corporation', sector: 'Product',     openings: 24, logo: 'Z', logoBg: '#FEF2F2', logoColor: '#DC2626' },
  { id: 2, name: 'Infosys',          sector: 'IT Services', openings: 58, logo: 'I', logoBg: '#EFF6FF', logoColor: '#0284C7' },
  { id: 3, name: 'TCS',              sector: 'IT Services', openings: 42, logo: 'T', logoBg: '#FAF5FF', logoColor: '#7C3AED' },
  { id: 4, name: 'Freshworks',       sector: 'SaaS',        openings: 15, logo: 'F', logoBg: '#EEF8F1', logoColor: '#16A34A' },
];

/* ─── Skills Progress ─────────────────────────────────────── */
const skills = [
  { name: 'Aptitude',       pct: 82, color: '#7C3AED' },
  { name: 'Coding',         pct: 67, color: '#0284C7' },
  { name: 'Communication',  pct: 75, color: '#16A34A' },
  { name: 'Resume Quality', pct: 88, color: '#D97706' },
];

/* ═══ Main Component ═══════════════════════════════════════ */
export default function DashboardExtras({ setActiveTab }) {

  const handleQuickAction = (id) => {
    const map = {
      resume:   'resume',
      mock:     'mock-interview',
      aptitude: 'training',
      notify:   'notifications',
      docs:     'documents',
      profile:  'profile',
    };
    if (setActiveTab && map[id]) setActiveTab(map[id]);
  };

  return (
    <div className="db-extras-root">

      {/* ── Row 1: Recent Activity + Placement Journey + Skills ── */}
      <div className="db-row db-row-2col">

        {/* Recent Activity */}
        <div className="db-card">
          <div className="db-card-header">
            <span className="db-card-title">Recent Activity</span>
            <span className="db-card-badge">Last 7 days</span>
          </div>
          <ul className="db-activity-list">
            {activities.map(act => (
              <li key={act.id} className="db-activity-item">
                <span className="db-activity-icon" style={{ background: act.bg }}>{act.icon}</span>
                <div className="db-activity-info">
                  <p className="db-activity-text">{act.text}</p>
                  <p className="db-activity-sub">{act.sub}</p>
                </div>
                <div className="db-activity-right">
                  <span className="db-activity-tag" style={{ color: act.tagColor, background: act.tagBg }}>{act.tag}</span>
                  <span className="db-activity-time">{act.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: Journey + Skills */}
        <div className="db-col">

          {/* Placement Journey */}
          <div className="db-card db-card-journey">
            <div className="db-card-header">
              <span className="db-card-title">Placement Journey</span>
              <span className="db-card-badge db-badge-green">67% Complete</span>
            </div>
            <div className="db-journey-steps">
              {journeySteps.map((step, idx) => (
                <div key={step.id} className={`db-journey-step${step.done ? ' done' : ''}${step.current ? ' current' : ''}`}>
                  <div className="db-journey-left">
                    <div className="db-journey-dot">
                      {step.done ? (
                        <svg viewBox="0 0 12 12" fill="none" style={{ width: '12px', height: '12px' }}>
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : step.current ? (
                        <div className="db-journey-inner-pulse" />
                      ) : null}
                    </div>
                    {idx < journeySteps.length - 1 && (
                      <div className={`db-journey-line${step.done ? ' done' : ''}`} />
                    )}
                  </div>
                  <span className="db-journey-label">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Progress */}
          <div className="db-card">
            <div className="db-card-header">
              <span className="db-card-title">Skills Progress</span>
              <span className="db-card-badge">Self Assessment</span>
            </div>
            <div className="db-skills-list">
              {skills.map(s => (
                <div key={s.name} className="db-skill-row">
                  <span className="db-skill-name">{s.name}</span>
                  <div className="db-skill-bar-track">
                    <div className="db-skill-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span className="db-skill-pct" style={{ color: s.color }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Row 2: Quick Actions + Top Recruiters ────────── */}
      <div className="db-row db-row-2col">

        {/* Quick Actions */}
        <div className="db-card">
          <div className="db-card-header">
            <span className="db-card-title">Quick Actions</span>
          </div>
          <div className="db-quick-grid">
            {quickActions.map(qa => (
              <button
                key={qa.id}
                className="db-quick-btn"
                onClick={() => handleQuickAction(qa.id)}
                style={{ background: qa.bg }}
              >
                <span className="db-quick-icon">{qa.icon}</span>
                <span className="db-quick-label" style={{ color: qa.color }}>{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Recruiters */}
        <div className="db-card">
          <div className="db-card-header">
            <span className="db-card-title">Top Recruiters on Campus</span>
            <span className="db-card-badge">{recruiters.length} companies</span>
          </div>
          <div className="db-recruiters-list">
            {recruiters.map(r => (
              <div key={r.id} className="db-recruiter-row">
                <div className="db-recruiter-logo" style={{ background: r.logoBg, color: r.logoColor }}>
                  {r.logo}
                </div>
                <div className="db-recruiter-info">
                  <p className="db-recruiter-name">{r.name}</p>
                  <p className="db-recruiter-sector">{r.sector}</p>
                </div>
                <div className="db-recruiter-openings">
                  <span className="db-openings-num">{r.openings}</span>
                  <span className="db-openings-label">openings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 3: Motivational Tip ───────────────────────── */}
      <div className="db-tip-banner">
        <span className="db-tip-emoji">💡</span>
        <div className="db-tip-content">
          <p className="db-tip-title">Today's Placement Tip</p>
          <p className="db-tip-text">
            Practice at least <strong>2 coding problems</strong> and <strong>1 mock interview</strong> per week to stay ahead.
            Companies often ask data structures &amp; algorithms in the first round!
          </p>
        </div>
        <div className="db-tip-decoration" />
      </div>

    </div>
  );
}

