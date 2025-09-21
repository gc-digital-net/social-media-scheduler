'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Check,
  X,
  Clock,
  MessageSquare,
  Edit3,
  Eye,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  Image,
  Link2,
  MoreVertical,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApprovalRequest {
  id: string
  title: string
  content: string
  platforms: string[]
  scheduledFor: Date
  requestedBy: {
    name: string
    avatar: string
    role: string
  }
  client: string
  status: 'pending' | 'approved' | 'rejected' | 'revision'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  comments: number
  attachments: number
  createdAt: Date
}

const mockApprovals: ApprovalRequest[] = [
  {
    id: '1',
    title: 'Q4 Product Launch Announcement',
    content: 'Excited to announce our latest product innovation that will revolutionize how businesses manage their social media presence. Join us for the virtual launch event next Tuesday!',
    platforms: ['LinkedIn', 'Twitter'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    requestedBy: {
      name: 'Sarah Mitchell',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      role: 'Content Manager',
    },
    client: 'TechCorp Solutions',
    status: 'pending',
    priority: 'urgent',
    comments: 3,
    attachments: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    title: 'Weekly Industry Insights',
    content: 'Here are the top 5 trends shaping the tech industry this week. What trend are you most excited about?',
    platforms: ['Facebook', 'Instagram'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
    requestedBy: {
      name: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      role: 'Social Media Specialist',
    },
    client: 'Innovation Labs',
    status: 'pending',
    priority: 'medium',
    comments: 1,
    attachments: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '3',
    title: 'Customer Success Story',
    content: 'Read how GreenTech reduced their carbon footprint by 40% using our sustainable solutions.',
    platforms: ['LinkedIn'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    requestedBy: {
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      role: 'Marketing Coordinator',
    },
    client: 'EcoFriendly Corp',
    status: 'revision',
    priority: 'low',
    comments: 5,
    attachments: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals)
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewComment, setReviewComment] = useState('')
  const [bulkSelected, setBulkSelected] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setApprovals(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a)
    )
    setShowReviewDialog(false)
    setSelectedApproval(null)
  }

  const handleReject = (id: string) => {
    setApprovals(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a)
    )
    setShowReviewDialog(false)
    setSelectedApproval(null)
  }

  const handleRequestRevision = (id: string) => {
    setApprovals(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'revision' as const } : a)
    )
    setShowReviewDialog(false)
    setSelectedApproval(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />
      case 'revision':
        return <Edit3 className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const pendingApprovals = approvals.filter(a => a.status === 'pending')
  const reviewedApprovals = approvals.filter(a => a.status !== 'pending')

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approval Workflow</h2>
          <p className="text-muted-foreground">
            Review and approve content before publishing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bulkSelected.length > 0 && (
            <>
              <Badge variant="secondary">
                {bulkSelected.length} selected
              </Badge>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  bulkSelected.forEach(id => handleApprove(id))
                  setBulkSelected([])
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkSelected([])}
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Revision</CardTitle>
            <Edit3 className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Awaiting updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5h</div>
            <p className="text-xs text-muted-foreground">
              ↓ 30min from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewedApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Workflow Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <Card key={approval.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={bulkSelected.includes(approval.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBulkSelected([...bulkSelected, approval.id])
                        } else {
                          setBulkSelected(bulkSelected.filter(id => id !== approval.id))
                        }
                      }}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{approval.title}</h3>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={approval.requestedBy.avatar} />
                                <AvatarFallback>{approval.requestedBy.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{approval.requestedBy.name}</span>
                            </div>
                            <span>•</span>
                            <span>{approval.client}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {approval.scheduledFor.toLocaleDateString()} at{' '}
                                {approval.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm">{approval.content}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {approval.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        {approval.attachments > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Image className="h-3 w-3" />
                            <span>{approval.attachments}</span>
                          </div>
                        )}
                        {approval.comments > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>{approval.comments}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedApproval(approval)
                            setShowReviewDialog(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Quick Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <div className="space-y-4">
            {reviewedApprovals.map((approval) => (
              <Card key={approval.id} className="overflow-hidden opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getStatusIcon(approval.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{approval.title}</h3>
                        <Badge variant={
                          approval.status === 'approved' ? 'default' :
                          approval.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {approval.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{approval.requestedBy.name}</span>
                        <span>•</span>
                        <span>{approval.client}</span>
                        <span>•</span>
                        <span>Reviewed 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Settings</CardTitle>
              <CardDescription>
                Configure your approval workflow preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Approval Requirement</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All posts require approval</SelectItem>
                    <SelectItem value="client">Client-specific settings</SelectItem>
                    <SelectItem value="priority">High priority only</SelectItem>
                    <SelectItem value="none">No approval required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Auto-approve After</Label>
                <Select defaultValue="never">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never auto-approve</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="48h">48 hours</SelectItem>
                    <SelectItem value="72h">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <label htmlFor="email" className="text-sm">Email notifications for urgent approvals</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slack" defaultChecked />
                    <label htmlFor="slack" className="text-sm">Slack notifications for all approvals</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile" />
                    <label htmlFor="mobile" className="text-sm">Mobile push notifications</label>
                  </div>
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Post</DialogTitle>
            <DialogDescription>
              Review the content and provide feedback or approval
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{selectedApproval.title}</h4>
                <p className="text-sm">{selectedApproval.content}</p>
              </div>
              
              <div className="flex gap-2">
                {selectedApproval.platforms.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Feedback (Optional)</Label>
                <Textarea
                  placeholder="Add your comments or suggestions..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedApproval && handleReject(selectedApproval.id)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedApproval && handleRequestRevision(selectedApproval.id)}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Request Revision
            </Button>
            <Button
              onClick={() => selectedApproval && handleApprove(selectedApproval.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}