import React from 'react';
import {
  ProfileIcon,
  ApplicationsIcon,
  CalendarIcon,
  AssessmentsIcon,
  ResumeIcon,
  TrainingIcon,
  MockInterviewIcon,
  CertificatesIcon,
  LeaderboardIcon,
  StatsIcon,
  DocumentsIcon,
  SettingsIcon,
  CheckIcon
} from './Icons';

export default function FeatureView({ activeTab, drives, setActiveTab, onApplyDrive }) {
  if (activeTab === 'profile') {
    return (
      <div className="feature-page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Jayasurya K"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-maroon)' }}
            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Jayasurya+K&background=4C1536&color=fff'; }}
          />
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Jayasurya K</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>B.Tech - Information Technology (IV Year)</p>
            <p style={{ color: 'var(--primary-maroon)', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>Reg No: 717822IT045 | CGPA: 8.74</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: 'var(--primary-maroon)' }}>Academic Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div><strong>Department:</strong> Information Technology</div>
              <div><strong>College:</strong> AIT Engineering College</div>
              <div><strong>Batch:</strong> 2022 - 2026</div>
              <div><strong>Arrears:</strong> 0 History of Arrears</div>
            </div>
          </div>

          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: 'var(--primary-maroon)' }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div><strong>Email:</strong> jayasurya.k@ait.edu.in</div>
              <div><strong>Phone:</strong> +91 98765 43210</div>
              <div><strong>LinkedIn:</strong> linkedin.com/in/jayasuryak</div>
              <div><strong>GitHub:</strong> github.com/jayasuryak</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'applications') {
    return (
      <div className="feature-page-container">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ApplicationsIcon /> My Applications
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {drives.map(drive => (
            <div key={drive.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', border: '1px solid var(--border-light)', borderRadius: '16px',
              backgroundColor: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="company-logo" style={{ backgroundColor: drive.logoBg, color: drive.logoColor }}>
                  {drive.logoText}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{drive.company}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{drive.role} • {drive.ctc}</p>
                </div>
              </div>

              <div>
                {drive.applied ? (
                  <span style={{
                    padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800',
                    backgroundColor: '#DCFCE7', color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    <CheckIcon style={{ width: '14px', height: '14px' }} /> Applied & Under Review
                  </span>
                ) : (
                  <button className="btn-apply" onClick={() => onApplyDrive(drive)}>Apply Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'calendar') {
    return (
      <div className="feature-page-container">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon /> Drive Calendar 2025
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { date: '25 Jul 2025', company: 'Zoho Corporation', role: 'Software Developer', status: 'Upcoming' },
            { date: '30 Jul 2025', company: 'Infosys', role: 'System Engineer', status: 'Upcoming' },
            { date: '05 Aug 2025', company: 'TCS', role: 'Digital Engineer', status: 'Scheduled' },
            { date: '12 Aug 2025', company: 'Accenture', role: 'Advanced App Engineering', status: 'Scheduled' },
            { date: '18 Aug 2025', company: 'Cognizant', role: 'GenC Next Engineer', status: 'Scheduled' },
            { date: '25 Aug 2025', company: 'Wipro', role: 'Elite Developer', status: 'Upcoming' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '18px', border: '1px solid var(--border-light)', borderRadius: '16px',
              backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-maroon)' }}>📅 {item.date}</span>
              <span style={{ fontSize: '15px', fontWeight: '800' }}>{item.company}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>{item.role}</span>
              <span style={{
                fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '10px',
                backgroundColor: '#EFF6FF', color: '#1D4ED8', alignSelf: 'flex-start', marginTop: '4px'
              }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        Welcome to the {activeTab.replace('-', ' ')} module. Explore placement resources, tests, and active updates tailored for Jayasurya K.
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
