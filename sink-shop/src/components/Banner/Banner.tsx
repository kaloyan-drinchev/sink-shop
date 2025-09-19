import { useState } from 'react'
import './Banner.css'

interface BannerProps {
  image: string
  text: string
  button?: {
    text: string
    onClick: () => void
  }
  imageAlt?: string
}

function Banner({ image, text, button, imageAlt = "Banner Image" }: BannerProps) {
  console.log('🖼️ Banner image URL:', image);
  
  return (
    <div className="banner-container">
      <div 
        className="banner-image-wrapper"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 48%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f0f0f0', // Fallback background
          minHeight: '200px' // Ensure container has height
        }}
      >
        <div className="banner-text-overlay">
          <h2 className="banner-text">
            {text}
          </h2>
          {button && (
            <button 
              onClick={button.onClick}
              className="banner-button"
            >
              {button.text}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Banner