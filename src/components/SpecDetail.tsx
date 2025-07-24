import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Edit3, 
  MoreHorizontal, 
  MessageSquare, 
  Paperclip,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Circle,
  Users,
  Target,
  Clock,
  GripVertical,
  LayoutGrid,
  List,
  GitBranch,
  Eye,
  Save,
  X,
  Plus,
  History,
  Check,
  AlertCircle,
  UserCheck,
  GitCommit,
  FileText,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Settings,
  Code,
  CheckSquare,
  AlertTriangle
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { v4 as uuidv4 } from 'uuid'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CommentSystem } from './CommentSystem'

interface SpecDetailProps {
  specId: string
  onBack: () => void
}

interface UserStory {
  id: string
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
  acceptanceCriteria: string[]
  assignee?: {
    name: string
    avatar: string
    initials: string
  }
  estimatedPoints: number
}

interface Approver {
  id: string
  name: string
  avatar: string
  initials: string
  status: 'pending' | 'approved' | 'rejected'
  approvedAt?: string
  comments?: string
}

interface SpecVersion {
  id: string
  version: string
  description: string
  userStories: UserStory[]
  createdAt: string
  createdBy: {
    name: string
    avatar: string
    initials: string
  }
  changes: {
    type: 'added' | 'modified' | 'removed'
    section: 'description' | 'user-story'
    title: string
    details: string
  }[]
}

interface Spec {
  id: string
  title: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'draft' | 'review' | 'approved' | 'implemented'
  stage: 'requirements' | 'technical-design' | 'implementation-tasks'
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
  description: string
  technicalDesign: string
  implementationTasks: string
  userStories: UserStory[]
  approvers: Approver[]
  versions: SpecVersion[]
  currentVersion: string
  requirementsLocked: boolean
  lockReason?: string
}

