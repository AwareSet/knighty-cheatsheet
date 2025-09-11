import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className="language-toggle" onClick={toggleLanguage}>
      <div className="toggle-container">
        <div className={`toggle-option ${language === 'en' ? 'active' : ''}`}>
          <span className="flag">🇺🇸</span>
          <span className="lang-code">EN</span>
        </div>
        <div className={`toggle-option ${language === 'ar' ? 'active' : ''}`}>
          <span className="flag">🇸🇦</span>
          <span className="lang-code">العربية</span>
        </div>
        <div className={`toggle-slider ${language === 'ar' ? 'arabic' : 'english'}`}></div>
      </div>
    </button>
  );
};

export default LanguageToggle;

