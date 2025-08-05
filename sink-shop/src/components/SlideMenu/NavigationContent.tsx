import React from 'react'
import { Link } from 'react-router-dom'

export interface NavigationItem {
  to: string
  label: string
  icon?: string
  badge?: string | number
  onClick?: () => void
  delay?: number
}

export interface NavigationContentProps {
  items: NavigationItem[]
  onItemClick?: (item: NavigationItem) => void
  className?: string
  itemClassName?: string
  activeItemClassName?: string
  badgeClassName?: string
}

const NavigationContent: React.FC<NavigationContentProps> = ({
  items,
  onItemClick,
  className = '',
  itemClassName = '',
  activeItemClassName = 'text-blue-600 bg-blue-50',
  badgeClassName = 'bg-red-500 text-white'
}) => {
  const handleItemClick = (item: NavigationItem) => {
    if (onItemClick) {
      onItemClick(item)
    }
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <nav className={`navigation-content ${className}`}>
      {items.map((item, index) => (
        <Link
          key={`${item.to}-${index}`}
          to={item.to}
          className={`
            navigation-item
            ${itemClassName}
            ${item.delay ? `animation-delay-${item.delay}` : ''}
          `}
          onClick={() => handleItemClick(item)}
          style={{
            animationDelay: item.delay ? `${item.delay}ms` : undefined
          }}
        >
          <div className="navigation-item-content">
            {item.icon && (
              <img 
                src={item.icon} 
                alt={item.label} 
                className="navigation-item-icon" 
              />
            )}
            <span className="navigation-item-label">{item.label}</span>
          </div>
          {item.badge && (
            <span className={`navigation-item-badge ${badgeClassName}`}>
              {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}

export default NavigationContent