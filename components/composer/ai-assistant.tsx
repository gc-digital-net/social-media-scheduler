'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Sparkles, 
  Hash, 
  Smile, 
  Clock, 
  Lightbulb, 
  Wand2,
  Copy,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface AIAssistantProps {
  currentContent: string
  platform: string
  onContentGenerated: (content: string) => void
  onHashtagsGenerated?: (hashtags: string[]) => void
}

export function AIAssistant({ 
  currentContent, 
  platform, 
  onContentGenerated,
  onHashtagsGenerated 
}: AIAssistantProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  
  // Generate content state
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'humorous' | 'informative'>('friendly')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [generatedEmojis, setGeneratedEmojis] = useState<string[]>([])
  const [contentIdeas, setContentIdeas] = useState<string[]>([])
  const [optimalTime, setOptimalTime] = useState<{ time: string; reason: string } | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          topic,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          tone,
          platform,
          length,
          includeEmojis,
          includeHashtags
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      setGeneratedHashtags(data.hashtags || [])
      setGeneratedEmojis(data.emojis || [])
      
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateHashtags = async () => {
    if (!currentContent.trim()) {
      toast.error('Please write some content first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hashtags',
          content: currentContent,
          platform,
          count: 10
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setGeneratedHashtags(data.hashtags || [])
      toast.success('Hashtags generated!')
    } catch (error) {
      console.error('Hashtag error:', error)
      toast.error('Failed to generate hashtags')
    } finally {
      setLoading(false)
    }
  }

  const handleImproveContent = async () => {
    if (!currentContent.trim()) {
      toast.error('Please write some content first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve',
          content: currentContent,
          platform
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      toast.success('Content improved!')
    } catch (error) {
      console.error('Improve error:', error)
      toast.error('Failed to improve content')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateIdeas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ideas',
          industry: topic || 'general',
          count: 5,
          trending: true
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setContentIdeas(data.ideas || [])
      toast.success('Content ideas generated!')
    } catch (error) {
      console.error('Ideas error:', error)
      toast.error('Failed to generate ideas')
    } finally {
      setLoading(false)
    }
  }

  const handleOptimalTime = async () => {
    if (!currentContent.trim()) {
      toast.error('Please write some content first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimal-time',
          content: currentContent,
          platform,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setOptimalTime(data)
      toast.success('Optimal posting time suggested!')
    } catch (error) {
      console.error('Time error:', error)
      toast.error('Failed to suggest optimal time')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateEmojis = async () => {
    if (!currentContent.trim()) {
      toast.error('Please write some content first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'emojis',
          content: currentContent,
          count: 5
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setGeneratedEmojis(data.emojis || [])
      toast.success('Emoji suggestions ready!')
    } catch (error) {
      console.error('Emoji error:', error)
      toast.error('Failed to suggest emojis')
    } finally {
      setLoading(false)
    }
  }

  const handleUseContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent)
      toast.success('Content applied!')
    }
  }

  const handleAddHashtag = (hashtag: string) => {
    const formattedHashtag = `#${hashtag}`
    onContentGenerated(currentContent + ' ' + formattedHashtag)
    toast.success('Hashtag added!')
  }

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
      toast.success('Content copied to clipboard!')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic or Theme</Label>
                <Input
                  id="topic"
                  placeholder="What's your post about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="length">Length</Label>
                  <Select value={length} onValueChange={(v: any) => setLength(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={loading || !topic}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate Content
              </Button>

              {generatedContent && (
                <div className="space-y-2">
                  <Label>Generated Content</Label>
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopyContent}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={handleUseContent}>
                      Use This Content
                    </Button>
                  </div>
                </div>
              )}

              {generatedHashtags.length > 0 && (
                <div className="space-y-2">
                  <Label>Suggested Hashtags</Label>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => handleAddHashtag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="enhance" className="space-y-4">
            <div className="space-y-4">
              <Button
                onClick={handleImproveContent}
                disabled={loading || !currentContent}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Improve Current Content
              </Button>

              <Button
                onClick={handleGenerateHashtags}
                disabled={loading || !currentContent}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Hash className="h-4 w-4 mr-2" />
                )}
                Generate Hashtags
              </Button>

              <Button
                onClick={handleGenerateEmojis}
                disabled={loading || !currentContent}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Smile className="h-4 w-4 mr-2" />
                )}
                Suggest Emojis
              </Button>

              {generatedHashtags.length > 0 && (
                <div className="space-y-2">
                  <Label>Click to add hashtags</Label>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleAddHashtag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedEmojis.length > 0 && (
                <div className="space-y-2">
                  <Label>Click to add emojis</Label>
                  <div className="flex gap-2 text-2xl">
                    {generatedEmojis.map((emoji, i) => (
                      <span
                        key={i}
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => onContentGenerated(currentContent + ' ' + emoji)}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="industry">Industry/Niche</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Fashion, Food"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateIdeas}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                Generate Content Ideas
              </Button>

              {contentIdeas.length > 0 && (
                <div className="space-y-2">
                  <Label>Content Ideas</Label>
                  <div className="space-y-2">
                    {contentIdeas.map((idea, i) => (
                      <div
                        key={i}
                        className="p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => setTopic(idea)}
                      >
                        <p className="text-sm">{idea}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4">
            <div className="space-y-4">
              <Button
                onClick={handleOptimalTime}
                disabled={loading || !currentContent}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4 mr-2" />
                )}
                Suggest Best Posting Time
              </Button>

              {optimalTime && (
                <div className="p-4 border rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Optimal Time: {optimalTime.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{optimalTime.reason}</p>
                </div>
              )}

              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Platform Best Practices</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {platform === 'twitter' && (
                    <>
                      <p>• Keep it under 280 characters</p>
                      <p>• Use 1-2 hashtags maximum</p>
                      <p>• Best times: 9-10am, 7-9pm</p>
                    </>
                  )}
                  {platform === 'linkedin' && (
                    <>
                      <p>• Professional tone works best</p>
                      <p>• Use 3-5 hashtags</p>
                      <p>• Best times: Tue-Thu, 8-10am</p>
                    </>
                  )}
                  {platform === 'facebook' && (
                    <>
                      <p>• Longer posts perform well</p>
                      <p>• Include visuals when possible</p>
                      <p>• Best times: 1-4pm</p>
                    </>
                  )}
                  {platform === 'instagram' && (
                    <>
                      <p>• Use up to 30 hashtags</p>
                      <p>• Emojis increase engagement</p>
                      <p>• Best times: 11am-1pm, 7-9pm</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}