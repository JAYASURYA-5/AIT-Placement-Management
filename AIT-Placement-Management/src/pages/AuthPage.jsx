import React, { useState } from 'react';

// ── Flask backend base URL ────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000';

export default function AuthPage({ initialRole = 'Student', onLoginSuccess, onBackToHome }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Role preset credentials for user convenience
  const rolePresets = {
    Student: {
      email: 'student@ait.edu.in',
      placeholder: 'Enter Student Reg No. / Email',
      label: 'Email / Register Number',
      hint: 'Demo: student@ait.edu.in',
    },
    'HR / Company': {
      email: 'recruiter@google.com',
      placeholder: 'Enter Work Email / Company ID',
      label: 'Work Email / Company ID',
      hint: 'Demo: recruiter@google.com',
    },
    'Placement Officer': {
      email: 'officer@ait.edu.in',
      placeholder: 'Enter Officer Email / ID',
      label: 'Officer Email / Employee ID',
      hint: 'Demo: officer@ait.edu.in',
    },
    Admin: {
      email: 'admin@ait.edu.in',
      placeholder: 'Enter Admin Email / ID',
      label: 'Admin Email / Employee ID',
      hint: 'Demo: admin@ait.edu.in',
    },
  };

  const [formData, setFormData] = useState({
    emailOrReg: rolePresets[initialRole]?.email || 'student@ait.edu.in',
    password: 'password123',
  });

  const roles = [
    { id: 'Student', label: 'Student' },
    { id: 'HR / Company', label: 'HR / Company' },
    { id: 'Placement Officer', label: 'Placement Officer' },
    { id: 'Admin', label: 'Admin' },
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setFormData({ emailOrReg: rolePresets[roleId]?.email || '', password: 'password123' });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  // ── Real Flask backend login ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrReg.trim()) { setErrorMsg('Please enter your email or ID.'); return; }
    if (!formData.password)          { setErrorMsg('Please enter your password.');    return; }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    formData.emailOrReg.trim().toLowerCase(),
          password: formData.password,
          role:     selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Login failed. Please try again.');
        return;
      }

      // ── Store JWT + user data in localStorage ─────────────────────────────
      localStorage.setItem('ait-token', data.token);
      localStorage.setItem('ait-user',  JSON.stringify(data.user));

      // Sync profile for Student so the portal header shows correct name
      if (data.user.role === 'Student') {
        const existing = JSON.parse(localStorage.getItem('ait-profile') || '{}');
        localStorage.setItem('ait-profile', JSON.stringify({
          ...existing,
          name:     data.user.name,
          email:    data.user.email,
          regNo:    data.user.reg_no   || existing.regNo,
          branch:   data.user.branch   || existing.branch,
          batch:    data.user.batch    || existing.batch,
          phone:    data.user.phone    || existing.phone,
          location: data.user.location || existing.location,
          github:   data.user.github   || existing.github,
          linkedin: data.user.linkedin || existing.linkedin,
        }));
      }

      setSuccessMsg(data.message);

      // Brief green flash → redirect
      setTimeout(() => {
        onLoginSuccess({
          role:       data.user.role,
          identifier: data.user.email,
          name:       data.user.name,
        });
      }, 600);

    } catch (networkErr) {
      console.error('Login network error:', networkErr);
      setErrorMsg(
        '⚠️ Cannot reach the Flask server.\n' +
        'Please open a new terminal and run:\n\n' +
        '  cd "d:\\placement portel\\backend"\n' +
        '  python app.py'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentPreset = rolePresets[selectedRole] || rolePresets.Student;

  return (
    <div className="auth-page-root">
      {/* Top Header Bar */}
      <div className="auth-top-bar">
        <button className="auth-back-btn" onClick={onBackToHome} disabled={isLoading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>

        <div className="auth-portal-title">
          <div className="auth-brand-icon">
            <svg viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#4C1536" />
              <path d="M8 26L18 10l10 16H8z" fill="white" fillOpacity="0.9" />
              <circle cx="18" cy="14" r="3" fill="#F6EBF1" />
            </svg>
          </div>
          <span>AIT Placement Portal</span>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="auth-container-wrapper">
        <div className="auth-card">

          {/* Left Panel */}
          <div className="auth-left-panel">
            <div className="auth-illustration-wrap">
              <svg className="auth-mortarboard-icon" viewBox="0 0 64 64" fill="none">
                <path d="M32 8L4 22L32 36L60 22L32 8Z" fill="var(--primary-maroon)" />
                <path d="M12 28V44C12 44 20 52 32 52C44 52 52 44 52 44V28" stroke="var(--primary-maroon)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M52 24V42" stroke="var(--primary-maroon)" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="52" cy="45" r="3.5" fill="var(--primary-maroon)" />
              </svg>
            </div>

            <h2 className="auth-welcome-title">Welcome Back!</h2>
            <p className="auth-welcome-subtitle">
              Login to access your role-specific dashboard &amp; placement management tools.
            </p>

            {/* Flask status badge */}
            <div style={{
              marginTop: '20px', padding: '10px 14px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: '10px', fontSize: '11.5px',
              color: 'rgba(255,255,255,0.85)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: '#4ADE80', display: 'inline-block',
                boxShadow: '0 0 6px #4ADE80',
              }} />
              Flask API — localhost:5000
            </div>

            <div className="auth-left-footer-badge" style={{ marginTop: '12px' }}>
              <span className="auth-badge-icon">🔐</span>
              <span>JWT Secured · bcrypt Hashed</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="auth-right-panel">

            {/* Role Tabs */}
            <div className="auth-role-tabs">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`auth-role-tab ${selectedRole === r.id ? 'active' : ''}`}
                  onClick={() => handleRoleChange(r.id)}
                  disabled={isLoading}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">

              {/* Error Banner */}
              {errorMsg && (
                <div className="auth-error-banner" style={{ whiteSpace: 'pre-line', animation: 'fadeIn 0.2s ease-out' }}>
                  {errorMsg}
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div style={{
                  padding: '10px 14px', backgroundColor: '#ECFDF5',
                  border: '1.5px solid #BBF7D0', borderRadius: '10px',
                  color: '#16A34A', fontSize: '13px', fontWeight: '700',
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  ✅ {successMsg}
                </div>
              )}

              {/* Email Field */}
              <div className="auth-field-group">
                <label className="auth-label">{currentPreset.label}</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder={currentPreset.placeholder}
                  value={formData.emailOrReg}
                  onChange={(e) => handleInputChange('emailOrReg', e.target.value)}
                  disabled={isLoading}
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: '600', display: 'block' }}>
                  {currentPreset.hint}
                </span>
              </div>

              {/* Password Field */}
              <div className="auth-field-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input auth-input-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: '600', display: 'block' }}>
                  Demo password: password123
                </span>
              </div>

              {/* Options Row */}
              <div className="auth-options-row">
                <label className="auth-remember-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  className="auth-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been sent to your registered email.');
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', opacity: isLoading ? 0.85 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: 'authSpin 0.8s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  `Login as ${selectedRole}`
                )}
              </button>

              <style>{`
                @keyframes authSpin {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
              `}</style>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="auth-bottom-footer">
        <span>AIT Placement Portal</span>
        <span className="auth-footer-dot">•</span>
        <span>Flask JWT Backend</span>
        <span className="auth-footer-dot">•</span>
        <span>Secured Login</span>
      </div>
    </div>
  );
}
