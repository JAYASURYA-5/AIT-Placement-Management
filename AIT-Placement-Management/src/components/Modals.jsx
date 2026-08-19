import React from 'react';
import { CloseIcon, CheckIcon, CalendarIcon, CodeIcon, AssessmentsIcon } from './Icons';

export function ApplyModal({ drive, onClose, onConfirm }) {
  if (!drive) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div className="company-logo" style={{ backgroundColor: drive.logoBg, color: drive.logoColor, width: '54px', height: '54px', fontSize: '18px' }}>
            {drive.logoText}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Apply for {drive.company}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{drive.role} • {drive.ctc}</p>
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', marginBottom: '24px', fontSize: '13px' }}>
          <div style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--primary-maroon)' }}>Eligibility Verification</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: '700' }}>
              <CheckIcon style={{ width: '16px' }} /> CGPA 8.74 (Required: 7.5+)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: '700' }}>
              <CheckIcon style={{ width: '16px' }} /> 0 Standing Arrears
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: '700' }}>
              <CheckIcon style={{ width: '16px' }} /> Resume Attached (Jayasurya_K_IT_Resume.pdf)
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            style={{ padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--border-medium)', background: 'white', fontWeight: '700', cursor: 'pointer' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-apply"
            onClick={() => onConfirm(drive)}
          >
            Confirm & Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}

export function CalendarModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon /> Placement Drive Calendar 2025
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
          {[
            { date: 'Jul 25, 2025', company: 'Zoho Corporation', role: 'Software Developer', status: 'Applications Open' },
            { date: 'Jul 30, 2025', company: 'Infosys', role: 'System Engineer', status: 'Applications Open' },
            { date: 'Aug 05, 2025', company: 'TCS', role: 'Digital Engineer', status: 'Upcoming' },
            { date: 'Aug 12, 2025', company: 'Accenture', role: 'App Engineer', status: 'Upcoming' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-maroon)' }}>{item.date}</div>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>{item.company}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.role}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '6px 12px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrepModal({ module, onClose, onStartPractice }) {
  if (!module) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div className="prep-icon-box" style={{ backgroundColor: module.bg, color: module.color, width: '50px', height: '50px', marginBottom: 0 }}>
            {module.id === 'coding' ? <CodeIcon /> : <AssessmentsIcon />}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{module.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{module.subtitle}</p>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            Ready to test your skills in {module.title}? Practice curated placement questions from top recruiters including Zoho, Infosys, and TCS.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            className="btn-apply" 
            onClick={() => {
              if (onStartPractice) {
                onStartPractice();
              } else {
                onClose();
              }
            }}
          >
            Start Practice Session
          </button>
        </div>
      </div>
    </div>
  );
}
