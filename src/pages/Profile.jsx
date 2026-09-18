import React, { useState, useRef } from 'react'
import avatarImg from '../avatar.png'
import { fetchStudentProfileFromFirestore, saveStudentProfileToFirestore } from '../firebase'

const tabs = ['Overview', 'Placements', 'Academic Info', 'Education', 'Skills', 'Projects', 'Certificates']

const femaleAvatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80'

function Avatar({ profileData }) {
  const defaultAvatar = profileData.gender === 'Female' ? femaleAvatarUrl : avatarImg

  return (
    <div className="avatar-photo">
      <img src={profileData.photo || defaultAvatar} alt={`${profileData.name} profile`} />
    </div>
  )
}

function InfoItem({ icon, title, value }) {
  return (
    <div className="info-item">
      <div className="icon-box">{icon}</div>
      <div className="info-text">
        <div className="info-title">{title}</div>
        <div className="info-value">{value}</div>
      </div>
    </div>
  )
}

export default function Profile() {
  const [profileData, setProfileData] = useState({
    name: 'MADHUMITHA.K',
    gender: 'Female',
    photo: '',
    regNo: '710123205020',
    branch: 'B.Tech - Information Technology',
    department: 'IT',
    batch: '2023 - 2027',
    completion: 90,
    email: 'madhumithalakshmi9406@gmail.com',
    phone: '+91 63694 70565',
    mobile: '6369470565',
    parentMobile: '9750324454',
    dob: '15/05/2004',
    nativeDistrict: 'Pudukkottai',
    permanentAddress: 'Nagarathinam Pallam, Thanjur Post, Alangudi Taluk, Isugupatti, Pudukkottai',
    location: 'Coimbatore, Tamil Nadu',
    tenthPercentage: 'pass%',
    twelfthPercentage: '0.83%',
    cgpa: '9.025',
    yearOfPassing: '2027',
    historyOfArrears: 'nill',
    currentArrears: 'nill',
    technicalSkills: 'python developer, Data analyzer, python',
    certifications: 'introduction to Automation, Data analytics',
    languagesKnown: 'Tamil, English',
    wishToWork: 'software developer',
    willingInterviewAnyLocation: 'Yes',
    willingWorkAnyLocation: 'Yes',
    willingWorkTN: 'Yes',
    willingWorkIndia: 'Yes',
    github: 'github.com/jayasurya-k',
    linkedin: 'linkedin.com/in/jayasurya-k',
    selectedDrives: [],
    projects: []
  })

  const [activeTab, setActiveTab] = useState('Overview')
  const [resumeName, setResumeName] = useState('Final-Resume.pdf')
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)

  // Edit Profile states
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  const fileInputRef = useRef(null)
  const profilePhotoInputRef = useRef(null)

  const handleEditClick = () => {
    setEditForm({ ...profileData })
    setIsEditing(true)
  }

  const handleCancelProfile = () => {
    setIsEditing(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const saved = { ...editForm }
    setProfileData(saved)
    try {
      localStorage.setItem('ait-profile', JSON.stringify(saved))
      window.dispatchEvent(new CustomEvent('profile:update', { detail: saved }))

      // Live sync edits directly to Cloud Firestore 'users' collection
      const studentId = saved.uid || saved.id || saved.regNo || saved.email
      if (studentId) {
        await saveStudentProfileToFirestore(studentId, saved)
      }
    } catch (err) {
      console.warn('Failed to save profile to Firestore/localStorage', err)
    }
    setIsEditing(false)
  }

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setEditForm((currentForm) => ({ ...currentForm, photo: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // Load saved profile from localStorage and sync live from Cloud Firestore on mount
  React.useEffect(() => {
    let localProfile = {}
    try {
      const raw = localStorage.getItem('ait-profile')
      if (raw) {
        localProfile = JSON.parse(raw)
        setProfileData((prev) => ({ ...prev, ...localProfile }))
      }
    } catch {
      // ignore
    }

    // Live sync from Firestore database using logged-in student identifier
    const studentIdentifier = localProfile.uid || localProfile.id || localProfile.email || localProfile.regNo
    if (studentIdentifier) {
      fetchStudentProfileFromFirestore(studentIdentifier).then((fsUser) => {
        if (fsUser) {
          setProfileData((prev) => {
            const merged = {
              ...prev,
              ...fsUser,
              branch: fsUser.branch || fsUser.department || prev.branch,
              selectedDrives: Array.isArray(fsUser.selectedDrives) ? fsUser.selectedDrives : prev.selectedDrives || []
            }
            try {
              localStorage.setItem('ait-profile', JSON.stringify(merged))
            } catch (e) {
              console.warn('LocalStorage save error:', e)
            }
            return merged
          })
        }
      })
    }
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumeName(file.name)
      setResumeUploaded(true)

      const updated = {
        ...profileData,
        resumeName: file.name,
        resumeUploaded: true,
        resumeUpdatedAt: new Date().toISOString()
      }
      setProfileData(updated)
      try {
        localStorage.setItem('ait-profile', JSON.stringify(updated))
        const studentId = updated.uid || updated.id || updated.regNo || updated.email
        if (studentId) {
          await saveStudentProfileToFirestore(studentId, updated)
        }
      } catch (err) {
        console.warn('Failed to sync uploaded resume info to Firestore:', err)
      }

      window.alert(`Successfully uploaded resume: ${file.name}`)
    }
  }

  const handleViewResume = () => {
    if (resumeFile) {
      const fileURL = URL.createObjectURL(resumeFile)
      window.open(fileURL, '_blank')
    } else {
      const dummyContent = `Candidate Profile Resume Summary\n\nName: ${profileData.name}\nReg. No: ${profileData.regNo}\nBranch: ${profileData.branch || profileData.department}\nBatch: ${profileData.batch}\nEmail: ${profileData.email}\nPhone: ${profileData.mobile || profileData.phone}\nLocation: ${profileData.location}\nGitHub: ${profileData.github}\nLinkedIn: ${profileData.linkedin}`
      const dummyBlob = new Blob([dummyContent], { type: 'text/plain' })
      const fileURL = URL.createObjectURL(dummyBlob)
      window.open(fileURL, '_blank')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Placements':
        const drivesList = Array.isArray(profileData.selectedDrives) ? profileData.selectedDrives : []
        return (
          <div className="tab-body">
            {drivesList.length === 0 ? (
              <div className="project-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
                <h3 style={{ color: '#64748b', fontSize: '16px', marginBottom: '8px' }}>No Selected Placement Drives Yet</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  When you are shortlisted or nominated by the Placement Admin for a drive, your selected drive details (Company, Role, Package CTC, Date, Location, Bond) will appear right here in real time!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {drivesList.map((drive, idx) => (
                  <div key={drive.driveId || idx} className="project-card" style={{ borderLeft: '4px solid #16a34a', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {drive.company}
                        </h3>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb', margin: '4px 0' }}>
                          {drive.role}
                        </p>
                      </div>
                      <span className="badge-uploaded" style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                        🎉 {drive.status || 'Selected / Nominated'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px stroke #e2e8f0' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Package CTC</span>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>{drive.package || 'N/A'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Drive Date</span>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{drive.date || 'Scheduled'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Location</span>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{drive.location || 'Campus'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Service Bond</span>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{drive.bond || 'None'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'Academic Info':
        return (
          <div className="tab-body">
            <div className="project-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎓 Academic Performance & Arrears Track
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>10th Score</span>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginTop: '2px' }}>
                    {profileData.tenthPercentage ? `${profileData.tenthPercentage}` : 'pass%'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>12th / Diploma</span>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginTop: '2px' }}>
                    {profileData.twelfthPercentage ? `${profileData.twelfthPercentage}` : '0.83%'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <span style={{ color: '#1e40af', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>CGPA (till VI Sem)</span>
                  <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '22px', marginTop: '2px' }}>
                    {profileData.cgpa || '9.025'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Year of Passing</span>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginTop: '2px' }}>
                    {profileData.yearOfPassing || '2027'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px' }}>
                  <span style={{ color: '#166534', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Arrears Cleared</span>
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '18px', marginTop: '2px' }}>
                    {profileData.historyOfArrears || 'nill'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: profileData.currentArrears && profileData.currentArrears !== '0' && profileData.currentArrears !== 'nill' ? '#fef2f2' : '#f0fdf4', borderRadius: '10px' }}>
                  <span style={{ color: profileData.currentArrears && profileData.currentArrears !== '0' && profileData.currentArrears !== 'nill' ? '#991b1b' : '#166534', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Current Arrears</span>
                  <div style={{ fontWeight: 800, color: profileData.currentArrears && profileData.currentArrears !== '0' && profileData.currentArrears !== 'nill' ? '#dc2626' : '#166534', fontSize: '18px', marginTop: '2px' }}>
                    {profileData.currentArrears || 'nill'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'Education':
        return (
          <div className="tab-body">
            <div className="section-row">
              <div>
                <h3>Adithya Institute Of Technology</h3>
                <p className="section-meta">{profileData.branch || profileData.department || 'B.Tech - Information Technology'} • {profileData.batch || '2023 - 2027'}</p>
              </div>
              <span className="detail-pill">CGPA {profileData.cgpa || '9.025'}</span>
            </div>
            <div className="section-row">
              <div>
                <h3>Central Board of Secondary Education</h3>
                <p className="section-meta">Higher Secondary / Diploma • {profileData.yearOfPassing ? Number(profileData.yearOfPassing) - 4 : '2023'}</p>
              </div>
              <span className="detail-pill">{profileData.twelfthPercentage || '0.83%'}</span>
            </div>
            <div className="section-row">
              <div>
                <h3>Secondary School Certificate</h3>
                <p className="section-meta">Secondary School (10th) • {profileData.yearOfPassing ? Number(profileData.yearOfPassing) - 6 : '2021'}</p>
              </div>
              <span className="detail-pill">{profileData.tenthPercentage || 'pass%'}</span>
            </div>
          </div>
        )
      case 'Skills':
        const skillsArray = profileData.technicalSkills
          ? profileData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean)
          : ['python developer', 'Data analyzer', 'python', 'React', 'JavaScript', 'CSS']
        const certsList = profileData.certifications
          ? profileData.certifications.split(',').map(c => c.trim()).filter(Boolean)
          : ['introduction to Automation', 'Data analytics']

        return (
          <div className="tab-body" style={{ display: 'grid', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
                Technical Skills
              </h4>
              <div className="feature-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skillsArray.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-badge" style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe', fontWeight: 700 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
                Certification Courses
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {certsList.map((cert, cIdx) => (
                  <div key={cIdx} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>
                    📜 {cert}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                Languages Known
              </h4>
              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '15px' }}>
                🗣️ {profileData.languagesKnown || 'Tamil, English'}
              </div>
            </div>
          </div>
        )
      case 'Projects':
        const projectsList = Array.isArray(profileData.projects) && profileData.projects.length > 0
          ? profileData.projects
          : [
              {
                title: 'Placement Portal Dashboard',
                description: 'Designed a student-facing dashboard with profile tracking, milestones, and resume upload flows.',
                meta: 'React, Vite, CSS'
              },
              {
                title: 'Job Application Tracker',
                description: 'Built a responsive interface for tracking applications, interview status and upcoming events.',
                meta: 'JavaScript, API Design'
              }
            ]
        return (
          <div className="tab-body">
            {projectsList.map((proj, idx) => (
              <div key={proj.id || idx} className="project-card">
                <h3>{proj.title || proj.name}</h3>
                <p>{proj.description || proj.desc}</p>
                <div className="project-meta">{proj.meta || proj.tech || proj.technologies || 'Web App'}</div>
              </div>
            ))}
          </div>
        )
      case 'Certificates':
        return (
          <div className="tab-body feature-grid certificates-grid">
            {[
              { title: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2024' },
              { title: 'Full Stack Web Dev', issuer: 'Coursera', date: '2023' },
              { title: 'UI/UX Foundations', issuer: 'LinkedIn Learning', date: '2024' }
            ].map((cert) => (
              <div key={cert.title} className="cert-card">
                <strong>{cert.title}</strong>
                <p>{cert.issuer}</p>
                <span>{cert.date}</span>
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="overview-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="overview-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', borderBottom: '1px stroke #e2e8f0', paddingBottom: '6px' }}>
                📞 Contact & Personal Info
              </div>
              <InfoItem
                title="Email"
                value={profileData.email}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />
              <InfoItem
                title="Student Mobile"
                value={profileData.mobile || profileData.phone || '6369470565'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              />
              <InfoItem
                title="Parent Mobile"
                value={profileData.parentMobile || '9750324454'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              />
              <InfoItem
                title="Date of Birth / Gender"
                value={`${profileData.dob || '15/05/2004'} | ${profileData.gender || 'Female'}`}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />
              <InfoItem
                title="Native District"
                value={profileData.nativeDistrict || 'Pudukkottai'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />
              <InfoItem
                title="Permanent Address"
                value={profileData.permanentAddress || 'Nagarathinam Pallam, Thanjur Post, Alangudi Taluk, Isugupatti, Pudukkottai'}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                }
              />
            </div>

            <div className="overview-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', borderBottom: '1px stroke #e2e8f0', paddingBottom: '6px' }}>
                📍 Placement Preferences & Resume
              </div>
              <InfoItem
                title="Wish to Work (Role)"
                value={<span style={{ color: '#2563eb', fontWeight: 700 }}>{profileData.wishToWork || 'software developer'}</span>}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                }
              />
              <InfoItem
                title="Location Preferences"
                value={
                  <div style={{ fontSize: '13px', display: 'grid', gap: '4px' }}>
                    <div>Interview Anywhere: <strong style={{ color: '#166534' }}>{profileData.willingInterviewAnyLocation || 'Yes'}</strong></div>
                    <div>Work Anywhere: <strong style={{ color: '#166534' }}>{profileData.willingWorkAnyLocation || 'Yes'}</strong></div>
                    <div>Work in TN: <strong style={{ color: '#166534' }}>{profileData.willingWorkTN || 'Yes'}</strong> | Work in India: <strong style={{ color: '#166534' }}>{profileData.willingWorkIndia || 'Yes'}</strong></div>
                  </div>
                }
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                }
              />
              <InfoItem
                title="GitHub"
                value={<a href={`https://${profileData.github}`} target="_blank" rel="noreferrer" className="link-purple">{profileData.github}</a>}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                }
              />
              <InfoItem
                title="LinkedIn"
                value={<a href={`https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="link-purple">{profileData.linkedin}</a>}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                }
              />
              <InfoItem
                title="Resume Document"
                value={
                  <div className="resume-value-row">
                    {resumeUploaded || profileData.resumeUrl ? (
                      <>
                        <span className="badge-uploaded" title={resumeName}>Uploaded ({resumeName})</span>
                        <button className="btn-view" type="button" onClick={handleViewResume}>
                          View
                        </button>
                      </>
                    ) : (
                      <button className="btn-upload-resume" type="button" onClick={handleUploadClick}>
                        Upload Resume
                      </button>
                    )}
                  </div>
                }
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                }
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="profile-page-wrapper">
      <h1 className="page-title">Student Profile</h1>

      <div className="profile-page-content">
        {/* Card 1: My Profile */}
        <div className="profile-card profile-main-card">
          <div className="profile-card-header">
            <h2 className="card-title">My Profile</h2>
            <button className="btn-edit" type="button" onClick={handleEditClick}>
              Edit Profile
            </button>
          </div>

          <div className="profile-card-body">
            <div className="student-profile-info">
              <Avatar profileData={profileData} />
              <div className="student-profile-details">
                <h3 className="student-name">{profileData.name}</h3>
                <div className="student-meta-item">
                  <span className="meta-label">Reg. No:</span>
                  <span className="meta-value">{profileData.regNo}</span>
                </div>
                <div className="student-meta-item">
                  <span className="meta-label">{profileData.branch || profileData.department || 'IT'}</span>
                </div>
                <div className="student-meta-item">
                  <span className="meta-label">Batch:</span>
                  <span className="meta-value">{profileData.batch}</span>
                </div>
              </div>
            </div>

            <div className="profile-completion-row">
              <span className="completion-label">Profile Completion</span>
              <div className="completion-bar-track">
                <div className="completion-bar-fill" style={{ width: `${profileData.completion}%` }} />
              </div>
              <span className="completion-value">{profileData.completion}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tabs Details */}
        <div className="profile-card profile-details-card">
          <div className="tabs-header">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-panel">{renderTabContent()}</div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden-input"
        onChange={handleResumeChange}
        accept=".pdf,.doc,.docx"
      />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={handleCancelProfile}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <form onSubmit={handleSaveProfile}>
              <div className="modal-header">
                <h2 className="modal-company-name">Edit Complete Profile Details</h2>
                <button className="modal-close-btn" type="button" onClick={handleCancelProfile}>
                  &times;
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <h4 style={{ color: '#0f172a', margin: '0 0 12px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Personal & Contact Details</h4>
                <div className="edit-profile-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={editForm.gender || 'Male'}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      value={editForm.regNo || ''}
                      onChange={(e) => setEditForm({ ...editForm, regNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch / Department</label>
                    <input
                      type="text"
                      value={editForm.branch || editForm.department || ''}
                      onChange={(e) => setEditForm({ ...editForm, branch: e.target.value, department: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Batch</label>
                    <input
                      type="text"
                      value={editForm.batch || ''}
                      onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Student Mobile</label>
                    <input
                      type="text"
                      value={editForm.mobile || editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Mobile</label>
                    <input
                      type="text"
                      value={editForm.parentMobile || ''}
                      onChange={(e) => setEditForm({ ...editForm, parentMobile: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="text"
                      value={editForm.dob || ''}
                      onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Native District</label>
                    <input
                      type="text"
                      value={editForm.nativeDistrict || ''}
                      onChange={(e) => setEditForm({ ...editForm, nativeDistrict: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Permanent Address</label>
                    <input
                      type="text"
                      value={editForm.permanentAddress || ''}
                      onChange={(e) => setEditForm({ ...editForm, permanentAddress: e.target.value })}
                    />
                  </div>
                </div>

                <h4 style={{ color: '#0f172a', margin: '20px 0 12px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Academic Performance</h4>
                <div className="edit-profile-form-grid">
                  <div className="form-group">
                    <label>10th Percentage (%)</label>
                    <input
                      type="text"
                      value={editForm.tenthPercentage || ''}
                      onChange={(e) => setEditForm({ ...editForm, tenthPercentage: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>12th / Diploma (%)</label>
                    <input
                      type="text"
                      value={editForm.twelfthPercentage || ''}
                      onChange={(e) => setEditForm({ ...editForm, twelfthPercentage: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>CGPA (till VI Sem)</label>
                    <input
                      type="text"
                      value={editForm.cgpa || ''}
                      onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Passing</label>
                    <input
                      type="text"
                      value={editForm.yearOfPassing || ''}
                      onChange={(e) => setEditForm({ ...editForm, yearOfPassing: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Arrears Cleared</label>
                    <input
                      type="text"
                      value={editForm.historyOfArrears || ''}
                      onChange={(e) => setEditForm({ ...editForm, historyOfArrears: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Arrears</label>
                    <input
                      type="text"
                      value={editForm.currentArrears || ''}
                      onChange={(e) => setEditForm({ ...editForm, currentArrears: e.target.value })}
                    />
                  </div>
                </div>

                <h4 style={{ color: '#0f172a', margin: '20px 0 12px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Skills & Preferences</h4>
                <div className="edit-profile-form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Technical Skills (Comma Separated)</label>
                    <input
                      type="text"
                      value={editForm.technicalSkills || ''}
                      onChange={(e) => setEditForm({ ...editForm, technicalSkills: e.target.value })}
                      placeholder="python developer, Data analyzer, React, Node.js"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Certification Courses</label>
                    <input
                      type="text"
                      value={editForm.certifications || ''}
                      onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                      placeholder="introduction to Automation, Data analytics"
                    />
                  </div>
                  <div className="form-group">
                    <label>Languages Known</label>
                    <input
                      type="text"
                      value={editForm.languagesKnown || ''}
                      onChange={(e) => setEditForm({ ...editForm, languagesKnown: e.target.value })}
                      placeholder="Tamil, English"
                    />
                  </div>
                  <div className="form-group">
                    <label>Wish to Work (Role)</label>
                    <input
                      type="text"
                      value={editForm.wishToWork || ''}
                      onChange={(e) => setEditForm({ ...editForm, wishToWork: e.target.value })}
                      placeholder="software developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub Profile</label>
                    <input
                      type="text"
                      value={editForm.github || ''}
                      onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="text"
                      value={editForm.linkedin || ''}
                      onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-modal-close" type="button" onClick={handleCancelProfile} style={{ marginRight: 8 }}>
                  Cancel
                </button>
                <button className="btn-modal-save" type="submit">
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
