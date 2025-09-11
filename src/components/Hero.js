import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import LanguageToggle from './LanguageToggle';
import './Hero.css';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-particles"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>{t.tagline}</span>
            </div>
            <LanguageToggle />
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-main">{t.title}</span>
            <span className="hero-title-sub">{t.subtitle}</span>
          </h1>
          
          <p className="hero-description">
            {t.description}
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">💻</span>
              <span>{t.features.cli}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🐹</span>
              <span>{t.features.programming}</span>
            </div>
          </div>
          
          <div className="hero-actions">
            <button 
              className="cta-button primary"
              onClick={() => document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{t.buttons.explore}</span>
              <span className="button-icon">📚</span>
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => document.querySelector('.controls-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{t.buttons.search}</span>
              <span className="button-icon">🔍</span>
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <div className="terminal-button close"></div>
                <div className="terminal-button minimize"></div>
                <div className="terminal-button maximize"></div>
              </div>
              <div className="terminal-title">knighty@dev: ~/cheatsheets — zsh</div>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="terminal-prompt">knighty@dev:~$</span>
                <span className="terminal-command typing-animation">cat shortcuts.help</span>
              </div>
              <div className="terminal-output">
                <div className="output-line welcome-message">🚀 {t.terminal.welcome || 'Welcome to Knighty - Your Developer Reference Hub'}</div>
                <div className="output-line">📚 Access 25+ curated cheat sheets</div>
                <div className="output-line">⚡ Fast search & filter capabilities</div>
                <div className="output-line">🌟 Always up-to-date content</div>
                <div className="output-line"></div>
                <div className="output-line">⌨️  <strong>Keyboard Shortcuts:</strong></div>
                <div className="output-line">   • <span className="shortcut-key">Ctrl+K</span> or <span className="shortcut-key">⌘K</span> → Quick search</div>
                <div className="output-line">   • <span className="shortcut-key">↑</span> <span className="shortcut-key">↓</span> → Navigate results</div>
                <div className="output-line">   • <span className="shortcut-key">Enter</span> → Open cheat sheet</div>
                <div className="output-line">   • <span className="shortcut-key">ESC</span> → Close dropdown</div>
                <div className="output-line"></div>
                <div className="output-line">🎯 Try: Press <span className="shortcut-key">Ctrl+K</span> and type "docker"!</div>
              </div>
              <div className="terminal-line current-line">
                <span className="terminal-prompt">knighty@dev:~$</span>
                <span className="terminal-cursor">▊</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
