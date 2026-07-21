import React from 'react';
import { CalendarIcon, CheckIcon } from './Icons';

export const initialDrivesData = [
  {
    id: 'zoho',
    company: 'Zoho Corporation',
    logoBg: '#FEF2F2',
    logoText: 'zoho',
    logoColor: '#DC2626',
    role: 'Software Developer',
    ctc: 'CTC: 12 LPA',
    date: '25 Jul 2025',
    applied: false,
  },
  {
    id: 'infosys',
    company: 'Infosys',
    logoBg: '#EFF6FF',
    logoText: 'Infosys',
    logoColor: '#0284C7',
    role: 'System Engineer',
    ctc: 'CTC: 9 LPA',
    date: '30 Jul 2025',
    applied: false,
  },
  {
    id: 'tcs',
    company: 'TCS',
    logoBg: '#FAF5FF',
    logoText: 'tcs',
    logoColor: '#7C3AED',
    role: 'Digital Engineer',
    ctc: 'CTC: 7 LPA',
    date: '05 Aug 2025',
    applied: false,
  },
];

export default function UpcomingDrives({ drives, onApply, onViewCalendar }) {
  return (
    <div className="section-container">
      {/* Section Title & Action */}
      <div className="section-header">
        <h2 className="section-title">Upcoming Drives</h2>
        <button className="section-link" onClick={onViewCalendar}>
          View Calendar
        </button>
      </div>

      {/* Drives Grid */}
      <div className="drives-grid">
        {drives.map((drive) => (
          <div key={drive.id} className="drive-card">
            {/* Top Info */}
            <div className="drive-top">
              <div
                className="company-logo"
                style={{ backgroundColor: drive.logoBg, color: drive.logoColor }}
              >
                {drive.logoText}
              </div>
              <div className="drive-info">
                <span className="company-name">{drive.company}</span>
                <span className="role-title">{drive.role}</span>
                <span className="ctc-badge">{drive.ctc}</span>
              </div>
            </div>

            {/* Bottom Date & Action */}
            <div className="drive-bottom">
              <div className="drive-date">
                <CalendarIcon className="w-4 h-4" />
                <span>{drive.date}</span>
              </div>
              <button
                className={`btn-apply ${drive.applied ? 'applied' : ''}`}
                onClick={() => !drive.applied && onApply(drive)}
                disabled={drive.applied}
              >
                {drive.applied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckIcon style={{ width: '14px', height: '14px' }} /> Applied
                  </span>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
