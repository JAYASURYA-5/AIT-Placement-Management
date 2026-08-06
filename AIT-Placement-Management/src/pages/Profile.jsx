import React, { useState, useRef } from 'react'
import avatarImg from '../avatar.png'

const tabs = ['Overview', 'Education', 'Skills', 'Projects', 'Certificates']

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
    name: 'Jayasurya K',
    gender: 'Male',
    photo: '',
    regNo: '20IT30104',
    branch: 'B.Tech - Information Technology',
    batch: '2023 - 2027',
    completion: 90,
    email: 'jayasurya.k@ait.edu.in',
    phone: '+91 63749 09350',
    location: 'Coimbatore, Tamil Nadu',
    github: 'github.com/jayasurya-k',
    linkedin: 'linkedin.com/in/jayasurya-k'
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

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setProfileData({ ...editForm })
    try {
      const saved = { ...editForm }
      localStorage.setItem('ait-profile', JSON.stringify(saved))
      window.dispatchEvent(new CustomEvent('profile:update', { detail: saved }))
    } catch (err) {
      console.warn('Failed to save profile to localStorage', err)
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

  // Load saved profile from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('ait-profile')
      if (raw) {
        const parsed = JSON.parse(raw)
        setProfileData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumeName(file.name)
      setResumeUploaded(true)
      window.alert(`Successfully uploaded resume: ${file.name}`)
    }
  }

  const handleViewResume = () => {
    if (resumeFile) {
      const fileURL = URL.createObjectURL(resumeFile)
      window.open(fileURL, '_blank')
    } else {
      const dummyContent = `Candidate Profile Resume Summary\n\nName: ${profileData.name}\nReg. No: ${profileData.regNo}\nBranch: ${profileData.branch}\nBatch: ${profileData.batch}\nEmail: ${profileData.email}\nPhone: ${profileData.phone}\nLocation: ${profileData.location}\nGitHub: ${profileData.github}\nLinkedIn: ${profileData.linkedin}`
      const dummyBlob = new Blob([dummyContent], { type: 'text/plain' })
      const fileURL = URL.createObjectURL(dummyBlob)
      window.open(fileURL, '_blank')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Education':
        return (
          <div className="tab-body">
            <div className="section-row">
              <div>
                <h3>Adithya Institute Of Technology</h3>
                <p className="section-meta">B.Tech - Information Technology • 2023 - 2027</p>
              </div>
              <span className="detail-pill">CGPA 8.4</span>
            </div>
            <div className="section-row">
              <div>
                <h3>Central Board of Secondary Education</h3>
                <p className="section-meta">Higher Secondary • 2023</p>
              </div>
              <span className="detail-pill">92%</span>
            </div>
            <div className="section-row">
              <div>
                <h3>Secondary School Certificate</h3>
                <p className="section-meta">Secondary School • 2021</p>
              </div>
              <span className="detail-pill">94%</span>
            </div>
          </div>
        )
      case 'Skills':
        return (
          <div className="tab-body feature-grid">
            {['React', 'JavaScript', 'CSS', 'Git', 'Figma', 'Node.js'].map((skill) => (
              <span key={skill} className="skill-badge">{skill}</span>
            ))}
          </div>
        )
      case 'Projects':
        return (
          <div className="tab-body">
            <div className="project-card">
              <h3>Placement Portal Dashboard</h3>
              <p>Designed a student-facing dashboard with profile tracking, milestones, and resume upload flows.</p>
              <div className="project-meta">React, Vite, CSS</div>
            </div>
            <div className="project-card">
              <h3>Job Application Tracker</h3>
              <p>Built a responsive interface for tracking applications, interview status and upcoming events.</p>
              <div className="project-meta">JavaScript, API Design</div>
            </div>
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
          <div className="overview-columns">
            <div className="overview-column">
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
                title="Phone"
                value={profileData.phone}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              />
              <InfoItem
                title="Location"
                value={profileData.location}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />
            </div>
            <div className="overview-column">
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
                title="Resume"
                value={
                  <div className="resume-value-row">
                    {resumeUploaded ? (
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
                  <span className="meta-label">{profileData.branch}</span>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveProfile}>
              <div className="modal-header">
                <h2 className="modal-company-name">Edit Profile Details</h2>
                <button className="modal-close-btn" type="button" onClick={handleCancelProfile}>
                  &times;
                </button>
              </div>

              <div className="modal-body">
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
                  <div className="form-group profile-photo-form-group">
                    <label>Profile Photo</label>
                    <div className="profile-photo-editor">
                      <div className="profile-photo-preview">
                        <img
                          src={editForm.photo || (editForm.gender === 'Female' ? femaleAvatarUrl : avatarImg)}
                          alt="Profile preview"
                        />
                      </div>
                      <button
                        className="btn-upload-photo"
                        type="button"
                        onClick={() => profilePhotoInputRef.current?.click()}
                      >
                        Choose Photo
                      </button>
                      <input
                        ref={profilePhotoInputRef}
                        type="file"
                        className="hidden-input"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                      />
                    </div>
                    <span className="form-help-text">A default {editForm.gender === 'Female' ? 'girl' : 'boy'} image is used until you upload one.</span>
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
                    <label>Branch</label>
                    <input
                      type="text"
                      value={editForm.branch || ''}
                      onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
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
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub Username (Link)</label>
                    <input
                      type="text"
                      value={editForm.github || ''}
                      onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn Username (Link)</label>
                    <input
                      type="text"
                      value={editForm.linkedin || ''}
                      onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-modal-close" type="button" onClick={handleCancelProfile} style={{ marginRight: 8 }}>
                  Cancel
                </button>
                <button className="btn-modal-save" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
