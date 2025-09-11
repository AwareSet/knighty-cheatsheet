import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './CheatSheetCard.css';

const CheatSheetCard = ({ cheatsheet, featured = false }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const handleCardClick = () => {
    window.open(`/htmls/${cheatsheet.file}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`cheatsheet-card ${featured ? 'featured' : ''}`}
      onClick={handleCardClick}
      style={{ '--card-color': cheatsheet.color }}
    >
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: cheatsheet.color }}>
          {cheatsheet.icon}
        </div>
        <div className="card-category">
          {cheatsheet.category}
        </div>
        {featured && (
          <div className="featured-badge">
            ⭐
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{cheatsheet.title}</h3>
        <p className="card-description">{cheatsheet.description}</p>
        
        <div className="card-tags">
          {cheatsheet.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {cheatsheet.tags.length > 3 && (
            <span className="tag-more">+{cheatsheet.tags.length - 3}</span>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <button className="card-button">
          <span>{t.card.viewSheet}</span>
          <span className="button-arrow">{language === 'ar' ? '←' : '→'}</span>
        </button>
      </div>
      
      <div className="card-glow"></div>
    </div>
  );
};

export default CheatSheetCard;
