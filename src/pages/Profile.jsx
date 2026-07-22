import React, { useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Jayasurya K',
    regNo: '20IT30104',
    degree: 'B.Tech - Information Technology',
    batch: '2023 - 2027',
    completion: 90,
    email: 'jayasurya.k@ait.edu.in',
    phone: '+91 63749 09350',
    location: 'Coimbatore, Tamil Nadu',
    github: 'github.com/jayasurya-k',
    linkedin: 'linkedin.com/in/jayasurya-k',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    
    // Additional education details
    education: {
      tenth: { school: 'KV Matriculation School', year: '2021', score: '94.2%' },
      twelfth: { school: 'KV Higher Secondary School', year: '2023', score: '96.5%' },
      college: { cgpa: '8.74', arrears: '0' }
    },
    // Skills categories
    skills: {
      languages: ['Java', 'Python', 'JavaScript (ES6+)', 'SQL', 'HTML5/CSS3'],
      frameworks: ['React.js', 'Node.js', 'Express', 'Bootstrap', 'TailwindCSS'],
      tools: ['Git & GitHub', 'Postman', 'VS Code', 'Figma']
    },
    // Projects
    projects: [
      { title: 'AIT Placement Management Portal', desc: 'A comprehensive web application to streamline college placements, featuring mock interviews, calendar tracking, and resume builders.', tech: 'React, Node.js, Express, MongoDB' },
      { title: 'Smart Farm Companion', desc: 'An IoT and web-based crop recommendation and health analysis platform using machine learning.', tech: 'React Native, Python, Flask, ML' }
    ],
    // Certificates
    certificates: [
      { name: 'Google Cloud Certified Associate Cloud Engineer', issuer: 'Google Cloud', date: 'Dec 2025' },
      { name: 'Full Stack Web Development Professional Certificate', issuer: 'Coursera', date: 'Jul 2025' }
    ]
  });

  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfile({ ...tempProfile });
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setTempProfile({ ...profile });
    setShowEditModal(true);
  };

  return (
    <div style={{ fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', padding: '10px 0' }}>
      
      {/* 1. TOP MY PROFILE CARD */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>My Profile</h2>
          <button
            onClick={openEditModal}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: '1.5px solid #C18B63',
              backgroundColor: 'transparent',
              color: '#C18B63',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-family)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(193, 139, 99, 0.05)' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Info Row */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1.5px solid var(--border-light)'
            }}
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4C1536&color=fff`; }}
          />

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0' }}>{profile.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
              <div>Reg. No: {profile.regNo}</div>
              <div>{profile.degree}</div>
              <div>Batch: {profile.batch}</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Profile Completion</span>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#F3ECE6', borderRadius: '3px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${profile.completion}%`,
                backgroundColor: '#C18B63',
                borderRadius: '3px'
              }} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>{profile.completion}%</span>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM DETAILS CARD WITH TABBED NAVIGATION */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Navigation Tabs Header */}
        <div style={{
          display: 'flex',
          gap: '28px',
          borderBottom: '1.5px solid var(--border-light)',
          paddingBottom: '2px',
          overflowX: 'auto'
        }}>
          {['Overview', 'Education', 'Skills', 'Projects', 'Certificates'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 10px 0',
                fontSize: '13.5px',
                fontWeight: '700',
                color: activeTab === tab ? '#7C3AED' : 'var(--text-muted)',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2.5px solid #7C3AED' : '2.5px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-family)',
                marginBottom: '-2px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <div style={{ minHeight: '220px' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="profile-overview-grid">
              
              {/* Left Column */}
              <div className="profile-overview-col left-col">
                
                {/* Email */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Email</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{profile.email}</div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Phone</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{profile.phone}</div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Location</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{profile.location}</div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="profile-overview-col">
                
                {/* GitHub */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>GitHub</div>
                    <a href={`https://${profile.github}`} target="_blank" rel="noreferrer" style={{ fontSize: '13.5px', fontWeight: '700', color: '#7C3AED', textDecoration: 'none' }}>
                      {profile.github}
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>LinkedIn</div>
                    <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" style={{ fontSize: '13.5px', fontWeight: '700', color: '#7C3AED', textDecoration: 'none' }}>
                      {profile.linkedin}
                    </a>
                  </div>
                </div>

                {/* Resume */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Resume</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        backgroundColor: '#EEF8F1',
                        color: '#16A34A'
                      }}>
                        Uploaded
                      </span>
                      <button
                        onClick={() => alert("Simulating Resume PDF preview...")}
                        style={{
                          padding: '3px 12px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          backgroundColor: '#ffffff',
                          border: '1.5px solid var(--border-medium)',
                          color: 'var(--text-main)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family)'
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: EDUCATION */}
          {activeTab === 'Education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-light)' }}>
                <span style={{ fontSize: '20px' }}>🎓</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>B.Tech in Information Technology</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{profile.college} | {profile.batch}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#7C3AED' }}>CGPA: {profile.education.college.cgpa} | Arrears: {profile.education.college.arrears}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-light)' }}>
                <span style={{ fontSize: '20px' }}>🏫</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>Higher Secondary School (XII)</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{profile.education.twelfth.school} | Year: {profile.education.twelfth.year}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#7C3AED' }}>Score: {profile.education.twelfth.score}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '20px' }}>🏢</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>Secondary School (X)</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{profile.education.tenth.school} | Year: {profile.education.tenth.year}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#7C3AED' }}>Score: {profile.education.tenth.score}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'Skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Programming Languages</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.skills.languages.map(skill => (
                    <span key={skill} style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--primary-maroon-light)', color: 'var(--primary-maroon)', fontSize: '12.5px', fontWeight: '700' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Libraries &amp; Frameworks</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.skills.frameworks.map(skill => (
                    <span key={skill} style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--primary-maroon-light)', color: 'var(--primary-maroon)', fontSize: '12.5px', fontWeight: '700' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Developer Tools</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.skills.tools.map(skill => (
                    <span key={skill} style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--primary-maroon-light)', color: 'var(--primary-maroon)', fontSize: '12.5px', fontWeight: '700' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'Projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {profile.projects.map((proj, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#FAF8F5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>{proj.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{proj.desc}</p>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED' }}>Tech Stack: {proj.tech}</div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: CERTIFICATES */}
          {activeTab === 'Certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profile.certificates.map((cert, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#FAF8F5'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{cert.name}</h4>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Issued by {cert.issuer} • {cert.date}</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>📜</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 3. EDIT PROFILE MODAL */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)', margin: 0 }}>Edit Profile</h3>
              <button
                style={{ border: 'none', background: 'transparent', fontSize: '18px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-light)' }}
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Name</label>
                <input
                  type="text"
                  required
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Reg. No</label>
                <input
                  type="text"
                  required
                  value={tempProfile.regNo}
                  onChange={(e) => setTempProfile({ ...tempProfile, regNo: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Batch</label>
                <input
                  type="text"
                  required
                  value={tempProfile.batch}
                  onChange={(e) => setTempProfile({ ...tempProfile, batch: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Email</label>
                <input
                  type="email"
                  required
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Phone</label>
                <input
                  type="text"
                  required
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Location</label>
                <input
                  type="text"
                  required
                  value={tempProfile.location}
                  onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>GitHub Link</label>
                <input
                  type="text"
                  required
                  value={tempProfile.github}
                  onChange={(e) => setTempProfile({ ...tempProfile, github: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>LinkedIn Link</label>
                <input
                  type="text"
                  required
                  value={tempProfile.linkedin}
                  onChange={(e) => setTempProfile({ ...tempProfile, linkedin: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-medium)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary-maroon)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
