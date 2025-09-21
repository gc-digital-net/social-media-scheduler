'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, Clock, Edit, Trash2, MoreVertical, Eye } from 'lucide-react'
import { PLATFORMS, Platform } from '@/lib/constants/platforms'
import { format, formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ScheduledPost {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledFor: Date;
  status: 'scheduled' | 'publishing' | 'failed';
  mediaCount: number;
}

export function UpcomingPosts() {
  const router = useRouter()
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Fetch real posts from database
          const { data: posts, error } = await supabase
            .from('posts')
            .select(`
              id,
              content,
              scheduled_for,
              status,
              media_urls,
              post_platforms!inner(
                platform
              )
            `)
            .eq('status', 'scheduled')
            .gte('scheduled_for', new Date().toISOString())
            .order('scheduled_for', { ascending: true })
            .limit(10)

          if (!error && posts) {
            const transformedPosts: ScheduledPost[] = posts.map((post: any) => ({
              id: post.id,
              content: post.content || '',
              platforms: post.post_platforms?.map((pp: any) => pp.platform) || [],
              scheduledFor: new Date(post.scheduled_for),
              status: post.status,
              mediaCount: post.media_urls?.length || 0
            }))
            setPosts(transformedPosts)
          } else {
            // Use mock data as fallback
            useMockData()
          }
        } else {
          // Use mock data if not authenticated
          useMockData()
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        useMockData()
      } finally {
        setLoading(false)
      }
    }

    const useMockData = () => {
      const mockPosts: ScheduledPost[] = [
        {
          id: '1',
          content: 'Excited to share our latest product update! Check out the new features that will make your workflow even smoother.',
          platforms: ['twitter', 'linkedin'],
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: 'scheduled',
          mediaCount: 2,
        },
        {
          id: '2',
          content: 'Behind the scenes of our team building event last week. Great memories with an amazing team!',
          platforms: ['facebook', 'instagram'],
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          status: 'scheduled',
          mediaCount: 5,
        },
        {
          id: '3',
          content: 'New blog post: "10 Tips for Better Social Media Engagement" - Learn how to boost your online presence.',
          platforms: ['twitter', 'facebook', 'linkedin'],
          scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          status: 'scheduled',
          mediaCount: 1,
        },
      ]
      setPosts(mockPosts)
    }

    fetchPosts()
  }, [])

  const handleEdit = (postId: string) => {
    router.push(`/compose?edit=${postId}`)
  }

  const handleDelete = async (postId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        toast.error('Failed to delete post')
      } else {
        setPosts(posts.filter(p => p.id !== postId))
        toast.success('Post deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const handleReschedule = (postId: string) => {
    router.push(`/calendar?reschedule=${postId}`)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No scheduled posts</p>
          <Button onClick={() => router.push('/compose')}>
            Create Your First Post
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Posts</CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.push('/calendar')}>
          View Calendar
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(post.scheduledFor, 'PPP')}</span>
                      <span>•</span>
                      <span>{format(post.scheduledFor, 'p')}</span>
                      <span>•</span>
                      <span className="text-xs">
                        {formatDistanceToNow(post.scheduledFor, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {post.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            <span className="mr-1">{PLATFORMS[platform].icon}</span>
                            {PLATFORMS[platform].name}
                          </Badge>
                        ))}
                      </div>
                      {post.mediaCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {post.mediaCount} media
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReschedule(post.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}