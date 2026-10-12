import React from 'react';

export default function AITLogo({ size = 50, className = '', style = {} }) {
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
        ...style
      }}
    />
  );
}
