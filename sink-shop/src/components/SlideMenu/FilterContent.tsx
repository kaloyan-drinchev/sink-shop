import React from 'react'

export interface FilterOption {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  group?: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

export interface FilterContentProps {
  groups: FilterGroup[]
  selectedFilter: string
  onFilterSelect: (filterId: string) => void
  clearFilterLabel?: string
  showClearFilter?: boolean
  className?: string
  groupClassName?: string
  optionClassName?: string
  selectedOptionClassName?: string
  clearFilterClassName?: string
}

const FilterContent: React.FC<FilterContentProps> = ({
  groups,
  selectedFilter,
  onFilterSelect,
  clearFilterLabel = 'Clear Filter',
  showClearFilter = true,
  className = '',
  groupClassName = '',
  optionClassName = '',
  selectedOptionClassName = 'bg-blue-50 text-blue-600',
  clearFilterClassName = ''
}) => {
  const handleFilterSelect = (filterId: string) => {
    onFilterSelect(filterId)
  }

  const renderCheckIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path 
        fillRule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clipRule="evenodd" 
      />
    </svg>
  )

  return (
    <div className={`filter-content ${className}`}>
      {groups.map((group) => (
        <div key={group.id} className={`filter-group ${groupClassName}`}>
          <h3 className="filter-group-title">{group.label}</h3>
          
          {group.options.map((option) => {
            const isSelected = selectedFilter === option.id
            
            return (
              <button
                key={option.id}
                onClick={() => handleFilterSelect(option.id)}
                className={`
                  filter-option
                  ${optionClassName}
                  ${isSelected ? selectedOptionClassName : ''}
                `}
              >
                <div className="filter-option-content">
                  {option.icon && (
                    <span className="filter-option-icon">{option.icon}</span>
                  )}
                  <div className="filter-option-text">
                    <span className="filter-option-label">{option.label}</span>
                    {option.description && (
                      <span className="filter-option-description">{option.description}</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <span className="filter-option-check">
                    {renderCheckIcon()}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}

      {/* Clear Filter */}
      {showClearFilter && selectedFilter && (
        <div className="filter-clear-section">
          <button
            onClick={() => handleFilterSelect('')}
            className={`filter-clear-button ${clearFilterClassName}`}
          >
            <span className="filter-clear-label">{clearFilterLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterContent