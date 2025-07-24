import React, { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, 
  Reply, 
  Check, 
  X, 
  MoreHorizontal, 
  AtSign,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  Circle,
  User,
  Hash
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader } from './ui/card'
import { Separator } from './ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
}

interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt?: string
  isResolved: boolean
  highlightedText?: string
  highlightRange?: {
    start: number
    end: number
    text: string
  }
  taggedUsers: User[]
  replies: Comment[]
  parentId?: string
}

interface CommentSystemProps {
  storyId: string
  storyContent: string
  onContentUpdate?: (content: string) => void
  onScrollToContent?: (highlightedText: string) => void
}

// Mock users for tagging
const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', avatar: '', initials: 'AJ' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', avatar: '', initials: 'BS' },
  { id: '3', name: 'Carol Davis', email: 'carol@company.com', avatar: '', initials: 'CD' },
  { id: '4', name: 'David Wilson', email: 'david@company.com', avatar: '', initials: 'DW' },
  { id: '5', name: 'Emma Brown', email: 'emma@company.com', avatar: '', initials: 'EB' }
]

// Mock current user
const currentUser: User = mockUsers[0]

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 'c1',
    content: 'I think we should clarify the password complexity requirements. The current specification might be too strict for some users.',
    author: mockUsers[1],
    createdAt: '2024-01-20T10:30:00Z',
    isResolved: false,
    highlightedText: 'Password must meet complexity requirements',
    highlightRange: {
      start: 245,
      end: 285,
      text: 'Password must meet complexity requirements'
    },
    taggedUsers: [mockUsers[0], mockUsers[2]],
    replies: [
      {
        id: 'c1-r1',
        content: 'Good point @bob! Maybe we can make some requirements optional or provide alternative authentication methods.',
        author: mockUsers[0],
        createdAt: '2024-01-20T11:15:00Z',
        isResolved: false,
        taggedUsers: [mockUsers[1]],
        replies: [],
        parentId: 'c1'
      },
      {
        id: 'c1-r2',
        content: 'I agree with @alice. We could implement a progressive enhancement approach where basic requirements are mandatory but advanced ones are optional.',
        author: mockUsers[2],
        createdAt: '2024-01-20T14:22:00Z',
        isResolved: false,
        taggedUsers: [mockUsers[0]],
        replies: [],
        parentId: 'c1'
      }
    ]
  },
  {
    id: 'c2',
    content: 'The email verification step needs more detail. What happens if the user doesn\'t verify within a certain timeframe?',
    author: mockUsers[3],
    createdAt: '2024-01-20T09:45:00Z',
    isResolved: true,
    highlightedText: 'Email verification is required before account activation',
    highlightRange: {
      start: 156,
      end: 205,
      text: 'Email verification is required before account activation'
    },
    taggedUsers: [mockUsers[0]],
    replies: [
      {
        id: 'c2-r1',
        content: 'Great question! I\'ll add a section about verification timeouts and account cleanup policies.',
        author: mockUsers[0],
        createdAt: '2024-01-20T10:00:00Z',
        isResolved: false,
        taggedUsers: [mockUsers[3]],
        replies: [],
        parentId: 'c2'
      }
    ]
  },
  {
    id: 'c3',
    content: 'Should we consider social login options like Google/GitHub OAuth in addition to email/password?',
    author: mockUsers[4],
    createdAt: '2024-01-19T16:30:00Z',
    isResolved: false,
    taggedUsers: [mockUsers[0], mockUsers[1]],
    replies: []
  }
]

