import { useMemo } from 'react'
import type { NavBarConfig } from './AbstractNavBar'
import type { NavigationItem, SearchResult, FilterGroup } from '../SlideMenu'

export interface UseNavBarConfigProps {
  // Required
  logoText: string
  logoLink?: string
  
  // Navigation
  navigationLinks?: Array<{
    to: string
    label: string
    className?: string
  }>
  
  mobileNavigationItems?: NavigationItem[]
  
  // Search
  searchConfig?: {
    enabled: boolean
    placeholder?: string
    searchIcon?: string
    searchFunction: (query: string) => SearchResult[]
    emptyMessage?: string
    noResultsMessage?: string
  }
  
  // Filter  
  filterConfig?: {
    enabled: boolean
    filterIcon?: string
    groups: FilterGroup[]
    selectedFilter: string
    onFilterSelect: (filterId: string) => void
    clearLabel?: string
  }
  
  // Action buttons (cart, profile, etc.)
  actionButtons?: Array<{
    id: string
    icon: string
    label: string
    onClick: () => void
    badge?: string | number
    className?: string
  }>
  
  // Assets
  menuIcon?: string
  searchIcon?: string
  filterIcon?: string
  
  // Styling
  className?: string
  responsive?: {
    hideLinksOnMobile?: boolean
    mobileBreakpoint?: string
  }
}

export const useNavBarConfig = (props: UseNavBarConfigProps): NavBarConfig => {
  return useMemo(() => {
    const config: NavBarConfig = {
      logo: {
        text: props.logoText,
        to: props.logoLink || '/',
      },
      
      links: props.navigationLinks || [],
      
      mobileNavigation: props.mobileNavigationItems || [],
      
      actionButtons: props.actionButtons || [],
      
      menu: {
        icon: props.menuIcon || '/default-menu-icon.svg',
        title: 'Menu'
      },
      
      className: props.className,
      responsive: props.responsive
    }
    
    // Add search if enabled
    if (props.searchConfig?.enabled) {
      config.search = {
        enabled: true,
        placeholder: props.searchConfig.placeholder || 'Search...',
        icon: props.searchConfig.searchIcon || props.searchIcon || '/default-search-icon.svg',
        searchFunction: props.searchConfig.searchFunction,
        emptyStateMessage: props.searchConfig.emptyMessage,
        noResultsMessage: props.searchConfig.noResultsMessage
      }
    }
    
    // Add filter if enabled
    if (props.filterConfig?.enabled) {
      config.filter = {
        enabled: true,
        icon: props.filterConfig.filterIcon || props.filterIcon || '/default-filter-icon.svg',
        groups: props.filterConfig.groups,
        selectedFilter: props.filterConfig.selectedFilter,
        onFilterSelect: props.filterConfig.onFilterSelect,
        clearFilterLabel: props.filterConfig.clearLabel
      }
    }
    
    return config
  }, [props])
}

// Helper function for quick setup
export const createSimpleNavBarConfig = (
  logoText: string,
  navigationLinks: Array<{ to: string; label: string }>,
  actionButtons: Array<{
    id: string
    icon: string
    label: string
    onClick: () => void
    badge?: string | number
  }> = []
): NavBarConfig => {
  return {
    logo: {
      text: logoText,
      to: '/'
    },
    links: navigationLinks,
    mobileNavigation: [
      ...navigationLinks.map((link, index) => ({
        to: link.to,
        label: link.label,
        delay: (index + 1) * 100
      })),
      ...actionButtons.map((button, index) => ({
        to: '#',
        label: button.label,
        icon: button.icon,
        badge: button.badge,
        onClick: button.onClick,
        delay: (navigationLinks.length + index + 1) * 100
      }))
    ],
    actionButtons,
    menu: {
      icon: '/default-menu-icon.svg',
      title: 'Menu'
    }
  }
}