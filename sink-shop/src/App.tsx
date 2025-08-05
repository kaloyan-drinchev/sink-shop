import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Home, NavBar, SingleSinkView, SideNavBar, TopBar, Cart } from './components'
import { CartProvider } from './contexts/CartContext'
import { FilterProvider } from './components/NavBar/NavBar'
import { SearchProvider } from './contexts/SearchContext'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isCartPage = location.pathname === '/cart'
  const shouldHideSideBar = isHomePage || isCartPage

  return (
    <div className="min-h-screen">
      <TopBar />
      <NavBar />
      {shouldHideSideBar ? (
        <main className="w-full min-h-screen">
          {children}
        </main>
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* Hide SideNavBar on mobile (below lg breakpoint) */}
          <div className="hidden lg:block">
            <SideNavBar />
          </div>
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>
      )}
    </div>
  )
}

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Home />} />
        <Route path="/sink/:id" element={<SingleSinkView />} />
        <Route path="/category/wooden" element={<Home />} />
        <Route path="/category/natural-stone" element={<Home />} />
        <Route path="/category/mramor" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<div className="p-6 text-center"><h2 className="text-2xl font-bold">Checkout - Coming Soon!</h2></div>} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <CartProvider>
      <FilterProvider>
        <SearchProvider>
          <Router>
            <AppContent />
          </Router>
        </SearchProvider>
      </FilterProvider>
    </CartProvider>
  )
}

export default App