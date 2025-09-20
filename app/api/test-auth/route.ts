import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()
    
    const supabase = await createClient()
    
    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
        }
      })
      
      if (error) {
        return NextResponse.json({ 
          status: 'error', 
          message: error.message,
          details: error
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        status: 'success',
        message: 'Check your email for verification link',
        user: data.user,
        session: data.session
      })
    }
    
    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return NextResponse.json({ 
          status: 'error', 
          message: error.message,
          details: error
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        status: 'success',
        user: data.user,
        session: data.session
      })
    }
    
    if (action === 'check') {
      const { data: { user } } = await supabase.auth.getUser()
      
      return NextResponse.json({ 
        status: 'success',
        user: user || null,
        authenticated: !!user
      })
    }
    
    return NextResponse.json({ 
      status: 'error', 
      message: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}