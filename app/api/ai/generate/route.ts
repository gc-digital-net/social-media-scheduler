import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContent, generateHashtags, improveContent, generateContentIdeas, suggestOptimalTime, suggestEmojis } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, ...params } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'generate': {
        result = await generateContent(params)
        break
      }

      case 'hashtags': {
        const { content, platform = 'twitter', count = 5 } = params
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for hashtag generation' },
            { status: 400 }
          )
        }
        const hashtags = await generateHashtags(content, platform, count)
        result = { hashtags }
        break
      }

      case 'improve': {
        const { content, platform = 'twitter', suggestions = [] } = params
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for improvement' },
            { status: 400 }
          )
        }
        const improved = await improveContent(content, platform, suggestions)
        result = { content: improved }
        break
      }

      case 'ideas': {
        const { industry, count = 5, trending = false } = params
        if (!industry) {
          return NextResponse.json(
            { error: 'Industry is required for content ideas' },
            { status: 400 }
          )
        }
        const ideas = await generateContentIdeas(industry, count, trending)
        result = { ideas }
        break
      }

      case 'optimal-time': {
        const { content, platform = 'twitter', timezone = 'America/New_York' } = params
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for optimal time suggestion' },
            { status: 400 }
          )
        }
        result = await suggestOptimalTime(content, platform, timezone)
        break
      }

      case 'emojis': {
        const { content, count = 3 } = params
        if (!content) {
          return NextResponse.json(
            { error: 'Content is required for emoji suggestions' },
            { status: 400 }
          )
        }
        const emojis = await suggestEmojis(content, count)
        result = { emojis }
        break
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Log AI usage for tracking
    await supabase
      .from('ai_usage')
      .insert({
        user_id: user.id,
        action,
        parameters: params,
        response: result,
        created_at: new Date().toISOString()
      })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI API error:', error)
    
    // Handle OpenAI API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add OpenAI API key.' },
        { status: 503 }
      )
    }
    
    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'AI rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}