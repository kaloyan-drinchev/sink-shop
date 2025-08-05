import React from 'react'
import './SlideMenu.css'

export interface SlideMenuProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
  maxWidth?: string
  position?: 'left' | 'right'
  backdrop?: {
    blur?: boolean
    opacity?: number
    clickToClose?: boolean
  }
  animation?: {
    duration?: string
    easing?: string
  }
  className?: string
  headerClassName?: string
  contentClassName?: string
}

const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-80',
  maxWidth = 'max-w-[85vw]',
  position = 'right',
  backdrop = {
    blur: true,
    opacity: 0.15,
    clickToClose: true
  },
  animation = {
    duration: '300ms',
    easing: 'ease-in-out'
  },
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  if (!isOpen) return null

  const handleBackdropClick = () => {
    if (backdrop.clickToClose) {
      onClose()
    }
  }

  const slideDirection = position === 'right' ? 'slideInFromRight' : 'slideInFromLeft'
  const positionClass = position === 'right' ? 'right-0' : 'left-0'

  return (
    <div className="slide-menu-overlay">
      {/* Backdrop */}
      <div 
        className={`slide-menu-backdrop ${backdrop.blur ? 'slide-menu-backdrop-blur' : ''}`}
        onClick={handleBackdropClick}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backdrop.opacity})`,
          transitionDuration: animation.duration,
          transitionTimingFunction: animation.easing,
          ...(backdrop.blur && {
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          })
        }}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`slide-menu-panel ${width} ${maxWidth} ${positionClass} ${slideDirection} ${className}`}
        style={{
          animationDuration: animation.duration,
          animationTimingFunction: animation.easing
        }}
      >
        {/* Header */}
        <div className={`slide-menu-header ${headerClassName}`}>
          <h2 className="slide-menu-title">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="slide-menu-close-button"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={`slide-menu-content ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SlideMenu