// Mock spec data with enhanced features
const mockSpec: Spec = {
  id: 'SPEC-001',
  title: 'User Authentication System Specification',
  priority: 'urgent',
  status: 'review',
  stage: 'requirements',
  assignee: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
  cycle: 'Q1 2024',
  createdAt: '2024-01-15',
  updatedAt: '2 hours ago',
  comments: 5,
  attachments: 2,
  description: 'Comprehensive specification for implementing a secure user authentication system with multi-factor authentication support.',
  technicalDesign: '',
  implementationTasks: '',
  currentVersion: 'v1.2',
  requirementsLocked: false,
  approvers: [
    {
      id: '1',
      name: 'John Smith',
      avatar: '',
      initials: 'JS',
      status: 'approved',
      approvedAt: '2024-01-20T10:30:00Z',
      comments: 'Looks good, approved for implementation'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      avatar: '',
      initials: 'SW',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Mike Davis',
      avatar: '',
      initials: 'MD',
      status: 'rejected',
      approvedAt: '2024-01-19T15:45:00Z',
      comments: 'Need more details on security requirements'
    }
  ],
  versions: [
    {
      id: 'v1.2',
      version: 'v1.2',
      description: 'Enhanced authentication system with improved security measures and better user experience.',
      createdAt: '2024-01-20T14:30:00Z',
      createdBy: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
      changes: [
        {
          type: 'modified',
          section: 'description',
          title: 'Updated security requirements',
          details: 'Added multi-factor authentication requirements'
        },
        {
          type: 'added',
          section: 'user-story',
          title: 'Added MFA setup story',
          details: 'New user story for multi-factor authentication setup'
        }
      ],
      userStories: [
        {
          id: 'US-001',
          title: 'User Registration with Email Verification',
          description: 'As a new user, I want to register for an account using my email address so that I can access the application securely.',
          priority: 'urgent',
          status: 'in-progress',
          estimatedPoints: 8,
          assignee: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
          acceptanceCriteria: [
            'User can enter email address and password on registration form',
            'Password must meet complexity requirements (8+ chars, uppercase, lowercase, number, special char)',
            'System sends verification email to provided email address',
            'User account is created but marked as unverified until email is confirmed',
            'User receives confirmation message after successful registration'
          ]
        },
        {
          id: 'US-002',
          title: 'Secure User Login',
          description: 'As a registered user, I want to log in to my account using my credentials so that I can access my personalized content.',
          priority: 'urgent',
          status: 'todo',
          estimatedPoints: 5,
          assignee: { name: 'Bob Smith', avatar: '', initials: 'BS' },
          acceptanceCriteria: [
            'User can enter email and password on login form',
            'System validates credentials against stored user data',
            'Successful login redirects user to dashboard',
            'Failed login shows appropriate error message',
            'Account locks after 5 consecutive failed attempts'
          ]
        },
        {
          id: 'US-003',
          title: 'Multi-Factor Authentication Setup',
          description: 'As a security-conscious user, I want to enable multi-factor authentication so that my account has an additional layer of security.',
          priority: 'high',
          status: 'todo',
          estimatedPoints: 13,
          assignee: { name: 'Carol Davis', avatar: '', initials: 'CD' },
          acceptanceCriteria: [
            'User can access MFA settings from account preferences',
            'User can enable SMS-based verification',
            'User can set up TOTP authenticator app',
            'System generates backup recovery codes',
            'MFA is required on subsequent logins after enablement'
          ]
        }
      ]
    },
    {
      id: 'v1.1',
      version: 'v1.1',
      description: 'Initial authentication system specification with basic login and registration functionality.',
      createdAt: '2024-01-15T09:00:00Z',
      createdBy: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
      changes: [
        {
          type: 'added',
          section: 'description',
          title: 'Initial specification',
          details: 'Created initial authentication system specification'
        },
        {
          type: 'added',
          section: 'user-story',
          title: 'Added basic user stories',
          details: 'Added registration and login user stories'
        }
      ],
      userStories: [
        {
          id: 'US-001',
          title: 'User Registration with Email Verification',
          description: 'As a new user, I want to register for an account using my email address so that I can access the application securely.',
          priority: 'urgent',
          status: 'todo',
          estimatedPoints: 8,
          assignee: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
          acceptanceCriteria: [
            'User can enter email address and password on registration form',
            'Password must meet complexity requirements',
            'System sends verification email to provided email address',
            'User account is created but marked as unverified until email is confirmed'
          ]
        },
        {
          id: 'US-002',
          title: 'Secure User Login',
          description: 'As a registered user, I want to log in to my account using my credentials so that I can access my personalized content.',
          priority: 'urgent',
          status: 'todo',
          estimatedPoints: 5,
          assignee: { name: 'Bob Smith', avatar: '', initials: 'BS' },
          acceptanceCriteria: [
            'User can enter email and password on registration form',
            'System validates credentials against stored user data',
            'Successful login redirects user to dashboard',
            'Failed login shows appropriate error message'
          ]
        }
      ]
    }
  ],
  userStories: [
    {
      id: 'US-001',
      title: 'User Registration with Email Verification',
      description: 'As a new user, I want to register for an account using my email address so that I can access the application securely.',
      priority: 'urgent',
      status: 'in-progress',
      estimatedPoints: 8,
      assignee: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
      acceptanceCriteria: [
        'User can enter email address and password on registration form',
        'Password must meet complexity requirements (8+ chars, uppercase, lowercase, number, special char)',
        'System sends verification email to provided email address',
        'User account is created but marked as unverified until email is confirmed',
        'User receives confirmation message after successful registration'
      ]
    },
    {
      id: 'US-002',
      title: 'Secure User Login',
      description: 'As a registered user, I want to log in to my account using my credentials so that I can access my personalized content.',
      priority: 'urgent',
      status: 'todo',
      estimatedPoints: 5,
      assignee: { name: 'Bob Smith', avatar: '', initials: 'BS' },
      acceptanceCriteria: [
        'User can enter email and password on login form',
        'System validates credentials against stored user data',
        'Successful login redirects user to dashboard',
        'Failed login shows appropriate error message',
        'Account locks after 5 consecutive failed attempts'
      ]
    },
    {
      id: 'US-003',
      title: 'Multi-Factor Authentication Setup',
      description: 'As a security-conscious user, I want to enable multi-factor authentication so that my account has an additional layer of security.',
      priority: 'high',
      status: 'todo',
      estimatedPoints: 13,
      assignee: { name: 'Carol Davis', avatar: '', initials: 'CD' },
      acceptanceCriteria: [
        'User can access MFA settings from account preferences',
        'User can enable SMS-based verification',
        'User can set up TOTP authenticator app',
        'System generates backup recovery codes',
        'MFA is required on subsequent logins after enablement'
      ]
    }
  ]
}

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

const userStoryStatusColors = {
  'todo': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'done': 'bg-green-500/10 text-green-400 border-green-500/20'
}

const approverStatusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
}

const stageColors = {
  'requirements': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'technical-design': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'implementation-tasks': 'bg-green-500/10 text-green-400 border-green-500/20'
}

const stageIcons = {
  'requirements': FileText,
  'technical-design': Settings,
  'implementation-tasks': CheckSquare
}

// Sortable User Story Component (Simplified)
function SortableUserStory({ story, isCompact }: { story: UserStory; isCompact: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (isCompact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className={`w-3 h-3 rounded-full ${priorityColors[story.priority]}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm text-foreground truncate">{story.title}</h3>
            <Badge variant="outline" className={`text-xs ${userStoryStatusColors[story.status]}`}>
              {story.status === 'in-progress' ? 'In Progress' : story.status === 'todo' ? 'To Do' : 'Done'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{story.description}</p>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {story.estimatedPoints}
          </span>
          {story.assignee && (
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-xs">
                {story.assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-xs">
            {story.acceptanceCriteria.length} criteria
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm">
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Full card view (simplified)
  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border border-border ${isDragging ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing mt-1"
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <div className={`w-3 h-3 rounded-full mt-1 ${priorityColors[story.priority]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{story.title}</h3>
                  <Badge variant="outline" className={userStoryStatusColors[story.status]}>
                    {story.status === 'in-progress' ? 'In Progress' : story.status === 'todo' ? 'To Do' : 'Done'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{story.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {story.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.estimatedPoints} points
                  </span>
                  {story.assignee && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {story.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{story.assignee.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Acceptance Criteria</h4>
              <span className="text-xs text-muted-foreground">
                {story.acceptanceCriteria.length} criteria
              </span>
            </div>
            
            <div className="space-y-2">
              {story.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
                  <Circle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      {criteria}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Version Comparison Dialog
function VersionComparisonDialog({ 
  versions, 
  currentVersionId, 
  onClose 
}: { 
  versions: SpecVersion[]
  currentVersionId: string
  onClose: () => void 
}) {
  const [selectedVersion, setSelectedVersion] = useState<string>(versions[1]?.id || '')
  
  const currentVersion = versions.find(v => v.id === currentVersionId)
  const compareVersion = versions.find(v => v.id === selectedVersion)

  if (!currentVersion || !compareVersion) return null

  return (
    <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Compare Versions: {currentVersion.version} vs {compareVersion.version}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium">Compare with:</label>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {versions.filter(v => v.id !== currentVersionId).map(version => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.version} - {new Date(version.createdAt).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Description Changes</h3>
          <ReactDiffViewer
            oldValue={compareVersion.description}
            newValue={currentVersion.description}
            splitView={true}
            leftTitle={`${compareVersion.version} (${new Date(compareVersion.createdAt).toLocaleDateString()})`}
            rightTitle={`${currentVersion.version} (${new Date(currentVersion.createdAt).toLocaleDateString()})`}
            styles={{
              variables: {
                dark: {
                  diffViewerBackground: '#0d1117',
                  diffViewerColor: '#e6edf3',
                  addedBackground: '#0d4429',
                  addedColor: '#7fb069',
                  removedBackground: '#67060c',
                  removedColor: '#f85149',
                  wordAddedBackground: '#1a7f37',
                  wordRemovedBackground: '#da3633',
                  addedGutterBackground: '#0d4429',
                  removedGutterBackground: '#67060c',
                  gutterBackground: '#21262d',
                  gutterBackgroundDark: '#161b22',
                  highlightBackground: '#264f78',
                  highlightGutterBackground: '#264f78',
                  codeFoldGutterBackground: '#21262d',
                  codeFoldBackground: '#262c36',
                  emptyLineBackground: '#21262d',
                  gutterColor: '#8b949e',
                  addedGutterColor: '#7fb069',
                  removedGutterColor: '#f85149',
                  codeFoldContentColor: '#8b949e',
                  diffViewerTitleBackground: '#161b22',
                  diffViewerTitleColor: '#e6edf3',
                  diffViewerTitleBorderColor: '#30363d'
                }
              }
            }}
            useDarkTheme={true}
          />
        </div>

        {/* User Stories Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-4">User Stories Changes</h3>
          <div className="space-y-4">
            {currentVersion.userStories.map(currentStory => {
              const oldStory = compareVersion.userStories.find(s => s.id === currentStory.id)
              
              if (!oldStory) {
                return (
                  <div key={currentStory.id} className="border border-green-500/20 rounded-lg p-4 bg-green-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Added User Story</span>
                    </div>
                    <h4 className="font-medium">{currentStory.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{currentStory.description}</p>
                  </div>
                )
              }

              const hasChanges = JSON.stringify(oldStory) !== JSON.stringify(currentStory)
              
              if (!hasChanges) return null

              return (
                <div key={currentStory.id} className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Edit3 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Modified User Story</span>
                  </div>
                  <h4 className="font-medium">{currentStory.title}</h4>
                  
                  {oldStory.description !== currentStory.description && (
                    <div className="mt-3">
                      <ReactDiffViewer
                        oldValue={oldStory.description}
                        newValue={currentStory.description}
                        splitView={false}
                        hideLineNumbers={true}
                        styles={{
                          variables: {
                            dark: {
                              diffViewerBackground: 'transparent',
                              diffViewerColor: '#e6edf3',
                              addedBackground: '#0d4429',
                              addedColor: '#7fb069',
                              removedBackground: '#67060c',
                              removedColor: '#f85149'
                            }
                          }
                        }}
                        useDarkTheme={true}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Removed stories */}
            {compareVersion.userStories.filter(oldStory => 
              !currentVersion.userStories.find(s => s.id === oldStory.id)
            ).map(removedStory => (
              <div key={removedStory.id} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Removed User Story</span>
                </div>
                <h4 className="font-medium">{removedStory.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{removedStory.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export function SpecDetail({ specId, onBack }: SpecDetailProps) {
  const [spec, setSpec] = useState<Spec>(mockSpec)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editDescription, setEditDescription] = useState(spec.description)
  const [isCompactView, setIsCompactView] = useState(false)
  const [userStories, setUserStories] = useState<UserStory[]>(mockSpec.userStories)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showVersionComparison, setShowVersionComparison] = useState(false)
  const [newVersionDescription, setNewVersionDescription] = useState('')
  const [showCreateVersion, setShowCreateVersion] = useState(false)
  const [activeStageTab, setActiveStageTab] = useState<string>(spec.stage)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleStatusChange = (newStatus: string) => {
    setSpec(prev => ({
      ...prev,
      status: newStatus as Spec['status'],
      updatedAt: 'just now'
    }))
  }

  const handleStageChange = (newStage: string) => {
    const stage = newStage as Spec['stage']
    
    // If moving to technical-design or implementation-tasks, lock requirements
    const shouldLockRequirements = stage === 'technical-design' || stage === 'implementation-tasks'
    
    setSpec(prev => ({
      ...prev,
      stage,
      requirementsLocked: shouldLockRequirements,
      lockReason: shouldLockRequirements ? `Requirements locked because spec moved to ${stage.replace('-', ' ')} stage` : undefined,
      updatedAt: 'just now'
    }))
    
    setActiveStageTab(stage)
  }

  const handleUnlockRequirements = () => {
    setSpec(prev => ({
      ...prev,
      requirementsLocked: false,
      lockReason: undefined,
      updatedAt: 'just now'
    }))
  }

  const handleDescriptionSave = () => {
    setSpec(prev => ({
      ...prev,
      description: editDescription,
      updatedAt: 'just now'
    }))
    setIsEditingDescription(false)
  }

  const handleDescriptionCancel = () => {
    setEditDescription(spec.description)
    setIsEditingDescription(false)
  }

  const handleApproverStatusChange = (approverId: string, status: 'approved' | 'rejected', comments?: string) => {
    setSpec(prev => ({
      ...prev,
      approvers: prev.approvers.map(approver =>
        approver.id === approverId
          ? {
              ...approver,
              status,
              approvedAt: new Date().toISOString(),
              comments
            }
          : approver
      ),
      updatedAt: 'just now'
    }))
  }

  const handleCreateNewVersion = () => {
    const newVersion: SpecVersion = {
      id: `v${spec.versions.length + 1}.0`,
      version: `v${spec.versions.length + 1}.0`,
      description: newVersionDescription,
      userStories: [...userStories],
      createdAt: new Date().toISOString(),
      createdBy: spec.assignee,
      changes: [
        {
          type: 'modified',
          section: 'description',
          title: 'Updated specification',
          details: newVersionDescription
        }
      ]
    }

    setSpec(prev => ({
      ...prev,
      versions: [newVersion, ...prev.versions],
      currentVersion: newVersion.version,
      updatedAt: 'just now'
    }))

    setNewVersionDescription('')
    setShowCreateVersion(false)
  }

  const scrollToContent = (highlightedText: string) => {
    if (!contentRef.current) return
    
    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null
    )
    
    let node
    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(highlightedText)) {
        const element = node.parentElement
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          
          element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'
          element.style.transition = 'background-color 0.3s ease'
          
          setTimeout(() => {
            element.style.backgroundColor = 'transparent'
          }, 2000)
          
          break
        }
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setUserStories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const currentVersion = spec.versions.find(v => v.id === spec.currentVersion)
  const approvedCount = spec.approvers.filter(a => a.status === 'approved').length
  const totalApprovers = spec.approvers.length

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${priorityColors[spec.priority]}`} />
            <div>
              <h1 className="text-xl font-semibold text-foreground">{spec.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{spec.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GitCommit className="w-3 h-3" />
                  {spec.currentVersion}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {React.createElement(stageIcons[spec.stage], { className: 'w-3 h-3' })}
                  <Badge variant="outline" className={`text-xs ${stageColors[spec.stage]}`}>
                    {spec.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                Version History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Version History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-auto">
                {spec.versions.map((version, index) => (
                  <div key={version.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        version.id === spec.currentVersion ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <GitCommit className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{version.version}</h3>
                        {version.id === spec.currentVersion && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{version.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                        <span>by {version.createdBy.name}</span>
                        <span>{version.changes.length} changes</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="flex items-center gap-2 text-xs">
                            {change.type === 'added' && <Plus className="w-3 h-3 text-green-400" />}
                            {change.type === 'modified' && <Edit3 className="w-3 h-3 text-blue-400" />}
                            {change.type === 'removed' && <X className="w-3 h-3 text-red-400" />}
                            <span className="text-muted-foreground">{change.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {index > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowVersionComparison(true)}
                      >
                        Compare
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateVersion} onOpenChange={setShowCreateVersion}>
            <DialogTrigger asChild>
              <Button size="sm">
                <GitBranch className="w-4 h-4 mr-2" />
                Create Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Version Description</label>
                  <Textarea
                    value={newVersionDescription}
                    onChange={(e) => setNewVersionDescription(e.target.value)}
                    placeholder="Describe the changes in this version..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateVersion(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewVersion} disabled={!newVersionDescription.trim()}>
                    Create Version
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metadata Bar with Stage Selector */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-6">
          {/* Stage Selector */}
          <div className="flex items-center gap-2">
            {React.createElement(stageIcons[spec.stage], { className: 'w-4 h-4 text-muted-foreground' })}
            <Select value={spec.stage} onValueChange={handleStageChange}>
              <SelectTrigger className="w-auto border-none bg-transparent p-0 h-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="requirements">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <Badge variant="outline" className={stageColors.requirements}>
                      Requirements
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="technical-design">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <Badge variant="outline" className={stageColors['technical-design']}>
                      Technical Design
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="implementation-tasks">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    <Badge variant="outline" className={stageColors['implementation-tasks']}>
                      Implementation Tasks
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Select value={spec.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-auto border-none bg-transparent p-0 h-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <Badge variant="outline" className={statusColors.draft}>
                    Draft
                  </Badge>
                </SelectItem>
                <SelectItem value="review">
                  <Badge variant="outline" className={statusColors.review}>
                    In Review
                  </Badge>
                </SelectItem>
                <SelectItem value="approved">
                  <Badge variant="outline" className={statusColors.approved}>
                    Approved
                  </Badge>
                </SelectItem>
                <SelectItem value="implemented">
                  <Badge variant="outline" className={statusColors.implemented}>
                    Implemented
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={spec.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {spec.assignee.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{spec.assignee.name}</span>
            </div>
          </div>

          {/* Cycle */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{spec.cycle}</span>
          </div>

          {/* Approvals */}
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {approvedCount}/{totalApprovers} approved
            </span>
            <div className="flex -space-x-1">
              {spec.approvers.map((approver) => (
                <Avatar key={approver.id} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className={`text-xs ${
                    approver.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    approver.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {approver.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{spec.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip className="w-4 h-4" />
            <span>{spec.attachments}</span>
          </div>
          <span>Updated {spec.updatedAt}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6" ref={contentRef}>
          <div className="max-w-4xl space-y-8">
            {/* Requirements Lock Warning */}
            {spec.requirementsLocked && (
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-400 mb-1">Requirements Locked</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {spec.lockReason}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    <strong>What happens when requirements change during implementation?</strong><br />
                    When requirements need to be modified during technical design or implementation phases, 
                    you can unlock them temporarily. However, this will trigger a new approval cycle and 
                    may require updating technical designs and implementation tasks to maintain consistency.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleUnlockRequirements}
                    className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Requirements
                  </Button>
                </div>
              </div>
            )}

            {/* Stage Tabs */}
            <Tabs value={activeStageTab} onValueChange={setActiveStageTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="requirements" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Requirements
                  {spec.requirementsLocked && <Lock className="w-3 h-3" />}
                </TabsTrigger>
                <TabsTrigger value="technical-design" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Technical Design
                </TabsTrigger>
                <TabsTrigger value="implementation-tasks" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Implementation Tasks
                </TabsTrigger>
              </TabsList>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-8">
                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Description</h2>
                    {!spec.requirementsLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingDescription(!isEditingDescription)}
                      >
                        {isEditingDescription ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {isEditingDescription ? 'Preview' : 'Edit'}
                      </Button>
                    )}
                  </div>
                  
                  {isEditingDescription ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDescriptionCancel}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleDescriptionSave}>
                          Save Changes
                        </Button>
                      </div>
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="min-h-[100px] resize-none"
                        placeholder="Enter specification description..."
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-foreground">{spec.description}</p>
                    </div>
                  )}
                </div>

                {/* Approvals Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Approvals ({approvedCount}/{totalApprovers})</h2>
                  <div className="space-y-3">
                    {spec.approvers.map((approver) => (
                      <div key={approver.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{approver.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{approver.name}</span>
                              <Badge variant="outline" className={`text-xs ${approverStatusColors[approver.status]}`}>
                                {approver.status === 'pending' ? 'Pending' : 
                                 approver.status === 'approved' ? 'Approved' : 'Rejected'}
                              </Badge>
                            </div>
                            {approver.approvedAt && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(approver.approvedAt).toLocaleDateString()} at {new Date(approver.approvedAt).toLocaleTimeString()}
                              </p>
                            )}
                            {approver.comments && (
                              <p className="text-sm text-muted-foreground mt-1">{approver.comments}</p>
                            )}
                          </div>
                        </div>
                        
                        {approver.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApproverStatusChange(approver.id, 'rejected', 'Needs revision')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApproverStatusChange(approver.id, 'approved', 'Approved for implementation')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Stories */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">User Stories ({spec.userStories.length})</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-lg p-1">
                        <Button
                          variant={isCompactView ? "ghost" : "secondary"}
                          size="sm"
                          onClick={() => setIsCompactView(false)}
                          className="h-7 px-2"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={isCompactView ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setIsCompactView(true)}
                          className="h-7 px-2"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                      {!spec.requirementsLocked && (
                        <Button size="sm">
                          <Target className="w-4 h-4 mr-2" />
                          Add User Story
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={userStories.map(story => story.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className={isCompactView ? "space-y-2" : "space-y-4"}>
                        {userStories.map((story) => (
                          <SortableUserStory
                            key={story.id}
                            story={story}
                            isCompact={isCompactView}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </TabsContent>

              {/* Technical Design Tab */}
              <TabsContent value="technical-design" className="space-y-8">
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Technical Design</h3>
                  <p className="text-muted-foreground mb-4">
                    Technical design documentation will be added here.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technical Design
                  </Button>
                </div>
              </TabsContent>

              {/* Implementation Tasks Tab */}
              <TabsContent value="implementation-tasks" className="space-y-8">
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Implementation Tasks</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementation tasks and development breakdown will be added here.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Implementation Tasks
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="w-96 border-l border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({spec.comments})
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <CommentSystem
              storyId={spec.id}
              storyContent={spec.description}
              onContentUpdate={(content) => {
                setSpec(prev => ({ ...prev, description: content }))
              }}
              onScrollToContent={scrollToContent}
            />
          </div>
        </div>
      </div>

      {/* Version Comparison Dialog */}
      <Dialog open={showVersionComparison} onOpenChange={setShowVersionComparison}>
        <VersionComparisonDialog
          versions={spec.versions}
          currentVersionId={spec.currentVersion}
          onClose={() => setShowVersionComparison(false)}
        />
      </Dialog>
    </div>
  )
}