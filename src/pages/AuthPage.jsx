import React, { useState } from 'react';
import AITLogo from '../components/AITLogo';
import {
  loginWithFirebase,
  registerWithFirebase,
  getFirebaseProjectInfo,
  isFirebaseRealApiKey,
  saveFirebaseApiKey,
  clearCustomApiKey
} from '../firebase';

export default function AuthPage({ initialRole = 'Student', onLoginSuccess, onBackToHome }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const fbInfo = getFirebaseProjectInfo();

  // Role preset credentials for user convenience
  const rolePresets = {
    Student: {
      email: 'student@ait.edu.in',
      placeholder: 'Enter Student Reg No. / Email',
      label: 'Email / Register Number',
      hint: 'Demo: student@ait.edu.in',
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
    fullName: 'Jayasurya K',
    regNo: '710123205015'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isApiKeyError, setIsApiKeyError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const roles = [
    { id: 'Student', label: 'Student' },
    { id: 'Admin', label: 'Admin' },
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setFormData((prev) => ({
      ...prev,
      emailOrReg: rolePresets[roleId]?.email || '',
      password: 'password123',
    }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
    setIsApiKeyError(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
    setIsApiKeyError(false);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      alert('Please enter your Firebase Web API Key.');
      return;
    }
    saveFirebaseApiKey(apiKeyInput.trim());
  };

  const handleDemoProceed = () => {
    const email = formData.emailOrReg.trim() || `${selectedRole.toLowerCase()}@ait.edu.in`;
    const name = formData.fullName.trim() || (selectedRole === 'Student' ? 'Jayasurya K' : selectedRole);
    onLoginSuccess({
      role: selectedRole,
      identifier: email,
      name: name,
      regNo: formData.regNo,
      provider: 'demo'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsApiKeyError(false);

    if (!formData.emailOrReg.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    const email = formData.emailOrReg.includes('@')
      ? formData.emailOrReg.trim()
      : `${formData.emailOrReg.trim()}@ait.edu.in`;

    if (isRegisterMode) {
      // ── Handle Register Mode ────────────────────────────────────────────────
      const name = formData.fullName.trim() || email.split('@')[0];
      const res = await registerWithFirebase(email, formData.password, selectedRole, name, formData.regNo);

      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess({
            role: selectedRole,
            identifier: email,
            name: name,
            regNo: formData.regNo,
            provider: 'firebase'
          });
        }, 1200);
      } else {
        setErrorMsg(res.message);
        if (res.isApiKeyError || !isFirebaseRealApiKey()) {
          setIsApiKeyError(true);
          setShowApiKeyInput(true);
        }
      }
    } else {
      // ── Handle Login Mode ───────────────────────────────────────────────────
      const res = await loginWithFirebase(email, formData.password, selectedRole);

      setIsLoading(false);

      if (res.success) {
        onLoginSuccess({
          role: res.user.role || selectedRole,
          identifier: res.user.email,
          name: res.user.name,
          regNo: res.user.regNo,
          provider: 'firebase'
        });
      } else {
        if (res.isApiKeyError || !isFirebaseRealApiKey()) {
          setErrorMsg(res.message);
          setIsApiKeyError(true);
          setShowApiKeyInput(true);
        } else {
          setErrorMsg(res.message);
        }
      }
    }
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
          <div className="auth-brand-icon" style={{ background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AITLogo size={32} />
          </div>
          <span>AIT Placement Portal</span>
        </div>
      </div>

      {/* Main Centered Auth Container */}
      <div className="auth-container-wrapper">
        <div className="auth-card">
          {/* Left Decorative Welcome Panel */}
          <div className="auth-left-panel">
            <div className="auth-illustration-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
              <AITLogo size={84} />
            </div>

            <h2 className="auth-welcome-title">
              {isRegisterMode ? 'Create Account' : 'Welcome Back!'}
            </h2>
            <p className="auth-welcome-subtitle">
              {isRegisterMode
                ? 'Register your profile in the Firebase Database to manage your placements.'
                : 'Login to access your role-specific dashboard & placement management tools.'}
            </p>

          </div>

          {/* Right Form Panel */}
          <div className="auth-right-panel">
            {/* Mode Switcher Tabs (Login vs Register) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setErrorMsg(''); setSuccessMsg(''); setIsApiKeyError(false); }}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none',
                  fontWeight: '700', cursor: 'pointer',
                  backgroundColor: !isRegisterMode ? 'var(--primary-maroon)' : '#f1f5f9',
                  color: !isRegisterMode ? '#fff' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setErrorMsg(''); setSuccessMsg(''); setIsApiKeyError(false); }}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none',
                  fontWeight: '700', cursor: 'pointer',
                  backgroundColor: isRegisterMode ? 'var(--primary-maroon)' : '#f1f5f9',
                  color: isRegisterMode ? '#fff' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                Register in Firebase
              </button>
            </div>

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
              {errorMsg && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '14px'
                }}>
                  <div>⚠️ {errorMsg}</div>

                  {isApiKeyError && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #fca5a5', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#7f1d1d' }}>
                        To connect live Firebase Auth, paste your API Key from Firebase Console:
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Paste AIzaSy... API Key"
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            border: '1px solid #f87171'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSaveApiKey}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#991b1b',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleDemoProceed}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#4C1536',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '12px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        🚀 Continue with Local Demo Account instead
                      </button>
                    </div>
                  )}
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  backgroundColor: '#dcfce7', color: '#166534',
                  fontSize: '13px', fontWeight: '600', marginBottom: '14px'
                }}>
                  ✅ {successMsg}
                </div>
              )}

              {/* Extra Register Fields */}
              {isRegisterMode && (
                <>
                  <div className="auth-field-group">
                    <label className="auth-label">Full Name</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Jayasurya K"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>

                  {selectedRole === 'Student' && (
                    <div className="auth-field-group">
                      <label className="auth-label">Register Number</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="e.g. 710123205015"
                        value={formData.regNo}
                        onChange={(e) => handleInputChange('regNo', e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

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
              {!isRegisterMode && (
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading
                  ? 'Connecting to Firebase...'
                  : isRegisterMode
                    ? `Create ${selectedRole} Account`
                    : `Login as ${selectedRole}`}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="auth-bottom-footer">
        <span>AIT Placement Portal</span>
        <span className="auth-footer-dot">•</span>
        <span>Firebase Database: ait-placement-35053</span>
        <span className="auth-footer-dot">•</span>
        <span>AIT Placement Management</span>
      </div>
    </div>
  );
}
