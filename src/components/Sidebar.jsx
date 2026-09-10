import React from 'react';
import AITLogo from './AITLogo';
import {
  DashboardIcon,
  ApplicationsIcon,
  CalendarIcon,
  ResumeIcon,
  TrainingIcon,
  MockInterviewIcon,
  CertificatesIcon,
  DocumentsIcon,
  LogoutIcon,
  ResourcesIcon,
  AlumniIcon
} from './Icons';

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'applications', label: 'Applications', icon: ApplicationsIcon },
  { id: 'calendar', label: 'Drive Calendar', icon: CalendarIcon },
  { id: 'resume', label: 'Resume Builder', icon: ResumeIcon },
  { id: 'training', label: 'Training', icon: TrainingIcon },
  { id: 'mock-interview', label: 'Mock Interview', icon: MockInterviewIcon },
  { id: 'certificates', label: 'Certificates', icon: CertificatesIcon },
  { id: 'resources', label: 'Resources', icon: ResourcesIcon },
  { id: 'alumni', label: 'Alumni Network', icon: AlumniIcon },
  { id: 'documents', label: 'Documents', icon: DocumentsIcon },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-logo-icon" style={{ background: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AITLogo size={32} />
        </div>
        <div className="brand-info">
          <span className="brand-title">AIT</span>
          <span className="brand-subtitle">PLACEMENT PORTAL</span>
        </div>
      </div>

      {/* Feature Menu Navigation */}
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
