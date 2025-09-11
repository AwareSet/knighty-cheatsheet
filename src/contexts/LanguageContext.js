import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('knighty-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('knighty-language', newLanguage);
  };

  const setLanguageMode = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguage(lang);
      localStorage.setItem('knighty-language', lang);
    }
  };

  const value = {
    language,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
    toggleLanguage,
    setLanguageMode
  };

  return (
    <LanguageContext.Provider value={value}>
      <div className={`app-container ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

