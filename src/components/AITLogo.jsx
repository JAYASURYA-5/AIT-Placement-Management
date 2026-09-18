import React from 'react';

export default function AITLogo({ size = 40, className = '', style = {} }) {
  return (
    <img
      src="/ait-logo.png"
      alt="AIT College Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        padding: '2px',
        ...style
      }}
    />
  );
}
