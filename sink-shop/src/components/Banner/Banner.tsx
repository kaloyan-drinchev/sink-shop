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
  return (
    <div className="banner-container">
      <div className="banner-image-wrapper">
        <img 
          src={image}
          alt={imageAlt}
          className="banner-image"
        />
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