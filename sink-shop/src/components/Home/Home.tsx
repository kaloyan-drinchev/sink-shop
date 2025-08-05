import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import SinkCard from '../SinkCard/SinkCard'
import Banner from '../Banner/Banner'
import { useFilter } from '../NavBar/NavBar'
import { useSearch } from '../../contexts/SearchContext'

function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentFilter } = useFilter()
  const { searchQuery, setSearchQuery } = useSearch()

  // Get all sink data from translations
  const sinksData = t('sinks', { returnObjects: true }) as Record<string, any>
  
  // Extract category from route (e.g., /category/wooden -> wooden)
  const pathSegments = location.pathname.split('/')
  const routeCategory = pathSegments[2] // Gets the category part after /category/
  
  // Map route categories to data categories
  const categoryMap: Record<string, string> = {
    'wooden': 'wooden',
    'natural-stone': 'naturalStone',
    'mramor': 'mramor'
  }
  
  const currentCategory = routeCategory ? categoryMap[routeCategory] : null
  const isHomePage = location.pathname === '/' || location.pathname === '/products'
  
  // Category-specific images
  const getCategoryImage = () => {
    if (!currentCategory) {
      return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Modern kitchen interior
    }
    
    switch (currentCategory) {
      case 'wooden':
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Wooden kitchen with natural elements
      case 'naturalStone':
        return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Marble and stone bathroom
      case 'mramor':
        return "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Elegant mramor sink in luxury bathroom
      default:
        return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  }
  
  // Filter and sort sink IDs based on search, category, and filters
  const filteredAndSortedSinkIds = useMemo(() => {
    let sinkIds = Object.keys(sinksData)
    
    // Filter by category if on category page
    if (currentCategory) {
      sinkIds = sinkIds.filter(sinkId => sinksData[sinkId].category === currentCategory)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      sinkIds = sinkIds.filter(sinkId => {
        const sink = sinksData[sinkId]
        return (
          sink.title?.toLowerCase().includes(query) ||
          sink.description?.toLowerCase().includes(query) ||
          sink.tag?.toLowerCase().includes(query) ||
          t(`categories.${sink.category}`)?.toLowerCase().includes(query)
        )
      })
    }
    
    // Apply sorting based on current filter
    if (currentFilter) {
      const isEnglish = i18n.language === 'en'
      
      sinkIds = [...sinkIds].sort((a, b) => {
        const sinkA = sinksData[a]
        const sinkB = sinksData[b]
        
        switch (currentFilter) {
          case 'price-low-high':
            const priceA = isEnglish ? sinkA.priceEur : sinkA.priceBgn
            const priceB = isEnglish ? sinkB.priceEur : sinkB.priceBgn
            return priceA - priceB
            
          case 'price-high-low':
            const priceA2 = isEnglish ? sinkA.priceEur : sinkA.priceBgn
            const priceB2 = isEnglish ? sinkB.priceEur : sinkB.priceBgn
            return priceB2 - priceA2
            
          case 'newest':
            return new Date(sinkB.date).getTime() - new Date(sinkA.date).getTime()
            
          case 'best-selling':
            // Sort by sales count if available, otherwise by rating
            const salesA = sinkA.salesCount || 0
            const salesB = sinkB.salesCount || 0
            if (salesA !== salesB) {
              return salesB - salesA
            }
            // Fallback to rating if sales are equal
            return (sinkB.rating || 0) - (sinkA.rating || 0)
            
          case '':
          case 'featured':
          default:
            // Featured items - sort by featured flag, then by rating
            const featuredA = sinkA.featured || false
            const featuredB = sinkB.featured || false
            if (featuredA !== featuredB) {
              return featuredB ? 1 : -1
            }
            // Fallback to rating for featured items
            return (sinkB.rating || 0) - (sinkA.rating || 0)
        }
      })
    }
    
    return sinkIds
  }, [sinksData, currentCategory, searchQuery, currentFilter, i18n.language, t])

  const handleSinkClick = (sinkId: string) => {
    // Extract the number from sinkId (e.g., "sink1" -> "1")
    const id = sinkId.replace('sink', '')
    navigate(`/sink/${id}`)
  }

  return (
    <div className="w-full">

      {/* Banner Component */}
      <Banner 
        image={getCategoryImage()}
        text={currentCategory ? t(`categories.${currentCategory}`) : t('banner.text')}
        button={isHomePage ? {
          text: t('navigation.allProducts'),
          onClick: () => navigate('/products')
        } : undefined}
        imageAlt={currentCategory ? t(`categories.${currentCategory}`) : "Nature Landscape"}
      />
      
      {/* Content Section with Padding */}
      <div className={`${currentCategory ? 'pr-6 pt-6 pb-6' : 'p-6'}`}>
        {!currentCategory && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {t('home.title')}
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {t('home.subtitle')}
            </p>
          </>
        )}

        {/* Sink Cards Grid - Dynamic */}
                {filteredAndSortedSinkIds.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedSinkIds.map((sinkId) => (
                <SinkCard 
                  key={sinkId}
                  sinkId={sinkId} 
                  onClick={handleSinkClick} 
                />
              ))}
            </div>

            {/* Show count of sinks */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {searchQuery.trim() ? (
                `${t('search.found')} ${filteredAndSortedSinkIds.length} ${filteredAndSortedSinkIds.length === 1 ? t('search.results') : t('search.resultsPlural')} ${t('search.for')} "${searchQuery}"`
              ) : currentCategory ? (
                `Showing ${filteredAndSortedSinkIds.length} ${t(`categories.${currentCategory}`).toLowerCase()} products`
              ) : (
                `Showing ${filteredAndSortedSinkIds.length} products`
              )}
            </div>
          </>
        ) : (
                    <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery.trim() ? (
                `${t('search.noResults')} "${searchQuery}".`
              ) : currentCategory ? (
                `No ${t(`categories.${currentCategory}`).toLowerCase()} sinks are currently available.`
              ) : (
                'No products are currently available.'
              )}
            </p>
            {searchQuery.trim() ? (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mr-2"
              >
                {t('search.clearSearch')}
              </button>
            ) : null}
            <button
              onClick={() => navigate('/products')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home