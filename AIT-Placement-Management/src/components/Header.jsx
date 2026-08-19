import React, { useState } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, ProfileIcon, SettingsIcon, LogoutIcon } from './Icons';

export default function Header({ searchQuery, setSearchQuery, notifications, setActiveTab, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileName, setProfileName] = useState(() => {
    try {
      const raw = localStorage.getItem('ait-profile')
      if (raw) return JSON.parse(raw).name || 'Jayasurya K'
    } catch {}
    return 'Jayasurya K'
  })
  const [profileRole, setProfileRole] = useState(() => {
    try {
      const raw = localStorage.getItem('ait-profile')
      if (raw) {
        const parsed = JSON.parse(raw)
        // derive simple role like 'IV - IT'
        const branch = parsed.branch || ''
        const batch = parsed.batch || ''
        const startYearMatch = batch.match(/(\d{4})/)
        const startYear = startYearMatch ? parseInt(startYearMatch[0], 10) : null
        let yearNum = null
        if (startYear) {
          const cur = new Date().getFullYear()
          yearNum = Math.min(5, Math.max(1, cur - startYear + 1))
        }
        const romans = ['I','II','III','IV','V']
        const yearRoman = yearNum ? romans[yearNum-1] : 'IV'
        const dept = branch.includes('Information') ? 'IT' : branch.split(' ').slice(-1)[0]
        return `${yearRoman} - ${dept}`
      }
    } catch {}
    return 'IV - IT'
  })

  React.useEffect(() => {
    const handler = (e) => {
      const d = e?.detail || {}
      if (d.name) setProfileName(d.name)
      if (d.branch || d.batch) {
        const branch = d.branch || ''
        const batch = d.batch || ''
        const startYearMatch = batch.match(/(\d{4})/)
        const startYear = startYearMatch ? parseInt(startYearMatch[0], 10) : null
        let yearNum = null
        if (startYear) {
          const cur = new Date().getFullYear()
          yearNum = Math.min(5, Math.max(1, cur - startYear + 1))
        }
        const romans = ['I','II','III','IV','V']
        const yearRoman = yearNum ? romans[yearNum-1] : 'IV'
        const dept = branch.includes('Information') ? 'IT' : branch.split(' ').slice(-1)[0]
        setProfileRole(`${yearRoman} - ${dept}`)
      }
    }
    window.addEventListener('profile:update', handler)
    return () => window.removeEventListener('profile:update', handler)
  }, [])

  return (
    <header className="top-header">
      {/* Search Input Bar */}
      <div className="search-container">
        <div className="search-icon-wrapper">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search drives, companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Header Actions */}
      <div className="header-right">
        {/* Notifications Icon Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="notification-btn"
            onClick={() => {
              setActiveTab('notifications');
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            <BellIcon />
            {notifications.some(n => !n.read) && <span className="notification-badge" />}
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <div className="dropdown-header">Notifications ({notifications.length})</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <div key={notif.id} className="dropdown-item" onClick={() => { setActiveTab('notifications'); setShowNotifications(false); }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: notif.read ? '#CBD5E1' : '#E11D48',
                      marginTop: '6px', flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{notif.title}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                style={{ 
                  padding: '10px 16px', 
                  borderTop: '1px solid var(--border-light)', 
                  textAlign: 'center', 
                  fontSize: '12.5px', 
                  fontWeight: '800', 
                  color: 'var(--primary-maroon)', 
                  cursor: 'pointer',
                  backgroundColor: 'var(--primary-maroon-light)',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px'
                }}
                onClick={() => {
                  setActiveTab('notifications');
                  setShowNotifications(false);
                }}
              >
                View All Notifications
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div style={{ position: 'relative' }}>
          <div
            className="profile-chip"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt={profileName}
              className="profile-avatar"
              onError={(e) => {
                // Fallback avatar if image offline
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=4C1536&color=fff`;
              }}
            />
            <div className="profile-details">
              <span className="profile-name">{profileName}</span>
              <span className="profile-role">{profileRole}</span>
            </div>
            <ChevronDownIcon style={{ marginLeft: '4px', color: 'var(--text-muted)' }} />
          </div>

          {showProfileMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">Student Account</div>
              <div className="dropdown-item" onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}>
                <ProfileIcon />
                <span>My Profile</span>
              </div>
              <div className="dropdown-item" onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}>
                <SettingsIcon />
                <span>Settings</span>
              </div>
              <div className="dropdown-item" style={{ color: '#DC2626' }} onClick={onLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
