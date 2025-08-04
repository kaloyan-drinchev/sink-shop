import { useTranslation } from 'react-i18next'

function SideNavBar() {
  const { t } = useTranslation()

  return (
    <aside className="w-full lg:w-64 bg-gray-50 border-b lg:border-r lg:border-b-0 border-gray-200">
      <div className="p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {t('filters.category')}
        </h2>
        {/* Search and filters content will go here */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">{t('navigation.search')}</p>
          <p>{t('navigation.filters')}</p>
        </div>
      </div>
    </aside>
  )
}

export default SideNavBar