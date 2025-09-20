import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { content, platforms, scheduled_for, status = 'draft', media_urls = [], hashtags = [] } = body
    
    // Get user's workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
    }
    
    // Create post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        workspace_id: workspace.id,
        created_by: user.id,
        content,
        platforms,
        scheduled_for,
        status,
        media_urls,
        hashtags
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // If scheduled, add to queue
    if (status === 'scheduled' && scheduled_for && platforms?.length > 0) {
      const queueItems = platforms.map((platform: string) => ({
        post_id: post.id,
        platform,
        process_after: scheduled_for,
        status: 'pending'
      }))
      
      await supabase.from('post_queue').insert(queueItems)
    }
    
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error in POST /api/posts:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
    }
    
    // Get posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 })
  }
}