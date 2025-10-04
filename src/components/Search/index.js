import React, { useState, useEffect, useRef } from 'react';
import ScrollContainer from '../ui-components/ScrollContainer';
import { 
  FiSearch, 
  FiFilter, 
  FiMap, 
  FiGrid, 
  FiList, 
  FiHeart, 
  FiShare2, 
  FiStar,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiX,
  FiChevronDown,
  FiSliders
} from 'react-icons/fi';
import styles from './style.module.css';

// Mock data for demonstration
const mockUniversities = [
  {
    id: 1,
    name: "Harvard University",
    location: "Cambridge, MA",
    country: "United States",
    logo: "🎓",
    ranking: 1,
    matchScore: 98,
    tuition: 54000,
    programs: ["Computer Science", "Business", "Medicine"],
    acceptanceRate: 4.6,
    studentCount: 23000,
    founded: 1636,
    type: "Private",
    size: "Large",
    climate: "Temperate",
    language: "English",
    scholarships: true,
    research: true,
    sports: true,
    arts: true,
    image: "/images/harvard.jpg"
  },
  {
    id: 2,
    name: "Stanford University",
    location: "Stanford, CA",
    country: "United States",
    logo: "🎓",
    ranking: 2,
    matchScore: 95,
    tuition: 56000,
    programs: ["Engineering", "Computer Science", "Business"],
    acceptanceRate: 4.3,
    studentCount: 17000,
    founded: 1885,
    type: "Private",
    size: "Large",
    climate: "Mediterranean",
    language: "English",
    scholarships: true,
    research: true,
    sports: true,
    arts: true,
    image: "/images/stanford.jpg"
  },
  {
    id: 3,
    name: "MIT",
    location: "Cambridge, MA",
    country: "United States",
    logo: "🎓",
    ranking: 3,
    matchScore: 92,
    tuition: 53000,
    programs: ["Engineering", "Computer Science", "Physics"],
    acceptanceRate: 6.7,
    studentCount: 12000,
    founded: 1861,
    type: "Private",
    size: "Medium",
    climate: "Temperate",
    language: "English",
    scholarships: true,
    research: true,
    sports: false,
    arts: false,
    image: "/images/mit.jpg"
  },
  {
    id: 4,
    name: "University of Oxford",
    location: "Oxford, England",
    country: "United Kingdom",
    logo: "🎓",
    ranking: 4,
    matchScore: 89,
    tuition: 35000,
    programs: ["Humanities", "Sciences", "Medicine"],
    acceptanceRate: 17.5,
    studentCount: 24000,
    founded: 1096,
    type: "Public",
    size: "Large",
    climate: "Temperate",
    language: "English",
    scholarships: true,
    research: true,
    sports: true,
    arts: true,
    image: "/images/oxford.jpg"
  },
  {
    id: 5,
    name: "University of Cambridge",
    location: "Cambridge, England",
    country: "United Kingdom",
    logo: "🎓",
    ranking: 5,
    matchScore: 87,
    tuition: 33000,
    programs: ["Sciences", "Engineering", "Humanities"],
    acceptanceRate: 21.0,
    studentCount: 23000,
    founded: 1209,
    type: "Public",
    size: "Large",
    climate: "Temperate",
    language: "English",
    scholarships: true,
    research: true,
    sports: true,
    arts: true,
    image: "/images/cambridge.jpg"
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockUniversities);
  const [filteredResults, setFilteredResults] = useState(mockUniversities);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [sortBy, setSortBy] = useState('match'); // match, ranking, tuition, name
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    tuitionRange: [0, 100000],
    rankingRange: [1, 1000],
    acceptanceRateRange: [0, 100],
    universityType: '',
    size: '',
    climate: '',
    language: '',
    programs: [],
    features: {
      scholarships: false,
      research: false,
      sports: false,
      arts: false
    }
  });

  const searchInputRef = useRef(null);

  // AI-powered search simulation
  const performSearch = async (query) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!query.trim()) {
      setSearchResults(mockUniversities);
      setFilteredResults(mockUniversities);
    } else {
      // Simple search logic (in real app, this would be AI-powered)
      const results = mockUniversities.filter(university =>
        university.name.toLowerCase().includes(query.toLowerCase()) ||
        university.location.toLowerCase().includes(query.toLowerCase()) ||
        university.country.toLowerCase().includes(query.toLowerCase()) ||
        university.programs.some(program => 
          program.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      setSearchResults(results);
      setFilteredResults(results);
    }
    
    setIsLoading(false);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...searchResults];

    if (filters.country) {
      filtered = filtered.filter(uni => uni.country === filters.country);
    }

    if (filters.tuitionRange[0] > 0 || filters.tuitionRange[1] < 100000) {
      filtered = filtered.filter(uni => 
        uni.tuition >= filters.tuitionRange[0] && uni.tuition <= filters.tuitionRange[1]
      );
    }

    if (filters.rankingRange[0] > 1 || filters.rankingRange[1] < 1000) {
      filtered = filtered.filter(uni => 
        uni.ranking >= filters.rankingRange[0] && uni.ranking <= filters.rankingRange[1]
      );
    }

    if (filters.acceptanceRateRange[0] > 0 || filters.acceptanceRateRange[1] < 100) {
      filtered = filtered.filter(uni => 
        uni.acceptanceRate >= filters.acceptanceRateRange[0] && 
        uni.acceptanceRate <= filters.acceptanceRateRange[1]
      );
    }

    if (filters.universityType) {
      filtered = filtered.filter(uni => uni.type === filters.universityType);
    }

    if (filters.size) {
      filtered = filtered.filter(uni => uni.size === filters.size);
    }

    if (filters.climate) {
      filtered = filtered.filter(uni => uni.climate === filters.climate);
    }

    if (filters.language) {
      filtered = filtered.filter(uni => uni.language === filters.language);
    }

    if (filters.programs.length > 0) {
      filtered = filtered.filter(uni => 
        filters.programs.some(program => uni.programs.includes(program))
      );
    }

    // Apply feature filters
    Object.entries(filters.features).forEach(([feature, enabled]) => {
      if (enabled) {
        filtered = filtered.filter(uni => uni[feature] === true);
      }
    });

    setFilteredResults(filtered);
  };

  // Sort results
  const sortResults = (results, sortType) => {
    const sorted = [...results].sort((a, b) => {
      switch (sortType) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'ranking':
          return a.ranking - b.ranking;
        case 'tuition':
          return a.tuition - b.tuition;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(searchInputRef.current);
    searchInputRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Save search
  const saveSearch = () => {
    const searchData = {
      id: Date.now(),
      query: searchQuery,
      filters: filters,
      resultsCount: filteredResults.length,
      timestamp: new Date().toISOString()
    };
    
    setSavedSearches(prev => [searchData, ...prev]);
  };

  // Load saved search
  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    performSearch(savedSearch.query);
    setShowSavedSearches(false);
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, searchResults]);

  // Sort results when sortBy changes
  useEffect(() => {
    setFilteredResults(sortResults(filteredResults, sortBy));
  }, [sortBy]);

  return (
    <div className={styles.searchPage}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.container}>
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search universities, programs, or locations..."
                value={searchQuery}
                onChange={handleSearch}
                className={styles.input}
              />
              {searchQuery && (
                <button 
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchQuery('');
                    performSearch('');
                  }}
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <div className={styles.searchActions}>
              <button 
                className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiSliders />
                Filters
              </button>
              
              <button 
                className={styles.savedButton}
                onClick={() => setShowSavedSearches(!showSavedSearches)}
              >
                <FiHeart />
                Saved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.container}>
            <div className={styles.filtersContent}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Country</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                >
                  <option value="">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Tuition Range</label>
                <div className={styles.rangeInput}>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.tuitionRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      tuitionRange: [prev.tuitionRange[0], parseInt(e.target.value)] 
                    }))}
                  />
                  <span className={styles.rangeValue}>
                    ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>University Type</label>
                <select 
                  className={styles.filterSelect}
                  value={filters.universityType}
                  onChange={(e) => setFilters(prev => ({ ...prev, universityType: e.target.value }))}
                >
                  <option value="">All Types</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Features</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.features.scholarships}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, scholarships: e.target.checked }
                      }))}
                    />
                    Scholarships Available
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.features.research}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, research: e.target.checked }
                      }))}
                    />
                    Research Opportunities
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.features.sports}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, sports: e.target.checked }
                      }))}
                    />
                    Sports Programs
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.features.arts}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, arts: e.target.checked }
                      }))}
                    />
                    Arts Programs
                  </label>
                </div>
              </div>

              <div className={styles.filterActions}>
                <button 
                  className="btn btn-outline"
                  onClick={() => setFilters({
                    country: '',
                    tuitionRange: [0, 100000],
                    rankingRange: [1, 1000],
                    acceptanceRateRange: [0, 100],
                    universityType: '',
                    size: '',
                    climate: '',
                    language: '',
                    programs: [],
                    features: {
                      scholarships: false,
                      research: false,
                      sports: false,
                      arts: false
                    }
                  })}
                >
                  Clear All
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={saveSearch}
                >
                  Save Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches Dropdown */}
      {showSavedSearches && (
        <div className={styles.savedSearches}>
          <div className={styles.container}>
            <div className={styles.savedContent}>
              <h3 className={styles.savedTitle}>Saved Searches</h3>
              {savedSearches.length === 0 ? (
                <p className={styles.noSaved}>No saved searches yet</p>
              ) : (
                <div className={styles.savedList}>
                  {savedSearches.map(search => (
                    <div 
                      key={search.id} 
                      className={styles.savedItem}
                      onClick={() => loadSavedSearch(search)}
                    >
                      <div className={styles.savedQuery}>{search.query}</div>
                      <div className={styles.savedMeta}>
                        {search.resultsCount} results • {new Date(search.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className={styles.resultsHeader}>
        <div className={styles.container}>
          <div className={styles.resultsInfo}>
            <h2 className={styles.resultsTitle}>
              {isLoading ? 'Searching...' : `${filteredResults.length} Universities Found`}
            </h2>
            {searchQuery && (
              <p className={styles.resultsSubtitle}>
                Results for "{searchQuery}"
              </p>
            )}
          </div>

          <div className={styles.resultsControls}>
            <div className={styles.sortControl}>
              <label className={styles.sortLabel}>Sort by:</label>
              <select 
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="match">Match Score</option>
                <option value="ranking">World Ranking</option>
                <option value="tuition">Tuition Cost</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className={styles.viewControl}>
              <button 
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'map' ? styles.active : ''}`}
                onClick={() => setViewMode('map')}
              >
                <FiMap />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <ScrollContainer variant="minimal" className={styles.results}>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className="loading-spinner"></div>
              <p>Searching universities...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className={styles.noResults}>
              <FiSearch className={styles.noResultsIcon} />
              <h3>No universities found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className={`${styles.resultsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
              {filteredResults.map(university => (
                <div key={university.id} className={`${styles.universityCard} card card-interactive`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.universityLogo}>
                      {university.logo}
                    </div>
                    <div className={styles.universityInfo}>
                      <h3 className={styles.universityName}>{university.name}</h3>
                      <div className={styles.universityLocation}>
                        <FiMapPin />
                        {university.location}, {university.country}
                      </div>
                    </div>
                    <div className={styles.matchScore}>
                      <span className={styles.scoreNumber}>{university.matchScore}%</span>
                      <span className={styles.scoreLabel}>Match</span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.universityStats}>
                      <div className={styles.stat}>
                        <FiTrendingUp />
                        <span>#{university.ranking} World Ranking</span>
                      </div>
                      <div className={styles.stat}>
                        <FiDollarSign />
                        <span>${university.tuition.toLocaleString()}/year</span>
                      </div>
                      <div className={styles.stat}>
                        <FiUsers />
                        <span>{university.studentCount.toLocaleString()} students</span>
                      </div>
                      <div className={styles.stat}>
                        <FiClock />
                        <span>{university.acceptanceRate}% acceptance rate</span>
                      </div>
                    </div>

                    <div className={styles.programs}>
                      <h4 className={styles.programsTitle}>Popular Programs:</h4>
                      <div className={styles.programsList}>
                        {university.programs.slice(0, 3).map((program, index) => (
                          <span key={index} className={styles.programTag}>
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardActions}>
                      <button className="btn btn-outline btn-sm">
                        <FiHeart />
                        Save
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <FiShare2 />
                        Share
                      </button>
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default Search;