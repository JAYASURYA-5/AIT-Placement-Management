import React from 'react';

export default function StatCards({ stats, onSelectStat }) {
  const cards = [
    { key: 'applied', number: stats.applied ?? 5, label: 'Applied', color: 'blue' },
    { key: 'shortlisted', number: stats.shortlisted ?? 2, label: 'Shortlisted', color: 'green' },
    { key: 'interview', number: stats.interview ?? 1, label: 'Interview', color: 'pink' },
    { key: 'offers', number: stats.offers ?? 0, label: 'Offers', color: 'amber' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`stat-card ${card.color}`}
          onClick={() => onSelectStat && onSelectStat(card.key)}
        >
          <div className="stat-number">{card.number}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
