import React from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react'
import { Button } from './ui/button'

interface Spec {
  id: string
  title: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'draft' | 'review' | 'approved' | 'implemented'
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  cycle: string
  createdAt: string
  updatedAt: string
  comments: number
  attachments: number
}

interface SpecsTableProps {
  currentView: string
  searchQuery: string
  selectedSpecs: string[]
  onSelectedSpecsChange: (specs: string[]) => void
  onSpecSelect: (specId: string) => void
}

// Mock data
const mockSpecs: Spec[] = [
  {
    id: 'SPEC-001',
    title: 'User Authentication System Specification',
    priority: 'urgent',
    status: 'review',
    assignee: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
    cycle: 'Q1 2024',
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    comments: 5,
    attachments: 2
  },
  {
    id: 'SPEC-002',
    title: 'Payment Gateway Integration Requirements',
    priority: 'high',
    status: 'draft',
    assignee: { name: 'Bob Smith', avatar: '', initials: 'BS' },
    cycle: 'Q1 2024',
    createdAt: '2024-01-14',
    updatedAt: '1 day ago',
    comments: 3,
    attachments: 1
  },
  {
    id: 'SPEC-003',
    title: 'Mobile App Navigation Specification',
    priority: 'medium',
    status: 'approved',
    assignee: { name: 'Carol Davis', avatar: '', initials: 'CD' },
    cycle: 'Q1 2024',
    createdAt: '2024-01-13',
    updatedAt: '3 days ago',
    comments: 8,
    attachments: 0
  },
  {
    id: 'SPEC-004',
    title: 'Database Schema Design Document',
    priority: 'high',
    status: 'implemented',
    assignee: { name: 'David Wilson', avatar: '', initials: 'DW' },
    cycle: 'Q4 2023',
    createdAt: '2024-01-10',
    updatedAt: '1 week ago',
    comments: 12,
    attachments: 4
  },
  {
    id: 'SPEC-005',
    title: 'API Rate Limiting Specification',
    priority: 'low',
    status: 'draft',
    assignee: { name: 'Eva Brown', avatar: '', initials: 'EB' },
    cycle: 'Q2 2024',
    createdAt: '2024-01-08',
    updatedAt: '2 weeks ago',
    comments: 1,
    attachments: 0
  }
]

const priorityColors = {
  urgent: 'linear-priority-urgent',
  high: 'linear-priority-high',
  medium: 'linear-priority-medium',
  low: 'linear-priority-low'
}

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  review: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  implemented: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
}

export function SpecsTable({ 
  currentView, 
  searchQuery, 
  selectedSpecs, 
  onSelectedSpecsChange,
  onSpecSelect 
}: SpecsTableProps) {
  const filteredSpecs = mockSpecs.filter(spec => 
    spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedSpecsChange(filteredSpecs.map(spec => spec.id))
    } else {
      onSelectedSpecsChange([])
    }
  }

  const handleSelectSpec = (specId: string, checked: boolean) => {
    if (checked) {
      onSelectedSpecsChange([...selectedSpecs, specId])
    } else {
      onSelectedSpecsChange(selectedSpecs.filter(id => id !== specId))
    }
  }

  const isAllSelected = filteredSpecs.length > 0 && selectedSpecs.length === filteredSpecs.length
  const isIndeterminate = selectedSpecs.length > 0 && selectedSpecs.length < filteredSpecs.length

  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card border-b border-border">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all specs"
                className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                {...(isIndeterminate && { 'data-state': 'indeterminate' })}
              />
            </TableHead>
            <TableHead className="w-8"></TableHead>
            <TableHead>Spec</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-32">Assignee</TableHead>
            <TableHead className="w-24">Cycle</TableHead>
            <TableHead className="w-32">Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSpecs.map((spec) => (
            <TableRow 
              key={spec.id} 
              className="hover:bg-muted/50 cursor-pointer group"
              onClick={() => onSpecSelect(spec.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedSpecs.includes(spec.id)}
                  onCheckedChange={(checked) => handleSelectSpec(spec.id, checked as boolean)}
                  aria-label={`Select spec ${spec.id}`}
                />
              </TableCell>
              <TableCell>
                <div className={`w-2 h-2 rounded-full ${priorityColors[spec.priority]}`} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{spec.title}</span>
                    <div className="flex items-center gap-1">
                      {spec.comments > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-xs">{spec.comments}</span>
                        </div>
                      )}
                      {spec.attachments > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Paperclip className="w-3 h-3" />
                          <span className="text-xs">{spec.attachments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{spec.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${statusColors[spec.status]}`}
                >
                  {spec.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={spec.assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {spec.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {spec.assignee.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{spec.cycle}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{spec.updatedAt}</span>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredSpecs.length === 0 && (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No specs found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )
}