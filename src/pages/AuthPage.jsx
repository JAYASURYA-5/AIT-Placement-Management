import React, { useState } from 'react';

export default function AuthPage({ initialRole = 'Student', onLoginSuccess, onBackToHome }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  // Form State initialized with Student preset
  const [formData, setFormData] = useState({
    emailOrReg: rolePresets[initialRole]?.email || 'student@ait.edu.in',
    password: 'password123',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const roles = [
    { id: 'Student', label: 'Student' },
    { id: 'HR / Company', label: 'HR / Company' },
    { id: 'Placement Officer', label: 'Placement Officer' },
    { id: 'Admin', label: 'Admin' },
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setFormData({
      emailOrReg: rolePresets[roleId]?.email || '',
      password: 'password123',
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.emailOrReg.trim()) {
      setErrorMsg('Please enter your email or ID.');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Derive display name from credentials
    let displayName = 'User';
    if (selectedRole === 'Student') {
      try {
        const savedProfile = JSON.parse(localStorage.getItem('ait-profile') || '{}');
        displayName = savedProfile.name || 'Jayasurya K';
      } catch {
        displayName = 'Jayasurya K';
      }
    }
    else if (selectedRole === 'HR / Company') displayName = 'HR Manager (Google)';
    else if (selectedRole === 'Placement Officer') displayName = 'Dr. R. Placement Officer';
    else if (selectedRole === 'Admin') displayName = 'System Admin';

    // Trigger login redirection
    onLoginSuccess({
      role: selectedRole,
      identifier: formData.emailOrReg,
      name: displayName,
    });
  };

  const currentPreset = rolePresets[selectedRole] || rolePresets.Student;

  return (
    <div className="auth-page-root">
      {/* Top Header Bar / Back navigation */}
      <div className="auth-top-bar">
        <button className="auth-back-btn" onClick={onBackToHome}>
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

      {/* Main Centered Auth Container */}
      <div className="auth-container-wrapper">
        <div className="auth-card">
          {/* Left Decorative Welcome Panel */}
          <div className="auth-left-panel">
            <div className="auth-illustration-wrap">
              <svg className="auth-mortarboard-icon" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 8L4 22L32 36L60 22L32 8Z"
                  fill="var(--primary-maroon)"
                />
                <path
                  d="M12 28V44C12 44 20 52 32 52C44 52 52 44 52 44V28"
                  stroke="var(--primary-maroon)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M52 24V42"
                  stroke="var(--primary-maroon)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="52" cy="45" r="3.5" fill="var(--primary-maroon)" />
              </svg>
            </div>

            <h2 className="auth-welcome-title">Welcome Back!</h2>
            <p className="auth-welcome-subtitle">
              Login to access your role-specific dashboard & placement management tools.
            </p>

            <div className="auth-left-footer-badge">
              <span className="auth-badge-icon">🔐</span>
              <span>Single Sign-On Portal</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="auth-right-panel">
            {/* Role Selection Tabs */}
            <div className="auth-role-tabs">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`auth-role-tab ${selectedRole === r.id ? 'active' : ''}`}
                  onClick={() => handleRoleChange(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

              {/* Email / Reg No */}
              <div className="auth-field-group">
                <label className="auth-label">{currentPreset.label}</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder={currentPreset.placeholder}
                  value={formData.emailOrReg}
                  onChange={(e) => handleInputChange('emailOrReg', e.target.value)}
                  required
                />
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="auth-field-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input auth-input-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
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
              </div>

              {/* Options Row */}
              <div className="auth-options-row">
                <label className="auth-remember-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
              <button type="submit" className="auth-submit-btn">
                Login as {selectedRole}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="auth-bottom-footer">
        <span>AIT Placement Portal</span>
        <span className="auth-footer-dot">•</span>
        <span>Unified Login</span>
        <span className="auth-footer-dot">•</span>
        <span>AIT Placement Management</span>
      </div>
    </div>
  );
}
