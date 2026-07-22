import React, { useState } from 'react'

const initialApplications = [
  {
    id: 1,
    company: 'Zoho Corporation',
    role: 'Software Developer',
    ctc: '8.5 LPA',
    appliedDate: '10 Jul 2025',
    status: 'Applied',
    statusDetail: 'Online Test',
    logo: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="14" height="14" rx="2" fill="#E74C3C" />
        <rect x="22" y="4" width="14" height="14" rx="2" fill="#3498DB" />
        <rect x="4" y="22" width="14" height="14" rx="2" fill="#2ECC71" />
        <rect x="22" y="22" width="14" height="14" rx="2" fill="#F1C40F" />
      </svg>
    ),
    description: 'Zoho is hiring Software Developers for building next-generation SaaS enterprise software. You will design, build, and implement highly scalable products.',
    eligibility: 'B.Tech IT/CSE/ECE with CGPA >= 7.5. No standing arrears.',
    rounds: [
      { name: 'Online Programming Round', status: 'Completed' },
      { name: 'Advanced Programming & Design Round', status: 'Upcoming' },
      { name: 'Technical Interview', status: 'Pending' },
      { name: 'HR Interview', status: 'Pending' }
    ]
  },
  {
    id: 2,
    company: 'Tata Consultancy Services',
    role: 'System Engineer',
    ctc: '7.0 LPA',
    appliedDate: '05 Jul 2025',
    status: 'Shortlisted',
    statusDetail: 'Technical Round',
    logo: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c4-4 12-4 16 0s4 12 0 16-12 4-16 0" stroke="#3498DB" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 20h8M20 16v8" stroke="#E74C3C" strokeWidth="2.5" />
      </svg>
    ),
    description: 'TCS Digital is seeking system engineers to drive innovative digital transformation projects and software consulting.',
    eligibility: 'B.Tech IT/CSE/ECE/EEE with CGPA >= 7.0. 60% throughout Academics.',
    rounds: [
      { name: 'TCS NQT National Qualifier Test', status: 'Completed' },
      { name: 'Technical Interview Round', status: 'Upcoming' },
      { name: 'Managerial Round', status: 'Pending' },
      { name: 'HR Round', status: 'Pending' }
    ]
  },
  {
    id: 3,
    company: 'Infosys',
    role: 'System Engineer',
    ctc: '6.2 LPA',
    appliedDate: '28 Jun 2025',
    status: 'Interview',
    statusDetail: 'HR Round',
    logo: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#007CC3" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">Infosys</text>
      </svg>
    ),
    description: 'Infosys Specialist Programmer role focused on complex cloud-native microservices architecture, frontend frameworks, and database design.',
    eligibility: 'All Engineering branches with CGPA >= 6.5. Good analytical skills.',
    rounds: [
      { name: 'Online Coding Challenge', status: 'Completed' },
      { name: 'Technical Interview', status: 'Completed' },
      { name: 'HR Interview Round', status: 'Upcoming' }
    ]
  },
  {
    id: 4,
    company: 'Accenture',
    role: 'Associate Software Engineer',
    ctc: '4.5 LPA',
    appliedDate: '15 Jun 2025',
    status: 'Rejected',
    statusDetail: 'Rejected',
    logo: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10l12 10l-12 10" stroke="#A12B93" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50%" y="80%" dominantBaseline="middle" textAnchor="middle" fill="#111111" fontSize="8" fontWeight="bold">accenture</text>
      </svg>
    ),
    description: 'Accenture Technology Careers provides associate engineers with the foundation to build, maintain, and support enterprise applications globally.',
    eligibility: 'B.Tech/BE/MCA/M.Sc Computer Science with CGPA >= 6.0.',
    rounds: [
      { name: 'Cognitive & Technical Assessment', status: 'Completed' },
      { name: 'Coding Assessment', status: 'Failed' },
      { name: 'Communication Assessment', status: 'Cancelled' },
      { name: 'Technical & HR Interview', status: 'Cancelled' }
    ]
  },
  {
    id: 5,
    company: 'Cognizant',
    role: 'Programmer Analyst',
    ctc: '5.4 LPA',
    appliedDate: '02 Jul 2025',
    status: 'Applied',
    statusDetail: 'Resume Screening',
    logo: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#0D2E5C" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
      </svg>
    ),
    description: 'Cognizant GenC developer program focused on entry-level programming roles, application support, and business technology solutions.',
    eligibility: 'B.Tech IT/CSE/ECE/EEE with CGPA >= 6.5.',
    rounds: [
      { name: 'Online Aptitude & Coding Test', status: 'Completed' },
      { name: 'Technical Interview', status: 'Pending' },
      { name: 'HR Interview', status: 'Pending' }
    ]
  }
]

export default function Applications() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)

  // Calculate counts dynamically
  const counts = {
    All: initialApplications.length,
    Applied: initialApplications.filter((app) => app.status === 'Applied').length,
    Shortlisted: initialApplications.filter((app) => app.status === 'Shortlisted').length,
    Interview: initialApplications.filter((app) => app.status === 'Interview').length,
    Offers: initialApplications.filter((app) => app.status === 'Offers').length,
    Rejected: initialApplications.filter((app) => app.status === 'Rejected').length
  }

  const filterTabs = ['All', 'Applied', 'Shortlisted', 'Interview', 'Offers', 'Rejected']

  const filteredApplications = activeFilter === 'All'
    ? initialApplications
    : initialApplications.filter((app) => app.status === activeFilter)

  const handleOpenDetails = (app) => {
    setSelectedApp(app)
  }

  const handleCloseDetails = () => {
    setSelectedApp(null)
  }

  return (
    <div className="applications-page-wrapper">
  

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
                    <div className="company-logo">{app.logo}</div>
                    <div className="company-info-text">
                      <h3 className="company-name">{app.company}</h3>
                      <p className="company-role">{app.role} • <span className="ctc-value">{app.ctc}</span></p>
                      <div className="company-metadata-row">
                        <span className="meta-item">Applied on: <strong>{app.appliedDate}</strong></span>
                        <span className="meta-item status-detail-label">
                          Status: <strong className="status-detail-val">{app.statusDetail}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="company-card-right">
                    <span className={`status-badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
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
