import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { CommandPalette } from './components/CommandPalette'
import { SpecDetail } from './components/SpecDetail'

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [currentView, setCurrentView] = useState('specs')
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null)

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsCommandPaletteOpen(true)
    }
  }

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      {selectedSpecId ? (
        <SpecDetail 
          specId={selectedSpecId} 
          onBack={() => setSelectedSpecId(null)} 
        />
      ) : (
        <MainContent 
          currentView={currentView} 
          onSpecSelect={setSelectedSpecId}
        />
      )}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  )
}

export default App