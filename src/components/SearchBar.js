import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCheatsheets } from '../data/cheatsheets';
import './SearchBar.css';

const SearchBar = forwardRef(({ onSearch, searchQuery, placeholder = "Search..." }, ref) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    clear: () => {
      setLocalQuery('');
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      onSearch('');
    }
  }));

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Handle search and update dropdown
  useEffect(() => {
    if (localQuery.trim()) {
      const results = searchCheatsheets(localQuery).slice(0, 8); // Limit to 8 results
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, [localQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const selectedSheet = searchResults[selectedIndex];
          navigate(`/cheatsheet/${selectedSheet.id}`);
          setShowDropdown(false);
          setSelectedIndex(-1);
        } else if (searchResults.length > 0) {
          // If no selection, open first result
          navigate(`/cheatsheet/${searchResults[0].id}`);
          setShowDropdown(false);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleResultClick = (cheatsheet) => {
    navigate(`/cheatsheet/${cheatsheet.id}`);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/cheatsheet/${searchResults[0].id}`);
      setShowDropdown(false);
    } else {
      onSearch(localQuery);
    }
  };

  return (
    <div className="search-bar" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <div className="search-icon">
            🔍
          </div>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          {localQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </form>
      
      {showDropdown && searchResults.length > 0 && (
        <div className="search-dropdown">
          {searchResults.map((cheatsheet, index) => (
            <div
              key={cheatsheet.id}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleResultClick(cheatsheet)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="result-icon" style={{ backgroundColor: cheatsheet.color }}>
                {cheatsheet.icon}
              </div>
              <div className="result-content">
                <div className="result-title">{cheatsheet.title}</div>
                <div className="result-description">{cheatsheet.description}</div>
                <div className="result-category">{cheatsheet.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SearchBar;
