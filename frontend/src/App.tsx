import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="h-full w-full flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex-1" style={{ paddingTop: '4rem' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default App 