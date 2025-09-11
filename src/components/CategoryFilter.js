import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, translations }) => {
  return (
    <div className="category-filter">
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="category-name">
              {translations[category.toLowerCase()] || category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
