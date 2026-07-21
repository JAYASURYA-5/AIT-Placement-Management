import React from 'react';

export default function WelcomeBanner({ userName = "Jayasurya" }) {
  return (
    <div className="welcome-banner">
      <h1 className="welcome-title">
        Welcome back, {userName}! 👋
      </h1>
      <p className="welcome-subtitle">
        Keep learning, keep growing.
      </p>
    </div>
  );
}
