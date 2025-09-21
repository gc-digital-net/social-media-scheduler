import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

/**
 * Cron job to publish scheduled posts
 * This should be called every minute by Vercel Cron or external scheduler
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret if in production
    if (process.env.NODE_ENV === 'production') {
      const headersList = headers()
      const authHeader = headersList.get('authorization')
      
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const supabase = createClient()
    
    // Find posts that are scheduled for now or past
    const now = new Date()
    const { data: scheduledPosts, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        scheduled_for,
        status
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now.toISOString())
      .limit(10) // Process max 10 posts per run to avoid timeouts

    if (error) {
      console.error('Error fetching scheduled posts:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        message: 'No posts to publish',
        checked_at: now.toISOString()
      })
    }

    // Publish each post
    const results = []
    
    for (const post of scheduledPosts) {
      try {
        // Call the publish API for each post
        const publishResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/publish`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Use service role key for internal API calls
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ post_id: post.id })
          }
        )

        const publishResult = await publishResponse.json()
        
        results.push({
          post_id: post.id,
          success: publishResponse.ok,
          result: publishResult
        })

        // Log the publish attempt
        await supabase
          .from('cron_logs')
          .insert({
            job_name: 'publish_posts',
            post_id: post.id,
            status: publishResponse.ok ? 'success' : 'failed',
            details: publishResult,
            executed_at: new Date().toISOString()
          })

      } catch (error: any) {
        console.error(`Failed to publish post ${post.id}:`, error)
        
        results.push({
          post_id: post.id,
          success: false,
          error: error.message
        })

        // Update post status to failed
        await supabase
          .from('posts')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', post.id)
      }
    }

    return NextResponse.json({
      message: `Processed ${scheduledPosts.length} posts`,
      results,
      executed_at: now.toISOString()
    })

  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request)
}