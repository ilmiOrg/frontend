import React, { useState, useRef, useEffect } from 'react'
import { FiArrowRight, FiPlay, FiSearch, FiStar, FiUsers, FiGlobe, FiMapPin, FiTrendingUp, FiX, FiChevronDown } from 'react-icons/fi'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './style.module.css'

// Mock data for search suggestions
const searchSuggestions = [
  { id: 1, name: "Harvard University", location: "Cambridge, MA", country: "United States", logo: "🎓", matchScore: 98 },
  { id: 2, name: "Stanford University", location: "Stanford, CA", country: "United States", logo: "🎓", matchScore: 95 },
  { id: 3, name: "MIT", location: "Cambridge, MA", country: "United States", logo: "🎓", matchScore: 92 },
  { id: 4, name: "University of Oxford", location: "Oxford, England", country: "United Kingdom", logo: "🎓", matchScore: 89 },
  { id: 5, name: "University of Cambridge", location: "Cambridge, England", country: "United Kingdom", logo: "🎓", matchScore: 87 },
  { id: 6, name: "Yale University", location: "New Haven, CT", country: "United States", logo: "🎓", matchScore: 85 },
  { id: 7, name: "Princeton University", location: "Princeton, NJ", country: "United States", logo: "🎓", matchScore: 83 },
  { id: 8, name: "Columbia University", location: "New York, NY", country: "United States", logo: "🎓", matchScore: 81 }
]

const popularSearches = [
  "Computer Science",
  "Business Administration", 
  "Medicine",
  "Engineering",
  "Psychology",
  "Economics",
  "Art & Design",
  "International Relations"
]

function Hero() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(university =>
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 6)) // Show max 6 suggestions
    } else {
      setFilteredSuggestions([])
    }
  }, [searchQuery])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true)
  }

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    setShowSuggestions(true)
  }

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsSearchFocused(false)
      setShowSuggestions(false)
    }, 200)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name)
    setShowSuggestions(false)
    // Here you would typically navigate to the university page or search results
    console.log('Selected university:', suggestion)
  }

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Here you would typically navigate to search results
      console.log('Searching for:', searchQuery)
      setShowSuggestions(false)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGradient}></div>
        <div className={styles.heroParticles}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              <FiStar />
              {t('heroBadge')}
            </div>
            
            <h1 className={styles.title}>
              {t('heroTitle')} 
              <span className={styles.gradientText}> {t('heroSubtitle')}</span>
            </h1>
            
            <p className={styles.subtitle}>
              {t('heroDescription')}
            </p>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <FiUsers />
                <span>50K+ {t('heroStudents')}</span>
              </div>
              <div className={styles.stat}>
                <FiGlobe />
                <span>1000+ {t('heroUniversities')}</span>
              </div>
              <div className={styles.stat}>
                <FiStar />
                <span>95% {t('heroSuccessRate')}</span>
              </div>
            </div>
            
            {/* CommonApp-style Search Bar */}
            <div className={styles.searchSection}>
              <div className={styles.searchContainer} ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                  <div className={`${styles.searchInput} ${isSearchFocused ? styles.focused : ''}`}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search universities, programs, or locations..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className={styles.input}
                    />
                    {searchQuery && (
                      <button 
                        type="button"
                        className={styles.clearButton}
                        onClick={clearSearch}
                      >
                        <FiX />
                      </button>
                    )}
                    <button type="submit" className={styles.searchButton}>
                      <FiSearch />
                    </button>
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className={styles.suggestionsDropdown}>
                    {filteredSuggestions.length > 0 ? (
                      <div className={styles.suggestionsList}>
                        <div className={styles.suggestionsHeader}>
                          <span className={styles.suggestionsTitle}>Universities</span>
                        </div>
                        {filteredSuggestions.map(suggestion => (
                          <div 
                            key={suggestion.id}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className={styles.suggestionLogo}>
                              {suggestion.logo}
                            </div>
                            <div className={styles.suggestionInfo}>
                              <div className={styles.suggestionName}>{suggestion.name}</div>
                              <div className={styles.suggestionLocation}>
                                <FiMapPin />
                                {suggestion.location}, {suggestion.country}
                              </div>
                            </div>
                            <div className={styles.suggestionMatch}>
                              <span className={styles.matchScore}>{suggestion.matchScore}%</span>
                              <span className={styles.matchLabel}>Match</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery.trim() === '' && (
                      <div className={styles.popularSearches}>
                        <div className={styles.popularHeader}>
                          <span className={styles.popularTitle}>Popular Searches</span>
                        </div>
                        <div className={styles.popularTags}>
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              className={styles.popularTag}
                              onClick={() => setSearchQuery(search)}
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.primaryButton} btn btn-primary btn-lg`}>
                {t('heroCta')}
                <FiArrowRight />
              </button>
              <button className={`${styles.secondaryButton} btn btn-outline btn-lg`}>
                <FiPlay />
                {t('heroDemo')}
              </button>
            </div>
          </div>
          
          <div className={styles.visual}>
            <div className={styles.floatingElements}>
              <div className={styles.floatingElement}></div>
              <div className={styles.floatingElement}></div>
              <div className={styles.floatingElement}></div>
              <div className={styles.floatingElement}></div>
            </div>
            
            <div className={styles.heroCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>UniversityMatch</div>
                <div className={styles.cardSubtitle}>{t('heroSubtitle')}</div>
              </div>
              
              <div className={styles.statsDemo}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiTrendingUp />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>50K+</div>
                    <div className={styles.statLabel}>Students Matched</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiStar />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>95%</div>
                    <div className={styles.statLabel}>Success Rate</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FiGlobe />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statNumber}>1000+</div>
                    <div className={styles.statLabel}>Universities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
