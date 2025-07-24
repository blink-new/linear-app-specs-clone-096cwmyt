import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from './ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { 
  FileText, 
  Search, 
  Settings, 
  Users, 
  Calendar,
  Plus,
  Archive,
  Star,
  Inbox
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [searchValue, setSearchValue] = useState('')

  const commands = [
    {
      group: 'Actions',
      items: [
        { id: 'create-spec', label: 'Create new spec', icon: Plus, shortcut: 'C' },
        { id: 'search', label: 'Search specs', icon: Search, shortcut: '/' },
      ]
    },
    {
      group: 'Navigation',
      items: [
        { id: 'inbox', label: 'Go to Inbox', icon: Inbox, shortcut: 'G I' },
        { id: 'specs', label: 'Go to All Specs', icon: FileText, shortcut: 'G S' },
        { id: 'assigned', label: 'Go to Assigned', icon: Star, shortcut: 'G A' },
        { id: 'archived', label: 'Go to Archived', icon: Archive, shortcut: 'G R' },
        { id: 'team', label: 'Go to Team', icon: Users, shortcut: 'G T' },
        { id: 'cycles', label: 'Go to Cycles', icon: Calendar, shortcut: 'G C' },
        { id: 'settings', label: 'Go to Settings', icon: Settings, shortcut: 'G ,' },
      ]
    },
    {
      group: 'Recent Specs',
      items: [
        { id: 'spec-001', label: 'User Authentication System Specification', icon: FileText },
        { id: 'spec-002', label: 'Payment Gateway Integration Requirements', icon: FileText },
        { id: 'spec-003', label: 'Mobile App Navigation Specification', icon: FileText },
      ]
    }
  ]

  const handleSelect = (commandId: string) => {
    console.log('Selected command:', commandId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-0 shadow-md">
          <CommandInput 
            placeholder="Type a command or search..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-96">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {commands.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => handleSelect(item.id)}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <div className="flex gap-1">
                        {item.shortcut.split(' ').map((key, index) => (
                          <kbd 
                            key={index}
                            className="px-1.5 py-0.5 text-xs bg-muted rounded"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}