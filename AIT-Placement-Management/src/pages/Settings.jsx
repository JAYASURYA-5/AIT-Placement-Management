import React, { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    emailJobAlerts: true,
    emailDeadlines: true,
    emailFeedback: true,
    smsAlerts: false,
    minPackage: '8',
    alertFrequency: 'Immediate',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="feature-page-container" style={{ width: '100%', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Portal Settings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0', fontWeight: '600' }}>Manage your profile visibility, notification preferences, and account security</p>
        </div>
        {isSaved && (
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#16A34A', backgroundColor: '#EEF8F1', padding: '6px 12px', borderRadius: '8px', animation: 'fadeIn 0.2s' }}>
            ✓ Preferences Saved
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* SECTION 1: PLACEMENT & VISIBILITY PREFERENCES */}
        <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', margin: 0 }}>
            Placement Preferences
          </h3>

          {/* Visibility Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>Share Profile with Recruiter</div>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Allows registered placement officers and companies to view your resume and details.</p>
            </div>
            <button
              onClick={() => handleToggle('profileVisible')}
              style={{
                width: '46px',
                height: '24px',
                borderRadius: '999px',
                backgroundColor: settings.profileVisible ? 'var(--primary-maroon)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: settings.profileVisible ? '25px' : '3px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }} />
            </button>
          </div>

          {/* Minimum package dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>Min. Salary Package Preference</label>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Filter job notification alerts below this package.</p>
            <select
              value={settings.minPackage}
              onChange={(e) => { setSettings(prev => ({ ...prev, minPackage: e.target.value })); handleSaveSettings(); }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-medium)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                color: 'var(--text-main)',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="4">4.0 LPA +</option>
              <option value="6">6.0 LPA +</option>
              <option value="8">8.0 LPA +</option>
              <option value="12">12.0 LPA +</option>
              <option value="15">15.0 LPA +</option>
            </select>
          </div>

          {/* Job Alert Frequency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>Job Alert Notification Frequency</label>
            <select
              value={settings.alertFrequency}
              onChange={(e) => { setSettings(prev => ({ ...prev, alertFrequency: e.target.value })); handleSaveSettings(); }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-medium)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                color: 'var(--text-main)',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Immediate">Immediate (Real-Time)</option>
              <option value="Daily">Daily Summary</option>
              <option value="Weekly">Weekly Digest</option>
            </select>
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS PREFERENCES */}
        <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', margin: 0 }}>
            Notifications
          </h3>

          {/* Email Job Alerts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Email on New Drives</div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Get email alerts when companies launch new recruitment drives.</p>
            </div>
            <button
              onClick={() => { handleToggle('emailJobAlerts'); handleSaveSettings(); }}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: settings.emailJobAlerts ? 'var(--primary-maroon)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: settings.emailJobAlerts ? '23px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          {/* Email Deadlines */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Deadline Reminders</div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Receive reminders 24 hours prior to application close dates.</p>
            </div>
            <button
              onClick={() => { handleToggle('emailDeadlines'); handleSaveSettings(); }}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: settings.emailDeadlines ? 'var(--primary-maroon)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: settings.emailDeadlines ? '23px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          {/* Email Feedback */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Mock Interview Feedbacks</div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Get notified when your interview results are graded and annotated.</p>
            </div>
            <button
              onClick={() => { handleToggle('emailFeedback'); handleSaveSettings(); }}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: settings.emailFeedback ? 'var(--primary-maroon)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: settings.emailFeedback ? '23px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          {/* SMS Alerts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>SMS Alerts</div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Get critical announcements and shortlist results on your mobile phone.</p>
            </div>
            <button
              onClick={() => { handleToggle('smsAlerts'); handleSaveSettings(); }}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: settings.smsAlerts ? 'var(--primary-maroon)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: settings.smsAlerts ? '23px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: SECURITY & PASSWORD UPDATE */}
      <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', margin: 0 }}>
          Security & Password Change
        </h3>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-medium)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>New Password</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-medium)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-medium)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '11px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--primary-maroon)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              height: '40px'
            }}
          >
            Update Password
          </button>
        </form>
      </div>
      
    </div>
  );
}
