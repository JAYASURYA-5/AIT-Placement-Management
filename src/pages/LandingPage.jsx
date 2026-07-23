import React, { useState, useEffect, useRef } from 'react';

/* ─── Recruiter logos (inline SVG / text badges) ─── */
const recruiters = [
  {
    name: 'Google',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontFamily: 'Product Sans, Arial, sans-serif', fontWeight: 700, fontSize: '22px' }}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC04' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </span>
    ),
  },
  {
    name: 'Microsoft',
    el: (
      <span className="lp-recruiter-logo-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="20" height="20" viewBox="0 0 21 21">
          <rect x="0" y="0" width="10" height="10" fill="#F25022" />
          <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
          <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
          <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>Microsoft</span>
      </span>
    ),
  },
  {
    name: 'Amazon',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: '22px', color: '#FF9900', letterSpacing: '-1px' }}>
        amazon
        <svg viewBox="0 0 100 20" width="60" height="12" style={{ display: 'block', marginTop: '-4px' }}>
          <path d="M5 10 Q50 20 95 8" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="92,5 98,12 88,14" fill="#FF9900" />
        </svg>
      </span>
    ),
  },
  {
    name: 'TCS',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontWeight: 900, fontSize: '22px', color: '#0076CE', letterSpacing: '2px' }}>tcs</span>
    ),
  },
  {
    name: 'Infosys',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '20px', color: '#007CC3', fontStyle: 'italic' }}>Infosys</span>
    ),
  },
  {
    name: 'Zoho',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontWeight: 900, fontSize: '20px', background: 'linear-gradient(90deg,#E01F27,#F07D00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>ZOHO</span>
    ),
  },
  {
    name: 'Accenture',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontWeight: 700, fontSize: '18px', color: '#A100FF' }}>accenture</span>
    ),
  },
  {
    name: 'Wipro',
    el: (
      <span className="lp-recruiter-logo-text" style={{ fontWeight: 700, fontSize: '18px', color: '#341C75' }}>
        wipro
        <span style={{ color: '#5BC4BF', fontWeight: 900 }}>.</span>
      </span>
    ),
  },
];

/* ─── Animated counter hook ─── */
function useCountUp(target, duration, started) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return val;
}

/* ─── Stat card ─── */
function StatCard({ value, suffix, label, color, started }) {
  const numeric = parseInt(String(value).replace(/\D/g, ''), 10);
  const count = useCountUp(numeric, 1800, started);
  return (
    <div className="lp-stat-card">
      <div className="lp-stat-value" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="lp-stat-label">{label}</div>
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage({ onStudentLogin, onCompanyLogin }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-root">
      {/* ── NAVBAR ── */}
      <nav className={`lp-nav${scrolled ? ' lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <svg viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#4C1536" />
                <path d="M8 26L18 10l10 16H8z" fill="white" fillOpacity="0.9" />
                <circle cx="18" cy="14" r="3" fill="#F6EBF1" />
              </svg>
            </div>
            <div className="lp-brand-text">
              <span className="lp-brand-name">AIT</span>
              <span className="lp-brand-sub">PLACEMENT PORTAL</span>
            </div>
          </div>

          <button className="lp-btn lp-btn--primary lp-login-btn" onClick={onStudentLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span className="lp-badge-dot" />
            AIT Placement Portal 2025–26
          </div>

          <h1 className="lp-hero-title">
            Your Future<br />
            <span className="lp-hero-title--highlight">Starts Here</span>
          </h1>

          <p className="lp-hero-subtitle">
            Connecting talented students with the right opportunities. Land your dream job with AIT's industry-leading placement cell.
          </p>

          <div className="lp-hero-actions">
            <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={onStudentLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Student Login
            </button>
            <button className="lp-btn lp-btn--outline lp-btn--lg" onClick={onCompanyLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              Company / HR Login
            </button>
          </div>

          <div className="lp-hero-trust">
            {['No registration fee', '120+ top companies', 'AI-powered prep'].map((t) => (
              <div key={t} className="lp-trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-hero-image-wrap">
          <div className="lp-hero-image-glow" />
          <img src="/college-hero.png" alt="AIT College Campus" className="lp-hero-img" />
          <div className="lp-hero-float-badge lp-hero-float-badge--top">
            <span className="lp-float-icon">🎓</span>
            <div>
              <div className="lp-float-val">850+</div>
              <div className="lp-float-sub">Students Placed</div>
            </div>
          </div>
          <div className="lp-hero-float-badge lp-hero-float-badge--bottom">
            <span className="lp-float-icon">💼</span>
            <div>
              <div className="lp-float-val">18 LPA</div>
              <div className="lp-float-sub">Highest Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lp-stats-section" ref={statsRef}>
        <StatCard value={95} suffix="%" label="Placement Rate" color="#4C1536" started={statsVisible} />
        <StatCard value={850} suffix="+" label="Students Placed" color="#4C1536" started={statsVisible} />
        <StatCard value={120} suffix="+" label="Recruiting Companies" color="#4C1536" started={statsVisible} />
        <StatCard value={18} suffix=" LPA" label="Highest Package" color="#4C1536" started={statsVisible} />
      </section>

      {/* ── TOP RECRUITERS ── */}
      <section className="lp-recruiters-section">
        <div className="lp-recruiters-header">
          <h2 className="lp-recruiters-title">Our Top Recruiters</h2>
          <a href="#" className="lp-recruiters-viewall">View All →</a>
        </div>
        <div className="lp-recruiters-grid">
          {recruiters.map((r) => (
            <div key={r.name} className="lp-recruiter-chip" title={r.name}>{r.el}</div>
          ))}
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="lp-features-strip">
        {[
          { icon: '📋', title: 'Apply to Drives', desc: 'Browse & apply to 100+ active campus drives in one click.' },
          { icon: '🤖', title: 'AI Interview Prep', desc: 'Mock interviews & smart feedback powered by AI.' },
          { icon: '📅', title: 'Drive Calendar', desc: 'Never miss a deadline with live placement schedules.' },
          { icon: '📊', title: 'Track Applications', desc: 'Real-time status updates from applied to offered.' },
        ].map((f) => (
          <div key={f.title} className="lp-feature-card">
            <div className="lp-feature-icon">{f.icon}</div>
            <h3 className="lp-feature-title">{f.title}</h3>
            <p className="lp-feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-content">
          <h2 className="lp-cta-title">Ready to launch your career?</h2>
          <p className="lp-cta-sub">Join hundreds of AIT students who landed their dream jobs through our portal.</p>
          <div className="lp-cta-actions">
            <button className="lp-btn lp-btn--white lp-btn--lg" onClick={onStudentLogin}>
              Get Started — Student Login
            </button>
            <button className="lp-btn lp-btn--outline-white lp-btn--lg" onClick={onCompanyLogin}>
              Post a Job — Company Login
            </button>
          </div>
        </div>
        <div className="lp-cta-decoration">
          <div className="lp-cta-circle lp-cta-circle--1" />
          <div className="lp-cta-circle lp-cta-circle--2" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-brand-icon lp-brand-icon--sm">
              <svg viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#4C1536" />
                <path d="M8 26L18 10l10 16H8z" fill="white" fillOpacity="0.9" />
                <circle cx="18" cy="14" r="3" fill="#F6EBF1" />
              </svg>
            </div>
            <div>
              <div className="lp-footer-brand-name">AIT Placement Portal</div>
              <div className="lp-footer-brand-sub">© 2025–26 All rights reserved.</div>
            </div>
          </div>
          <div className="lp-footer-links">
            {['Privacy Policy', 'Terms of Use', 'Contact Us', 'Help'].map((l) => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
