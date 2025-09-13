import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';
import CheatSheetViewer from './components/CheatSheetViewer';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cheatsheet" element={<LandingPage />} />
            <Route path="/cheatsheet/:name" element={<CheatSheetViewer />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
