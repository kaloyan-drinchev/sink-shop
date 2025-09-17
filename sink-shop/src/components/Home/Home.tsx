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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
    'river-stone': 'riverStone',
    'marble': 'marble',
    'onyx': 'onyx'
  }
  
  const currentCategory = routeCategory ? categoryMap[routeCategory] : null
  const isHomePage = location.pathname === '/' || location.pathname === '/products'
  
  // Category-specific images
  const getCategoryImage = () => {
    if (!currentCategory) {
      return "/images/art-indo-sinks-hero.jpg" // Art Indo sinks collage
    }
    
    switch (currentCategory) {
      case 'fossil':
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Fossil sink collection
      case 'riverStone':
        return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // River stone bathroom
      case 'marble':
        return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Marble bathroom
      case 'onyx':
        return "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Onyx stone texture
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
          (typeof product.tag === 'string' ? product.tag : product.tag?.en || '').toLowerCase().includes(searchLower) ||
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
  
  // Reset to page 1 when filters/search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, currentFilter, currentCategory])
  
  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, endIndex)
  }, [filteredAndSortedProducts, currentPage, itemsPerPage])
  
  // Calculate pagination info
  const totalProducts = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts)

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
        {totalProducts > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <SinkCard 
                  key={product.id}
                  product={product} 
                  onClick={handleSinkClick}
                />
              ))}
            </div>

            {/* Show count and pagination info */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {searchQuery.trim() ? (
                `Found ${totalProducts} products for "${searchQuery}"`
              ) : currentCategory ? (
                `Showing ${totalProducts} ${t(`categories.${currentCategory}`).toLowerCase()} products`
              ) : (
                `Showing ${totalProducts} products`
              )}
              {totalProducts > itemsPerPage && (
                <div className="mt-2">
                  Showing {startItem}-{endItem} of {totalProducts}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
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