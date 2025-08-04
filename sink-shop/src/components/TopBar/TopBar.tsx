import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'

function TopBar() {
  const { t } = useTranslation()

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex justify-between items-center">
          {/* Contact Information - Always visible */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            {/* Email */}
            <div className="flex items-center gap-1 sm:gap-2">
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              <span>{t('contact.email')}</span>
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-1 sm:gap-2">
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              <span>{t('contact.phone')}</span>
            </div>
          </div>
          
          {/* Language Switcher - Always visible */}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default TopBar