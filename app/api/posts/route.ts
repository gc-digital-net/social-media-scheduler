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
    const { content, platforms, scheduledFor, status = 'draft', media, hashtags } = body
    
    // Get or create user's workspace
    let { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (!workspace) {
      // Create default workspace
      const { data: newWorkspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({
          name: 'My Workspace',
          owner_id: user.id
        })
        .select()
        .single()
      
      if (wsError) {
        console.error('Error creating workspace:', wsError)
        return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
      }
      workspace = newWorkspace
    }
    
    // Create post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        workspace_id: workspace.id,
        content,
        platforms,
        scheduled_for: scheduledFor,
        status,
        media_urls: media || [],
        platform_specific_data: { hashtags: hashtags || [] }
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // If scheduled, add to queue (only if user has connected accounts)
    if (status === 'scheduled' && scheduledFor && platforms?.length > 0) {
      // Get user's connected accounts for selected platforms
      const { data: accounts } = await supabase
        .from('social_accounts')
        .select('id, platform')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .in('platform', platforms)
      
      if (accounts && accounts.length > 0) {
        const queueItems = accounts.map(account => ({
          post_id: post.id,
          social_account_id: account.id,
          process_after: scheduledFor,
          status: 'pending'
        }))
        
        await supabase.from('post_queue').insert(queueItems)
      }
    }
    
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error in POST /api/posts:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const limit = searchParams.get('limit') || '50'
    
    // Build query
    let query = supabase
      .from('posts')
      .select(`
        *,
        post_queue(*)
      `)
      .eq('user_id', user.id)
    
    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (platform) {
      query = query.contains('platforms', [platform])
    }
    
    // Execute query
    const { data: posts, error } = await query
      .order('scheduled_for', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
    
    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 })
  }
}