import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cheatsheets } from '../data/cheatsheets';
import './CheatSheetViewer.css';

const CheatSheetViewer = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [cheatsheet, setCheatsheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sheet = cheatsheets.find(cs => cs.id === name || cs.file === name);
    
    if (sheet) {
      setCheatsheet(sheet);
      setLoading(false);
    } else {
      setError('Cheat sheet not found');
      setLoading(false);
    }
  }, [name]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDirectView = () => {
    if (cheatsheet) {
      window.open(`/htmls/${cheatsheet.file}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="cheatsheet-viewer loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading cheat sheet...</p>
        </div>
      </div>
    );
  }

  if (error || !cheatsheet) {
    return (
      <div className="cheatsheet-viewer error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>Cheat Sheet Not Found</h2>
          <p>The requested cheat sheet could not be found.</p>
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cheatsheet-viewer">
      <header className="viewer-header">
        <div className="container">
          <div className="header-content">
            <button className="back-button" onClick={handleBackClick}>
              ← Back to Home
            </button>
            <div className="header-info">
              <div className="sheet-icon" style={{ backgroundColor: cheatsheet.color }}>
                {cheatsheet.icon}
              </div>
              <div className="sheet-details">
                <h1>{cheatsheet.title}</h1>
                <p>{cheatsheet.description}</p>
                <div className="sheet-meta">
                  <span className="category">{cheatsheet.category}</span>
                  <span className="tags">
                    {cheatsheet.tags.slice(0, 3).join(', ')}
                    {cheatsheet.tags.length > 3 && ` +${cheatsheet.tags.length - 3}`}
                  </span>
                </div>
              </div>
            </div>
            <button className="direct-view-button" onClick={handleDirectView}>
              Open in New Tab →
            </button>
          </div>
        </div>
      </header>

      <main className="viewer-content">
        <div className="iframe-container">
          <iframe
            src={`/htmls/${cheatsheet.file}`}
            title={cheatsheet.title}
            className="cheatsheet-iframe"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </main>
    </div>
  );
};

export default CheatSheetViewer;
