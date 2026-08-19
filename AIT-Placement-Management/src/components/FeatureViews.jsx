import React, { useState, useEffect } from 'react';
import ApplicationsPage from '../pages/Applications';
import DriveCalendarPage from '../pages/DriveCalendar';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import ChatbotView from './ChatbotWidget';
import '../index.css';
import {
  ProfileIcon,
  AssessmentsIcon,
  ResumeIcon,
  TrainingIcon,
  MockInterviewIcon,
  CertificatesIcon,
  DocumentsIcon,
  SparklesIcon,
  UploadIcon,
  InfoIcon,
  RefreshIcon,
  DownloadIcon,
  CodeIcon,
  ResourcesIcon,
  AlumniIcon,
  BellIcon
} from './Icons';

// ─── Standalone Certificates Component ─────────────────────────────────
function CertificatesView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAll, setShowAll] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Modals
  const [selectedCert, setSelectedCert] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Certificate Form State
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Courses',
    skills: '',
    credentialUrl: '',
  });

  const filters = ['All', 'Achievements', 'Courses', 'Internships'];

  const [certificatesList, setCertificatesList] = useState([
    {
      id: 1,
      title: 'Python Programming',
      issuer: 'Coursera',
      date: '10 Jun 2025',
      category: 'Courses',
      iconBg: '#3B82F6',
      iconColor: '#fff',
      iconSvg: 'python',
      credentialUrl: 'https://coursera.org',
      skills: ['Python', 'Data Analysis', 'OOP'],
      credentialId: 'COUR-PY-84920',
      timestamp: new Date('2025-06-10').getTime(),
    },
    {
      id: 2,
      title: 'Data Structures',
      issuer: 'Udemy',
      date: '25 May 2025',
      category: 'Courses',
      iconBg: '#F59E0B',
      iconColor: '#fff',
      iconSvg: 'bulb',
      credentialUrl: 'https://udemy.com',
      skills: ['DSA', 'Trees', 'Graphs', 'C++'],
      credentialId: 'UDE-DSA-99124',
      timestamp: new Date('2025-05-25').getTime(),
    },
    {
      id: 3,
      title: 'Web Development',
      issuer: 'Udemy',
      date: '16 Apr 2025',
      category: 'Courses',
      iconBg: '#8B5CF6',
      iconColor: '#fff',
      iconSvg: 'code',
      credentialUrl: 'https://udemy.com',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      credentialId: 'UDE-WEB-77312',
      timestamp: new Date('2025-04-16').getTime(),
    },
    {
      id: 4,
      title: 'SQL for Data Science',
      issuer: 'Coursera',
      date: '30 Mar 2025',
      category: 'Courses',
      iconBg: '#10B981',
      iconColor: '#fff',
      iconSvg: 'db',
      credentialUrl: 'https://coursera.org',
      skills: ['SQL', 'PostgreSQL', 'Database Design'],
      credentialId: 'COUR-SQL-10293',
      timestamp: new Date('2025-03-30').getTime(),
    },
    {
      id: 5,
      title: 'Hackathon Winner 2025',
      issuer: 'AIT College',
      date: '15 Feb 2025',
      category: 'Achievements',
      iconBg: '#EF4444',
      iconColor: '#fff',
      iconSvg: 'trophy',
      credentialUrl: 'https://ait.edu',
      skills: ['Problem Solving', 'Teamwork', 'Fullstack'],
      credentialId: 'AIT-HACK-0012',
      timestamp: new Date('2025-02-15').getTime(),
    },
    {
      id: 6,
      title: 'React Developer Certification',
      issuer: 'freeCodeCamp',
      date: '01 Jan 2025',
      category: 'Courses',
      iconBg: '#0EA5E9',
      iconColor: '#fff',
      iconSvg: 'react',
      credentialUrl: 'https://freecodecamp.org',
      skills: ['React.js', 'Redux', 'JSX', 'REST API'],
      credentialId: 'FCC-REACT-5510',
      timestamp: new Date('2025-01-01').getTime(),
    },
    {
      id: 7,
      title: 'Internship - Frontend Dev',
      issuer: 'Zoho Corp',
      date: '30 Nov 2024',
      category: 'Internships',
      iconBg: '#D97706',
      iconColor: '#fff',
      iconSvg: 'intern',
      credentialUrl: 'https://zoho.com',
      skills: ['Frontend', 'UI Design', 'Product Testing'],
      credentialId: 'ZOHO-INT-8831',
      timestamp: new Date('2024-11-30').getTime(),
    },
    {
      id: 8,
      title: 'Best Outgoing Student',
      issuer: 'AIT College',
      date: '10 Oct 2024',
      category: 'Achievements',
      iconBg: '#EC4899',
      iconColor: '#fff',
      iconSvg: 'star',
      credentialUrl: 'https://ait.edu',
      skills: ['Leadership', 'Academic Excellence'],
      credentialId: 'AIT-AWARD-2024',
      timestamp: new Date('2024-10-10').getTime(),
    },
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter & Search & Sort Logic
  const filtered = certificatesList
    .filter(c => {
      const matchesFilter = activeFilter === 'All' || c.category === activeFilter;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });

  const displayed = showAll ? filtered : filtered.slice(0, 6);

  const handleDownload = (cert) => {
    showToast(`⬇️ Downloading "${cert.title}" certificate...`);

    const certificateHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cert.title} - Certificate of Completion</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body {
      margin: 0;
      padding: 40px;
      background: #f4f4f7;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .cert-box {
      width: 900px;
      padding: 50px 60px;
      background: #ffffff;
      border: 12px solid #4C1536;
      outline: 3px solid #D97706;
      outline-offset: -18px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      position: relative;
      text-align: center;
      box-sizing: border-box;
    }
    .header-logo {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 700;
      color: #4C1536;
      letter-spacing: 4px;
      margin-bottom: 5px;
    }
    .sub-header {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #7D7378;
      text-transform: uppercase;
      margin-bottom: 30px;
    }
    .cert-title-label {
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #7D7378;
    }
    .student-name {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      color: #4C1536;
      margin: 15px 0;
      border-bottom: 2px solid #EFE8E1;
      display: inline-block;
      padding-bottom: 8px;
    }
    .cert-description {
      font-size: 16px;
      color: #2D2529;
      line-height: 1.6;
      max-width: 680px;
      margin: 15px auto 30px;
    }
    .course-name {
      font-size: 24px;
      font-weight: 800;
      color: #D97706;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #E3D9CF;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      width: 180px;
      border-bottom: 1.5px solid #2D2529;
      margin-bottom: 6px;
    }
    .badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4C1536, #9B1B30);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(76,21,54,0.3);
      margin: 0 auto;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="cert-box">
    <div class="header-logo">AIT PLACEMENT PORTAL</div>
    <div class="sub-header">Official Verified Certificate</div>
    <div class="cert-title-label">This certificate is proudly awarded to</div>
    <div class="student-name">Jayasurya K</div>
    <div class="cert-description">
      For successfully completing the certified program in <br>
      <span class="course-name">${cert.title}</span><br>
      issued by <strong>${cert.issuer}</strong> on <strong>${cert.date}</strong>.
    </div>
    <div class="footer-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div style="font-size: 12px; font-weight: 700; color: #7D7378;">${cert.issuer} Representative</div>
      </div>
      <div class="badge">VERIFIED<br>AIT</div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div style="font-size: 12px; font-weight: 700; color: #7D7378;">Placement Director</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddCertificateSubmit = (e) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) {
      alert('Please fill in the Certificate Title and Issuer.');
      return;
    }

    const categoryIcons = {
      Courses: 'code',
      Achievements: 'trophy',
      Internships: 'intern',
    };

    const createdCert = {
      id: Date.now(),
      title: newCert.title,
      issuer: newCert.issuer,
      date: newCert.date || 'Today',
      category: newCert.category,
      iconBg: newCert.category === 'Achievements' ? '#EF4444' : newCert.category === 'Internships' ? '#D97706' : '#4C1536',
      iconColor: '#fff',
      iconSvg: categoryIcons[newCert.category] || 'bulb',
      credentialUrl: newCert.credentialUrl || 'https://ait.edu',
      skills: newCert.skills ? newCert.skills.split(',').map(s => s.trim()) : ['Verified Skill'],
      credentialId: `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date(newCert.date || Date.now()).getTime(),
    };

    setCertificatesList([createdCert, ...certificatesList]);
    setIsAddModalOpen(false);
    setNewCert({ title: '', issuer: '', date: new Date().toISOString().split('T')[0], category: 'Courses', skills: '', credentialUrl: '' });
    showToast(`🎉 "${createdCert.title}" added to your certificates!`);
  };

  const handleDeleteCert = (certId) => {
    if (window.confirm('Are you sure you want to remove this certificate?')) {
      setCertificatesList(certificatesList.filter(c => c.id !== certId));
      setSelectedCert(null);
      showToast('🗑️ Certificate removed successfully.');
    }
  };

  const handleCopyLink = (cert) => {
    navigator.clipboard.writeText(cert.credentialUrl);
    showToast(`📋 Copied credential link for "${cert.title}"!`);
  };

  const handleShareLinkedIn = (cert) => {
    const text = encodeURIComponent(`I'm excited to share my certification in ${cert.title} issued by ${cert.issuer}! #AITPlacements #SkillBuilding`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  const renderCertIcon = (type, bg, color) => {
    const icons = {
      python: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <path d="M12 2C8.13 2 8 4.5 8 6v2h8V6c0-1.5-.13-4-4-4z" fill="rgba(255,255,255,0.25)" />
          <path d="M8 8H4C2.9 8 2 8.9 2 10v6c0 1.1.9 2 2 2h4V8z" fill="rgba(255,255,255,0.15)" />
          <path d="M16 8h4c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-4V8z" fill="rgba(255,255,255,0.15)" />
          <circle cx="9.5" cy="6" r="1" fill={color} />
          <circle cx="14.5" cy="18" r="1" fill={color} />
        </svg>
      ),
      bulb: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      ),
      code: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      db: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      trophy: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
          <path d="M14 14.66V17c0 .55.47 1 1 1h2c.55 0 1-.45 1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      ),
      react: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2c5.5 0 10 4.5 10 10S17.5 22 12 22 2 17.5 2 12 22 2 17.5 2 12 6.5 2 12 2" />
          <path d="M2.5 12h19M12 2.5c2 3.5 2 8 0 11M12 2.5c-2 3.5-2 8 0 11" />
        </svg>
      ),
      intern: (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      star: (
        <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    };
    return (
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        backgroundColor: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
        boxShadow: `0 4px 12px ${bg}55`,
      }}>
        {icons[type] || icons.code}
      </div>
    );
  };

  // Metrics counters
  const totalCount = certificatesList.length;
  const coursesCount = certificatesList.filter(c => c.category === 'Courses').length;
  const achievementsCount = certificatesList.filter(c => c.category === 'Achievements').length;
  const internshipsCount = certificatesList.filter(c => c.category === 'Internships').length;

  return (
    <div className="cert-page-wrapper">
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '100px',
          backgroundColor: 'var(--primary-maroon)', color: '#fff',
          padding: '12px 20px', borderRadius: '14px',
          fontWeight: '700', fontSize: '13.5px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 3000, animation: 'fadeIn 0.2s ease-out',
        }}>
          {toastMsg}
        </div>
      )}

      <div className="cert-layout">
        {/* ── Main Panel ──────────────────── */}
        <div className="cert-main-panel">
          {/* Section header & Add Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 className="cert-section-title" style={{ margin: 0 }}>Certificates</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>
                Verified credentials and certifications awarded to Jayasurya K
              </p>
            </div>

            <button
              className="cert-btn-download"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: '10px 20px', borderRadius: '12px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '13.5px', fontWeight: '700',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Certificate
            </button>
          </div>

          {/* ── Summary Stats Bar ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px', marginBottom: '24px', padding: '16px',
            backgroundColor: '#F9F7FC', borderRadius: '16px', border: '1px solid #EDE8F5'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Earned</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-maroon)' }}>{totalCount}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Courses</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#3B82F6' }}>{coursesCount}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Achievements</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#EF4444' }}>{achievementsCount}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Internships</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#D97706' }}>{internshipsCount}</span>
            </div>
          </div>

          {/* ── Filter Tabs & Controls Row ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            {/* Filter Tabs */}
            <div className="cert-filter-tabs" style={{ marginBottom: 0 }}>
              {filters.map(f => (
                <button
                  key={f}
                  className={`cert-filter-tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => { setActiveFilter(f); setShowAll(false); }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Search + Sort */}
            <div style={{ display: 'flex', gap: '10px', flex: '1', maxWidth: '420px', justifyContent: 'flex-end' }}>
              <div style={{ position: 'relative', flex: '1' }}>
                <input
                  type="text"
                  placeholder="Search certificate or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 14px 8px 36px', borderRadius: '10px',
                    border: '1px solid var(--border-medium)', fontSize: '13px',
                    outline: 'none', backgroundColor: '#FAF6F0'
                  }}
                />
                <svg
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', stroke: 'var(--text-muted)' }}
                  viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '10px',
                  border: '1px solid var(--border-medium)', fontSize: '12.5px',
                  fontWeight: '600', color: 'var(--text-main)', backgroundColor: '#FAF6F0',
                  outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Certificate Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <CertificatesIcon style={{ width: '40px', height: '40px', margin: '0 auto 12px', display: 'block', stroke: 'var(--border-medium)' }} />
              <p style={{ fontWeight: '700', fontSize: '15px' }}>No certificates match "{searchQuery || activeFilter}"</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search query or filter tab.</p>
            </div>
          ) : (
            <div className="cert-grid">
              {displayed.map(cert => (
                <div key={cert.id} className="cert-card">
                  {/* Icon + Info */}
                  <div className="cert-card-top">
                    {renderCertIcon(cert.iconSvg, cert.iconBg, cert.iconColor)}
                    <div className="cert-card-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 className="cert-card-title">{cert.title}</h4>
                        <span style={{
                          fontSize: '10.5px', fontWeight: '800', color: '#16A34A',
                          backgroundColor: '#DCFCE7', padding: '2px 7px', borderRadius: '6px'
                        }}>✓ Verified</span>
                      </div>
                      <p className="cert-card-issuer">{cert.issuer}</p>
                      <p className="cert-card-date">Issued: {cert.date}</p>

                      {/* Skill tags */}
                      {cert.skills && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {cert.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} style={{
                              fontSize: '10px', fontWeight: '700', color: 'var(--primary-maroon)',
                              backgroundColor: 'var(--primary-maroon-light)', padding: '2px 6px', borderRadius: '4px'
                            }}>
                              #{skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="cert-card-actions">
                    <button
                      className="cert-btn cert-btn-view"
                      onClick={() => setSelectedCert(cert)}
                    >
                      View Details
                    </button>
                    <button
                      className="cert-btn cert-btn-download"
                      onClick={() => handleDownload(cert)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All / Show Less */}
          {filtered.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                className="cert-view-all-btn"
                onClick={() => setShowAll(prev => !prev)}
              >
                {showAll ? 'Show Less' : `View All Certificates (${filtered.length})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── View Details Modal ── */}
      {selectedCert && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 3500, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px',
            maxWidth: '540px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-light)', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {renderCertIcon(selectedCert.iconSvg, selectedCert.iconBg, selectedCert.iconColor)}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{selectedCert.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>Issued by {selectedCert.issuer}</p>
                </div>
              </div>
              <button
                style={{ border: 'none', background: 'transparent', fontSize: '20px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSelectedCert(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF6F0', borderRadius: '10px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Credential ID:</span>
                <span style={{ fontWeight: '800', color: 'var(--primary-maroon)', fontFamily: 'monospace' }}>{selectedCert.credentialId || 'CERT-AIT-9921'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF6F0', borderRadius: '10px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Issue Date:</span>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{selectedCert.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF6F0', borderRadius: '10px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Verification Status:</span>
                <span style={{ fontWeight: '800', color: '#16A34A' }}>✓ Authenticated & Linked</span>
              </div>

              {selectedCert.skills && (
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Mastered Competencies:</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedCert.skills.map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '12px', fontWeight: '700', color: 'var(--primary-maroon)',
                        backgroundColor: 'var(--primary-maroon-light)', padding: '4px 10px', borderRadius: '8px'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons inside View Modal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '24px' }}>
              <button
                className="cert-btn cert-btn-download"
                onClick={() => handleDownload(selectedCert)}
              >
                ⬇️ Download Certificate
              </button>
              <button
                className="cert-btn cert-btn-view"
                onClick={() => handleShareLinkedIn(selectedCert)}
              >
                💼 Share on LinkedIn
              </button>
              <button
                className="cert-btn cert-btn-view"
                onClick={() => handleCopyLink(selectedCert)}
              >
                🔗 Copy Link
              </button>
              <button
                style={{
                  padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCA5A5',
                  backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer'
                }}
                onClick={() => handleDeleteCert(selectedCert.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Certificate Modal ── */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 3500, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px',
            maxWidth: '500px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-light)', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-maroon)', margin: 0 }}>Add New Certificate</h3>
              <button
                style={{ border: 'none', background: 'transparent', fontSize: '20px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCertificateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Certificate Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Developer"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Issuing Organization *</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    required
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newCert.category}
                    onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none', backgroundColor: 'white' }}
                  >
                    <option value="Courses">Courses</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Internships">Internships</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Issue Date</label>
                  <input
                    type="date"
                    value={newCert.date}
                    onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud, Docker, Node.js"
                    value={newCert.skills}
                    onChange={(e) => setNewCert({ ...newCert, skills: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Credential Verification URL</label>
                <input
                  type="url"
                  placeholder="https://credential-verify-link.com"
                  value={newCert.credentialUrl}
                  onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="cert-btn-download"
                style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '14px', fontWeight: '800', borderRadius: '12px' }}
              >
                Save & Publish Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Standalone Alumni Network Component ───────────────────────────────
function AlumniView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBatch, setActiveBatch] = useState('All');
  const [connected, setConnected] = useState({});

  const batches = ['All', '2017 Batch', '2018 Batch', '2019 Batch', '2020 Batch', '2021 Batch'];

  const allAlumni = [
    { id: 1, name: 'Rahul R', role: 'Software Engineer', company: 'Google', batch: '2019 Batch', avatarBg: '#4F46E5', tag: 'Featured' },
    { id: 2, name: 'Sneha M', role: 'Product Manager', company: 'Amazon', batch: '2018 Batch', avatarBg: '#D97706', tag: 'Featured' },
    { id: 3, name: 'Arun Kumar', role: 'Data Scientist', company: 'Microsoft', batch: '2020 Batch', avatarBg: '#0EA5E9', tag: 'Featured' },
    { id: 4, name: 'Priya S', role: 'Frontend Engineer', company: 'Flipkart', batch: '2021 Batch', avatarBg: '#EC4899', tag: '' },
    { id: 5, name: 'Karthik V', role: 'DevOps Engineer', company: 'Zoho', batch: '2020 Batch', avatarBg: '#10B981', tag: '' },
    { id: 6, name: 'Deepika R', role: 'ML Engineer', company: 'Infosys AI Lab', batch: '2019 Batch', avatarBg: '#8B5CF6', tag: '' },
    { id: 7, name: 'Vikram N', role: 'Cloud Architect', company: 'TCS', batch: '2017 Batch', avatarBg: '#F59E0B', tag: '' },
    { id: 8, name: 'Ananya K', role: 'UX Designer', company: 'Swiggy', batch: '2021 Batch', avatarBg: '#EF4444', tag: '' },
  ];

  const filtered = allAlumni.filter(a => {
    const matchesBatch = activeBatch === 'All' || a.batch === activeBatch;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.batch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handleConnect = (id) => {
    setConnected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="feature-page-container">
      {/* Header — same style as Resources */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '10px',
            backgroundColor: 'var(--primary-maroon)', color: '#fff', fontSize: '14px', fontWeight: '800'
          }}>20</span>
          Alumni Network
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', fontWeight: '500' }}>
          Connect with AIT alumni placed across top companies worldwide.
        </p>
      </div>

      {/* Search Bar — identical to Resources */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <svg
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', stroke: 'var(--text-muted)' }}
          viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search alumni..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="resources-search-input"
        />
      </div>

      {/* Batch Filter Chips — same as Resources category chips */}
      <div className="resources-category-bar">
        {batches.map(b => (
          <button
            key={b}
            className={`resources-cat-chip ${activeBatch === b ? 'active' : ''}`}
            onClick={() => setActiveBatch(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Alumni Cards Grid — same grid as Resources */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <AlumniIcon style={{ width: '40px', height: '40px', margin: '0 auto 12px', display: 'block', stroke: 'var(--border-medium)' }} />
          <p style={{ fontWeight: '600', fontSize: '14px' }}>No alumni found for <strong>"{searchQuery || activeBatch}"</strong></p>
        </div>
      ) : (
        <div className="resources-grid">
          {filtered.map(alumni => (
            <div key={alumni.id} className="resource-card">
              <div className="resource-card-info">
                {/* Avatar — same shape as resource file icon */}
                <div
                  className="resource-file-icon"
                  style={{ backgroundColor: alumni.avatarBg, color: '#fff', fontSize: '15px', fontWeight: '800', letterSpacing: '0' }}
                >
                  {getInitials(alumni.name)}
                  {alumni.tag === 'Featured' && (
                    <span style={{
                      position: 'absolute', top: '-4px', right: '-4px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: '#22C55E', border: '2px solid #fff'
                    }}></span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h4 className="resource-title">{alumni.name}</h4>
                  <p className="resource-meta">{alumni.role} &bull; {alumni.company}</p>
                  <p className="resource-desc">{alumni.batch}</p>
                </div>
              </div>

              {/* Connect Button — same slot as Download button */}
              <button
                className={`resource-download-btn${connected[alumni.id] ? '' : ''}`}
                onClick={() => handleConnect(alumni.id)}
                style={connected[alumni.id] ? {
                  background: '#DCFCE7', color: '#15803D', borderColor: '#16A34A'
                } : {}}
              >
                {connected[alumni.id] ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Connected
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                      <path d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
                      <path d="M3 20c0-3.31 2.69-6 6-6h6c3.31 0 6 2.69 6 6" />
                    </svg>
                    Connect
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Standalone Resume View Component ─────────────────────────────────
function ResumeView({ userName = 'Jayasurya K' }) {
  const [subTab, setSubTab] = useState('checker');

  // Inbuilt Gemini API Key. Paste your key here or set VITE_GEMINI_API_KEY in your .env file
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

    // Checker states
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [detailsTab, setDetailsTab] = useState('improvements');
    const [pastedText, setPastedText] = useState('');
    const [showPasteArea, setShowPasteArea] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Builder states
    const [formData, setFormData] = useState({
      name: userName,
      role: 'Associate Software Engineer',
      email: 'jayasurya.k@ait.edu.in',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/jayasuryak',
      github: 'github.com/jayasuryak',
      education: 'B.Tech in Information Technology (IV Year) | AIT Engineering College | CGPA: 8.74',
      experience: 'Frontend Development Intern, ABC Corp (May 2025 - July 2025)\n- Resolved 25+ frontend issues in React codebase, improving system stability by 15%\n- Collaborated with design and engineering teams to build modular components\n- Assisted in implementing dashboard telemetry views.',
      projects: 'Placement Management Portal (React, CSS)\n- Built interactive web application for placement drive management\n- Designed responsive UI with dark mode support and custom dashboards\n\nPersonal Weather App (React, Web APIs)\n- Developed simple forecasting application integrating REST services',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git', 'Java', 'C++'],
      newSkill: ''
    });

    useEffect(() => {
      if (results?.score !== undefined) {
        setAnimatedScore(0);
        const timeout = setTimeout(() => {
          setAnimatedScore(results.score);
        }, 100);
        return () => clearTimeout(timeout);
      }
    }, [results]);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
      }
    };

    const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    };

    const processFile = (selectedFile) => {
      const type = selectedFile.type;
      const sizeMB = selectedFile.size / (1024 * 1024);
      if (sizeMB > 5) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);

      const reader = new FileReader();
      if (type === 'application/pdf') {
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          analyzeResume(base64Data, 'application/pdf', selectedFile.name);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Assume text file
        reader.onload = () => {
          analyzeResume(reader.result, 'text/plain', selectedFile.name);
        };
        reader.readAsText(selectedFile);
      }
    };

    const handlePastedTextSubmit = () => {
      if (!pastedText.trim()) return;
      setFile({ name: 'pasted_text.txt', type: 'text/plain', size: pastedText.length });
      setShowPasteArea(false);
      analyzeResume(pastedText, 'text/plain', 'pasted_text.txt');
    };

    const handleUseSample = () => {
      setFile({ name: 'Jayasurya_K_IT_Resume.pdf', type: 'application/pdf', size: 124000 });

      const dummyText = `JAYASURYA K
jayasurya.k@ait.edu.in | +91 98765 43210 | linkedin.com/in/jayasuryak | github.com/jayasuryak

B.Tech - Information Technology (IV Year) - AIT Engineering College
CGPA: 8.74

SKILLS: React, JavaScript, HTML, CSS, SQL, Git, Java, C++

EXPERIENCE:
Frontend Development Intern, ABC Corp (May 2025 - July 2025)
- Worked on frontend bug fixes.

PROJECTS:
1. Placement Management Portal
- Built a placement management website using React and CSS.
2. Weather App
- A simple weather forecasting app using API.`;

      if (GEMINI_API_KEY) {
        analyzeResume(dummyText, 'text/plain', 'Jayasurya_K_IT_Resume.pdf');
      } else {
        analyzeResume(null, 'application/pdf', 'Jayasurya_K_IT_Resume.pdf');
      }
    };

    const getMockResult = (_name) => {
      return {
        score: 78,
        rating: "Good",
        strengths: [
          "Excellent academic background (8.74 CGPA)",
          "Solid foundation in JavaScript & React core components",
          "Structured layout with clear contact & GitHub links",
          "Good use of bullet points for readability"
        ],
        improvements: [
          "Quantify project achievements with metrics (e.g. page speed improvements, user count)",
          "Add a short, professional profile summary at the very top of your resume",
          "Expand technical skills to cover standard modern tools (e.g. TypeScript, Next.js, Redux)",
          "Rewrite experiences using the STAR method (Situation, Task, Action, Result)"
        ],
        keywordAnalysis: {
          found: ["React", "JavaScript", "HTML", "CSS", "SQL", "Git", "Java", "C++"],
          missing: ["TypeScript", "Next.js", "Redux", "Unit Testing", "CI/CD", "Tailwind CSS", "REST API"]
        },
        alignment: "Strong alignment with Junior Frontend Engineer and Software Developer Intern roles.",
        rewrites: [
          {
            original: "Worked on frontend bug fixes during internship.",
            rewritten: "Resolved 25+ frontend issues in React codebase, improving system stability by 15% and collaborating with a team of 4 engineers."
          },
          {
            original: "Built a weather forecasting app using an API.",
            rewritten: "Developed and deployed a responsive Weather App using React, integrating OpenWeather REST API to serve real-time forecasts to over 500+ active users."
          },
          {
            original: "Built interactive web application for placement drive management.",
            rewritten: "Designed and implemented a placement management dashboard in React, reducing processing delays for drive registrations by 40%."
          }
        ]
      };
    };

    const analyzeResume = async (content, mimeType, name) => {
      setLoading(true);
      setScanProgress(0);

      const steps = [
        { text: "Extracting resume structure and typography...", delay: 600 },
        { text: "Analyzing ATS keywords and technical density...", delay: 1300 },
        { text: "Evaluating experience impact with STAR format...", delay: 2000 },
        { text: "Formulating critical scoring vectors...", delay: 2700 }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          setScanProgress(idx);
        }, step.delay);
      });

      try {
        if (!GEMINI_API_KEY) {
          // Mock mode fallback
          setTimeout(() => {
            setResults(getMockResult(name));
            setLoading(false);
          }, 3500);
          return;
        }

        const promptText = `You are an elite corporate recruiter and Applicant Tracking System (ATS) optimization expert.
Conduct a rigorous, highly accurate, and comprehensive audit of the attached resume. Your scoring must be realistic and reflect industry standard recruiting filters.
Provide analysis and recommendations, and return ONLY a JSON response conforming to the schema below.

Scoring Criteria Guidelines:
- High Score (85-100): Excellent keyword alignment, quantified achievements (STAR method), clear work history, clean structural hierarchy.
- Medium Score (70-84): Good layout and core skills, but lacks numerical metrics, has weak action verbs, or misses standard keywords.
- Low Score (<70): Poor layout structure, zero metrics, weak action statements, grammatical issues, or massive keyword gaps.

Return a JSON object matching this schema EXACTLY:
{
  "score": number (an integer from 0 to 100 representing a strict, realistic ATS score),
  "rating": "Excellent!" (score >= 85) | "Good" (70-84) | "Average" (50-69) | "Needs Improvement" (<50),
  "strengths": [string], (exactly 4 key professional strengths discovered in their resume)
  "improvements": [string], (up to 5 actionable, critical improvements to boost their score)
  "keywordAnalysis": {
    "found": [string], (up to 10 core technical and domain-specific keywords identified)
    "missing": [string] (up to 8 highly relevant industry-standard technical keywords they should add for their target roles)
  },
  "alignment": string (detailed analysis of target roles and industry alignment),
  "rewrites": [
    {
      "original": string, (a weak, passive, or metric-less bullet point from their resume)
      "rewritten": string (a high-impact rewritten version using the STAR method, starting with a strong action verb and containing realistic quantitative metrics)
    }
  ] (exactly 3 bullet point rewrites)
}

Do not return any markdown tags, trailing commas, or prefix commentary. Return ONLY the raw JSON block.`;

        const requestBody = {
          contents: [
            {
              parts: [
                { text: promptText },
                mimeType === 'application/pdf'
                  ? { inlineData: { mimeType, data: content } }
                  : { text: `Resume Text:\n\n${content}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
          throw new Error("Empty response from Gemini API");
        }

        let parsed;
        try {
          parsed = JSON.parse(resultText.trim());
        } catch {
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0].trim());
          } else {
            throw new Error("Failed to parse JSON response from Gemini API");
          }
        }

        setTimeout(() => {
          setResults(parsed);
          setLoading(false);
        }, 3200);

      } catch (err) {
        console.error("Gemini API Error:", err);
        setTimeout(() => {
          alert(`API Analysis failed: ${err.message || 'Unknown Error'}. Falling back to high-fidelity Mock Mode so you can see the interface.`);
          setResults(getMockResult(name || "Uploaded Resume"));
          setLoading(false);
        }, 1500);
      }
    };

    const handleReset = () => {
      setFile(null);
      setResults(null);
      setPastedText('');
    };

    const handleDownloadReport = () => {
      if (!results) return;
      const reportText = `=========================================
ATS RESUME EVALUATION REPORT (AI GENERATED)
=========================================
Score: ${results.score} / 100
Rating: ${results.rating}
Industry Alignment: ${results.alignment}

KEY STRENGTHS:
${results.strengths.map(s => `- [✓] ${s}`).join('\n')}

RECOMMENDED IMPROVEMENTS:
${results.improvements.map(i => `- [ ] ${i}`).join('\n')}

KEYWORD ANALYSIS:
- Found: ${results.keywordAnalysis.found.join(', ')}
- Missing: ${results.keywordAnalysis.missing.join(', ')}

AI BULLET REWRITES (STAR METHOD):
${results.rewrites.map((r, i) => `\nRewrite #${i + 1}:\nOriginal: "${r.original}"\nRewritten: "${r.rewritten}"`).join('\n')}

=========================================
Report generated via AIT AI Resume Workspace.
`;
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Resume_Report_${results.score}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const handlePrintResume = () => {
      window.print();
    };

    const handleAddSkill = (e) => {
      if (e.key === 'Enter' || e.type === 'click') {
        e.preventDefault();
        if (formData.skills.length >= 15) {
          alert("Maximum of 15 skills allowed to fit the resume on one page.");
          return;
        }
        if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
          setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, prev.newSkill.trim()],
            newSkill: ''
          }));
        }
      }
    };

    const handleRemoveSkill = (skillToRemove) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skillToRemove)
      }));
    };

    const getScoreColor = (score) => {
      if (score >= 85) return '#16A34A'; // Green
      if (score >= 70) return '#EA580C'; // Orange
      if (score >= 50) return '#D97706'; // Amber/Yellow
      return '#DC2626'; // Red
    };

    const getRatingBgColor = (rating) => {
      const r = rating.toLowerCase();
      if (r.includes('excellent')) return '#DCFCE7';
      if (r.includes('good')) return '#FFEDD5';
      if (r.includes('average')) return '#FEF9C3';
      return '#FEE2E2';
    };

    const getRatingTextColor = (rating) => {
      const r = rating.toLowerCase();
      if (r.includes('excellent')) return '#15803D';
      if (r.includes('good')) return '#C2410C';
      if (r.includes('average')) return '#A16207';
      return '#B91C1C';
    };

    const arcLength = 251.33;
    const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;

    return (
      <div className="feature-page-container">
        <div className="resume-workspace">
          {/* Header & Mode Switcher */}
          <div className="resume-workspace-header">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ResumeIcon style={{ color: 'var(--primary-maroon)' }} /> Resume Workspace
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Build an industry-standard resume and check its ATS score using advanced Gemini AI analysis.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="resume-tabs">
                <button
                  className={`resume-tab-btn ${subTab === 'checker' ? 'active' : ''}`}
                  onClick={() => setSubTab('checker')}
                >
                  <SparklesIcon style={{ width: '15px', height: '15px' }} /> AI ATS Score Checker
                </button>
                <button
                  className={`resume-tab-btn ${subTab === 'builder' ? 'active' : ''}`}
                  onClick={() => setSubTab('builder')}
                >
                  <ResumeIcon style={{ width: '15px', height: '15px' }} /> Resume Builder
                </button>
              </div>
            </div>
          </div>

          {/* Main workspace panels */}
          {subTab === 'checker' ? (
            // Checker view
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!file && !loading && !results && (
                // Dropzone area
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    className={`resume-upload-zone ${dragActive ? 'dragging' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('resume-file-picker').click()}
                  >
                    <input
                      type="file"
                      id="resume-file-picker"
                      style={{ display: 'none' }}
                      accept=".pdf,.txt"
                      onChange={handleFileSelect}
                    />
                    <div className="upload-icon-box">
                      <UploadIcon style={{ width: '28px', height: '28px' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                        Upload your resume for ATS Scoring
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                        Drag and drop your PDF or Text resume here, or click to browse files.
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', fontWeight: '600' }}>
                        Maximum File Size: 5MB • Supported Formats: .pdf, .txt
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar for Sample / Paste */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="api-settings-btn"
                      onClick={handleUseSample}
                    >
                      <SparklesIcon style={{ width: '14px', height: '14px' }} /> Try Sample Resume
                    </button>
                    <button
                      className="api-settings-btn"
                      onClick={() => setShowPasteArea(!showPasteArea)}
                    >
                      <SparklesIcon style={{ width: '14px', height: '14px' }} /> Paste Resume Text Instead
                    </button>
                  </div>

                  {showPasteArea && (
                    <div style={{
                      padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px'
                    }}>
                      <label className="builder-label">Paste Resume Raw Text</label>
                      <textarea
                        className="builder-textarea"
                        style={{ minHeight: '180px' }}
                        placeholder="Paste the text contents of your resume here..."
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-medium)', background: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                          onClick={() => setShowPasteArea(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-apply"
                          onClick={handlePastedTextSubmit}
                          disabled={!pastedText.trim()}
                        >
                          Analyze Pasted Text
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                // Scanning view
                <div className="scanner-container" style={{ border: '1px solid var(--border-light)', borderRadius: '24px', backgroundColor: 'var(--bg-white)' }}>
                  <div className="scanner-doc-box">
                    <div className="scanner-doc-line"></div>
                    <div className="scanner-doc-text">
                      <div className="scanner-doc-text-line" style={{ width: '85%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '65%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '90%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '75%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--primary-maroon)', marginTop: '8px' }}>
                    Gemini AI Resumebot Scanning...
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '380px', minHeight: '40px' }}>
                    {scanProgress === 0 && "Extracting document schema & layout nodes..."}
                    {scanProgress === 1 && "Measuring industry-specific keywords density..."}
                    {scanProgress === 2 && "Validating action-oriented impact phrases..."}
                    {scanProgress === 3 && "Correlating scores with recruiting standard metrics..."}
                  </p>

                  <div style={{
                    width: '200px', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px'
                  }}>
                    <div style={{
                      width: `${(scanProgress + 1) * 25}%`, height: '100%', backgroundColor: 'var(--primary-maroon)', transition: 'width 0.6s ease'
                    }}></div>
                  </div>
                </div>
              )}

              {results && !loading && (
                // Dashboard layout
                <div className="analysis-dashboard">
                  {/* Left Column Gauge Card */}
                  <div className="score-gauge-card">
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      File: {file?.name || 'Resume'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)', marginTop: '8px', marginBottom: '24px' }}>
                      8. Resume Analyzer (AI)
                    </h3>

                    <div className="gauge-wrapper">
                      <svg viewBox="0 0 200 110" style={{ width: '100%', height: '100%' }}>
                        <path
                          d="M 20,100 A 80,80 0 0,1 180,100"
                          fill="none"
                          stroke="var(--border-light)"
                          strokeWidth="14"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 20,100 A 80,80 0 0,1 180,100"
                          fill="none"
                          stroke={getScoreColor(results.score)}
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={arcLength}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                      </svg>

                      <div className="gauge-score-text">
                        <span className="gauge-score-value">{animatedScore}</span>
                        <span className="gauge-score-max">/100</span>
                      </div>
                    </div>

                    <span className="rating-badge" style={{
                      padding: '6px 14px', borderRadius: '12px',
                      backgroundColor: getRatingBgColor(results.rating),
                      color: getRatingTextColor(results.rating)
                    }}>
                      {results.rating}!
                    </span>

                    <div className="strengths-checklist">
                      {results.strengths.map((str, idx) => (
                        <div key={idx} className="checklist-item">
                          <span className="checklist-check">✓</span>
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px', marginTop: '24px' }}>
                      <button
                        className="btn-apply"
                        style={{ width: '100%', padding: '12px 18px', fontSize: '13px' }}
                        onClick={() => {
                          const element = document.getElementById('suggestions-panel-details');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                          setDetailsTab('rewriter');
                        }}
                      >
                        Improve My Resume
                      </button>
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button
                          className="api-settings-btn"
                          style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                          onClick={handleDownloadReport}
                        >
                          <DownloadIcon style={{ width: '14px', height: '14px' }} /> Download PDF Report
                        </button>
                        <button
                          className="api-settings-btn"
                          style={{ flex: 1, justifyContent: 'center', padding: '10px', color: '#EF4444' }}
                          onClick={handleReset}
                        >
                          <RefreshIcon style={{ width: '14px', height: '14px' }} /> Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column details tab card */}
                  <div className="analysis-details-card" id="suggestions-panel-details">
                    <div className="details-tab-nav">
                      <button
                        className={`details-tab-btn ${detailsTab === 'improvements' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('improvements')}
                      >
                        Actionable Improvements
                      </button>
                      <button
                        className={`details-tab-btn ${detailsTab === 'keywords' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('keywords')}
                      >
                        ATS Keyword Analysis
                      </button>
                      <button
                        className={`details-tab-btn ${detailsTab === 'rewriter' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('rewriter')}
                      >
                        AI Bullet Rewriter (STAR)
                      </button>
                    </div>

                    {detailsTab === 'improvements' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)' }}>Target Role Alignment</h4>
                          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>
                            🎯 {results.alignment}
                          </p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', marginBottom: '12px' }}>
                            Critical Improvements Checklist
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {results.improvements.map((imp, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', lineHeight: '1.4' }}>
                                <span style={{
                                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--pink-bg)',
                                  color: 'var(--pink-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '11px', fontWeight: '800', flexShrink: 0, marginTop: '2px'
                                }}>!</span>
                                <span style={{ color: 'var(--text-main)' }}>{imp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {detailsTab === 'keywords' && (
                      <div className="keyword-grid">
                        <div className="keyword-col">
                          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>✓</span> Found Keywords ({results.keywordAnalysis.found.length})
                          </h4>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            These technical match points were successfully detected in your resume structure.
                          </p>
                          <div className="keyword-badges-list">
                            {results.keywordAnalysis.found.map((kw, i) => (
                              <span key={i} className="keyword-badge found">{kw}</span>
                            ))}
                          </div>
                        </div>

                        <div className="keyword-col" style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '20px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>⚠</span> Recommended Missing Keywords ({results.keywordAnalysis.missing.length})
                          </h4>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Adding these technical terms will help you bypass automatic filters for engineering roles.
                          </p>
                          <div className="keyword-badges-list">
                            {results.keywordAnalysis.missing.map((kw, i) => (
                              <span key={i} className="keyword-badge missing">{kw}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {detailsTab === 'rewriter' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--primary-maroon-light)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <InfoIcon style={{ color: 'var(--primary-maroon)', flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            <strong>AI Rewriter Concept:</strong> Transforming passive statements into active results. The rewritten bullet points use action verbs and quantitative metrics (STAR method) to maximize recruiter engagement.
                          </p>
                        </div>

                        <div className="rewriter-list">
                          {results.rewrites.map((item, idx) => (
                            <div key={idx} className="rewriter-item">
                              <div className="rewrite-original">
                                <strong>Original:</strong> "{item.original}"
                              </div>
                              <div className="rewrite-new">
                                <strong>Optimized STAR:</strong> "{item.rewritten}"
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Builder view
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
                    Resume Fields
                  </h3>

                  <div className="builder-form-grid">
                    <div className="builder-form-group">
                      <label className="builder-label">Full Name ({formData.name.length}/50)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={50}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Target Role ({formData.role.length}/50)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={50}
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Email Address ({formData.email.length}/60)</label>
                      <input
                        type="email"
                        className="builder-input"
                        maxLength={60}
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Phone Number ({formData.phone.length}/20)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">LinkedIn URL ({formData.linkedin.length}/100)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={100}
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">GitHub URL ({formData.github.length}/100)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={100}
                        value={formData.github}
                        onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Education Details ({formData.education.length}/150)</label>
                      <input
                        type="text"
                        className="builder-input"
                        maxLength={150}
                        value={formData.education}
                        onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Work Experience ({formData.experience.length}/500)</label>
                      <textarea
                        className="builder-textarea"
                        maxLength={500}
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Projects ({formData.projects.length}/500)</label>
                      <textarea
                        className="builder-textarea"
                        maxLength={500}
                        value={formData.projects}
                        onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Skills Checklist ({formData.skills.length}/15 skills)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="builder-input"
                          placeholder="e.g. TypeScript"
                          maxLength={30}
                          value={formData.newSkill}
                          onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                          onKeyDown={handleAddSkill}
                        />
                        <button
                          className="btn-apply"
                          style={{ height: '38px', padding: '0 16px' }}
                          onClick={handleAddSkill}
                        >
                          Add
                        </button>
                      </div>
                      <div className="builder-skills-list">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="builder-skill-tag">
                            {skill}
                            <button
                              className="builder-skill-remove"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print layout preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800' }}>Live Resume Preview</h4>
                    <button
                      className="btn-apply"
                      onClick={handlePrintResume}
                    >
                      🖨 Save PDF / Print
                    </button>
                  </div>

                  {/* Resume sheet */}
                  <div className="resume-preview-card">
                    <div className="preview-header">
                      <div className="preview-name">{formData.name || 'Your Name'}</div>
                      <div className="preview-title">{formData.role || 'Target Professional Role'}</div>
                      <div className="preview-contact">
                        {formData.email && <span>📧 {formData.email}</span>}
                        {formData.phone && <span>📞 {formData.phone}</span>}
                        {formData.linkedin && <span>🔗 LinkedIn</span>}
                        {formData.github && <span>💻 GitHub</span>}
                      </div>
                    </div>

                    <div>
                      <div className="preview-section-title">Education</div>
                      <p style={{ fontSize: '12.5px', lineHeight: '1.4' }}>{formData.education}</p>
                    </div>

                    {formData.experience && (
                      <div>
                        <div className="preview-section-title">Work Experience</div>
                        <div style={{ fontSize: '12.5px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                          {formData.experience}
                        </div>
                      </div>
                    )}

                    {formData.projects && (
                      <div>
                        <div className="preview-section-title">Key Projects</div>
                        <div style={{ fontSize: '12.5px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                          {formData.projects}
                        </div>
                      </div>
                    )}

                    {formData.skills.length > 0 && (
                      <div>
                        <div className="preview-section-title">Technical Skills</div>
                        <p style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.4' }}>
                          {formData.skills.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

// ─── Standalone Training View Component ─────────────────────────────────
function TrainingView() {
  const [subTab, setSubTab] = useState('aptitude');
    const [practiceMode, setPracticeMode] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [scoreResult, setScoreResult] = useState(null);

    // Donut Category scores
    const [categoryScores, setCategoryScores] = useState({
      aptitude: 70,
      coding: 80,
      sql: 65,
      mcq: 85
    });

    // Test History
    const [testHistory, setTestHistory] = useState([
      { id: 1, type: 'aptitude', title: 'Aptitude Test - 5', date: '20 Jul 2025', score: 85 },
      { id: 2, type: 'coding', title: 'Coding Test - Arrays', date: '18 Jul 2025', score: 90 },
      { id: 3, type: 'sql', title: 'SQL Test - Joins', date: '15 Jul 2025', score: 70 }
    ]);

    // Practice States - Aptitude
    const [aptitudeAnswers, setAptitudeAnswers] = useState({});
    const [aptitudeSubmitted, setAptitudeSubmitted] = useState(false);

    // Practice States - Coding
    const [codingCode, setCodingCode] = useState(
      `function fizzBuzz(n) {
  let result = [];
  // Write your code here
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i.toString());
  }
  return result;
}`
    );
    const [codingTestResults, setCodingTestResults] = useState(null);

    // Practice States - SQL
    const [sqlQuery, setSqlQuery] = useState("SELECT * FROM employees WHERE department = 'IT' AND salary > 60000");
    const [sqlTestResults, setSqlTestResults] = useState(null);

    // Practice States - MCQ
    const [mcqAnswers, setMcqAnswers] = useState({});
    const [mcqSubmitted, setMcqSubmitted] = useState(false);

    // Donut overall progress calculation
    const overallProgress = Math.round(
      (categoryScores.aptitude + categoryScores.coding + categoryScores.sql + categoryScores.mcq) / 4
    );

    // Donut SVG constants (Radius = 38, Circumference = 238.76)
    const circ = 238.76;
    const qtr = 59.69;

    const dashApt = (categoryScores.aptitude / 100) * qtr;
    const dashCod = (categoryScores.coding / 100) * qtr;
    const dashSql = (categoryScores.sql / 100) * qtr;
    const dashMcq = (categoryScores.mcq / 100) * qtr;

    // Aptitude Question Data
    const aptitudeQuestions = [
      {
        id: 1,
        question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        options: ["120 metres", "150 metres", "324 metres", "180 metres"],
        correct: "150 metres",
        explanation: "Speed in m/s = 60 * 5/18 = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 metres."
      },
      {
        id: 2,
        question: "The average of 20 numbers is zero. Of them, at most, how many may be greater than zero?",
        options: ["0", "1", "10", "19"],
        correct: "19",
        explanation: "To keep the average 0, we can have up to 19 positive numbers as long as the 20th number is a large negative number that balances the sum to 0."
      },
      {
        id: 3,
        question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
        options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"],
        correct: "Rs. 698",
        explanation: "Simple Interest for 1 year = Rs. 854 - 815 = Rs. 39. SI for 3 years = 39 * 3 = Rs. 117. Principal Sum = 815 - 117 = Rs. 698."
      }
    ];

    // MCQ Question Data
    const mcqQuestions = [
      {
        id: 1,
        question: "Which of the following is not a Database Management System (DBMS)?",
        options: ["PostgreSQL", "MongoDB", "Redux", "Cassandra"],
        correct: "Redux",
        explanation: "Redux is a JavaScript state management library, while PostgreSQL, MongoDB, and Cassandra are Database Management Systems."
      },
      {
        id: 2,
        question: "What is the primary function of an Operating System's kernel?",
        options: [
          "To render the graphical user interface components",
          "To manage system resources and communication between hardware and software",
          "To compile high-level programming language sources",
          "To secure internet connections and cache web resources"
        ],
        correct: "To manage system resources and communication between hardware and software",
        explanation: "The kernel is the core components of the OS that directly interacts with the hardware, allocating CPU time, memory, and devices."
      }
    ];

    const handleSubmitAptitude = () => {
      let correctCount = 0;
      aptitudeQuestions.forEach(q => {
        if (aptitudeAnswers[q.id] === q.correct) correctCount++;
      });
      const pct = Math.round((correctCount / aptitudeQuestions.length) * 100);
      setScoreResult(pct);
      setAptitudeSubmitted(true);
      setTestCompleted(true);

      // Update history & stats
      const newTest = {
        id: Date.now(),
        type: 'aptitude',
        title: `Aptitude Practice - Log`,
        date: 'Today',
        score: pct
      };
      setTestHistory(prev => [newTest, ...prev]);
      setCategoryScores(prev => ({
        ...prev,
        aptitude: Math.round((prev.aptitude + pct) / 2)
      }));
    };

    const handleRunCode = () => {
      try {
        // Safe evaluation simulation for testing
        // Build user function
        const userFnCode = codingCode + "\nreturn fizzBuzz(n);";
        const testFn = new Function('n', userFnCode);

        // Execute test cases
        const tc1 = testFn(3);
        const tc2 = testFn(5);
        const tc3 = testFn(15);

        const passed1 = Array.isArray(tc1) && tc1[2] === 'Fizz';
        const passed2 = Array.isArray(tc2) && tc2[4] === 'Buzz';
        const passed3 = Array.isArray(tc3) && tc3[14] === 'FizzBuzz' && tc3[13] === '14';

        const results = [
          { input: "n = 3", expected: "['1', '2', 'Fizz']", actual: JSON.stringify(tc1), passed: passed1 },
          { input: "n = 5", expected: "['1', '2', 'Fizz', '4', 'Buzz']", actual: JSON.stringify(tc2), passed: passed2 },
          { input: "n = 15", expected: "fizzBuzz(15)[14] == 'FizzBuzz'", actual: tc3 ? tc3[14] : 'undefined', passed: passed3 }
        ];

        setCodingTestResults(results);

        if (passed1 && passed2 && passed3) {
          setScoreResult(100);
          setTestCompleted(true);
          const newTest = {
            id: Date.now(),
            type: 'coding',
            title: 'Coding Test - FizzBuzz',
            date: 'Today',
            score: 100
          };
          setTestHistory(prev => [newTest, ...prev]);
          setCategoryScores(prev => ({
            ...prev,
            coding: Math.round((prev.coding + 100) / 2)
          }));
        } else {
          setScoreResult(50);
        }
      } catch (err) {
        setCodingTestResults([
          { input: "Runtime check", expected: "No errors", actual: `Error: ${err.message}`, passed: false }
        ]);
        setScoreResult(0);
      }
    };

    const handleRunSQL = () => {
      const isSelect = sqlQuery.toLowerCase().includes("select");
      const hasEmployees = sqlQuery.toLowerCase().includes("employees");
      const hasFilter = sqlQuery.toLowerCase().includes("it") && sqlQuery.toLowerCase().includes("60000");

      if (isSelect && hasEmployees && hasFilter) {
        setSqlTestResults({
          status: "success",
          message: "Query executed successfully. 2 rows returned.",
          rows: [
            { name: userName, department: "IT", salary: 75000 },
            { name: "Abishek R", department: "IT", salary: 65000 }
          ]
        });
        setScoreResult(100);
        setTestCompleted(true);
        const newTest = {
          id: Date.now(),
          type: 'sql',
          title: 'SQL Test - Employees',
          date: 'Today',
          score: 100
        };
        setTestHistory(prev => [newTest, ...prev]);
        setCategoryScores(prev => ({
          ...prev,
          sql: Math.round((prev.sql + 100) / 2)
        }));
      } else {
        setSqlTestResults({
          status: "error",
          message: "Query compilation failed or filters did not return IT employees with salary > 60000. Double check your query syntax and constraints.",
          rows: []
        });
        setScoreResult(30);
      }
    };

    const handleSubmitMcq = () => {
      let correctCount = 0;
      mcqQuestions.forEach(q => {
        if (mcqAnswers[q.id] === q.correct) correctCount++;
      });
      const pct = Math.round((correctCount / mcqQuestions.length) * 100);
      setScoreResult(pct);
      setMcqSubmitted(true);
      setTestCompleted(true);

      const newTest = {
        id: Date.now(),
        type: 'mcq',
        title: 'MCQ Placement - OS/DBMS',
        date: 'Today',
        score: pct
      };
      setTestHistory(prev => [newTest, ...prev]);
      setCategoryScores(prev => ({
        ...prev,
        mcq: Math.round((prev.mcq + pct) / 2)
      }));
    };

    const handleResetTest = () => {
      setPracticeMode(false);
      setTestCompleted(false);
      setScoreResult(null);
      setAptitudeAnswers({});
      setAptitudeSubmitted(false);
      setCodingTestResults(null);
      setSqlTestResults(null);
      setMcqAnswers({});
      setMcqSubmitted(false);
    };

    return (
      <div className="feature-page-container">
        <div className="training-workspace">
          {/* Header & Sub-Tabs */}
          <div className="resume-workspace-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrainingIcon style={{ color: 'var(--primary-maroon)' }} /> 9. Aptitude & Coding Practice
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Test and optimize your placement potential with interactive training modules.
              </p>
            </div>

            <div className="resume-tabs">
              <button
                className={`resume-tab-btn ${subTab === 'aptitude' ? 'active' : ''}`}
                onClick={() => { setSubTab('aptitude'); handleResetTest(); }}
              >
                Aptitude
              </button>
              <button
                className={`resume-tab-btn ${subTab === 'coding' ? 'active' : ''}`}
                onClick={() => { setSubTab('coding'); handleResetTest(); }}
              >
                Coding
              </button>
              <button
                className={`resume-tab-btn ${subTab === 'sql' ? 'active' : ''}`}
                onClick={() => { setSubTab('sql'); handleResetTest(); }}
              >
                SQL
              </button>
              <button
                className={`resume-tab-btn ${subTab === 'mcq' ? 'active' : ''}`}
                onClick={() => { setSubTab('mcq'); handleResetTest(); }}
              >
                MCQ
              </button>
            </div>
          </div>

          {/* Practice Arena Mode */}
          {practiceMode ? (
            <div className="practice-arena">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', textTransform: 'capitalize' }}>
                  Interactive Practice: {subTab} Arena
                </h3>
                <button className="api-settings-btn" onClick={handleResetTest}>
                  Back to Dashboard
                </button>
              </div>

              {subTab === 'aptitude' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {aptitudeQuestions.map((q, idx) => (
                    <div key={q.id} className="question-card">
                      <div style={{ fontWeight: '800', fontSize: '14.5px', marginBottom: '14px' }}>
                        Q{idx + 1}. {q.question}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.options.map(opt => {
                          const isSelected = aptitudeAnswers[q.id] === opt;
                          let btnClass = "option-button";
                          if (isSelected) btnClass += " selected";
                          if (aptitudeSubmitted) {
                            if (opt === q.correct) btnClass += " correct";
                            else if (isSelected) btnClass += " incorrect";
                          }
                          return (
                            <button
                              key={opt}
                              className={btnClass}
                              disabled={aptitudeSubmitted}
                              onClick={() => setAptitudeAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {aptitudeSubmitted && (
                        <div style={{ marginTop: '14px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#F3F4F6' }}>
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {!aptitudeSubmitted ? (
                    <button className="btn-apply" style={{ alignSelf: 'flex-end' }} onClick={handleSubmitAptitude}>
                      Submit Test answers
                    </button>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-maroon-light)', padding: '16px 24px', borderRadius: '16px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary-maroon)' }}>
                        Test score: {scoreResult}%
                      </span>
                      <button className="btn-apply" onClick={handleResetTest}>
                        Finish & View Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {subTab === 'coding' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="question-card">
                    <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '10px' }}>
                      Problem Statement: FizzBuzz
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      Write a function <code style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>fizzBuzz(n)</code> that returns an array of strings representing numbers from 1 to <code style={{ fontFamily: 'monospace' }}>n</code>.
                      For multiples of three, append <code style={{ color: 'var(--primary-maroon)' }}>"Fizz"</code> instead of the number, and for multiples of five, append <code style={{ color: 'var(--primary-maroon)' }}>"Buzz"</code>.
                      For numbers which are multiples of both three and five, append <code style={{ color: 'var(--primary-maroon)' }}>"FizzBuzz"</code>.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="builder-label">Code Editor (JavaScript)</label>
                    <textarea
                      className="code-editor-textarea"
                      value={codingCode}
                      onChange={(e) => setCodingCode(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn-apply" onClick={handleRunCode}>
                      🚀 Run Code & Verify
                    </button>
                  </div>

                  {codingTestResults && (
                    <div className="test-case-panel">
                      <div style={{ fontWeight: '800', marginBottom: '10px' }}>Test Case Execution:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {codingTestResults.map((tc, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '6px' }}>
                            <div>
                              <strong>Case {idx + 1}:</strong> {tc.input} <br />
                              <span style={{ fontSize: '11px', color: '#6B7280' }}>Expected: {tc.expected}</span> <br />
                              <span style={{ fontSize: '11px', color: '#6B7280' }}>Actual: {tc.actual}</span>
                            </div>
                            <span style={{
                              fontWeight: '800',
                              color: tc.passed ? '#10B981' : '#EF4444'
                            }}>
                              {tc.passed ? "PASSED ✓" : "FAILED ✕"}
                            </span>
                          </div>
                        ))}
                      </div>
                      {testCompleted && (
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#16A34A', fontWeight: '800' }}>🎉 All test cases passed! Category score updated.</span>
                          <button className="btn-apply" onClick={handleResetTest}>
                            Finish
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {subTab === 'sql' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="question-card">
                    <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '10px' }}>
                      Task: Filter IT Salaries
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      Write an SQL query to retrieve the names and salaries of all employees working in the <code style={{ fontWeight: 'bold' }}>'IT'</code> department whose salary is strictly greater than <code style={{ fontWeight: 'bold' }}>60000</code>.
                    </p>
                    <div style={{ marginTop: '12px' }}>
                      <strong style={{ fontSize: '12px' }}>Schema Definition:</strong>
                      <pre style={{ margin: '4px 0 0 0', padding: '6px', fontSize: '11.5px', backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                        employees (id INT, name VARCHAR, department VARCHAR, salary INT)
                      </pre>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="builder-label">SQL Console Query</label>
                    <input
                      type="text"
                      className="builder-input"
                      style={{ fontFamily: 'monospace' }}
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn-apply" onClick={handleRunSQL}>
                      ⚡ Execute SQL Query
                    </button>
                  </div>

                  {sqlTestResults && (
                    <div className="test-case-panel">
                      <div style={{ fontWeight: '800', color: sqlTestResults.status === 'success' ? '#16A34A' : '#EF4444', marginBottom: '10px' }}>
                        {sqlTestResults.status === 'success' ? "Compilation Success ✓" : "SQL Error ✕"}
                      </div>
                      <p style={{ fontSize: '12px', marginBottom: '10px' }}>{sqlTestResults.message}</p>

                      {sqlTestResults.rows.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', border: '1px solid var(--border-light)' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#F9FAFB' }}>
                              <th style={{ padding: '8px', border: '1px solid #E5E7EB', textAlign: 'left' }}>name</th>
                              <th style={{ padding: '8px', border: '1px solid #E5E7EB', textAlign: 'left' }}>department</th>
                              <th style={{ padding: '8px', border: '1px solid #E5E7EB', textAlign: 'left' }}>salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sqlTestResults.rows.map((row, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>{row.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>{row.department}</td>
                                <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>${row.salary.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {testCompleted && (
                        <button className="btn-apply" style={{ marginTop: '16px' }} onClick={handleResetTest}>
                          Finish Practice
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {subTab === 'mcq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {mcqQuestions.map((q, idx) => (
                    <div key={q.id} className="question-card">
                      <div style={{ fontWeight: '800', fontSize: '14.5px', marginBottom: '14px' }}>
                        Q{idx + 1}. {q.question}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.options.map(opt => {
                          const isSelected = mcqAnswers[q.id] === opt;
                          let btnClass = "option-button";
                          if (isSelected) btnClass += " selected";
                          if (mcqSubmitted) {
                            if (opt === q.correct) btnClass += " correct";
                            else if (isSelected) btnClass += " incorrect";
                          }
                          return (
                            <button
                              key={opt}
                              className={btnClass}
                              disabled={mcqSubmitted}
                              onClick={() => setMcqAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {mcqSubmitted && (
                        <div style={{ marginTop: '14px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#F3F4F6' }}>
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {!mcqSubmitted ? (
                    <button className="btn-apply" style={{ alignSelf: 'flex-end' }} onClick={handleSubmitMcq}>
                      Submit MCQ Test
                    </button>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-maroon-light)', padding: '16px 24px', borderRadius: '16px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary-maroon)' }}>
                        Test score: {scoreResult}%
                      </span>
                      <button className="btn-apply" onClick={handleResetTest}>
                        Finish
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Dashboard Mode
            <div className="training-dashboard">
              {/* Left Progress Card */}
              <div className="training-card">
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>
                  Your Progress
                </h3>

                <div className="donut-chart-box">
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Background ring */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--border-light)" strokeWidth="8" />

                    {/* Segment 1: Aptitude (Green) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="8"
                      strokeDasharray={`${dashApt} ${circ}`} strokeDashoffset="0" strokeLinecap="round" />

                    {/* Segment 2: Coding (Purple) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8B5CF6" strokeWidth="8"
                      strokeDasharray={`${dashCod} ${circ}`} strokeDashoffset={`-${qtr}`} strokeLinecap="round" />

                    {/* Segment 3: SQL (Orange) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="8"
                      strokeDasharray={`${dashSql} ${circ}`} strokeDashoffset={`-${qtr * 2}`} strokeLinecap="round" />

                    {/* Segment 4: MCQ (Blue) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3B82F6" strokeWidth="8"
                      strokeDasharray={`${dashMcq} ${circ}`} strokeDashoffset={`-${qtr * 3}`} strokeLinecap="round" />
                  </svg>

                  <div className="donut-inner-text">
                    <span className="donut-percentage">{overallProgress}%</span>
                    <span className="donut-label">Overall Progress</span>
                  </div>
                </div>

                <div className="legend-list">
                  <div className="legend-item">
                    <span>
                      <span className="legend-color-dot" style={{ backgroundColor: '#10B981' }}></span>
                      Aptitude
                    </span>
                    <span>{categoryScores.aptitude}%</span>
                  </div>
                  <div className="legend-item">
                    <span>
                      <span className="legend-color-dot" style={{ backgroundColor: '#8B5CF6' }}></span>
                      Coding
                    </span>
                    <span>{categoryScores.coding}%</span>
                  </div>
                  <div className="legend-item">
                    <span>
                      <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                      SQL
                    </span>
                    <span>{categoryScores.sql}%</span>
                  </div>
                  <div className="legend-item">
                    <span>
                      <span className="legend-color-dot" style={{ backgroundColor: '#3B82F6' }}></span>
                      MCQ
                    </span>
                    <span>{categoryScores.mcq}%</span>
                  </div>
                </div>
              </div>

              {/* Right Recent Tests Card */}
              <div className="training-card">
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)' }}>
                  Recent Tests
                </h3>

                <div className="test-history-list">
                  {testHistory.map(item => (
                    <div key={item.id} className="test-history-item">
                      <div className="test-info-group">
                        <div className="test-icon-wrapper">
                          {item.type === 'aptitude' && <AssessmentsIcon style={{ width: '18px', height: '18px' }} />}
                          {item.type === 'coding' && <CodeIcon style={{ width: '18px', height: '18px' }} />}
                          {item.type === 'sql' && <DocumentsIcon style={{ width: '18px', height: '18px' }} />}
                          {item.type === 'mcq' && <MockInterviewIcon style={{ width: '18px', height: '18px' }} />}
                        </div>
                        <div>
                          <div className="test-title-text">{item.title}</div>
                          <div className="test-date-text">{item.date}</div>
                        </div>
                      </div>
                      <span className="test-score-badge">{item.score}%</span>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-apply"
                  style={{ width: '100%', padding: '14px', fontSize: '13.5px' }}
                  onClick={() => setPracticeMode(true)}
                >
                  Start New Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

// ─── Standalone Notifications View Component ───────────────────────────
function NotificationsView() {
  const [filter, setFilter] = useState('all');
    const [notifList, setNotifList] = useState([
      {
        id: 1,
        title: "Zoho Drive Registration is Open",
        sub: "Register before 24 Jul 2025",
        time: "10:30 AM",
        iconType: "orange",
        icon: <DocumentsIcon style={{ width: '20px', height: '20px' }} />,
        unread: true,
        important: true
      },
      {
        id: 2,
        title: "TCS Online Test will be on 30 Jul 2025",
        sub: "Check your email for test link",
        time: "Yesterday",
        iconType: "purple",
        icon: <AssessmentsIcon style={{ width: '20px', height: '20px' }} />,
        unread: true,
        important: false
      },
      {
        id: 3,
        title: "Infosys Interview Shortlist Released",
        sub: "Check your dashboard",
        time: "19 Jul 2025",
        iconType: "blue",
        icon: <ProfileIcon style={{ width: '20px', height: '20px' }} />,
        unread: false,
        important: true
      },
      {
        id: 4,
        title: "Resume Writing Workshop on 25 Jul 2025",
        sub: "Venue: Seminar Hall",
        time: "19 Jul 2025",
        iconType: "green",
        icon: <ResumeIcon style={{ width: '20px', height: '20px' }} />,
        unread: false,
        important: false
      }
    ]);

    const handleToggleRead = (id) => {
      setNotifList(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
    };

    const handleMarkAllRead = () => {
      setNotifList(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const filteredNotifs = notifList.filter(n => {
      if (filter === 'unread') return n.unread;
      if (filter === 'important') return n.important;
      return true;
    });

    return (
      <div className="feature-page-container">
        <div className="notifications-workspace">
          {/* Header */}
          <div className="resume-workspace-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellIcon style={{ color: 'var(--primary-maroon)' }} /> 16. Notifications
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Stay updated with critical alerts, interview results, and campus drive schedules.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {notifList.some(n => n.unread) && (
                <button
                  className="api-settings-btn"
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                  onClick={handleMarkAllRead}
                >
                  ✓ Mark all as read
                </button>
              )}

              <div className="resume-tabs" style={{ margin: 0 }}>
                <button
                  className={`resume-tab-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`resume-tab-btn ${filter === 'unread' ? 'active' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </button>
                <button
                  className={`resume-tab-btn ${filter === 'important' ? 'active' : ''}`}
                  onClick={() => setFilter('important')}
                >
                  Important
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="notifications-list">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-row-item ${notif.unread ? 'unread' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleRead(notif.id)}
                  title="Click to toggle read status"
                >
                  <div className="notification-left-content">
                    <div className={`notification-icon-badge ${notif.iconType}`}>
                      {notif.icon}
                    </div>
                    <div>
                      <div className="notification-text-title">{notif.title}</div>
                      <div className="notification-text-sub">{notif.sub}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {notif.important && (
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '800',
                        color: 'var(--primary-maroon)',
                        backgroundColor: 'var(--primary-maroon-light)',
                        padding: '2px 8px',
                        borderRadius: '8px'
                      }}>
                        Urgent
                      </span>
                    )}
                    <div className="notification-right-meta">
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '14.5px' }}>
                📭 No {filter === 'all' ? '' : filter} notifications found. All caught up!
              </div>
            )}
          </div>

          {/* Footer Action Button */}
          <div className="notification-footer-btn-container">
            <button
              className="btn-apply"
              style={{ width: '100%', maxWidth: '240px', padding: '12px', fontSize: '13px' }}
              onClick={() => alert("All catchable notifications loaded. You are viewing the latest status updates.")}
            >
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    );
}

// ─── Standalone Documents View Component ───────────────────────────────
function DocumentsView() {
  const [offerLetterUploaded, setOfferLetterUploaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showLetterModal, setShowLetterModal] = useState(false);

    const handleAdminUploadSimulation = () => {
      setIsUploading(true);
      setUploadProgress(10);

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setOfferLetterUploaded(true);
            }, 500);
            return 100;
          }
          return prev + 30;
        });
      }, 300);
    };

    const handleDownloadOfferLetter = () => {
      // Build a simulated plain text offer letter download
      const offerContent = `ZOHO CORPORATION PRIVATE LIMITED
Estancia IT Park, Plot No. 140 & 151, GST Road, Vallancherry, Chengalpattu District, Tamil Nadu - 603202.

Dear Jayasurya K,

Congratulations! We are pleased to offer you the position of Software Developer at Zoho Corporation.

- Role: Software Developer
- CTC: 12 LPA (12,0,000 INR per annum)
- Location: Chennai, India
- Joining Date: September 01, 2025

Your employment will be subject to successful completion of all background and academic credential verifications.

Sincerely,
HR Recruitment Team
Zoho Corporation`;

      const element = document.createElement("a");
      const file = new Blob([offerContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "Zoho_Offer_Letter_Jayasurya_K.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return (
      <div className="feature-page-container">
        <div className="training-workspace">
          {/* Header */}
          <div className="resume-workspace-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DocumentsIcon style={{ color: 'var(--primary-maroon)' }} /> Offer Letter
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Access and submit academic marksheets, verification reports, and official selection letters.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Simulation panel */}
            <div className="admin-upload-simulation-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>⚙️</span>
                <strong style={{ fontSize: '13.5px', color: '#854D0E' }}>Admin Sandbox Simulator</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#A16207', marginBottom: '14px', maxWidth: '500px', margin: '0 auto 12px auto' }}>
                Once the admin uploads the offer letter, it will immediately display below. Try simulating this upload!
              </p>

              {isUploading ? (
                <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-muted)' }}>
                    Uploading Offer Letter... {uploadProgress}%
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--primary-maroon)', borderRadius: '3px', transition: 'width 0.2s ease' }} />
                  </div>
                </div>
              ) : !offerLetterUploaded ? (
                <button
                  className="btn-apply"
                  style={{ backgroundColor: '#EAB308', color: '#451A03', border: '1px solid #CA8A04' }}
                  onClick={handleAdminUploadSimulation}
                >
                  📤 Simulate Admin Uploading Offer Letter
                </button>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#16A34A', fontSize: '13px', fontWeight: '800' }}>✓ Simulated Offer Letter Uploaded Successfully!</span>
                  <button
                    className="api-settings-btn"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    onClick={() => setOfferLetterUploaded(false)}
                  >
                    Revoke/Reset
                  </button>
                </div>
              )}
            </div>

            {/* Offer Letter Main View */}
            {offerLetterUploaded ? (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', textAlign: 'center' }}>
                  19. Offer Letter
                </h3>

                <div className="offer-letter-card">
                  {/* Celebration graphic banner */}
                  <div className="celebration-banner">
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom: '12px' }}>
                      {/* Popper cone */}
                      <polygon points="35,65 50,45 60,55" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                      {/* Popper base */}
                      <path d="M35,65 L25,75 L30,80 L35,65 Z" fill="#8B5CF6" />
                      {/* Confetti pieces */}
                      <circle cx="65" cy="30" r="3" fill="#EF4444" />
                      <circle cx="45" cy="25" r="2.5" fill="#3B82F6" />
                      <circle cx="55" cy="15" r="2" fill="#10B981" />
                      <circle cx="75" cy="40" r="3" fill="#EC4899" />
                      <circle cx="30" cy="45" r="2" fill="#F59E0B" />
                      <path d="M62,48 Q70,43 72,50" fill="none" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M48,35 Q50,28 58,32" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                    </svg>

                    <div className="celebration-title">Congratulations! 🎉</div>
                    <div className="celebration-subtitle">You have been selected</div>
                  </div>

                  {/* Company Badge with inline Zoho logo */}
                  <div className="offer-company-badge">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginRight: '10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#E11D48', color: 'white', fontWeight: '800', fontSize: '12px' }}>Z</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#3B82F6', color: 'white', fontWeight: '800', fontSize: '12px' }}>o</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#EAB308', color: 'white', fontWeight: '800', fontSize: '12px' }}>h</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#10B981', color: 'white', fontWeight: '800', fontSize: '12px' }}>o</span>
                    </div>
                    Zoho Corporation
                  </div>

                  {/* Offer columns grid matching mockup */}
                  <div className="offer-details-grid">
                    <div className="offer-detail-col">
                      <span className="offer-detail-label">Role</span>
                      <span className="offer-detail-value">Software Developer</span>
                    </div>
                    <div className="offer-detail-col">
                      <span className="offer-detail-label">CTC</span>
                      <span className="offer-detail-value">12 LPA</span>
                    </div>
                    <div className="offer-detail-col">
                      <span className="offer-detail-label">Location</span>
                      <span className="offer-detail-value">Chennai</span>
                    </div>
                    <div className="offer-detail-col">
                      <span className="offer-detail-label">Joining Date</span>
                      <span className="offer-detail-value">01 Sep 2025</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="offer-action-buttons">
                    <button className="offer-btn-primary" onClick={() => setShowLetterModal(true)}>
                      View Offer Letter
                    </button>
                    <button className="offer-btn-secondary" onClick={handleDownloadOfferLetter}>
                      Download Offer Letter
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '48px 24px', border: '1px solid var(--border-light)', borderRadius: '24px',
                backgroundColor: 'white', textAlign: 'center', color: 'var(--text-muted)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>No Issued Offer Letters</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '380px', margin: '4px auto 0 auto' }}>
                  Once you clear placement interviews and the administrator publishes your official appointment details, it will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Offer Letter Overlay Modal */}
        {showLetterModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white', borderRadius: '24px', padding: '32px',
              maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)' }}>Zoho Corporation - Letter of Intent</h3>
                <button
                  style={{ border: 'none', background: 'transparent', fontSize: '18px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-light)' }}
                  onClick={() => setShowLetterModal(false)}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontFamily: 'monospace', fontSize: '12.5px', lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-line', backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <strong>ZOHO CORPORATION PRIVATE LIMITED</strong>{"\n"}
                Estancia IT Park, Vallancherry, Chengalpattu, TN - 603202.{"\n\n"}
                Date: July 22, 2026{"\n"}
                Ref: ZOHO/HR/2026/0452{"\n\n"}
                To,{"\n"}
                <strong>Jayasurya K</strong>{"\n"}
                AIT Campus, IT Department.{"\n\n"}
                Dear Jayasurya,{"\n\n"}
                We are pleased to offer you employment as a <strong>Software Developer</strong> at Zoho Corporation. Your annual compensation (CTC) will be <strong>12,00,000 INR</strong> (Twelve Lakhs per Annum).{"\n\n"}
                Your location of employment will be our corporate headquarters in <strong>Chennai</strong>. You are expected to join us on <strong>September 01, 2025</strong>.{"\n\n"}
                Please confirm your acceptance of this letter by clicking sign below.{"\n\n"}
                Best regards,{"\n"}
                HR Recruitment Team{"\n"}
                Zoho Corporation
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  className="api-settings-btn"
                  onClick={() => setShowLetterModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn-apply"
                  onClick={() => { alert("Offer Letter signed successfully!"); setShowLetterModal(false); }}
                >
                  Sign & Accept Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

// ─── Standalone Mock Interview View Component ───────────────────────────
function MockInterviewView() {
  const [interviewType, setInterviewType] = useState('Technical');
    const [difficulty, setDifficulty] = useState('Mid-Level');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [interviewResult, setInterviewResult] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoReadAloud, setAutoReadAloud] = useState(true);
    const [timerSeconds, setTimerSeconds] = useState(90);
    const [timerActive, setTimerActive] = useState(false);
    const [selectedHistoryModal, setSelectedHistoryModal] = useState(null);

    const interviewTypes = ['Technical', 'HR', 'Behavioural'];
    const difficultyLevels = ['Junior Level', 'Mid-Level', 'Senior Level'];

    const questionBank = {
      Technical: {
        'Junior Level': [
          { id: 1, question: "Explain the difference between == and === in JavaScript.", hint: "Think about type coercion and strict equality comparison.", keywords: ["strict equality", "type coercion", "types", "triple equals"] },
          { id: 2, question: "What is the Virtual DOM and how does React use it?", hint: "Consider rendering efficiency and diffing algorithm.", keywords: ["diffing", "reconciliation", "memory", "DOM node"] },
          { id: 3, question: "Explain CSS box model components.", hint: "Margin, border, padding, content.", keywords: ["content", "padding", "border", "margin"] }
        ],
        'Mid-Level': [
          { id: 1, question: "Describe the concept of closures in JavaScript with a practical use case.", hint: "Scope chain, lexical environment, private variables.", keywords: ["lexical scope", "outer scope", "private variables", "state persistence"] },
          { id: 2, question: "What are RESTful API principles and standard HTTP methods?", hint: "GET, POST, PUT, DELETE, statelessness, idempotency.", keywords: ["stateless", "GET", "POST", "PUT", "DELETE", "idempotent"] },
          { id: 3, question: "Explain the difference between SQL and NoSQL databases.", hint: "Relational vs document-based, ACID vs BASE, scaling.", keywords: ["ACID", "relational", "schema", "horizontal scaling", "document"] }
        ],
        'Senior Level': [
          { id: 1, question: "How would you design a scalable microservices architecture for a high-traffic placement portal?", hint: "Message queues, load balancing, caching, API gateways.", keywords: ["API gateway", "load balancer", "Redis", "Kafka", "event-driven", "caching"] },
          { id: 2, question: "Explain memory leaks in single-page applications and how to prevent them.", hint: "Event listeners, uncleaned intervals, detached DOM nodes.", keywords: ["event listeners", "cleanup", "useEffect", "garbage collection", "memory snapshot"] },
          { id: 3, question: "Compare Server-Side Rendering (SSR) vs Static Site Generation (SSG) in modern Web Frameworks.", hint: "Build time vs request time, SEO, dynamic data requirements.", keywords: ["hydration", "build-time", "revalidation", "SEO", "TTFB"] }
        ]
      },
      HR: {
        'Junior Level': [
          { id: 1, question: "Tell me about yourself and why you chose Information Technology at AIT.", hint: "Focus on academic projects, skills, and genuine interest.", keywords: ["passion", "AIT", "projects", "learning", "teamwork"] },
          { id: 2, question: "What are your greatest strengths and one area you are working to improve?", hint: "Be honest, self-aware, and demonstrate action taken.", keywords: ["self-awareness", "problem solving", "improvement", "growth mindset"] }
        ],
        'Mid-Level': [
          { id: 1, question: "Where do you see yourself in 3 to 5 years in your engineering career?", hint: "Show ambition, skill progression, and commitment.", keywords: ["leadership", "full-stack", "domain expertise", "mentorship"] },
          { id: 2, question: "Why should our company hire you over other qualified candidates?", hint: "Highlight unique project experience, adaptability, and culture fit.", keywords: ["adaptability", "value proposition", "collaboration", "ownership"] }
        ],
        'Senior Level': [
          { id: 1, question: "How do you handle disagreement with a technical decision made by a team lead or architect?", hint: "Focus on data, constructive dialogue, and team alignment.", keywords: ["data-driven", "constructive feedback", "alignment", "respect"] },
          { id: 2, question: "Describe your approach to mentoring junior developers and managing project deadlines.", hint: "Code reviews, clear delegation, empathy, risk mitigation.", keywords: ["code review", "delegation", "empathy", "sprint planning"] }
        ]
      },
      Behavioural: {
        'Junior Level': [
          { id: 1, question: "Describe a project experience where your team faced a bug right before submission.", hint: "Use STAR method: Situation, Task, Action, Result.", keywords: ["STAR method", "debugging", "teamwork", "prioritization"] }
        ],
        'Mid-Level': [
          { id: 1, question: "Give an example of a time you failed to meet a goal and how you handled the outcome.", hint: "Focus on accountability, lessons learned, and subsequent success.", keywords: ["ownership", "accountability", "reflection", "corrective action"] }
        ],
        'Senior Level': [
          { id: 1, question: "Tell me about a complex technical conflict you resolved under high pressure.", hint: "Trade-offs, root cause analysis, stakeholder communication.", keywords: ["root cause", "trade-offs", "stakeholders", "calm leadership"] }
        ]
      }
    };

    const questions = questionBank[interviewType]?.[difficulty] || questionBank.Technical['Mid-Level'];

    const recentInterviews = [
      { id: 1, role: 'Frontend Developer', date: '20 Jul 2025', type: 'Technical', difficulty: 'Mid-Level', performance: 'Good', score: 84, status: 'Passed', statusColor: '#16A34A', statusBg: '#DCFCE7' },
      { id: 2, role: 'System Engineer', date: '18 Jul 2025', type: 'HR', difficulty: 'Junior Level', performance: 'Reasonable', score: 72, status: 'Average', statusColor: '#D97706', statusBg: '#FEF9C3' },
      { id: 3, role: 'React Developer', date: '15 Jul 2025', type: 'Technical', difficulty: 'Senior Level', performance: 'Excellent', score: 92, status: 'Excellent', statusColor: '#2563EB', statusBg: '#EFF6FF' }
    ];

    // Speech Synthesis (AI Voice output)
    const speakText = (text) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    // Speech Recognition (Voice Input)
    const toggleRecording = () => {
      if (isRecording) {
        setIsRecording(false);
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. You can type your answer into the text area!");
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentAnswer(prev => {
            const trimmed = prev ? prev + ' ' + transcript : transcript;
            return trimmed;
          });
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
      } catch (err) {
        console.error("Speech recognition error:", err);
        setIsRecording(false);
      }
    };

    // Timer Effect
    useEffect(() => {
      let interval = null;
      if (timerActive && timerSeconds > 0) {
        interval = setInterval(() => {
          setTimerSeconds(prev => prev - 1);
        }, 1000);
      } else if (timerSeconds === 0 && timerActive) {
        setTimerActive(false);
      }
      return () => clearInterval(interval);
    }, [timerActive, timerSeconds]);

    // Handle Start Interview
    const handleStartInterview = () => {
      setInterviewStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
      setCurrentAnswer('');
      setInterviewCompleted(false);
      setInterviewResult(null);
      setTimerSeconds(90);
      setTimerActive(true);

      if (autoReadAloud && questions[0]) {
        setTimeout(() => speakText(questions[0].question), 400);
      }
    };

    // Handle Next Question
    const handleNextQuestion = () => {
      stopSpeaking();
      const updatedAnswers = { ...answers, [currentQuestion]: currentAnswer };
      setAnswers(updatedAnswers);
      setCurrentAnswer('');

      if (currentQuestion < questions.length - 1) {
        const nextIdx = currentQuestion + 1;
        setCurrentQuestion(nextIdx);
        setTimerSeconds(90);
        setTimerActive(true);
        if (autoReadAloud && questions[nextIdx]) {
          setTimeout(() => speakText(questions[nextIdx].question), 400);
        }
      } else {
        // Complete interview & Calculate detailed score
        setTimerActive(false);
        setInterviewCompleted(true);

        let totalScore = 0;
        const qDetails = questions.map((q, idx) => {
          const userAns = updatedAnswers[idx] || '';
          const words = userAns.trim() ? userAns.trim().split(/\s+/).length : 0;
          const matchedKw = q.keywords.filter(kw => userAns.toLowerCase().includes(kw.toLowerCase()));
          const kwScore = (matchedKw.length / q.keywords.length) * 60;
          const wordLengthScore = Math.min(40, (words / 30) * 40);
          const qScore = Math.round(kwScore + wordLengthScore);
          totalScore += qScore;

          return {
            question: q.question,
            userAnswer: userAns || "No answer provided.",
            score: qScore,
            matchedKeywords: matchedKw,
            missingKeywords: q.keywords.filter(kw => !matchedKw.includes(kw)),
            words
          };
        });

        const finalScore = Math.round(totalScore / questions.length);

        setInterviewResult({
          score: finalScore,
          totalQuestions: questions.length,
          answered: Object.keys(updatedAnswers).filter(k => updatedAnswers[k].trim().length > 0).length,
          rating: finalScore >= 80 ? 'Excellent' : finalScore >= 60 ? 'Good' : finalScore >= 40 ? 'Average' : 'Needs Improvement',
          questionDetails: qDetails,
          feedback: [
            finalScore >= 75 ? 'Strong technical terminology used in responses.' : 'Incorporate more domain-specific terms.',
            'Maintain structured responses using the STAR method for experience questions.',
            'Aim for 100-150 words per response to cover key points comprehensively.',
            'Good pacing and response confidence during the session.'
          ]
        });
      }
    };

    const handleEndInterview = () => {
      stopSpeaking();
      setTimerActive(false);
      setInterviewStarted(false);
      setInterviewCompleted(false);
      setInterviewResult(null);
      setCurrentQuestion(0);
      setAnswers({});
      setCurrentAnswer('');
    };

    // Download AI Performance Report
    const handleDownloadReport = () => {
      if (!interviewResult) return;
      const report = `=========================================
AIT AI MOCK INTERVIEW EVALUATION REPORT
=========================================
Date: ${new Date().toLocaleDateString()}
Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Overall Score: ${interviewResult.score} / 100
Rating: ${interviewResult.rating}
Questions Answered: ${interviewResult.answered} / ${interviewResult.totalQuestions}

QUESTION BREAKDOWN:
${interviewResult.questionDetails.map((q, i) => `
Q${i + 1}: ${q.question}
Score: ${q.score}/100 | Word Count: ${q.words} words
Keywords Matched: ${q.matchedKeywords.join(', ') || 'None'}
Keywords Missing: ${q.missingKeywords.join(', ') || 'None'}
User Response: "${q.userAnswer}"
`).join('\n-----------------------------------------')}

AI FEEDBACK & RECOMMENDATIONS:
${interviewResult.feedback.map(f => `- ${f}`).join('\n')}

=========================================
Generated by AIT Placement Portal AI Engine
`;
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AIT_Mock_Interview_${interviewType}_${interviewResult.score}pts.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    // Calculate live answer metrics
    const currentWords = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
    const estSpeakingTime = Math.ceil(currentWords / 2.2); // ~130 wpm
    const currentQKeywords = questions[currentQuestion]?.keywords || [];
    const liveMatchedKw = currentQKeywords.filter(kw => currentAnswer.toLowerCase().includes(kw.toLowerCase()));

    return (
      <div className="feature-page-container">
        <div className="mock-interview-layout">
          <div className="mock-interview-main">
            <div className="mock-interview-card">
              {!interviewStarted && !interviewCompleted ? (
                <>
                  {/* Header */}
                  <div className="mock-interview-header">
                    <h2 className="mock-interview-title">AI Mock Interview</h2>
                    <p className="mock-interview-subtitle">Practice. Improve. Succeed.</p>
                  </div>

                  {/* Type Selector */}
                  <div className="mock-interview-types">
                    {interviewTypes.map(type => (
                      <button
                        key={type}
                        className={`mock-type-btn ${interviewType === type ? 'active' : ''}`}
                        onClick={() => setInterviewType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Difficulty Selector */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '6px' }}>Difficulty:</span>
                    {difficultyLevels.map(lvl => (
                      <button
                        key={lvl}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '10px',
                          border: difficulty === lvl ? '1.5px solid var(--primary-maroon)' : '1px solid var(--border-medium)',
                          backgroundColor: difficulty === lvl ? 'var(--primary-maroon-light)' : 'var(--bg-white)',
                          color: difficulty === lvl ? 'var(--primary-maroon)' : 'var(--text-muted)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family)'
                        }}
                        onClick={() => setDifficulty(lvl)}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Feature Icons */}
                  <div className="mock-interview-features">
                    <div className="mock-feature-item" style={{ cursor: 'pointer' }} onClick={() => speakText("AI Voice Synthesis engine is active and ready for your interview session.")}>
                      <div className="mock-feature-icon" style={{ color: '#9333EA', backgroundColor: '#F3E8FF' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      </div>
                      <span className="mock-feature-label">AI Voice</span>
                    </div>
                    <div className="mock-feature-item">
                      <div className="mock-feature-icon" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          <circle cx="8.5" cy="12" r="2.5" fill="none" />
                        </svg>
                      </div>
                      <span className="mock-feature-label">Real-time Feedback</span>
                    </div>
                    <div className="mock-feature-item">
                      <div className="mock-feature-icon" style={{ color: '#16A34A', backgroundColor: '#DCFCE7' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          <path d="M8 10h8" />
                          <path d="M8 14h4" />
                        </svg>
                      </div>
                      <span className="mock-feature-label">Performance Analysis</span>
                    </div>
                  </div>

                  {/* Controls Bar */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={autoReadAloud}
                        onChange={(e) => setAutoReadAloud(e.target.checked)}
                        style={{ accentColor: 'var(--primary-maroon)', width: '16px', height: '16px' }}
                      />
                      🔊 Auto-read questions aloud
                    </label>
                  </div>

                  {/* Start Button */}
                  <button className="mock-start-btn" onClick={handleStartInterview}>
                    Start {interviewType} Interview ({difficulty})
                  </button>

                  {/* Recent Interviews */}
                  <div className="mock-recent-section">
                    <div className="mock-recent-header">
                      <span className="mock-recent-title">Recent Interviews</span>
                      <button className="mock-view-all-btn" onClick={() => setSelectedHistoryModal(recentInterviews)}>View History</button>
                    </div>
                    <div className="mock-recent-list">
                      {recentInterviews.map(interview => (
                        <div
                          key={interview.id}
                          className="mock-recent-item"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedHistoryModal(interview)}
                        >
                          <div className="mock-recent-dot" style={{ backgroundColor: interview.statusColor }}></div>
                          <span className="mock-recent-role">{interview.role}</span>
                          <span className="mock-recent-date">{interview.date}</span>
                          <span className="mock-recent-perf">{interview.performance} ({interview.score}%)</span>
                          <span className="mock-recent-status" style={{
                            color: interview.statusColor,
                            backgroundColor: interview.statusBg
                          }}>{interview.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : interviewStarted && !interviewCompleted ? (
                /* Active Interview Session */
                <div className="mock-active-session">
                  <div className="mock-session-header">
                    <div>
                      <h3 className="mock-session-title">{interviewType} Interview ({difficulty})</h3>
                      <p className="mock-session-subtitle">Question {currentQuestion + 1} of {questions.length}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Timer Pill */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        backgroundColor: timerSeconds < 20 ? '#FEE2E2' : 'var(--bg-card)',
                        color: timerSeconds < 20 ? '#DC2626' : 'var(--primary-maroon)',
                        border: '1px solid var(--border-medium)',
                        fontWeight: '800',
                        fontSize: '13px'
                      }}>
                        ⏱ {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                      </div>

                      {/* Read Aloud Button */}
                      <button
                        className="mock-record-btn"
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(questions[currentQuestion].question)}
                        style={{ borderColor: isSpeaking ? '#9333EA' : 'var(--border-medium)' }}
                      >
                        {isSpeaking ? '🔊 Speaking...' : '🔊 Read Aloud'}
                      </button>

                      {/* Voice Input Button */}
                      <button
                        className={`mock-record-btn ${isRecording ? 'recording' : ''}`}
                        onClick={toggleRecording}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isRecording ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        </svg>
                        {isRecording ? 'Listening...' : 'Voice Input'}
                      </button>

                      <button className="mock-end-btn" onClick={handleEndInterview}>
                        End Session
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mock-progress-bar">
                    <div
                      className="mock-progress-fill"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question Card */}
                  <div className="mock-question-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="mock-question-number">Q{currentQuestion + 1}</div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {difficulty}
                      </span>
                    </div>
                    <p className="mock-question-text">{questions[currentQuestion].question}</p>
                    <p className="mock-question-hint">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      Hint: {questions[currentQuestion].hint}
                    </p>
                  </div>

                  {/* Live Keywords Analysis Pill Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>Target Keywords:</span>
                    {currentQKeywords.map((kw, i) => {
                      const matched = liveMatchedKw.includes(kw);
                      return (
                        <span key={i} style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          backgroundColor: matched ? '#DCFCE7' : 'white',
                          color: matched ? '#16A34A' : 'var(--text-light)',
                          border: matched ? '1px solid #BBF7D0' : '1px solid var(--border-medium)',
                          transition: 'all 0.2s ease'
                        }}>
                          {matched ? '✓ ' : ''}{kw}
                        </span>
                      );
                    })}
                  </div>

                  {/* Answer Input */}
                  <div className="mock-answer-area">
                    <textarea
                      className="mock-answer-input"
                      placeholder="Type or click 'Voice Input' to speak your answer... Speak naturally as in a real interview."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      rows={5}
                    />
                    <div className="mock-answer-actions">
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className="mock-char-count">{currentWords} words ({currentAnswer.length} chars)</span>
                        {currentWords > 0 && (
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                            ~{estSpeakingTime}s est. speaking time
                          </span>
                        )}
                      </div>
                      <button
                        className="mock-next-btn"
                        onClick={handleNextQuestion}
                        disabled={!currentAnswer.trim()}
                      >
                        {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish & Evaluate ✓'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interview Results */
                <div className="mock-results-section">
                  <div className="mock-results-header">
                    <div className="mock-results-score-circle" style={{
                      borderColor: interviewResult?.score >= 80 ? '#16A34A' : interviewResult?.score >= 60 ? '#D97706' : '#DC2626'
                    }}>
                      <span className="mock-results-score-value">{interviewResult?.score}</span>
                      <span className="mock-results-score-label">/ 100</span>
                    </div>
                    <div>
                      <h3 className="mock-results-title">Interview Completed!</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="mock-results-rating" style={{
                          color: interviewResult?.score >= 80 ? '#16A34A' : interviewResult?.score >= 60 ? '#D97706' : '#DC2626',
                          backgroundColor: interviewResult?.score >= 80 ? '#DCFCE7' : interviewResult?.score >= 60 ? '#FEF9C3' : '#FEE2E2'
                        }}>{interviewResult?.rating}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                          ({interviewType} - {difficulty})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mock-results-stats">
                    <div className="mock-stat-box">
                      <span className="mock-stat-value">{interviewResult?.totalQuestions}</span>
                      <span className="mock-stat-label">Total Questions</span>
                    </div>
                    <div className="mock-stat-box">
                      <span className="mock-stat-value">{interviewResult?.answered}</span>
                      <span className="mock-stat-label">Answered</span>
                    </div>
                    <div className="mock-stat-box">
                      <span className="mock-stat-value">{difficulty}</span>
                      <span className="mock-stat-label">Difficulty</span>
                    </div>
                  </div>

                  {/* Detailed Q&A Breakdown */}
                  {interviewResult?.questionDetails && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)' }}>
                        Detailed Answer Breakdown
                      </h4>
                      {interviewResult.questionDetails.map((item, idx) => (
                        <div key={idx} style={{
                          padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                              Q{idx + 1}: {item.question}
                            </span>
                            <span style={{
                              fontSize: '12px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                              backgroundColor: item.score >= 75 ? '#DCFCE7' : '#FEF9C3',
                              color: item.score >= 75 ? '#15803D' : '#A16207'
                            }}>
                              {item.score}/100
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', italic: 'true', backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            "{item.userAnswer}"
                          </p>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#16A34A', fontWeight: '700' }}>✓ Matched: {item.matchedKeywords.join(', ') || 'None'}</span>
                            {item.missingKeywords.length > 0 && (
                              <span style={{ color: '#DC2626', fontWeight: '700' }}>⚠ Consider adding: {item.missingKeywords.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mock-results-feedback">
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', marginBottom: '12px' }}>
                      AI Feedback & Recommendations
                    </h4>
                    {interviewResult?.feedback.map((fb, idx) => (
                      <div key={idx} className="mock-feedback-item">
                        <span className="mock-feedback-check">✓</span>
                        <span>{fb}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button className="mock-start-btn" style={{ flex: 1, marginBottom: 0 }} onClick={handleStartInterview}>
                      Retake Interview
                    </button>
                    <button
                      className="mock-back-btn"
                      style={{ padding: '14px 20px', backgroundColor: 'var(--primary-maroon-light)', color: 'var(--primary-maroon)', borderColor: 'var(--primary-maroon)' }}
                      onClick={handleDownloadReport}
                    >
                      📄 Download Report
                    </button>
                    <button className="mock-back-btn" onClick={handleEndInterview}>
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Item Modal */}
        {selectedHistoryModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white', borderRadius: '24px', padding: '32px',
              maxWidth: '550px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)' }}>Interview History Details</h3>
                <button
                  style={{ border: 'none', background: 'transparent', fontSize: '18px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-light)' }}
                  onClick={() => setSelectedHistoryModal(null)}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                {Array.isArray(selectedHistoryModal) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedHistoryModal.map(h => (
                      <div key={h.id} style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: '12px', backgroundColor: 'var(--bg-card)' }}>
                        <div style={{ fontWeight: '800' }}>{h.role} ({h.type})</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Date: {h.date} | Score: {h.score}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div><strong>Role:</strong> {selectedHistoryModal.role}</div>
                    <div><strong>Date:</strong> {selectedHistoryModal.date}</div>
                    <div><strong>Category:</strong> {selectedHistoryModal.type} ({selectedHistoryModal.difficulty})</div>
                    <div><strong>Performance Rating:</strong> {selectedHistoryModal.performance}</div>
                    <div><strong>Overall Score:</strong> {selectedHistoryModal.score}%</div>
                    <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--primary-maroon-light)', color: 'var(--primary-maroon)', fontWeight: '700', fontSize: '12.5px', marginTop: '8px' }}>
                      ✓ Verified assessment record logged in placement portal database.
                    </div>
                  </>
                )}
              </div>
              <button
                className="btn-apply"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => setSelectedHistoryModal(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

// ─── Standalone Resources View Component ───────────────────────────────
function ResourcesView() {
  const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [downloadingId, setDownloadingId] = useState(null);

    const categories = ['All', 'Aptitude', 'Technical', 'Interview', 'Resume', 'Soft Skills'];

    const resources = [
      {
        id: 1,
        title: 'Aptitude Handbook',
        category: 'Aptitude',
        type: 'PDF',
        size: '3.4 MB',
        iconBg: '#E53E3E',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Comprehensive aptitude preparation guide covering quantitative, logical, and verbal reasoning.'
      },
      {
        id: 2,
        title: 'DSA Roadmap',
        category: 'Technical',
        type: 'PDF',
        size: '1.8 MB',
        iconBg: '#276749',
        iconColor: '#fff',
        iconLabel: 'XLS',
        description: 'Step-by-step data structures & algorithms roadmap with curated problem sets and time complexity charts.'
      },
      {
        id: 3,
        title: 'HR Interview Q&A',
        category: 'Interview',
        type: 'PDF',
        size: '1.2 MB',
        iconBg: '#E53E3E',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Top 100 HR interview questions with model answers and tips for freshers.'
      },
      {
        id: 4,
        title: 'Resume Tips',
        category: 'Resume',
        type: 'PDF',
        size: '856 KB',
        iconBg: '#276749',
        iconColor: '#fff',
        iconLabel: 'DOC',
        description: 'Expert resume writing tips, ATS optimization strategies, and before/after examples.'
      },
      {
        id: 5,
        title: 'Group Discussion Tips',
        category: 'Soft Skills',
        type: 'PDF',
        size: '1.1 MB',
        iconBg: '#6B46C1',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Effective GD strategies, body language tips, and sample topics with structured outlines.'
      },
      {
        id: 6,
        title: 'Communication Skills',
        category: 'Soft Skills',
        type: 'PDF',
        size: '1.3 MB',
        iconBg: '#D53F8C',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Verbal and non-verbal communication enhancement exercises and workplace etiquette guide.'
      },
      {
        id: 7,
        title: 'SQL Cheat Sheet',
        category: 'Technical',
        type: 'PDF',
        size: '980 KB',
        iconBg: '#E53E3E',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Concise reference for SQL queries — joins, subqueries, aggregates, and stored procedures.'
      },
      {
        id: 8,
        title: 'Technical Interview Guide',
        category: 'Interview',
        type: 'PDF',
        size: '2.1 MB',
        iconBg: '#2B6CB0',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'End-to-end guide to technical rounds: coding, system design, and behavioral questions.'
      },
      {
        id: 9,
        title: 'Quantitative Aptitude',
        category: 'Aptitude',
        type: 'PDF',
        size: '2.7 MB',
        iconBg: '#E53E3E',
        iconColor: '#fff',
        iconLabel: 'PDF',
        description: 'Practice sets for number systems, percentages, time & work, and data interpretation.'
      },
    ];

    const filtered = resources.filter(r => {
      const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const handleDownload = (resource) => {
      setDownloadingId(resource.id);
      setTimeout(() => {
        // Simulate download by creating a text blob
        const content = `AIT Placement Portal\n\nResource: ${resource.title}\nCategory: ${resource.category}\nSize: ${resource.size}\n\nThis is a demo download for the placement preparation resource.\nIn production, this would download the actual ${resource.type} file.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloadingId(null);
      }, 1200);
    };

    return (
      <div className="feature-page-container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '34px', height: '34px', borderRadius: '10px',
              backgroundColor: 'var(--primary-maroon)', color: '#fff', fontSize: '14px', fontWeight: '800'
            }}>17</span>
            Resources &amp; Materials
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', fontWeight: '500' }}>
            Access all placement preparation materials in one place.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <svg
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', stroke: 'var(--text-muted)' }}
            viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="resources-search-input"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="resources-category-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`resources-cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <ResourcesIcon style={{ width: '40px', height: '40px', margin: '0 auto 12px', display: 'block', stroke: 'var(--border-medium)' }} />
            <p style={{ fontWeight: '600', fontSize: '14px' }}>No resources found for <strong>"{searchQuery}"</strong></p>
          </div>
        ) : (
          <div className="resources-grid">
            {filtered.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-card-info">
                  {/* Icon */}
                  <div
                    className="resource-file-icon"
                    style={{ backgroundColor: resource.iconBg, color: resource.iconColor }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px', marginBottom: '2px' }}>
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.5px' }}>{resource.iconLabel}</span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <h4 className="resource-title">{resource.title}</h4>
                    <p className="resource-meta">{resource.type} &bull; {resource.size}</p>
                    <p className="resource-desc">{resource.description}</p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  className={`resource-download-btn ${downloadingId === resource.id ? 'downloading' : ''}`}
                  onClick={() => handleDownload(resource)}
                  disabled={downloadingId === resource.id}
                >
                  {downloadingId === resource.id ? (
                    <>
                      <svg style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <DownloadIcon style={{ width: '15px', height: '15px' }} />
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

function FeatureViewPanel({ activeTab, setActiveTab, userName = 'Jayasurya K' }) {
  if (activeTab === 'profile') return <ProfilePage />;
  if (activeTab === 'applications') return <ApplicationsPage />;
  if (activeTab === 'calendar') return <DriveCalendarPage />;
  if (activeTab === 'settings') return <SettingsPage />;
  if (activeTab === 'resume') return <ResumeView userName={userName} />;
  if (activeTab === 'training') return <TrainingView />;
  if (activeTab === 'notifications') return <NotificationsView />;
  if (activeTab === 'documents') return <DocumentsView />;
  if (activeTab === 'mock-interview') return <MockInterviewView />;
  if (activeTab === 'resources') return <ResourcesView />;
  if (activeTab === 'chatbot') return <ChatbotView userName={userName} />;
  if (activeTab === 'certificates') return <CertificatesView />;
  if (activeTab === 'alumni') return <AlumniView />;

  // Fallback view for other left menu tabs
  return (
    <div className="feature-page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--primary-maroon-light)',
        color: 'var(--primary-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
      }}>
        <AssessmentsIcon style={{ width: '32px', height: '32px' }} />
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', textTransform: 'capitalize' }}>
        {activeTab.replace('-', ' ')}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
        Welcome to the {activeTab.replace('-', ' ')} module. Explore placement resources, tests, and active updates tailored for {userName}.
      </p>
      <button
        className="btn-apply"
        style={{ marginTop: '24px' }}
        onClick={() => setActiveTab('dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default function FeatureView(props) {
  return <FeatureViewPanel key={props.activeTab} {...props} />;
}
