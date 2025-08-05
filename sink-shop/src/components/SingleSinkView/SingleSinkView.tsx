import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { SinkData } from '../SinkCard/SinkCard'
import Toast from '../Toast/Toast'
import { useCart } from '../../contexts/CartContext'

function SingleSinkView() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)

  // Get sink data from translations
  const sinkData = t(`sinks.sink${id}`, { returnObjects: true }) as SinkData
  
  // Check if sink exists
  if (!sinkData || !sinkData.id) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    )
  }

  // Determine currency based on language
  const isEnglish = i18n.language === 'en'
  const price = isEnglish ? sinkData.priceEur : sinkData.priceBgn
  const currency = isEnglish ? '€' : 'лв'

  const handleAddToCart = () => {
    // Add the sink to cart using CartContext
    addToCart(sinkData)
    setShowToast(true)
  }

  const handleCloseToast = () => {
    setShowToast(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <nav className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Products
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="w-full">
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
            <img 
              src={sinkData.image} 
              alt={sinkData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-sink.jpg'
              }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          {/* Tags and Category */}
          <div className="flex gap-3 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              {sinkData.tag}
            </span>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded">
              {t(`categories.${sinkData.category}`)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {sinkData.title}
          </h1>

          {/* Price */}
          <div className="text-4xl font-bold text-gray-900 mb-6">
            {price} {currency}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('product.description')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {sinkData.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('product.specifications')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{t(`categories.${sinkData.category}`)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Sales Count:</span>
                <span className="font-medium">{sinkData.salesCount} {t('product.salesCount')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Date Added:</span>
                <span className="font-medium">{new Date(sinkData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-medium">#{sinkData.id}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-auto">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              {t('product.addToCart')} - {price} {currency}
            </button>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <Toast
        show={showToast}
        onClose={handleCloseToast}
        productTitle={sinkData.title}
        type="success"
        t={t}
      />
    </div>
  )
}

export default SingleSinkView