import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import StatCards from './components/StatCards';
import UpcomingDrives, { initialDrivesData } from './components/UpcomingDrives';
import PlacementPrep, { prepModules } from './components/PlacementPrep';
import FeatureView from './components/FeatureViews';
import { ApplyModal, CalendarModal, PrepModal } from './components/Modals';
import ChatbotView from './components/ChatbotWidget';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  // Navigation Flow: 'landing' -> 'auth' -> 'app'
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [authRole, setAuthRole] = useState('Student');
  const [user, setUser] = useState({ name: 'Jayasurya', role: 'Student' });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [drives, setDrives] = useState(initialDrivesData);
  const [chatbotOpen, setChatbotOpen] = useState(false);
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
    setCurrentScreen('landing');
    showToast('👋 You have been logged out.');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentScreen('app');

    // Role-based view redirection:
    if (userData.role === 'HR / Company') {
      setActiveTab('applications');
      showToast(`🏢 Welcome ${userData.name}! Redirected to Company & Applications View.`);
    } else if (userData.role === 'Placement Officer') {
      setActiveTab('calendar');
      showToast(`🎓 Welcome ${userData.name}! Redirected to Placement Drives Calendar.`);
    } else if (userData.role === 'Admin') {
      setActiveTab('settings');
      showToast(`⚙️ Welcome ${userData.name}! Redirected to Portal System Settings.`);
    } else {
      // Student default
      setActiveTab('dashboard');
      showToast(`✨ Welcome back, ${userData.name}!`);
    }
  };

  // Filter drives according to top header search input
  const filteredDrives = drives.filter(d =>
    d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onStudentLogin={() => {
          setAuthRole('Student');
          setCurrentScreen('auth');
        }}
        onCompanyLogin={() => {
          setAuthRole('HR / Company');
          setCurrentScreen('auth');
        }}
      />
    );
  }

  if (currentScreen === 'auth') {
    return (
      <AuthPage
        initialRole={authRole}
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setCurrentScreen('landing')}
      />
    );
  }

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
            <WelcomeBanner userName={user.name} />
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

      {/* ── Floating Chatbot Widget ────────────────────────────── */}
      {/* Pulse ring + FAB button */}
      <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 1500 }}>
        {/* Animated pulse ring (only when closed) */}
        {!chatbotOpen && (
          <span style={{
            position: 'absolute', inset: '-6px', borderRadius: '50%',
            border: '2px solid var(--primary-maroon)', opacity: 0,
            animation: 'fabPulse 2.5s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Tooltip label */}
        {!chatbotOpen && (
          <div style={{
            position: 'absolute', right: '70px', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: '#1E293B', color: '#fff',
            padding: '6px 12px', borderRadius: '10px',
            fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }}>
            AI Assistant
            <span style={{
              position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
              borderLeft: '6px solid #1E293B',
            }} />
          </div>
        )}

        <button
          onClick={() => setChatbotOpen(prev => !prev)}
          title="AIT Placement AI Assistant"
          style={{
            width: '58px', height: '58px', borderRadius: '50%',
            background: chatbotOpen
              ? 'linear-gradient(135deg, #6B7280, #4B5563)'
              : 'linear-gradient(135deg, var(--primary-maroon) 0%, #9B1B30 50%, #C0392B 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px',
            boxShadow: chatbotOpen
              ? '0 4px 16px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(122,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: chatbotOpen ? 'rotate(0deg)' : 'rotate(0deg)',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(122,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = chatbotOpen
              ? '0 4px 16px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(122,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)';
          }}
        >
          {chatbotOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <>
              {/* Sparkle / AI star icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
              </svg>
              <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.5px', lineHeight: 1, color: 'rgba(255,255,255,0.9)' }}>AI</span>
            </>
          )}
        </button>
      </div>

      {/* Pulse ring keyframe injection */}
      <style>{`
        @keyframes fabPulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Floating Chatbot Panel */}
      {chatbotOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '28px',
          width: '380px',
          maxHeight: '560px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          backgroundColor: '#fff',
          zIndex: 1400,
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          animation: 'fadeIn 0.2s ease-out',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Chatbot header bar */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-maroon) 0%, #9B1B30 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fff',
            flexShrink: 0,
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px' }}>AIT Placement Assistant</div>
              <div style={{ fontSize: '11.5px', opacity: 0.8 }}>● Online · AI Powered</div>
            </div>
          </div>
          {/* Chatbot body */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <ChatbotView />
          </div>
        </div>
      )}

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
          right: '100px',
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
