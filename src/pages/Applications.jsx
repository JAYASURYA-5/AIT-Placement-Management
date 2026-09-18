import React, { useState, useEffect } from 'react'
import { fetchDrivesFromFirestore } from '../firebase'

const defaultApplications = [
  {
    id: 'demo_1',
    company: 'Zoho Corporation',
    role: 'Software Developer',
    ctc: '8.5 LPA',
    appliedDate: '10 Jul 2025',
    status: 'Shortlisted',
    statusDetail: 'Shortlisted by Admin Drive',
    isNominated: true,
    logoText: 'ZOHO',
    logoBg: '#be185d',
    description: 'Zoho Corporation campus recruitment drive. Designing and implementing scalable enterprise SaaS applications.',
    eligibility: 'B.Tech CSE/IT/ECE with CGPA >= 6.5',
    bond: 'No Bond',
    location: 'Chennai / Tenkasi',
    rounds: [
      { name: 'Candidate Nomination', status: 'Completed' },
      { name: 'Online Programming Challenge', status: 'Upcoming' },
      { name: 'Technical Interview', status: 'Pending' },
      { name: 'HR Round', status: 'Pending' }
    ]
  },
  {
    id: 'demo_2',
    company: 'TEAM TEXA',
    role: 'Data Analyst',
    ctc: '10 LPA',
    appliedDate: '05 Jul 2025',
    status: 'Shortlisted',
    statusDetail: 'Shortlisted by Admin Drive',
    isNominated: true,
    logoText: 'TEXA',
    logoBg: '#1e40af',
    description: 'TEAM TEXA campus placement drive for Data Analyst & Business Intelligence engineering roles.',
    eligibility: 'B.Tech IT/CSE/ECE/AI&DS with CGPA >= 8.5',
    bond: 'No Bond',
    location: 'Bangalore',
    rounds: [
      { name: 'Nomination by Placement Cell', status: 'Completed' },
      { name: 'Aptitude & Logical Assessment', status: 'Upcoming' },
      { name: 'Technical & HR Round', status: 'Pending' }
    ]
  },
  {
    id: 'demo_3',
    company: 'Tata Consultancy Services',
    role: 'System Engineer',
    ctc: '7.0 LPA',
    appliedDate: '05 Jul 2025',
    status: 'Applied',
    statusDetail: 'Technical Round',
    logoText: 'TCS',
    logoBg: '#2563eb',
    description: 'TCS Digital system engineers driving innovative digital transformation projects.',
    eligibility: 'B.Tech IT/CSE/ECE with CGPA >= 7.0',
    bond: '1 Year',
    location: 'Chennai',
    rounds: [
      { name: 'TCS NQT National Qualifier Test', status: 'Completed' },
      { name: 'Technical Interview Round', status: 'Upcoming' },
      { name: 'HR Round', status: 'Pending' }
    ]
  },
  {
    id: 'demo_4',
    company: 'Infosys',
    role: 'Specialist Programmer',
    ctc: '6.2 LPA',
    appliedDate: '28 Jun 2025',
    status: 'Interview',
    statusDetail: 'HR Round',
    logoText: 'INFO',
    logoBg: '#0284c7',
    description: 'Infosys Specialist Programmer role focused on cloud-native microservices architecture.',
    eligibility: 'All Engineering branches with CGPA >= 6.5',
    bond: 'No Bond',
    location: 'Mysore / Bangalore',
    rounds: [
      { name: 'Online Coding Challenge', status: 'Completed' },
      { name: 'Technical Interview', status: 'Completed' },
      { name: 'HR Interview Round', status: 'Upcoming' }
    ]
  }
]

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)
  const [studentProfile, setStudentProfile] = useState(null)

  useEffect(() => {
    async function loadDriveApplications() {
      setLoading(true)
      let profile = {}
      try {
        profile = JSON.parse(localStorage.getItem('ait-profile') || '{}')
        setStudentProfile(profile)
      } catch {}

      const studentIds = [
        (profile.uid || '').toLowerCase(),
        (profile.id || '').toLowerCase(),
        (profile.regNo || '').toLowerCase(),
        (profile.email || '').toLowerCase()
      ].filter(Boolean)

      const fsDrives = await fetchDrivesFromFirestore()

      if (fsDrives && fsDrives.length > 0) {
        const formattedDrives = fsDrives.map(drive => {
          const nominatedList = (drive.nominatedStudents || []).map(s => String(s).toLowerCase())
          const isNominated = studentIds.some(id => nominatedList.includes(id)) || nominatedList.length > 0

          return {
            id: drive.id,
            company: drive.company || 'Company Drive',
            role: drive.role || 'Software Engineer',
            ctc: drive.package ? (drive.package.toLowerCase().includes('ctc') || drive.package.toLowerCase().includes('lpa') ? drive.package : `${drive.package} LPA`) : '6.5 LPA',
            appliedDate: drive.date || 'Campus Drive',
            status: isNominated ? 'Shortlisted' : 'Applied',
            statusDetail: isNominated ? '🎉 Nominated by Placement Cell' : (drive.status || 'Upcoming Drive'),
            isNominated: isNominated,
            logoText: (drive.company || 'COMP').substring(0, 4).toUpperCase(),
            logoBg: isNominated ? '#be185d' : '#2563eb',
            description: `${drive.company} campus placement drive for ${drive.role} position. Location: ${drive.location || 'Campus'}.`,
            eligibility: `Min CGPA: ${drive.minCGPA || '6.5'}, Branches: ${drive.branches || 'CSE, IT, ECE'}, Max Backlogs: ${drive.maxBacklogs || '0'}`,
            bond: drive.bond || 'No Bond',
            location: drive.location || 'Campus',
            rounds: [
              { name: 'Admin Candidate Nomination', status: isNominated ? 'Completed' : 'Upcoming' },
              { name: 'Technical Assessment', status: 'Upcoming' },
              { name: 'Technical & HR Interview', status: 'Pending' }
            ]
          }
        })

        // Combine Firestore live drives with default list, ensuring unique IDs
        const existingIds = new Set(formattedDrives.map(d => d.id))
        const filteredDefault = defaultApplications.filter(d => !existingIds.has(d.id))
        setApplications([...formattedDrives, ...filteredDefault])
      } else {
        setApplications(defaultApplications)
      }
      setLoading(false)
    }

    loadDriveApplications()
  }, [])

  // Calculate counts dynamically
  const counts = {
    All: applications.length,
    Nominated: applications.filter((app) => app.isNominated || app.status === 'Shortlisted').length,
    Applied: applications.filter((app) => app.status === 'Applied').length,
    Interview: applications.filter((app) => app.status === 'Interview').length,
    Offers: applications.filter((app) => app.status === 'Offers').length,
    Rejected: applications.filter((app) => app.status === 'Rejected').length
  }

  const filterTabs = ['All', 'Nominated', 'Applied', 'Interview', 'Offers', 'Rejected']

  const filteredApplications = activeFilter === 'All'
    ? applications
    : activeFilter === 'Nominated'
      ? applications.filter((app) => app.isNominated || app.status === 'Shortlisted')
      : applications.filter((app) => app.status === activeFilter)

  const handleOpenDetails = (app) => {
    setSelectedApp(app)
  }

  const handleCloseDetails = () => {
    setSelectedApp(null)
  }

  return (
    <div className="applications-page-wrapper">
      <h1 className="page-title"></h1>

      <div className="profile-page-content">
        <div className="profile-card profile-details-card">
          <div className="applications-header">
            <h2 className="card-title">My Applications</h2>
          </div>

          {/* Filter Tabs */}
          <div className="applications-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter(tab)}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>

          {/* Company Cards List */}
          <div className="company-cards-list">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <div key={app.id} className="company-card">
                  <div className="company-card-left">
                    <div className="company-logo" style={{
                      backgroundColor: app.logoBg || '#be185d',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '12px',
                      borderRadius: '10px',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {app.logo ? app.logo : (app.logoText || app.company.substring(0, 4).toUpperCase())}
                    </div>
                    <div className="company-info-text">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className="company-name" style={{ margin: 0 }}>{app.company}</h3>
                        {app.isNominated && (
                          <span style={{
                            backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '11px',
                            fontWeight: '800', padding: '2px 8px', borderRadius: '6px'
                          }}>
                            🎉 Nominated
                          </span>
                        )}
                      </div>
                      <p className="company-role" style={{ marginTop: '2px' }}>{app.role} • <span className="ctc-value">{app.ctc}</span></p>
                      <div className="company-metadata-row">
                        <span className="meta-item">Drive Date: <strong>{app.appliedDate}</strong></span>
                        <span className="meta-item status-detail-label">
                          Status: <strong className="status-detail-val" style={{ color: app.isNominated ? '#be185d' : 'inherit' }}>{app.statusDetail}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="company-card-right">
                    <span className={`status-badge badge-${app.status.toLowerCase()}`}>
                      {app.isNominated ? 'Shortlisted' : app.status}
                    </span>
                    <button
                      className="btn-view-details"
                      type="button"
                      onClick={() => handleOpenDetails(app)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-applications">
                <p>No applications found under "{activeFilter}".</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruitment Drive Details Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-company-info">
                <div className="modal-logo">{selectedApp.logo}</div>
                <div>
                  <h2 className="modal-company-name">{selectedApp.company}</h2>
                  <p className="modal-role">{selectedApp.role} • <span className="modal-ctc">{selectedApp.ctc}</span></p>
                </div>
              </div>
              <button className="modal-close-btn" type="button" onClick={handleCloseDetails}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4 className="modal-section-title">Application Status</h4>
                <div className="modal-status-summary">
                  <span className={`status-badge badge-${selectedApp.status.toLowerCase()}`}>
                    {selectedApp.status}
                  </span>
                  <span className="modal-meta-text">Applied on: <strong>{selectedApp.appliedDate}</strong></span>
                  <span className="modal-meta-text">Current Stage: <strong>{selectedApp.statusDetail}</strong></span>
                </div>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Job Description</h4>
                <p className="modal-description">{selectedApp.description}</p>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Eligibility Criteria</h4>
                <p className="modal-description">{selectedApp.eligibility}</p>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Recruitment Rounds Timeline</h4>
                <div className="modal-timeline">
                  {selectedApp.rounds.map((round, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className={`timeline-dot dot-${round.status.toLowerCase()}`}></div>
                      <div className="timeline-info">
                        <div className="round-name">{round.name}</div>
                        <div className={`round-status status-${round.status.toLowerCase()}`}>
                          {round.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" type="button" onClick={handleCloseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
