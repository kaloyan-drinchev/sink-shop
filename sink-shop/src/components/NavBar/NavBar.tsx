import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../../contexts/CartContext'
import burgerMenuIcon from '../../assets/burger-menu-svgrepo-com.svg'
import paperBagIcon from '../../assets/icons8-paper-bag-50.png'
import './NavBar.css'

function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const cartCount = getCartCount()
  
  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600">
            SinkShop
          </Link>
          
          {/* Navigation Tabs - Center (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4 lg:gap-6">
            <Link 
              to="/" 
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium"
            >
              {t('navigation.home')}
            </Link>
            
            <Link 
              to="/products" 
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium"
            >
              {t('navigation.allProducts')}
            </Link>
            
            <Link 
              to="/category/wooden" 
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium"
            >
              {t('categories.wooden')}
            </Link>
            <Link 
              to="/category/natural-stone" 
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium"
            >
              {t('categories.naturalStone')}
            </Link>
            <Link 
              to="/category/pedestal" 
              className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium"
            >
              {t('categories.pedestal')}
            </Link>
          </div>

          {/* Mobile Menu Button (Visible on mobile) & Cart */}
          <div className="flex items-center gap-3">
            {/* Burger Menu Button - Mobile Only */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <img src={burgerMenuIcon} alt="Menu" className="w-6 h-6" />
            </button>

            {/* Cart - Right */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative flex items-center text-gray-700 hover:text-gray-800 transition-all duration-200 ease-in-out p-2 rounded-md hover:bg-gray-50 hover:scale-105 hover:shadow-sm"
            >
              <img src={paperBagIcon} alt={t('navigation.cart')} className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1 transition-transform duration-200 hover:scale-110">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-all duration-300"
            onClick={handleCloseMenu}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}
          ></div>
          
          {/* Sliding Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-slideIn">
            {/* Menu Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{t('navigation.menu')}</h2>
              <button 
                onClick={handleCloseMenu}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-6">
              <Link 
                to="/" 
                className="block px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards"
                onClick={handleCloseMenu}
              >
                {t('navigation.home')}
              </Link>
              
              <Link 
                to="/products" 
                className="block px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards animation-delay-200"
                onClick={handleCloseMenu}
              >
                {t('navigation.allProducts')}
              </Link>
              
              <Link 
                to="/category/wooden" 
                className="block px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards animation-delay-300"
                onClick={handleCloseMenu}
              >
                {t('categories.wooden')}
              </Link>
              
              <Link 
                to="/category/natural-stone" 
                className="block px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards animation-delay-400"
                onClick={handleCloseMenu}
              >
                {t('categories.naturalStone')}
              </Link>
              
              <Link 
                to="/category/pedestal" 
                className="block px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards animation-delay-500"
                onClick={handleCloseMenu}
              >
                {t('categories.pedestal')}
              </Link>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Link 
                  to="/cart" 
                  className="flex items-center justify-between px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-1 animate-slideInFromRight opacity-0 animation-fill-forwards animation-delay-600"
                  onClick={handleCloseMenu}
                >
                  <span>{t('navigation.cart')}</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar