import React, { useState } from 'react'
import { SpecsTable } from './SpecsTable'
import { SpecsHeader } from './SpecsHeader'

interface MainContentProps {
  currentView: string
  onSpecSelect: (specId: string) => void
}

export function MainContent({ currentView, onSpecSelect }: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])

  const getViewTitle = () => {
    switch (currentView) {
      case 'inbox':
        return 'Inbox'
      case 'specs':
        return 'All Specs'
      case 'assigned':
        return 'Assigned to me'
      case 'archived':
        return 'Archived'
      case 'team':
        return 'Team'
      case 'cycles':
        return 'Cycles'
      case 'settings':
        return 'Settings'
      default:
        return 'All Specs'
    }
  }

  const getViewDescription = () => {
    switch (currentView) {
      case 'inbox':
        return 'Specs that need your attention'
      case 'specs':
        return 'All specifications in your workspace'
      case 'assigned':
        return 'Specs assigned to you'
      case 'archived':
        return 'Archived specifications'
      default:
        return 'Manage your specifications'
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <SpecsHeader 
        title={getViewTitle()}
        description={getViewDescription()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedSpecs.length}
      />
      
      <div className="flex-1 overflow-hidden">
        <SpecsTable 
          currentView={currentView}
          searchQuery={searchQuery}
          selectedSpecs={selectedSpecs}
          onSelectedSpecsChange={setSelectedSpecs}
          onSpecSelect={onSpecSelect}
        />
      </div>
    </div>
  )
}