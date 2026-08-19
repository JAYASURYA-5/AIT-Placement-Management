import React, { useState } from 'react';
import {
  Crown,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  ClipboardList,
  Bot,
  Palette,
  HardDrive,
  Plug,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  Lock,
  Mail,
  Sliders,
  Cpu,
  Key,
  Database,
  Camera,
  Smartphone,
  Check,
  Download,
  Upload,
  UserCheck,
  RefreshCw,
  Zap,
  Activity,
  Server
} from 'lucide-react';

export default function SettingsPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Settings');
  const [activeSubPage, setActiveSubPage] = useState(null); // null = Main Settings Grid
  const [toast, setToast] = useState(null);

  // Settings State Toggles & Form Inputs
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@college.edu',
    phone: '+91 98765 43210',
    department: 'Placement Cell',
    role: 'Super Administrator',
    currentPass: '',
    newPass: ''
  });

  const [securityData, setSecurityData] = useState({
    twoFactor: true,
    sessionTimeout: '30 mins',
    passExpiry: '90 days'
  });

  const [notifData, setNotifData] = useState({
    emailAlerts: true,
    studentRegistrations: true,
    companyDriveUpdates: true,
    smsAlerts: false
  });

  const [rulesData, setRulesData] = useState({
    minCGPA: '6.5',
    maxBacklogs: '0',
    singleOfferRule: true,
    branches: { CSE: true, IT: true, ECE: true, MECH: true, EEE: true, CIVIL: false, AIDS: true }
  });

  const [aiData, setAiData] = useState({
    resumeScreening: true,
    predictiveScoring: true,
    autoShortlistCutoff: '75%',
    aiAssistantChat: true
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: 'Light Glass',
    primaryColor: '#be185d',
    compactMode: false
  });

  const [integrationData, setIntegrationData] = useState({
    googleAuth: true,
    smtpConfigured: true,
    linkedInJobs: false,
    whatsAppAlerts: true
  });

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Companies', icon: Building2 },
    { label: 'Drives', icon: Briefcase },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (onNavigate) {
      onNavigate(label);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 8 Settings Cards Definitions matching User Reference Photo
  const settingsCards = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage admin profile information and password',
      icon: User,
      iconBg: '#e0e7ff',
      iconColor: '#4338ca'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Configure password, 2FA and session settings',
      icon: Shield,
      iconBg: '#dbeafe',
      iconColor: '#1d4ed8'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage email and system notification preferences',
      icon: Bell,
      iconBg: '#fef3c7',
      iconColor: '#b45309'
    },
    {
      id: 'rules',
      title: 'Placement Rules',
      description: 'Set eligibility criteria and placement related rules',
      icon: ClipboardList,
      iconBg: '#f3e8ff',
      iconColor: '#6b21a8'
    },
    {
      id: 'ai',
      title: 'AI Settings',
      description: 'Configure AI features like resume screening and predictions',
      icon: Bot,
      iconBg: '#e0f2fe',
      iconColor: '#0369a1'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize theme, colors and layout preferences',
      icon: Palette,
      iconBg: '#fce7f3',
      iconColor: '#be185d'
    },
    {
      id: 'backup',
      title: 'Backup & Restore',
      description: 'Backup data and restore your platform',
      icon: HardDrive,
      iconBg: '#dcfce7',
      iconColor: '#15803d'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Manage third-party integrations and API keys',
      icon: Plug,
      iconBg: '#ffedd5',
      iconColor: '#c2410c'
    }
  ];

  // Common Glassmorphism Card Style
  const glassCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 2px 10px 0 rgba(0, 0, 0, 0.02)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  // Compact Form Inputs Helper
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff'
  };

  // Render Sub-Page View when a setting card is clicked (2-Column Side-by-Side Panel Layout for ALL Features)
  const renderSubPage = () => {
    switch (activeSubPage) {
      
      // 1. PROFILE
      case 'profile':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Admin Profile</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Update your personal details & security password</div>

              <form onSubmit={(e) => { e.preventDefault(); showToast('Profile details saved successfully!'); }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Personal Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Phone Number</label>
                    <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Department</label>
                    <input type="text" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>Security Password</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Current Password</label>
                    <input type="password" placeholder="••••••••" value={profileData.currentPass} onChange={(e) => setProfileData({ ...profileData, currentPass: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>New Password</label>
                    <input type="password" placeholder="••••••••" value={profileData.newPass} onChange={(e) => setProfileData({ ...profileData, newPass: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#be185d', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)' }}>
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: 800,
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(67, 56, 202, 0.25)'
                }}>
                  AU
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{profileData.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{profileData.role}</div>

                <div style={{ marginTop: '14px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
                  ● Active Admin
                </div>

                <button onClick={() => showToast('Avatar updated!')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '9px 14px', marginTop: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Camera size={16} /> Upload Photo
                </button>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Account Created:</span>
                  <strong style={{ color: '#0f172a' }}>12 Jan 2025</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>2FA Security:</span>
                  <strong style={{ color: '#16a34a' }}>Enabled</strong>
                </div>
              </div>
            </div>
          </div>
        );

      // 2. SECURITY
      case 'security':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Security & Authentication</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Manage 2FA, active login sessions, and session policies.</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Require an authenticator app code on every login attempt</div>
                  </div>
                  <input type="checkbox" checked={securityData.twoFactor} onChange={(e) => { setSecurityData({ ...securityData, twoFactor: e.target.checked }); showToast(e.target.checked ? '2FA Enabled' : '2FA Disabled', 'info'); }} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Session Timeout</label>
                    <select value={securityData.sessionTimeout} onChange={(e) => setSecurityData({ ...securityData, sessionTimeout: e.target.value })} style={inputStyle}>
                      <option value="15 mins">15 mins</option>
                      <option value="30 mins">30 mins</option>
                      <option value="1 hour">1 hour</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Password Renewal Policy</label>
                    <select value={securityData.passExpiry} onChange={(e) => setSecurityData({ ...securityData, passExpiry: e.target.value })} style={inputStyle}>
                      <option value="30 days">Every 30 days</option>
                      <option value="90 days">Every 90 days</option>
                      <option value="Never">Never</option>
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Active Session</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                    <span>🖥️ <strong>Chrome on Windows</strong> (Current device)</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>● Active Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(29, 78, 216, 0.2)'
                }}>
                  <Shield size={32} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Security Rating</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>95 / 100</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>High Protection Level</div>

                <button onClick={() => showToast('All external sessions terminated!', 'info')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px 14px', marginTop: '24px', borderRadius: '10px', border: '1px solid #fca5a5', backgroundColor: '#fff1f2', color: '#be123c', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                  <Lock size={15} /> Logout All Devices
                </button>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Password Change:</span>
                  <strong style={{ color: '#0f172a' }}>15 days ago</strong>
                </div>
              </div>
            </div>
          </div>
        );

      // 3. NOTIFICATIONS
      case 'notifications':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Notification Preferences</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Configure channels & alerts for placement announcements.</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { title: 'Email Drive Announcements', desc: 'Instant email when new company drives post', key: 'companyDriveUpdates' },
                  { title: 'Student Registrations Digest', desc: 'Notify on new student verification submissions', key: 'studentRegistrations' },
                  { title: 'Security Audit Alerts', desc: 'Alerts on unusual login activity or system changes', key: 'emailAlerts' },
                  { title: 'SMS Instant Alerts', desc: 'Send urgent SMS notifications to admin phone', key: 'smsAlerts' }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <input type="checkbox" checked={notifData[item.key]} onChange={(e) => { setNotifData({ ...notifData, [item.key]: e.target.checked }); showToast('Notification setting saved!'); }} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(180, 83, 9, 0.2)'
                }}>
                  <Bell size={30} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Alert Status</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', marginTop: '6px' }}>SMTP Mailer Connected</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Avg Delivery: 1.2s</div>

                <button onClick={() => showToast('Test notification email sent!')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px 14px', marginTop: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Mail size={16} /> Send Test Alert
                </button>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Alerts Sent Today:</span>
                  <strong style={{ color: '#0f172a' }}>142 emails</strong>
                </div>
              </div>
            </div>
          </div>
        );

      // 4. PLACEMENT RULES
      case 'rules':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Placement Eligibility Rules</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Set global student cutoff criteria and backlog thresholds.</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Minimum Cutoff CGPA *</label>
                  <input type="text" value={rulesData.minCGPA} onChange={(e) => setRulesData({ ...rulesData, minCGPA: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Max Active Backlogs Allowed *</label>
                  <input type="text" value={rulesData.maxBacklogs} onChange={(e) => setRulesData({ ...rulesData, maxBacklogs: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', marginBottom: '22px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Single Job Offer Policy</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Automatically block students once placed in a company</div>
                </div>
                <input type="checkbox" checked={rulesData.singleOfferRule} onChange={(e) => setRulesData({ ...rulesData, singleOfferRule: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => showToast('Placement rules saved successfully!')} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#be185d', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)' }}>
                  Save Rules
                </button>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f3e8ff',
                  color: '#6b21a8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(107, 33, 168, 0.2)'
                }}>
                  <ClipboardList size={30} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Eligible Students</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#6b21a8', marginTop: '6px' }}>1,248 / 1,500</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>83.2% Qualify Criteria</div>

                <button onClick={() => showToast('Rules reset to default values', 'info')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px 14px', marginTop: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <RefreshCw size={15} /> Reset to Defaults
                </button>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Policy Mode:</span>
                  <strong style={{ color: '#0f172a' }}>Strict Single Offer</strong>
                </div>
              </div>
            </div>
          </div>
        );

      // 5. AI SETTINGS
      case 'ai':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>AI & Automation Settings</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Configure AI resume parsing, candidate scoring, and auto-matching.</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Resume Screening</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Extract skills and calculate fit percentage</div>
                  </div>
                  <input type="checkbox" checked={aiData.resumeScreening} onChange={(e) => { setAiData({ ...aiData, resumeScreening: e.target.checked }); showToast('AI Resume Screening updated!'); }} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Predictive Success Scoring</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Forecast candidate interview success</div>
                  </div>
                  <input type="checkbox" checked={aiData.predictiveScoring} onChange={(e) => { setAiData({ ...aiData, predictiveScoring: e.target.checked }); showToast('Predictive Scoring updated!'); }} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(3, 105, 161, 0.2)'
                }}>
                  <Bot size={32} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>AI Engine Status</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7', marginTop: '6px' }}>GPT-4o Engine Active</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Parsing Accuracy: 98.4%</div>

                <button onClick={() => showToast('Re-indexing resumes in background...')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px 14px', marginTop: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Cpu size={16} /> Re-index Resumes
                </button>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Resumes Processed:</span>
                  <strong style={{ color: '#0f172a' }}>1,420 files</strong>
                </div>
              </div>
            </div>
          </div>
        );

      // 6. APPEARANCE
      case 'appearance':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Appearance & Styling</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Customize theme presets and interface accent colors.</div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Theme Presets</label>
                <div style={{ display: 'flex', gap: '14px' }}>
                  {['Light Glass', 'Dark Capsule', 'System Default'].map(theme => (
                    <button key={theme} onClick={() => { setAppearanceData({ ...appearanceData, theme }); showToast(`Theme changed to ${theme}!`); }} style={{ padding: '10px 22px', borderRadius: '10px', border: appearanceData.theme === theme ? '2px solid #be185d' : '1px solid #cbd5e1', backgroundColor: appearanceData.theme === theme ? '#fce7f3' : '#ffffff', color: appearanceData.theme === theme ? '#be185d' : '#334155', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fce7f3',
                  color: '#be185d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(190, 24, 93, 0.2)'
                }}>
                  <Palette size={30} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Active Theme</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#be185d', marginTop: '6px' }}>{appearanceData.theme}</div>
              </div>
            </div>
          </div>
        );

      // 7. BACKUP & RESTORE
      case 'backup':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Backup & System Restore</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Download database snapshots and restore recovery files.</div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => showToast('Creating database snapshot...')} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} /> Create Backup Now
                </button>
                <button onClick={() => showToast('Select backup file to restore', 'info')} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} /> Restore from File
                </button>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(21, 128, 61, 0.2)'
                }}>
                  <HardDrive size={30} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Backup Status</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', marginTop: '6px' }}>Auto-Backup Active</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Last Snapshot: 20 Jul 2026</div>
              </div>
            </div>
          </div>
        );

      // 8. INTEGRATIONS
      case 'integrations':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
            {/* Left Form Box */}
            <div style={{ ...glassCardStyle, padding: '28px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>API & Third-Party Integrations</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>Connect external authentication, email servers, and job portals.</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Google Workspace Single Sign-On (SSO)</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Enable @college.edu Google sign in for students</div>
                  </div>
                  <input type="checkbox" checked={integrationData.googleAuth} onChange={(e) => { setIntegrationData({ ...integrationData, googleAuth: e.target.checked }); showToast('Integration status updated!'); }} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Right Overview Box */}
            <div style={{ ...glassCardStyle, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ffedd5',
                  color: '#c2410c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 18px rgba(194, 65, 12, 0.2)'
                }}>
                  <Plug size={30} />
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Integrations</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c', marginTop: '6px' }}>3 Services Active</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f6f4ee', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Label */}
      <div style={{
        padding: '24px 36px 12px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          {activeSubPage ? (
            <button
              onClick={() => setActiveSubPage(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#be185d',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '6px',
                padding: 0
              }}
            >
              <ArrowLeft size={18} /> Back to Settings
            </button>
          ) : null}
          
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Settings
          </div>
          <div style={{ fontSize: '15px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
            Manage platform settings and preferences
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, paddingBottom: '24px' }}>
        
        {/* Left Sidebar - All 4 Corners Rounded */}
        <aside style={{
          width: '260px',
          backgroundColor: '#16151a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 20px',
          flexShrink: 0,
          borderRadius: '24px',
          margin: '12px 0 16px 20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.22)'
        }}>
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 42px 8px' }}>
            <Crown size={26} color="#ffffff" strokeWidth={2.5} />
            <span style={{ fontSize: '21px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.01em' }}>
              Admin Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: isActive ? '#be185d' : 'transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    fontSize: '17px',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 6px 20px rgba(190, 24, 93, 0.45)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <Icon size={22} color={isActive ? '#ffffff' : '#a1a1aa'} strokeWidth={2.3} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '12px 36px 24px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {activeSubPage ? (
            renderSubPage()
          ) : (
            /* 8 Settings Cards Grid (3 Columns) Matching Reference Image */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {settingsCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveSubPage(card.id)}
                    style={{
                      ...glassCardStyle,
                      padding: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '180px',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = glassCardStyle.boxShadow;
                    }}
                  >
                    <div>
                      {/* Icon Circle Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        backgroundColor: card.iconBg,
                        color: card.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}>
                        <IconComponent size={24} strokeWidth={2.2} />
                      </div>

                      {/* Card Title */}
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                        {card.title}
                      </div>

                      {/* Card Subtitle */}
                      <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.45', fontWeight: 500 }}>
                        {card.description}
                      </div>
                    </div>

                    {/* Chevron Right Arrow */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <ChevronRight size={20} color="#94a3b8" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Footer Info Bar matching User Reference Photo */}
          <div style={{
            ...glassCardStyle,
            padding: '18px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: 'auto'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Platform Version</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>v1.0.0</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Last Updated</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>20 Jul 2026</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>System Status</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>Active</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Admin Login</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>20 Jul 2026, 09:45 AM</div>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
