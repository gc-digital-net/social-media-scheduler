'use client'

import { useState, useEffect } from 'react'
import { ModernCalendar } from '@/components/calendar/modern-calendar'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string
  date: Date
  time: string
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published'
  color?: string
}

export default function CalendarPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch posts from the database
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_platforms!inner(
            platform
          )
        `)
        .order('scheduled_for', { ascending: true })

      if (error) {
        console.error('Error fetching posts:', error)
        toast.error('Failed to load posts')
      } else {
        // Transform the data to match our Post interface
        const transformedPosts: Post[] = (data || []).map(post => ({
          id: post.id,
          title: post.title || 'Untitled Post',
          content: post.content || '',
          date: new Date(post.scheduled_for),
          time: new Date(post.scheduled_for).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          platforms: post.post_platforms?.map((p: any) => p.platform) || [],
          status: post.status || 'draft',
        }))
        setPosts(transformedPosts)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred while loading posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDate = (date: Date) => {
    // Navigate to compose page with the selected date
    const dateStr = date.toISOString().split('T')[0]
    router.push(`/compose?date=${dateStr}`)
  }

  const handleSelectPost = (post: Post) => {
    // Navigate to edit the selected post
    router.push(`/compose?edit=${post.id}`)
  }

  // For demo purposes, add some mock data if no real posts exist
  useEffect(() => {
    if (!loading && posts.length === 0) {
      const today = new Date()
      const mockPosts: Post[] = [
        {
          id: 'mock-1',
          title: 'Product Launch Announcement',
          content: 'Excited to announce our new product!',
          date: new Date(today.getFullYear(), today.getMonth(), 15),
          time: '10:00',
          platforms: ['twitter', 'linkedin'],
          status: 'scheduled',
        },
        {
          id: 'mock-2',
          title: 'Weekly Tips Thread',
          content: 'Here are 5 tips for better productivity',
          date: new Date(today.getFullYear(), today.getMonth(), 17),
          time: '14:00',
          platforms: ['twitter'],
          status: 'scheduled',
        },
        {
          id: 'mock-3',
          title: 'Team Photo',
          content: 'Great team building event today!',
          date: new Date(today.getFullYear(), today.getMonth(), 20),
          time: '16:00',
          platforms: ['instagram', 'facebook'],
          status: 'draft',
        },
        {
          id: 'mock-4',
          title: 'Blog Post Share',
          content: 'Check out our latest blog post on productivity',
          date: new Date(today.getFullYear(), today.getMonth(), 22),
          time: '09:30',
          platforms: ['linkedin', 'facebook'],
          status: 'scheduled',
        },
        {
          id: 'mock-5',
          title: 'Customer Success Story',
          content: 'Amazing results from one of our clients',
          date: new Date(today.getFullYear(), today.getMonth(), 25),
          time: '11:00',
          platforms: ['twitter', 'linkedin', 'instagram'],
          status: 'published',
        },
      ]
      setPosts(mockPosts)
    }
  }, [loading, posts.length])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            Visualize and manage your content schedule
          </p>
        </div>
      </div>

      <ModernCalendar 
        posts={posts}
        onSelectDate={handleSelectDate}
        onSelectPost={handleSelectPost}
      />
    </div>
  )
}