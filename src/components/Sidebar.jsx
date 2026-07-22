import React from 'react';
import {
  DashboardIcon,
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
  LogoutIcon,
  ResourcesIcon,
  AlumniIcon,
  BellIcon
} from './Icons';

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
  { id: 'applications', label: 'Applications', icon: ApplicationsIcon },
  { id: 'calendar', label: 'Drive Calendar', icon: CalendarIcon },
  { id: 'assessments', label: 'Assessments', icon: AssessmentsIcon },
  { id: 'resume', label: 'Resume Builder', icon: ResumeIcon },
  { id: 'training', label: 'Training', icon: TrainingIcon },
  { id: 'mock-interview', label: 'Mock Interview', icon: MockInterviewIcon },
  { id: 'certificates', label: 'Certificates', icon: CertificatesIcon },
  { id: 'leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
  { id: 'stats', label: 'Placement Stats', icon: StatsIcon },
  { id: 'resources', label: 'Resources', icon: ResourcesIcon },
  { id: 'alumni', label: 'Alumni Network', icon: AlumniIcon },
  { id: 'documents', label: 'Documents', icon: DocumentsIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
