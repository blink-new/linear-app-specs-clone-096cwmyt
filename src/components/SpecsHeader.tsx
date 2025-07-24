import React from 'react'
import { Search, Filter, MoreHorizontal, Archive, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu'

interface SpecsHeaderProps {
  title: string
  description: string
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCount: number
}

export function SpecsHeader({ 
  title, 
  description, 
  searchQuery, 
  onSearchChange, 
  selectedCount 
}: SpecsHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      {/* Title Section */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Search and Actions */}
      <div className="px-6 pb-4 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search specs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {/* Filter Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>

        {/* Bulk Actions (shown when specs are selected) */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <Archive className="w-4 h-4" />
              Archive
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}