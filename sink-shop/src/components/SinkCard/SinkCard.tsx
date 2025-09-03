import { useTranslation } from 'react-i18next'
import { apiService, type ApiProduct } from '../../services/apiService'

// Legacy interface for backward compatibility
export interface SinkData {
  id: string
  title: string
  description: string
  tag: string
  category: string
  salesCount: number
  image: string
  date: string
  priceEur: number
  priceBgn: number
}

interface SinkCardProps {
  product: ApiProduct
  onClick?: (sinkId: string) => void
}

function SinkCard({ product, onClick }: SinkCardProps) {
  const { t, i18n } = useTranslation()
  
  // Get localized product data
  const localizedProduct = apiService.getLocalizedProduct(product, i18n.language)
  
  // Determine currency based on language
  const isEnglish = i18n.language === 'en'
  const price = isEnglish ? product.priceEur : product.priceBgn
  const currency = isEnglish ? '€' : 'лв'
  
  const handleClick = () => {
    if (onClick) {
      onClick(product.id)
    }
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={localizedProduct.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for missing images
            e.currentTarget.src = '/images/placeholder-sink.jpg'
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tag and Category */}
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {product.tag && t(`tags.${product.tag}`, product.tag)}
          </span>
          <span className="text-gray-500 text-xs">
            {t(`categories.${product.category}`)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {localizedProduct.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {localizedProduct.description}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 text-xs">
            {product.salesCount} sold
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(product.date).toLocaleDateString()}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            {price} {currency}
          </span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
            {t('product.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SinkCard