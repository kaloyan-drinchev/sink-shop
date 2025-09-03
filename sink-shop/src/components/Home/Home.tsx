import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import SinkCard from '../SinkCard/SinkCard'
import Banner from '../Banner/Banner'
import { useFilter } from '../NavBar/NavBar'
import { useSearch } from '../../contexts/SearchContext'
import { apiService, type ApiProduct } from '../../services/apiService'

function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentFilter } = useFilter()
  const { searchQuery, setSearchQuery } = useSearch()

  // State for products and loading
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await apiService.getProducts()
        setProducts(data)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  
  // Extract category from route (e.g., /category/wooden -> wooden)
  const pathSegments = location.pathname.split('/')
  const routeCategory = pathSegments[2] // Gets the category part after /category/
  
  // Map route categories to data categories
  const categoryMap: Record<string, string> = {
    'fossil': 'fossil',
    'river-stone': 'riverStone'
  }
  
  const currentCategory = routeCategory ? categoryMap[routeCategory] : null
  const isHomePage = location.pathname === '/' || location.pathname === '/products'
  
  // Category-specific images
  const getCategoryImage = () => {
    if (!currentCategory) {
      return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Modern kitchen interior
    }
    
    switch (currentCategory) {
      case 'fossil':
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Fossil sink collection
      case 'riverStone':
        return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // River stone bathroom
      default:
        return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  }
  
  // Filter and sort products based on search, category, and filters
  const filteredAndSortedProducts = useMemo(() => {
    if (!products.length) return []

    let filteredProducts = [...products]
    
    // Category filtering (for category pages like /category/fossil)
    if (currentCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === currentCategory)
    }
    
    // Search filtering
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase()
      filteredProducts = filteredProducts.filter(product => {
        const localizedProduct = apiService.getLocalizedProduct(product, i18n.language)
        return (
          localizedProduct.title.toLowerCase().includes(searchLower) ||
          localizedProduct.description.toLowerCase().includes(searchLower) ||
          product.tag.toLowerCase().includes(searchLower) ||
          t(`categories.${product.category}`).toLowerCase().includes(searchLower)
        )
      })
    }
    
    // Apply filter/sorting
    if (currentFilter === 'newest') {
      filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (currentFilter === 'oldest') {
      filteredProducts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (currentFilter === 'price-low-high') {
      filteredProducts.sort((a, b) => {
        const priceA = i18n.language === 'en' ? a.priceEur : a.priceBgn
        const priceB = i18n.language === 'en' ? b.priceEur : b.priceBgn
        return priceA - priceB
      })
    } else if (currentFilter === 'price-high-low') {
      filteredProducts.sort((a, b) => {
        const priceA = i18n.language === 'en' ? a.priceEur : a.priceBgn
        const priceB = i18n.language === 'en' ? b.priceEur : b.priceBgn
        return priceB - priceA
      })
    } else if (currentFilter === 'most-sold') {
      filteredProducts.sort((a, b) => b.salesCount - a.salesCount)
    } else if (currentFilter === 'least-sold') {
      filteredProducts.sort((a, b) => a.salesCount - b.salesCount)
    }
    
    return filteredProducts
  }, [products, currentCategory, searchQuery, currentFilter, i18n.language, t])

  const handleSinkClick = (productId: string) => {
    navigate(`/sink/${productId}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
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

        {/* Product Cards Grid - Dynamic */}
        {filteredAndSortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <SinkCard 
                  key={product.id}
                  product={product} 
                  onClick={handleSinkClick}
                />
              ))}
            </div>

            {/* Show count of sinks */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {searchQuery.trim() ? (
                `Found ${filteredAndSortedProducts.length} products for "${searchQuery}"`
              ) : currentCategory ? (
                `Showing ${filteredAndSortedProducts.length} ${t(`categories.${currentCategory}`).toLowerCase()} products`
              ) : (
                `Showing ${filteredAndSortedProducts.length} products`
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