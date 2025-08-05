# Reusable SlideMenu Components

A complete set of reusable slide-out menu components for React applications. Perfect for mobile navigation, search interfaces, and filter panels.

## Quick Start

```bash
# Copy the entire SlideMenu folder to your project
cp -r SlideMenu/ your-project/src/components/
```

## Components Overview

### 🔧 Core Component
- **`SlideMenu`** - Base sliding panel with backdrop and animations

### 📋 Content Components  
- **`NavigationContent`** - Mobile navigation menu with icons and badges
- **`SearchContent`** - Search interface with real-time results
- **`FilterContent`** - Grouped filter options with selections

## Basic Usage

### 1. Navigation Menu

```tsx
import { SlideMenu, NavigationContent } from './SlideMenu'

const navigationItems = [
  { to: '/', label: 'Home', delay: 100 },
  { to: '/products', label: 'Products', delay: 200 },
  { to: '/cart', label: 'Cart', icon: '/cart.png', badge: 3, delay: 300 }
]

<SlideMenu isOpen={isOpen} onClose={onClose} title="Menu">
  <NavigationContent 
    items={navigationItems}
    onItemClick={() => setIsOpen(false)}
  />
</SlideMenu>
```

### 2. Search Interface

```tsx
import { SlideMenu, SearchContent } from './SlideMenu'

const searchFunction = (query: string) => {
  return data.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  ).map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.description,
    image: item.image,
    price: `$${item.price}`,
    onClick: (result) => navigate(`/item/${result.id}`)
  }))
}

<SlideMenu isOpen={isSearchOpen} onClose={onClose} title="Search">
  <SearchContent 
    searchFunction={searchFunction}
    placeholder="Search products..."
    searchIcon="/search.svg"
  />
</SlideMenu>
```

### 3. Filter Panel

```tsx
import { SlideMenu, FilterContent } from './SlideMenu'

const filterGroups = [
  {
    id: 'sort',
    label: 'SORT BY',
    options: [
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'newest', label: 'Newest First' }
    ]
  }
]

<SlideMenu isOpen={isFilterOpen} onClose={onClose} title="Filters">
  <FilterContent 
    groups={filterGroups}
    selectedFilter={currentFilter}
    onFilterSelect={setCurrentFilter}
  />
</SlideMenu>
```

## Advanced Configuration

### SlideMenu Props

```tsx
interface SlideMenuProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string              // default: 'w-80'
  maxWidth?: string          // default: 'max-w-[85vw]'
  position?: 'left' | 'right' // default: 'right'
  backdrop?: {
    blur?: boolean           // default: true
    opacity?: number         // default: 0.15
    clickToClose?: boolean   // default: true
  }
  animation?: {
    duration?: string        // default: '300ms'
    easing?: string         // default: 'ease-in-out'
  }
  className?: string
  headerClassName?: string
  contentClassName?: string
}
```

### Navigation Item Structure

```tsx
interface NavigationItem {
  to: string                 // Route path
  label: string             // Display text
  icon?: string             // Icon image URL
  badge?: string | number   // Badge count/text
  onClick?: () => void      // Custom click handler
  delay?: number            // Animation delay (ms)
}
```

### Search Result Structure

```tsx
interface SearchResult {
  id: string                // Unique identifier
  title: string            // Main title
  subtitle?: string        // Description text
  image?: string           // Result image URL
  price?: string           // Price display
  onClick: (result: SearchResult) => void // Click handler
}
```

### Filter Group Structure

```tsx
interface FilterGroup {
  id: string
  label: string            // Group header
  options: FilterOption[]
}

interface FilterOption {
  id: string              // Unique filter ID
  label: string           // Display text
  description?: string    // Subtitle text
  icon?: React.ReactNode  // Custom icon
  group?: string          // Group association
}
```

## Styling & Customization

### CSS Files Required
```bash
SlideMenu/
├── SlideMenu.css          # Core sliding animations
└── SlideMenuContent.css   # Content component styles
```

### Custom Styling
All components accept `className` props for custom styling:

```tsx
<SlideMenu 
  className="custom-menu"
  headerClassName="custom-header" 
  contentClassName="custom-content"
>
  <NavigationContent 
    className="custom-nav"
    itemClassName="custom-nav-item"
    badgeClassName="custom-badge"
  />
</SlideMenu>
```

### Animation Control
```tsx
<SlideMenu 
  position="left"                    // Slide from left
  animation={{
    duration: "500ms",               // Slower animation
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
  }}
  backdrop={{
    blur: false,                     // No backdrop blur
    opacity: 0.3,                    // Darker backdrop
    clickToClose: false              // Prevent click-to-close
  }}
/>
```

## Accessibility Features

- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatibility  
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ ARIA labels and roles

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Progressive enhancement for older browsers
- ✅ Fallback animations for reduced motion

## Dependencies

### Required
- React 16.8+ (hooks support)
- React Router DOM (for navigation)

### Recommended
- Tailwind CSS (for utility classes)
- TypeScript (for type safety)

## Migration Guide

### From Custom Implementations
1. Replace hardcoded sliding panels with `<SlideMenu>`
2. Extract menu content into appropriate content components
3. Update CSS classes to use provided styles
4. Consolidate state management

### Performance Tips
- Use `React.memo()` for content components with many items
- Implement virtual scrolling for large search results
- Lazy load heavy content until menu opens
- Debounce search inputs (built-in for SearchContent)

## Examples

See the `NavBar.tsx` implementation for real-world usage patterns combining all three content types in a mobile-responsive navigation system.

---

**Ready to copy-paste into any React project! 🚀**