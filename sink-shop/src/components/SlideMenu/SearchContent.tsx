import React, { useState, useMemo } from "react";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  price?: string;
  onClick: (result: SearchResult) => void;
}

export interface SearchContentProps {
  placeholder?: string;
  searchIcon?: string;
  searchFunction: (query: string) => SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  emptyStateMessage?: string;
  noResultsMessage?: string;
  className?: string;
  inputClassName?: string;
  resultsClassName?: string;
  resultItemClassName?: string;
  debounceMs?: number;
}

const SearchContent: React.FC<SearchContentProps> = ({
  placeholder = "Search...",
  searchIcon,
  searchFunction,
  onResultClick,
  emptyStateMessage = "Start typing to search",
  noResultsMessage = "No results found",
  className = "",
  inputClassName = "",
  resultsClassName = "",
  resultItemClassName = "",
  // debounceMs = 300
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFunction(searchQuery.trim());
  }, [searchQuery, searchFunction]);

  const handleResultClick = (result: SearchResult) => {
    result.onClick(result);
    if (onResultClick) {
      onResultClick(result);
    }
  };

  return (
    <div className={`search-content ${className}`}>
      {/* Search Input */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`search-input ${inputClassName}`}
            autoFocus
          />
          {searchIcon && (
            <div className="search-input-icon">
              <img src={searchIcon} alt="Search" className="w-5 h-5 opacity-50" />
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className={`search-results ${resultsClassName}`}>
        {!searchQuery.trim() ? (
          <div className="search-empty-state">
            <p className="search-empty-message">{emptyStateMessage}</p>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div
              key={result.id}
              className={`search-result-item ${resultItemClassName}`}
              onClick={() => handleResultClick(result)}
            >
              {result.image && (
                <img src={result.image} alt={result.title} className="search-result-image" />
              )}
              <div className="search-result-content">
                <h4 className="search-result-title">{result.title}</h4>
                {result.subtitle && <p className="search-result-subtitle">{result.subtitle}</p>}
                {result.price && <p className="search-result-price">{result.price}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="search-no-results">
            <p className="search-no-results-message">{noResultsMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchContent;
