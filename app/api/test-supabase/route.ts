import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Test basic connection
    const supabase = await createClient()
    
    // Check if we can connect - query a system table that always exists
    const { data, error } = await supabase
      .from('test')
      .select('*')
      .limit(1)
    
    // If error includes "Could not find" or "does not exist", connection is OK but table missing
    if (error && (error.message.includes('Could not find') || error.message.includes('does not exist'))) {
      return NextResponse.json({ 
        status: 'connected',
        message: 'Supabase connection successful (no tables created yet)',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      })
    }
    
    // If no error or different error
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Supabase connection successful',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tables: data ? 'Tables exist' : 'No data'
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}