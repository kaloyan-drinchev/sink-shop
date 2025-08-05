import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SlideMenu, NavigationContent, SearchContent, FilterContent } from '../SlideMenu'
import type { NavigationItem, SearchResult, FilterGroup } from '../SlideMenu'

export interface NavBarButton {
  id: string
  icon: string
  label: string
  onClick: () => void
  badge?: string | number
  className?: string
  showOnMobile?: boolean
  showOnDesktop?: boolean
}

export interface NavBarLink {
  to: string
  label: string
  className?: string
  showOnMobile?: boolean
  showOnDesktop?: boolean
}

export interface NavBarConfig {
  // Branding
  logo: {
    text?: string
    image?: string
    to: string
    className?: string
  }
  
  // Navigation links (desktop)
  links: NavBarLink[]
  
  // Mobile navigation items
  mobileNavigation: NavigationItem[]
  
  // Action buttons (cart, profile, etc.)
  actionButtons: NavBarButton[]
  
  // Search configuration
  search?: {
    enabled: boolean
    placeholder: string
    icon: string
    searchFunction: (query: string) => SearchResult[]
    emptyStateMessage?: string
    noResultsMessage?: string
  }
  
  // Filter configuration
  filter?: {
    enabled: boolean
    icon: string
    groups: FilterGroup[]
    selectedFilter: string
    onFilterSelect: (filterId: string) => void
    clearFilterLabel?: string
  }
  
  // Menu configuration
  menu: {
    icon: string
    title: string
  }
  
  // Styling
  className?: string
  containerClassName?: string
  logoClassName?: string
  linksClassName?: string
  buttonsClassName?: string
  
  // Responsive
  responsive?: {
    hideLinksOnMobile?: boolean
    hideLinksOnTablet?: boolean
    mobileBreakpoint?: string
    tabletBreakpoint?: string
  }
}

export interface AbstractNavBarProps {
  config: NavBarConfig
  className?: string
}

