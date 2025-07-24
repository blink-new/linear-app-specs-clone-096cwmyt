import React from 'react'
import { 
  FileText, 
  Settings, 
  Users, 
  Calendar,
  Search,
  Plus,
  ChevronDown,
  Inbox,
  Archive,
  Star
} from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navigationItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: 3 },
    { id: 'specs', label: 'All Specs', icon: FileText, count: 24 },
    { id: 'assigned', label: 'Assigned to me', icon: Star, count: 8 },
    { id: 'archived', label: 'Archived', icon: Archive, count: 0 },
  ]

  const teamItems = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'cycles', label: 'Cycles', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Team Selector */}
      <div className="p-4 border-b border-border">
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground">SL</span>
            </div>
            <span className="font-medium">SpecLinear</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => {/* TODO: Open command palette */}}
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <div className="ml-auto flex gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">K</kbd>
          </div>
        </Button>
      </div>

      {/* Create Spec Button */}
      <div className="px-4 pb-4">
        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Create Spec
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "secondary" : "ghost"}
            className="w-full justify-between p-2 h-auto"
            onClick={() => onViewChange(item.id)}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {item.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Team Section */}
      <div className="px-4 py-4 border-t border-border space-y-1">
        {teamItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 p-2 h-auto"
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">john@company.com</span>
          </div>
        </Button>
      </div>
    </div>
  )
}