// Main components
export { default as AbstractNavBar } from './AbstractNavBar'
export type { AbstractNavBarProps, NavBarConfig, NavBarButton, NavBarLink } from './AbstractNavBar'

// Configuration utilities
export { useNavBarConfig, createSimpleNavBarConfig } from './useNavBarConfig'
export type { UseNavBarConfigProps } from './useNavBarConfig'

// Sink Shop specific configuration
export { useSinkShopNavBarConfig } from './SinkShopNavBarConfig'

// Re-export SlideMenu components for convenience
export * from '../SlideMenu'