function CommentThread({ comment, onReply, onResolve, onTag, onScrollToContent, level = 0 }: {
  comment: Comment
  onReply: (parentId: string, content: string, taggedUsers: User[]) => void
  onResolve: (commentId: string) => void
  onTag: (users: User[]) => void
  onScrollToContent?: (highlightedText: string) => void
  level?: number
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [taggedUsers, setTaggedUsers] = useState<User[]>([])
  const [showTagging, setShowTagging] = useState(false)

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent, taggedUsers)
      setReplyContent('')
      setTaggedUsers([])
      setIsReplying(false)
    }
  }

  const handleTagUser = (user: User) => {
    if (!taggedUsers.find(u => u.id === user.id)) {
      setTaggedUsers([...taggedUsers, user])
      setReplyContent(prev => prev + `@${user.name} `)
    }
    setShowTagging(false)
  }

  const removeTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter(u => u.id !== userId))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`${level > 0 ? 'ml-8 border-l border-border pl-4' : ''}`}>
      <Card className={`${comment.isResolved ? 'opacity-75' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="text-sm">
                  {comment.author.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
                  {comment.isResolved && (
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>
                
                {comment.highlightedText && (
                  <div 
                    className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs cursor-pointer hover:bg-yellow-500/20 transition-colors"
                    onClick={() => onScrollToContent?.(comment.highlightedText!)}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Hash className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-500 font-medium">Highlighted text (click to scroll):</span>
                    </div>
                    <span className="text-muted-foreground italic">"{comment.highlightedText}"</span>
                  </div>
                )}
                
                <p className="text-sm text-foreground mb-2">{comment.content}</p>
                
                {comment.taggedUsers.length > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <AtSign className="w-3 h-3 text-muted-foreground" />
                    <div className="flex gap-1">
                      {comment.taggedUsers.map(user => (
                        <Badge key={user.id} variant="secondary" className="text-xs">
                          {user.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsReplying(true)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResolve(comment.id)}>
                  {comment.isResolved ? (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Mark as Unresolved
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        {isReplying && (
          <CardContent className="pt-0">
            <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Reply to {comment.author.name}</span>
                {taggedUsers.length > 0 && (
                  <div className="flex gap-1">
                    {taggedUsers.map(user => (
                      <Badge key={user.id} variant="secondary" className="text-xs">
                        {user.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeTag(user.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px] resize-none"
              />
              
              <div className="flex items-center justify-between">
                <Popover open={showTagging} onOpenChange={setShowTagging}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <AtSign className="w-4 h-4 mr-2" />
                      Tag someone
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search team members..." />
                      <CommandList>
                        <CommandEmpty>No team members found.</CommandEmpty>
                        <CommandGroup>
                          {mockUsers.filter(u => u.id !== currentUser.id).map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleTagUser(user)}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {user.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onResolve={onResolve}
              onTag={onTag}
              onScrollToContent={onScrollToContent}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentSystem({ storyId, storyContent, onContentUpdate, onScrollToContent }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [isCreatingComment, setIsCreatingComment] = useState(false)
  const [newCommentContent, setNewCommentContent] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [taggedUsers, setTaggedUsers] = useState<User[]>([])
  const [showTagging, setShowTagging] = useState(false)
  const [filterBy, setFilterBy] = useState<'all' | 'tagged' | 'recent' | 'resolved' | 'unresolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim()
      const range = selection.getRangeAt(0)
      
      setSelectedText(selectedText)
      setSelectionRange({
        start: range.startOffset,
        end: range.endOffset
      })
      setIsCreatingComment(true)
    }
  }

  const handleCreateComment = () => {
    if (newCommentContent.trim()) {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        content: newCommentContent,
        author: currentUser,
        createdAt: new Date().toISOString(),
        isResolved: false,
        highlightedText: selectedText || undefined,
        highlightRange: selectionRange ? {
          start: selectionRange.start,
          end: selectionRange.end,
          text: selectedText
        } : undefined,
        taggedUsers,
        replies: []
      }
      
      setComments([newComment, ...comments])
      setNewCommentContent('')
      setSelectedText('')
      setSelectionRange(null)
      setTaggedUsers([])
      setIsCreatingComment(false)
    }
  }

  const handleReply = (parentId: string, content: string, taggedUsers: User[]) => {
    const reply: Comment = {
      id: `${parentId}-r${Date.now()}`,
      content,
      author: currentUser,
      createdAt: new Date().toISOString(),
      isResolved: false,
      taggedUsers,
      replies: [],
      parentId
    }

    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    )
  }

  const handleResolve = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, isResolved: !comment.isResolved }
        }
        // Also check replies
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? { ...reply, isResolved: !reply.isResolved }
              : reply
          )
        }
      })
    )
  }

  const handleTagUser = (user: User) => {
    if (!taggedUsers.find(u => u.id === user.id)) {
      setTaggedUsers([...taggedUsers, user])
      setNewCommentContent(prev => prev + `@${user.name} `)
    }
    setShowTagging(false)
  }

  const removeTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter(u => u.id !== userId))
  }

  // Filter comments
  const filteredComments = comments.filter(comment => {
    // Search filter
    if (searchQuery) {
      const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.replies.some(reply => 
                             reply.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             reply.author.name.toLowerCase().includes(searchQuery.toLowerCase())
                           )
      if (!matchesSearch) return false
    }

    // Status filter
    switch (filterBy) {
      case 'tagged':
        return comment.taggedUsers.some(user => user.id === currentUser.id) ||
               comment.replies.some(reply => reply.taggedUsers.some(user => user.id === currentUser.id))
      case 'recent': {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return new Date(comment.createdAt) > oneDayAgo
      }
      case 'resolved':
        return comment.isResolved
      case 'unresolved':
        return !comment.isResolved
      default:
        return true
    }
  })

  const unresolvedCount = comments.filter(c => !c.isResolved).length
  const taggedCount = comments.filter(c => 
    c.taggedUsers.some(user => user.id === currentUser.id) ||
    c.replies.some(reply => reply.taggedUsers.some(user => user.id === currentUser.id))
  ).length

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments ({comments.length})
          </h3>
          <div className="flex items-center gap-2">
            {unresolvedCount > 0 && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                {unresolvedCount} unresolved
              </Badge>
            )}
            {taggedCount > 0 && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {taggedCount} tagged
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="tagged">Tagged Me</SelectItem>
              <SelectItem value="recent">Recent (24h)</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content with selection capability */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h4 className="font-medium">User Story Content</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingComment(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={contentRef}
            className="prose prose-invert max-w-none cursor-text select-text"
            onMouseUp={handleTextSelection}
          >
            <p className="text-sm leading-relaxed">
              {storyContent}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New comment form */}
      {isCreatingComment && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Add Comment</h4>
            {selectedText && (
              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Hash className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-500 font-medium">Selected text:</span>
                </div>
                <span className="text-muted-foreground italic">"{selectedText}"</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {taggedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tagged:</span>
                <div className="flex gap-1">
                  {taggedUsers.map(user => (
                    <Badge key={user.id} variant="secondary" className="text-xs">
                      {user.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTag(user.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Write your comment..."
              className="min-h-[100px] resize-none"
            />
            
            <div className="flex items-center justify-between">
              <Popover open={showTagging} onOpenChange={setShowTagging}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AtSign className="w-4 h-4 mr-2" />
                    Tag someone
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandList>
                      <CommandEmpty>No team members found.</CommandEmpty>
                      <CommandGroup>
                        {mockUsers.filter(u => u.id !== currentUser.id).map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => handleTagUser(user)}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">
                                {user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsCreatingComment(false)
                    setNewCommentContent('')
                    setSelectedText('')
                    setSelectionRange(null)
                    setTaggedUsers([])
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateComment} disabled={!newCommentContent.trim()}>
                  Add Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                {searchQuery || filterBy !== 'all' 
                  ? 'No comments match your filters' 
                  : 'No comments yet. Select text to add the first comment!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredComments.map(comment => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onResolve={handleResolve}
              onTag={(users) => setTaggedUsers(users)}
              onScrollToContent={onScrollToContent}
            />
          ))
        )}
      </div>
    </div>
  )
}