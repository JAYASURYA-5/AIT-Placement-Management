import React from 'react';

export default function WelcomeBanner({ userName = "Jayasurya" }) {
  const name = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('ait-profile')
      if (raw) return JSON.parse(raw).name || userName
    } catch {}
    return userName
  }, [userName])

  return (
    <div className="welcome-banner">
      <h1 className="welcome-title">
        Welcome back, {name}! 👋
      </h1>
      <p className="welcome-subtitle">
        Keep learning, keep growing.
      </p>
    </div>
  );
}
