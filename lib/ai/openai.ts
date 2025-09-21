import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateContentOptions {
  topic?: string
  keywords?: string[]
  tone?: 'professional' | 'casual' | 'friendly' | 'humorous' | 'informative'
  platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
  length?: 'short' | 'medium' | 'long'
  includeEmojis?: boolean
  includeHashtags?: boolean
}

export interface ContentSuggestion {
  content: string
  hashtags: string[]
  emojis?: string[]
}

/**
 * Generate social media content using AI
 */
export async function generateContent(
  options: GenerateContentOptions
): Promise<ContentSuggestion> {
  try {
    const {
      topic = '',
      keywords = [],
      tone = 'friendly',
      platform = 'twitter',
      length = 'medium',
      includeEmojis = true,
      includeHashtags = true,
    } = options

    // Platform-specific character limits
    const platformLimits = {
      twitter: 280,
      linkedin: 3000,
      facebook: 63206,
      instagram: 2200,
    }

    const maxLength = platformLimits[platform]
    
    // Determine actual length targets
    const lengthTargets = {
      short: Math.min(100, maxLength * 0.3),
      medium: Math.min(200, maxLength * 0.6),
      long: Math.min(500, maxLength * 0.9),
    }

    const targetLength = lengthTargets[length]

    const systemPrompt = `You are a social media content expert. Create engaging ${platform} posts that are ${tone} in tone.
    ${includeEmojis ? 'Include relevant emojis.' : 'Do not include emojis.'}
    ${includeHashtags ? 'Include relevant hashtags.' : 'Do not include hashtags.'}
    Keep the content under ${targetLength} characters.
    Make it engaging and shareable.`

    const userPrompt = `Create a ${platform} post about: ${topic}
    ${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : ''}
    
    Return the response in JSON format with the following structure:
    {
      "content": "the main post content",
      "hashtags": ["hashtag1", "hashtag2"],
      "emojis": ["emoji1", "emoji2"]
    }`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(response)
    
    return {
      content: parsed.content || '',
      hashtags: parsed.hashtags || [],
      emojis: parsed.emojis || [],
    }
  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
}

/**
 * Generate hashtag suggestions based on content
 */
export async function generateHashtags(
  content: string,
  platform: string = 'twitter',
  count: number = 5
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a hashtag expert. Generate ${count} relevant hashtags for ${platform} based on the given content. Return only the hashtags as a JSON array of strings without the # symbol.`,
        },
        {
          role: 'user',
          content: `Generate hashtags for this post: "${content}"`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(response)
    return parsed.hashtags || []
  } catch (error) {
    console.error('Error generating hashtags:', error)
    return []
  }
}

/**
 * Improve existing content
 */
export async function improveContent(
  content: string,
  platform: string = 'twitter',
  suggestions: string[] = []
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a social media expert. Improve the given ${platform} post to make it more engaging. 
          Keep the original meaning but enhance clarity, engagement, and impact.
          ${suggestions.length > 0 ? `Consider these suggestions: ${suggestions.join(', ')}` : ''}`,
        },
        {
          role: 'user',
          content: `Improve this post: "${content}"`,
        },
      ],
      temperature: 0.6,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || content
  } catch (error) {
    console.error('Error improving content:', error)
    return content
  }
}

/**
 * Generate content ideas based on industry/niche
 */
export async function generateContentIdeas(
  industry: string,
  count: number = 5,
  trending: boolean = false
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a content strategist. Generate ${count} creative post ideas for the ${industry} industry.
          ${trending ? 'Focus on current trends and timely topics.' : 'Mix evergreen and timely content.'}
          Return as a JSON object with an "ideas" array containing strings.`,
        },
        {
          role: 'user',
          content: `Generate ${count} engaging social media post ideas for ${industry}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(response)
    return parsed.ideas || []
  } catch (error) {
    console.error('Error generating content ideas:', error)
    return []
  }
}

/**
 * Analyze content for optimal posting time
 */
export async function suggestOptimalTime(
  content: string,
  platform: string,
  timezone: string = 'America/New_York'
): Promise<{ time: string; reason: string }> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a social media timing expert. Based on the content and platform, suggest the optimal posting time.
          Consider engagement patterns, platform algorithms, and content type.
          Return a JSON object with "time" (24-hour format like "14:30") and "reason" fields.`,
        },
        {
          role: 'user',
          content: `Suggest the best time to post this ${platform} content in ${timezone} timezone: "${content}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(response)
    return {
      time: parsed.time || '10:00',
      reason: parsed.reason || 'Peak engagement time',
    }
  } catch (error) {
    console.error('Error suggesting optimal time:', error)
    return {
      time: '10:00',
      reason: 'Default morning posting time',
    }
  }
}

/**
 * Generate emoji suggestions for content
 */
export async function suggestEmojis(
  content: string,
  count: number = 3
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Suggest ${count} relevant emojis for the given text. Return only the emojis as a JSON array.`,
        },
        {
          role: 'user',
          content: `Suggest emojis for: "${content}"`,
        },
      ],
      temperature: 0.5,
      max_tokens: 50,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(response)
    return parsed.emojis || []
  } catch (error) {
    console.error('Error suggesting emojis:', error)
    return []
  }
}