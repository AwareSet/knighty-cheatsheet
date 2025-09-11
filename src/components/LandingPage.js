import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { cheatsheets, categories, getFeaturedCheatsheets, getCheatsheetsByCategory, searchCheatsheets } from '../data/cheatsheets';
import CheatSheetCard from './CheatSheetCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Hero from './Hero';
import Stats from './Stats';
import './LandingPage.css';

const LandingPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchBarRef = useRef(null);

  const filteredCheatsheets = useMemo(() => {
    let filtered = cheatsheets;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchCheatsheets(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sheet => sheet.category === selectedCategory);
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(sheet => sheet.featured);
    }

    return filtered;
  }, [searchQuery, selectedCategory, showFeaturedOnly]);

  const featuredCheatsheets = getFeaturedCheatsheets();

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Set search focused state
        setSearchFocused(true);
        
        // Focus search bar after a short delay to ensure scroll completes
        setTimeout(() => {
          if (searchBarRef.current) {
            searchBarRef.current.focus();
          }
        }, 300);
      }
      
      // ESC to clear search
      if (event.key === 'Escape' && searchQuery) {
        setSearchFocused(false);
        if (searchBarRef.current) {
          searchBarRef.current.clear();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowFeaturedOnly(false); // Reset featured filter when searching
    
    // If search is cleared, exit search focused mode
    if (!query.trim()) {
      setSearchFocused(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowFeaturedOnly(false); // Reset featured filter when changing category
  };

  const toggleFeatured = () => {
    setShowFeaturedOnly(!showFeaturedOnly);
    setSearchQuery(''); // Clear search when toggling featured
    setSelectedCategory('All'); // Reset category when toggling featured
  };

  return (
    <div className="landing-page">
      {!searchFocused && <Hero />}
      
      {!searchFocused && <Stats totalCheatsheets={cheatsheets.length} categories={categories.length - 1} />}
      
      {searchFocused && (
        <div className="search-focused-header">
          <div className="container">
            <div className="search-focused-container">
              <h1 className="search-focused-title">🔍 Search Cheat Sheets</h1>
              <SearchBar 
                ref={searchBarRef}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                placeholder={t.search.placeholder}
              />
              <p className="search-focused-hint">
                Use ↑↓ to navigate, Enter to select, ESC to return
              </p>
            </div>
          </div>
        </div>
      )}
      
      <main className="main-content">
        <div className="container">
          {!searchFocused && (
            <section className="controls-section">
              <div className="controls-container">
                <SearchBar 
                  ref={searchBarRef}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                  placeholder={t.search.placeholder}
                />
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  translations={t.categories}
                />
                <button 
                  className={`featured-toggle ${showFeaturedOnly ? 'active' : ''}`}
                  onClick={toggleFeatured}
                >
                  ⭐ {t.search.featuredOnly}
                </button>
              </div>
            </section>
          )}

          {/* Results Section */}
          <section className="results-section">
            {!searchFocused && (
              <div className="section-header">
                <h2>
                  {showFeaturedOnly ? `⭐ ${t.sections.featured}` : 
                   selectedCategory !== 'All' ? `📁 ${t.categories[selectedCategory.toLowerCase()] || selectedCategory}` :
                   searchQuery ? `🔍 ${t.sections.searchResults}` : `📚 ${t.sections.allSheets}`}
                </h2>
                <p>
                  {filteredCheatsheets.length} {t.stats.cheatsheets.toLowerCase()}{language === 'en' && filteredCheatsheets.length !== 1 ? 's' : ''} {language === 'en' ? 'found' : 'موجود'}
                  {searchQuery && ` ${language === 'en' ? 'for' : 'لـ'} "${searchQuery}"`}
                </p>
              </div>
            )}
            
            {filteredCheatsheets.length > 0 ? (
              <div className="cheatsheets-grid">
                {filteredCheatsheets.map(sheet => (
                  <CheatSheetCard key={sheet.id} cheatsheet={sheet} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>{t.sections.noResults}</h3>
                <p>
                  {searchQuery ? 
                    t.sections.noResultsDesc.replace('{query}', searchQuery) :
                    (language === 'en' ? 
                      'No cheat sheets match your current filters. Try adjusting your selection.' :
                      'لا توجد مراجع تطابق المرشحات الحالية. جرب تعديل اختيارك.'
                    )
                  }
                </p>
                <button 
                  className="reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setShowFeaturedOnly(false);
                  }}
                >
                  {t.sections.resetFilters}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🚀 {t.footer.title}</h3>
              <p>{t.footer.description}</p>
            </div>
            <div className="footer-section">
              <h4>{t.footer.categoriesTitle}</h4>
              <ul>
                {categories.slice(1, 6).map(category => (
                  <li key={category}>
                    <button onClick={() => handleCategoryChange(category)}>
                      {t.categories[category.toLowerCase()] || category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t.footer.popularTitle}</h4>
              <ul>
                {featuredCheatsheets.slice(0, 5).map(sheet => (
                  <li key={sheet.id}>
                    <a href={`/htmls/${sheet.file}`} target="_blank" rel="noopener noreferrer">
                      {sheet.icon} {sheet.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t.footer.aboutTitle}</h4>
              <p>{t.footer.aboutText}</p>
              <div className="footer-stats">
                <span>{cheatsheets.length} {t.stats.cheatsheets}</span>
                <span>{categories.length - 1} {t.stats.categories}</span>
                <span>{language === 'en' ? 'Always Updated' : 'محدث دائماً'}</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
