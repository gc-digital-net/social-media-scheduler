import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get filter parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const includePermissions = searchParams.get('include_permissions') === 'true'

    // Base query
    let query = supabase
      .from('client_accounts')
      .select(`
        *,
        ${includePermissions ? `
          account_permissions!inner(
            role,
            permissions
          )
        ` : ''}
      `)
      .eq('status', status)
      .order('name')

    // Filter by user permissions
    if (includePermissions) {
      query = query.eq('account_permissions.user_id', user.id)
    }

    const { data: accounts, error } = await query

    if (error) {
      console.error('Error fetching accounts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get pending counts for each account (mock for now)
    const accountsWithMetrics = await Promise.all(
      (accounts || []).map(async (account) => {
        // Get pending posts count
        const { count: pendingPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('client_account_id', account.id)
          .eq('approval_status', 'pending_review')

        // Get failed posts count
        const { count: failedPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('client_account_id', account.id)
          .eq('status', 'failed')

        return {
          ...account,
          metrics: {
            pending_posts: pendingPosts || 0,
            failed_posts: failedPosts || 0
          }
        }
      })
    )

    return NextResponse.json({ accounts: accountsWithMetrics })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspace
    const { data: workspaceMember, error: wsError } = await supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', user.id)
      .single()

    if (wsError || !workspaceMember) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
    }

    // Check if user is admin
    if (!['owner', 'admin'].includes(workspaceMember.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, industry, website_url, brand_colors, timezone } = body

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-')

    // Create account
    const { data: account, error: createError } = await supabase
      .from('client_accounts')
      .insert({
        workspace_id: workspaceMember.workspace_id,
        name,
        slug,
        description,
        industry,
        website_url,
        brand_colors,
        timezone: timezone || 'UTC',
        status: 'active'
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating account:', createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Grant creator owner permission
    const { error: permError } = await supabase
      .from('account_permissions')
      .insert({
        user_id: user.id,
        client_account_id: account.id,
        role: 'owner',
        granted_by: user.id
      })

    if (permError) {
      console.error('Error creating permission:', permError)
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    // Check user permission for this account
    const { data: permission, error: permError } = await supabase
      .from('account_permissions')
      .select('role')
      .eq('user_id', user.id)
      .eq('client_account_id', id)
      .single()

    if (permError || !permission) {
      return NextResponse.json({ error: 'No permission for this account' }, { status: 403 })
    }

    // Only owners and admins can update
    if (!['owner', 'admin'].includes(permission.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Update account
    const { data: account, error: updateError } = await supabase
      .from('client_accounts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating account:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    // Check user permission for this account
    const { data: permission, error: permError } = await supabase
      .from('account_permissions')
      .select('role')
      .eq('user_id', user.id)
      .eq('client_account_id', id)
      .single()

    if (permError || !permission) {
      return NextResponse.json({ error: 'No permission for this account' }, { status: 403 })
    }

    // Only owners can delete (archive)
    if (permission.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can delete accounts' }, { status: 403 })
    }

    // Archive account instead of hard delete
    const { error: deleteError } = await supabase
      .from('client_accounts')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (deleteError) {
      console.error('Error archiving account:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}