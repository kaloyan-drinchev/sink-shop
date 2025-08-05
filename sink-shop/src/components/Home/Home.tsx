import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import SinkCard from '../SinkCard/SinkCard'
import Banner from '../Banner/Banner'

function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Get all sink data from translations
  const sinksData = t('sinks', { returnObjects: true }) as Record<string, any>
  
  // Get array of sink IDs dynamically
  const sinkIds = Object.keys(sinksData)

  const handleSinkClick = (sinkId: string) => {
    // Extract the number from sinkId (e.g., "sink1" -> "1")
    const id = sinkId.replace('sink', '')
    navigate(`/sink/${id}`)
  }

  return (
    <div className="w-full">

      {/* Banner Component */}
      <Banner 
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        text={t('banner.text')}
        button={{
          text: t('navigation.allProducts'),
          onClick: () => navigate('/products')
        }}
        imageAlt="Nature Landscape"
      />
      
      {/* Content Section with Padding */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          {t('home.subtitle')}
        </p>

        {/* Sink Cards Grid - Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sinkIds.map((sinkId) => (
            <SinkCard 
              key={sinkId}
              sinkId={sinkId} 
              onClick={handleSinkClick} 
            />
          ))}
        </div>

        {/* Show count of sinks */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Showing {sinkIds.length} products
        </div>
      </div>
    </div>
  )
}

export default Home