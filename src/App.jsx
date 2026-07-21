import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import StatCards from './components/StatCards';
import UpcomingDrives, { initialDrivesData } from './components/UpcomingDrives';
import PlacementPrep, { prepModules } from './components/PlacementPrep';
import FeatureView from './components/FeatureViews';
import { ApplyModal, CalendarModal, PrepModal } from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [drives, setDrives] = useState(initialDrivesData);
  const [stats, setStats] = useState({
    applied: 5,
    shortlisted: 2,
    interview: 1,
    offers: 0
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Zoho Shortlist Announced', time: '10m ago', read: false },
    { id: 2, title: 'Infosys Drive Registration Closes Soon', time: '2h ago', read: false },
    { id: 3, title: 'Mock Interview Feedback Available', time: '1d ago', read: true }
  ]);

  // Modal States
  const [selectedDriveToApply, setSelectedDriveToApply] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedPrepModule, setSelectedPrepModule] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyConfirm = (drive) => {
    setDrives(prevDrives =>
      prevDrives.map(d => (d.id === drive.id ? { ...d, applied: true } : d))
    );
    setStats(prev => ({ ...prev, applied: prev.applied + 1 }));
    setSelectedDriveToApply(null);
    showToast(`🎉 Successfully applied for ${drive.company} (${drive.role})!`);
  };

  const handleLogout = () => {
    showToast('👋 You have been logged out.');
  };

  // Filter drives according to top header search input
  const filteredDrives = drives.filter(d =>
    d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Left Feature Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Dashboard Shell */}
      <main className="main-wrapper">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Dynamic View rendering depending on active left feature menu */}
        {activeTab === 'dashboard' ? (
          <>
            <WelcomeBanner userName="Jayasurya" />
            <StatCards
              stats={stats}
              onSelectStat={(key) => {
                if (key === 'applied') setActiveTab('applications');
              }}
            />
            <UpcomingDrives
              drives={filteredDrives}
              onApply={(drive) => setSelectedDriveToApply(drive)}
              onViewCalendar={() => setShowCalendarModal(true)}
            />
            <PlacementPrep
              onSelectPrep={(module) => setSelectedPrepModule(module)}
            />
          </>
        ) : (
          <FeatureView
            activeTab={activeTab}
            drives={drives}
            setActiveTab={setActiveTab}
            onApplyDrive={(drive) => setSelectedDriveToApply(drive)}
          />
        )}
      </main>

      {/* Interactive Modals */}
      {selectedDriveToApply && (
        <ApplyModal
          drive={selectedDriveToApply}
          onClose={() => setSelectedDriveToApply(null)}
          onConfirm={handleApplyConfirm}
        />
      )}

      {showCalendarModal && (
        <CalendarModal onClose={() => setShowCalendarModal(false)} />
      )}

      {selectedPrepModule && (
        <PrepModal
          module={selectedPrepModule}
          onClose={() => setSelectedPrepModule(null)}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--primary-maroon)',
          color: 'white',
          padding: '14px 22px',
          borderRadius: '16px',
          fontWeight: '700',
          fontSize: '13.5px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
