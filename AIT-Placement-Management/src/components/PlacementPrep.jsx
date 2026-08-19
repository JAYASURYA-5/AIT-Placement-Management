import React from 'react';
import { AssessmentsIcon, CodeIcon, UsersGroupIcon, ResumeIcon } from './Icons';

export const prepModules = [
  {
    id: 'aptitude',
    title: 'Aptitude Test',
    subtitle: 'Improve Your Skills',
    icon: AssessmentsIcon,
    bg: '#F5F3FF',
    color: '#7C3AED',
  },
  {
    id: 'coding',
    title: 'Coding Practice',
    subtitle: 'Solve Problems',
    icon: CodeIcon,
    bg: '#EFF6FF',
    color: '#0284C7',
  },
  {
    id: 'mock',
    title: 'Mock Interview',
    subtitle: 'Practice Now',
    icon: UsersGroupIcon,
    bg: '#FAF5FF',
    color: '#9333EA',
  },
  {
    id: 'resume-review',
    title: 'Resume Review',
    subtitle: 'Get AI Feedback',
    icon: ResumeIcon,
    bg: '#EEF2FF',
    color: '#4F46E5',
  },
];

export default function PlacementPrep({ onSelectPrep }) {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Placement Preparation</h2>
      </div>

      <div className="prep-grid">
        {prepModules.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="prep-card"
              onClick={() => onSelectPrep && onSelectPrep(item)}
            >
              <div className="prep-icon-box" style={{ backgroundColor: item.bg, color: item.color }}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="prep-title">{item.title}</span>
              <span className="prep-subtitle">{item.subtitle}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
