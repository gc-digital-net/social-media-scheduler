import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test if profiles table exists
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    // Test if workspaces table exists  
    const { error: workspacesError } = await supabase
      .from('workspaces')
      .select('id')
      .limit(1)
      
    // Test if posts table exists
    const { error: postsError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)
    
    const tables = {
      profiles: !profilesError || !profilesError.message.includes('not exist'),
      workspaces: !workspacesError || !workspacesError.message.includes('not exist'),
      posts: !postsError || !postsError.message.includes('not exist')
    }
    
    const allTablesExist = Object.values(tables).every(exists => exists)
    
    return NextResponse.json({
      status: allTablesExist ? 'ready' : 'partial',
      message: allTablesExist 
        ? '✅ All tables created successfully!' 
        : '⚠️ Some tables might be missing',
      tables,
      details: {
        profiles: profilesError?.message || 'OK',
        workspaces: workspacesError?.message || 'OK',
        posts: postsError?.message || 'OK'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}