const AbstractNavBar: React.FC<AbstractNavBarProps> = ({ 
  config, 
  className = '' 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  
  const responsive = {
    hideLinksOnMobile: true,
    hideLinksOnTablet: false,
    mobileBreakpoint: 'md',
    tabletBreakpoint: 'lg',
    ...config.responsive
  }
  
  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  const handleCloseSearch = () => {
    setIsSearchMenuOpen(false)
  }
  
  const handleCloseFilter = () => {
    setIsFilterMenuOpen(false)
  }
  
  const handleNavigationItemClick = () => {
    handleCloseMenu()
  }
  
  // Get responsive classes for links
  const getLinkVisibilityClass = () => {
    const classes = []
    if (responsive.hideLinksOnMobile) {
      classes.push(`hidden ${responsive.mobileBreakpoint}:flex`)
    }
    if (responsive.hideLinksOnTablet) {
      classes.push(`${responsive.tabletBreakpoint}:hidden`)
    }
    return classes.join(' ')
  }
  
  // Get mobile button visibility class
  const getMobileButtonClass = (showOnMobile: boolean = true) => {
    return showOnMobile ? `${responsive.mobileBreakpoint}:hidden` : 'hidden'
  }
  
  // Get desktop button visibility class  
  const getDesktopButtonClass = (showOnDesktop: boolean = true) => {
    return showOnDesktop ? `hidden ${responsive.mobileBreakpoint}:flex` : 'hidden'
  }

  return (
    <nav className={`bg-white shadow-lg px-4 sm:px-6 py-4 ${config.className || ''} ${className}`}>
      <div className={`flex justify-between items-center ${config.containerClassName || ''}`}>
        {/* Logo/Brand */}
        <Link 
          to={config.logo.to} 
          className={`text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors ${config.logoClassName || ''}`}
        >
          {config.logo.image ? (
            <img 
              src={config.logo.image} 
              alt={config.logo.text || 'Logo'} 
              className="h-8 sm:h-10"
            />
          ) : (
            config.logo.text
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`${getLinkVisibilityClass()} items-center gap-6 ${config.linksClassName || ''}`}>
          {config.links.map((link, index) => {
            const showOnDesktop = link.showOnDesktop !== false
            const showOnMobile = link.showOnMobile !== false
            
            if (!showOnDesktop && !showOnMobile) return null
            
            let visibilityClass = ''
            if (showOnDesktop && !showOnMobile) {
              visibilityClass = getDesktopButtonClass(true)
            } else if (!showOnDesktop && showOnMobile) {
              visibilityClass = getMobileButtonClass(true)
            }
            
            return (
              <Link
                key={`${link.to}-${index}`}
                to={link.to}
                className={`text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors ${visibilityClass} ${link.className || ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-3 ${config.buttonsClassName || ''}`}>
          {/* Search Button */}
          {config.search?.enabled && (
            <button 
              onClick={() => setIsSearchMenuOpen(!isSearchMenuOpen)}
              className={getMobileButtonClass()}
            >
              <img src={config.search.icon} alt="Search" className="w-6 h-6" />
            </button>
          )}
          
          {/* Filter Button */}
          {config.filter?.enabled && (
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`${getMobileButtonClass()} relative`}
            >
              <img src={config.filter.icon} alt="Filter" className="w-6 h-6" />
              {config.filter.selectedFilter && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          )}
          
          {/* Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={getMobileButtonClass()}
          >
            <img src={config.menu.icon} alt="Menu" className="w-6 h-6" />
          </button>

          {/* Action Buttons */}
          {config.actionButtons.map((button, index) => {
            const showOnDesktop = button.showOnDesktop !== false
            const showOnMobile = button.showOnMobile !== false
            
            if (!showOnDesktop && !showOnMobile) return null
            
            let visibilityClass = ''
            if (showOnDesktop && !showOnMobile) {
              visibilityClass = getDesktopButtonClass(true)
            } else if (!showOnDesktop && showOnMobile) {
              visibilityClass = getMobileButtonClass(false) // Show on mobile for action buttons
            }
            
            return (
              <button
                key={`${button.id}-${index}`}
                onClick={button.onClick}
                className={`relative flex items-center text-gray-700 hover:text-gray-800 transition-all duration-200 ease-in-out p-2 rounded-md hover:bg-gray-50 hover:scale-105 hover:shadow-sm ${visibilityClass} ${button.className || ''}`}
                aria-label={button.label}
              >
                <img 
                  src={button.icon} 
                  alt={button.label} 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200" 
                />
                {button.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1 transition-transform duration-200 hover:scale-110">
                    {typeof button.badge === 'number' && button.badge > 99 ? '99+' : button.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <SlideMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMenu}
        title={config.menu.title}
        className={getMobileButtonClass()}
      >
        <NavigationContent
          items={config.mobileNavigation}
          onItemClick={handleNavigationItemClick}
        />
      </SlideMenu>

      {/* Search Menu Overlay */}
      {config.search?.enabled && (
        <SlideMenu
          isOpen={isSearchMenuOpen}
          onClose={handleCloseSearch}
          title="Search"
          className={getMobileButtonClass()}
        >
          <SearchContent
            placeholder={config.search.placeholder}
            searchIcon={config.search.icon}
            searchFunction={config.search.searchFunction}
            emptyStateMessage={config.search.emptyStateMessage || "Start typing to search..."}
            noResultsMessage={config.search.noResultsMessage || "No results found"}
          />
        </SlideMenu>
      )}

      {/* Filter Menu Overlay */}
      {config.filter?.enabled && (
        <SlideMenu
          isOpen={isFilterMenuOpen}
          onClose={handleCloseFilter}
          title="Filters"
          className={getMobileButtonClass()}
        >
          <FilterContent
            groups={config.filter.groups}
            selectedFilter={config.filter.selectedFilter}
            onFilterSelect={config.filter.onFilterSelect}
            clearFilterLabel={config.filter.clearFilterLabel || "Clear Filter"}
          />
        </SlideMenu>
      )}
    </nav>
  )
}

export default AbstractNavBar