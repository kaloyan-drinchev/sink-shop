import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, NavBar, SingleSinkView, SideNavBar, TopBar } from './components'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <TopBar />
        <NavBar />
        <div className="flex flex-col lg:flex-row">
          <SideNavBar />
          <main className="flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Home />} />
              <Route path="/sink/:id" element={<SingleSinkView />} />
              <Route path="/category/wooden" element={<Home />} />
              <Route path="/category/natural-stone" element={<Home />} />
              <Route path="/category/pedestal" element={<Home />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App