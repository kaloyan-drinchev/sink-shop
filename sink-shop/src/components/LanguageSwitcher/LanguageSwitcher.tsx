import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex gap-1 sm:gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('bg')}
        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
          i18n.language === 'bg'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        BG
      </button>
    </div>
  )
}

export default LanguageSwitcher