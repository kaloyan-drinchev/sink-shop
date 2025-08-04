import { useTranslation } from 'react-i18next'

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
  sinkId: string
  onClick?: (sinkId: string) => void
}

function SinkCard({ sinkId, onClick }: SinkCardProps) {
  const { t, i18n } = useTranslation()
  
  // Get sink data from translations
  const sinkData = t(`sinks.${sinkId}`, { returnObjects: true }) as SinkData
  
  // Determine currency based on language
  const isEnglish = i18n.language === 'en'
  const price = isEnglish ? sinkData.priceEur : sinkData.priceBgn
  const currency = isEnglish ? '€' : 'лв'
  
  const handleClick = () => {
    if (onClick) {
      onClick(sinkData.id)
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
          src={sinkData.image} 
          alt={sinkData.title}
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
            {sinkData.tag}
          </span>
          <span className="text-gray-500 text-xs">
            {t(`categories.${sinkData.category}`)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {sinkData.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {sinkData.description}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 text-xs">
            {sinkData.salesCount} sold
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(sinkData.date).toLocaleDateString()}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            {price} {currency}
          </span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SinkCard