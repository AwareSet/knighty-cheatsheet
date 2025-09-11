import React from 'react';
import './Stats.css';

const Stats = ({ totalCheatsheets, categories }) => {
  const stats = [
    {
      icon: '📚',
      number: totalCheatsheets,
      label: 'Cheat Sheets',
      color: '#667eea'
    },
    {
      icon: '📁',
      number: categories,
      label: 'Categories',
      color: '#10b981'
    },
    {
      icon: '🌍',
      number: '2',
      label: 'Languages',
      color: '#f59e0b'
    },
    {
      icon: '⚡',
      number: '24/7',
      label: 'Available',
      color: '#ef4444'
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-item"
              style={{ '--stat-color': stat.color }}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {stat.number}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
