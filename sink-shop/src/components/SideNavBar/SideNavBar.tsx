import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../contexts/SearchContext'
import { useFilter } from '../NavBar/NavBar'
import searchIcon from '../../assets/search-interface-symbol.png'

function SideNavBar() {
  const { t } = useTranslation()
  const { searchQuery, setSearchQuery } = useSearch()
  const { currentFilter, setCurrentFilter } = useFilter()
  const [isFilterExpanded, setIsFilterExpanded] = useState(true)

  const filterOptions = [
    { value: '', key: 'featured' },
    { value: 'best-selling', key: 'bestSelling' },
    { value: 'price-low-high', key: 'priceLowHigh' },
    { value: 'price-high-low', key: 'priceHighLow' },
    { value: 'newest', key: 'newest' }
  ]

  const getCurrentFilterLabel = () => {
    if (!currentFilter) return t('filters.featured')
    const option = filterOptions.find(opt => opt.value === currentFilter)
    return option ? t(`filters.${option.key}`) : t('filters.featured')
  }

  return (
    <aside className="w-full lg:w-64">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Search Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            {t('navigation.search')}
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder={`${t('navigation.search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div>
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-700 mb-3"
          >
            <span>{t('filters.sortBy')}</span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFilterExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isFilterExpanded && (
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <label 
                  key={option.value || 'featured'} 
                  className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="filter"
                      value={option.value}
                      checked={currentFilter === option.value}
                      onChange={(e) => setCurrentFilter(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      currentFilter === option.value 
                        ? 'border-gray-800 bg-gray-800' 
                        : 'border-gray-300'
                    } transition-colors duration-150`}>
                      {currentFilter === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    {t(`filters.${option.key}`)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(searchQuery || currentFilter) && (
          <div>
            <button
              onClick={() => {
                setSearchQuery('')
                setCurrentFilter('')
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
            >
              {t('filters.clearFilter')}
            </button>
          </div>
        )}

        {/* Results Count Placeholder */}
        {(searchQuery || currentFilter) && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            {searchQuery && (
              <p className="mb-1">
                {t('navigation.search')}: "{searchQuery}"
              </p>
            )}
            {currentFilter && (
              <p>
                {t('filters.sortBy')}: {getCurrentFilterLabel()}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideNavBar