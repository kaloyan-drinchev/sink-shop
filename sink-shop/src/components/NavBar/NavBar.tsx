import React, { useState, createContext, useContext } from 'react'
import { AbstractNavBar } from '../ReusableNavBar'
import { useSinkShopNavBarConfig } from '../ReusableNavBar/SinkShopNavBarConfig'
import './NavBar.css'
import '../SlideMenu/SlideMenuContent.css'

// Filter Context - Keep for backward compatibility
const FilterContext = createContext<{
  currentFilter: string
  setCurrentFilter: (filter: string) => void
}>({
  currentFilter: '',
  setCurrentFilter: () => {}
})

export const useFilter = () => useContext(FilterContext)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentFilter, setCurrentFilter] = useState('')
  
  return (
    <FilterContext.Provider value={{ currentFilter, setCurrentFilter }}>
      {children}
    </FilterContext.Provider>
  )
}

function NavBar() {
  const config = useSinkShopNavBarConfig()
  
  return <AbstractNavBar config={config} />
}

export default NavBar