# Abstract NavBar Component

A completely configurable and reusable navigation bar component that works with any React project. Features mobile responsiveness, search functionality, filtering, and sliding menu overlays.

## Quick Start

```bash
# Copy the entire ReusableNavBar folder to your project
cp -r ReusableNavBar/ your-project/src/components/
```

## Basic Usage

### 1. Simple Navigation Bar

```tsx
import { AbstractNavBar, createSimpleNavBarConfig } from './ReusableNavBar'

const config = createSimpleNavBarConfig(
  'MyApp', // Logo text
  [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' }
  ],
  [
    {
      id: 'cart',
      icon: '/cart.svg',
      label: 'Cart',
      onClick: () => navigate('/cart'),
      badge: cartCount
    }
  ]
)

<AbstractNavBar config={config} />
```

### 2. Advanced Configuration

```tsx
import { AbstractNavBar, useNavBarConfig } from './ReusableNavBar'

const config = useNavBarConfig({
  logoText: 'MyApp',
  logoLink: '/',
  
  navigationLinks: [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' }
  ],
  
  searchConfig: {
    enabled: true,
    placeholder: 'Search products...',
    searchFunction: (query) => {
      return myData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ).map(item => ({
        id: item.id,
        title: item.name,
        subtitle: item.description,
        image: item.image,
        price: `$${item.price}`,
        onClick: (result) => navigate(`/product/${result.id}`)
      }))
    }
  },
  
  filterConfig: {
    enabled: true,
    groups: [
      {
        id: 'sort',
        label: 'SORT BY',
        options: [
          { id: 'price-asc', label: 'Price: Low to High' },
          { id: 'price-desc', label: 'Price: High to Low' },
          { id: 'newest', label: 'Newest' }
        ]
      }
    ],
    selectedFilter: currentFilter,
    onFilterSelect: setCurrentFilter
  },
  
  actionButtons: [
    {
      id: 'cart',
      icon: '/cart.svg',
      label: 'Cart',
      onClick: () => navigate('/cart'),
      badge: cartCount
    }
  ]
})

<AbstractNavBar config={config} />
```

## Configuration Reference

### NavBarConfig Interface

```tsx
interface NavBarConfig {
  // Branding
  logo: {
    text?: string           // Logo text
    image?: string          // Logo image URL
    to: string             // Logo link destination
    className?: string     // Custom logo styles
  }
  
  // Desktop navigation links
  links: NavBarLink[]
  
  // Mobile navigation items (with animations)
  mobileNavigation: NavigationItem[]
  
  // Action buttons (cart, profile, etc.)
  actionButtons: NavBarButton[]
  
  // Search configuration (optional)
  search?: {
    enabled: boolean
    placeholder: string
    icon: string
    searchFunction: (query: string) => SearchResult[]
    emptyStateMessage?: string
    noResultsMessage?: string
  }
  
  // Filter configuration (optional)
  filter?: {
    enabled: boolean
    icon: string
    groups: FilterGroup[]
    selectedFilter: string
    onFilterSelect: (filterId: string) => void
    clearFilterLabel?: string
  }
  
  // Mobile menu configuration
  menu: {
    icon: string           // Hamburger menu icon
    title: string          // Menu panel title
  }
  
  // Styling options
  className?: string
  containerClassName?: string
  logoClassName?: string
  linksClassName?: string
  buttonsClassName?: string
  
  // Responsive behavior
  responsive?: {
    hideLinksOnMobile?: boolean      // Hide nav links on mobile
    hideLinksOnTablet?: boolean      // Hide nav links on tablet
    mobileBreakpoint?: string        // CSS breakpoint (default: 'md')
    tabletBreakpoint?: string        // CSS breakpoint (default: 'lg')
  }
}
```

### NavBarButton Interface

```tsx
interface NavBarButton {
  id: string                    // Unique identifier
  icon: string                  // Button icon URL
  label: string                 // Accessibility label
  onClick: () => void           // Click handler
  badge?: string | number       // Badge content (cart count, etc.)
  className?: string            // Custom button styles
  showOnMobile?: boolean        // Show on mobile devices
  showOnDesktop?: boolean       // Show on desktop devices
}
```

### SearchResult Interface

```tsx
interface SearchResult {
  id: string                    // Unique identifier
  title: string                 // Main title
  subtitle?: string             // Description
  image?: string                // Result image URL
  price?: string                // Price display
  onClick: (result: SearchResult) => void  // Click handler
}
```

## Pre-built Configurations

### E-commerce Store

```tsx
const ecommerceConfig = useNavBarConfig({
  logoText: 'MyStore',
  navigationLinks: [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/deals', label: 'Deals' }
  ],
  searchConfig: {
    enabled: true,
    placeholder: 'Search products...',
    searchFunction: searchProducts
  },
  filterConfig: {
    enabled: true,
    groups: sortAndFilterGroups,
    selectedFilter: currentFilter,
    onFilterSelect: setCurrentFilter
  },
  actionButtons: [
    {
      id: 'wishlist',
      icon: '/heart.svg',
      label: 'Wishlist',
      onClick: () => navigate('/wishlist'),
      badge: wishlistCount
    },
    {
      id: 'cart',
      icon: '/cart.svg', 
      label: 'Cart',
      onClick: () => navigate('/cart'),
      badge: cartCount
    }
  ]
})
```

### Blog/Content Site

```tsx
const blogConfig = createSimpleNavBarConfig(
  'MyBlog',
  [
    { to: '/', label: 'Home' },
    { to: '/articles', label: 'Articles' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ],
  [
    {
      id: 'search',
      icon: '/search.svg',
      label: 'Search',
      onClick: () => setSearchOpen(true)
    }
  ]
)
```

### SaaS Application

```tsx
const saasConfig = useNavBarConfig({
  logoText: 'MyApp',
  navigationLinks: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
    { to: '/analytics', label: 'Analytics' }
  ],
  actionButtons: [
    {
      id: 'notifications',
      icon: '/bell.svg',
      label: 'Notifications',
      onClick: () => setNotificationsOpen(true),
      badge: unreadCount
    },
    {
      id: 'profile',
      icon: '/avatar.svg',
      label: 'Profile',
      onClick: () => navigate('/profile')
    }
  ]
})
```

## Responsive Behavior

The NavBar automatically adapts to different screen sizes:

### Mobile (< md breakpoint)
- Navigation links hidden
- Mobile menu button shown
- Search/filter buttons shown (if enabled)
- Action buttons responsive based on configuration

### Desktop (≥ md breakpoint)
- Navigation links shown
- Mobile menu button hidden
- Search/filter buttons hidden
- Action buttons shown

### Custom Breakpoints

```tsx
const config = {
  // ... other config
  responsive: {
    hideLinksOnMobile: true,
    mobileBreakpoint: 'lg',     // Use 'lg' instead of 'md'
    hideLinksOnTablet: false
  }
}
```

## Styling Customization

### CSS Classes

```tsx
const config = {
  // ... other config
  className: 'custom-navbar',
  containerClassName: 'max-w-7xl mx-auto',
  logoClassName: 'custom-logo',
  linksClassName: 'custom-nav-links',
  buttonsClassName: 'custom-action-buttons'
}
```

### Tailwind CSS Support

The component is built with Tailwind CSS classes but can be customized:

```css
/* Custom styles */
.custom-navbar {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
}

.custom-logo {
  @apply text-white font-extrabold;
}

.custom-nav-links a {
  @apply text-white/80 hover:text-white;
}
```

## Integration Examples

### Next.js

```tsx
// components/Layout.tsx
import { AbstractNavBar } from '../components/ReusableNavBar'
import { useMyNavBarConfig } from '../hooks/useMyNavBarConfig'

export default function Layout({ children }) {
  const navConfig = useMyNavBarConfig()
  
  return (
    <div>
      <AbstractNavBar config={navConfig} />
      <main>{children}</main>
    </div>
  )
}
```

### React Router

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AbstractNavBar } from './components/ReusableNavBar'

function App() {
  return (
    <BrowserRouter>
      <AbstractNavBar config={myConfig} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## Dependencies

### Required
- React 16.8+ (hooks support)
- React Router DOM (for navigation)

### Optional
- Tailwind CSS (for styling)
- TypeScript (for type safety)

## Migration from Hardcoded NavBars

1. **Extract navigation data** into configuration objects
2. **Replace hardcoded components** with `<AbstractNavBar>`
3. **Configure search/filter functions** for your data
4. **Update styling** using className props
5. **Test responsive behavior** on different screen sizes

---

**Ready to use in any React project! 🚀**

Perfect for e-commerce stores, blogs, SaaS applications, portfolios, and more.