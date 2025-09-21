'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Image, Send, Save, Eye, Hash, Smile, Link, BarChart3, X } from 'lucide-react'
import { PLATFORMS, Platform, getPlatformCharLimit } from '@/lib/constants/platforms'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { PlatformPreview } from './platform-preview'
import { MediaUploader } from './media-uploader'
import { DateTimePicker } from './date-time-picker'
import { cn } from '@/lib/utils'

interface PostComposerProps {
  defaultPlatforms?: Platform[];
  onSave?: (post: any) => void;
  onSchedule?: (post: any) => void;
}

export function PostComposer({ defaultPlatforms = ['twitter'], onSave, onSchedule }: PostComposerProps) {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(defaultPlatforms)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [isScheduled, setIsScheduled] = useState(false)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [currentHashtag, setCurrentHashtag] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleAddHashtag = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`
    if (!hashtags.includes(cleanTag) && tag.trim()) {
      setHashtags([...hashtags, cleanTag])
      setCurrentHashtag('')
    }
  }

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag))
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    
    setContent(newContent)
    
    // Reset cursor position after React re-render
    setTimeout(() => {
      textarea.selectionStart = start + text.length
      textarea.selectionEnd = start + text.length
      textarea.focus()
    }, 0)
  }

  const handleInsertHashtags = () => {
    if (hashtags.length > 0) {
      insertAtCursor(' ' + hashtags.join(' '))
      setHashtags([])
    }
  }

  const handleSubmit = async (action: 'draft' | 'schedule' | 'publish') => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Please add some content or media')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    // Validate content length for each platform
    for (const platform of selectedPlatforms) {
      const limit = getPlatformCharLimit(platform)
      if (content.length > limit) {
        toast.error(`Content exceeds ${PLATFORMS[platform].name} character limit (${limit} chars)`)
        return
      }
    }

    const postData = {
      content,
      platforms: selectedPlatforms,
      media: mediaFiles,
      scheduledFor: isScheduled ? scheduledDate : null,
      status: action === 'draft' ? 'draft' : action === 'publish' ? 'published' : 'scheduled',
      hashtags,
    }

    try {
      if (action === 'draft' && onSave) {
        onSave(postData)
        toast.success('Post saved as draft')
      } else if (action === 'schedule' && onSchedule) {
        onSchedule(postData)
        toast.success(`Post scheduled for ${format(scheduledDate!, 'PPP p')}`)
      } else if (action === 'publish') {
        // TODO: Implement immediate publishing
        toast.success('Post published successfully!')
      }

      // Reset form
      setContent('')
      setMediaFiles([])
      setHashtags([])
      setScheduledDate(null)
      setIsScheduled(false)
    } catch (error) {
      toast.error('Failed to save post')
    }
  }

  const getCharacterCount = () => {
    const counts = selectedPlatforms.map(platform => ({
      platform,
      count: content.length,
      limit: getPlatformCharLimit(platform),
    }))
    
    const mostRestrictive = counts.sort((a, b) => a.limit - b.limit)[0]
    
    if (!mostRestrictive) return null
    
    const percentage = (mostRestrictive.count / mostRestrictive.limit) * 100
    const remaining = mostRestrictive.limit - mostRestrictive.count
    
    return {
      ...mostRestrictive,
      percentage,
      remaining,
      isOver: remaining < 0,
    }
  }

  const charCount = getCharacterCount()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div>
              <Label className="text-base mb-3 block">Select Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PLATFORMS).map(([key, platform]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={selectedPlatforms.includes(key as Platform) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePlatformToggle(key as Platform)}
                    className="gap-2"
                  >
                    <span className="text-lg">{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div>
              <Label htmlFor="content" className="text-base mb-3 block">Content</Label>
              <Textarea
                ref={textareaRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[150px] resize-none"
              />
              {charCount && (
                <div className={cn(
                  "text-sm mt-2 flex justify-between items-center",
                  charCount.isOver ? "text-destructive" : "text-muted-foreground"
                )}>
                  <span>
                    {charCount.remaining < 0 
                      ? `${Math.abs(charCount.remaining)} over limit`
                      : `${charCount.remaining} characters remaining`
                    }
                  </span>
                  <span className="text-xs">
                    {PLATFORMS[charCount.platform as Platform].name} limit
                  </span>
                </div>
              )}
            </div>

            {/* Content Tools */}
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertAtCursor('😊')}
              >
                <Smile className="h-4 w-4 mr-1" />
                Emoji
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleInsertHashtags}
                disabled={hashtags.length === 0}
              >
                <Hash className="h-4 w-4 mr-1" />
                Hashtags ({hashtags.length})
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertAtCursor('\n\n👉 ')}
              >
                <Link className="h-4 w-4 mr-1" />
                Link
              </Button>
            </div>

            {/* Hashtag Management */}
            <div>
              <Label className="text-base mb-3 block">Hashtags</Label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentHashtag}
                  onChange={(e) => setCurrentHashtag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddHashtag(currentHashtag)
                    }
                  }}
                  placeholder="Add hashtag"
                  className="flex-1 px-3 py-1 border rounded-md"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddHashtag(currentHashtag)}
                >
                  Add
                </Button>
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {hashtags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Media Upload */}
            <MediaUploader
              files={mediaFiles}
              onFilesChange={setMediaFiles}
              maxFiles={Math.max(...selectedPlatforms.map(p => PLATFORMS[p].maxImages || 0))}
            />

            {/* Scheduling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule" className="text-base">Schedule Post</Label>
                <Switch
                  id="schedule"
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
              </div>
              {isScheduled && (
                <DateTimePicker
                  date={scheduledDate}
                  onDateChange={setScheduledDate}
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit('draft')}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <div className="flex gap-2">
              {isScheduled ? (
                <Button
                  type="button"
                  onClick={() => handleSubmit('schedule')}
                  disabled={!scheduledDate}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit('publish')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish Now
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlatforms.length > 0 ? (
              <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, 1fr)` }}>
                  {selectedPlatforms.map(platform => (
                    <TabsTrigger key={platform} value={platform}>
                      {PLATFORMS[platform].name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {selectedPlatforms.map(platform => (
                  <TabsContent key={platform} value={platform}>
                    <PlatformPreview
                      platform={platform}
                      content={content}
                      media={mediaFiles}
                      hashtags={hashtags}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a platform to see preview
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}