'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  Clock,
  Image,
  Video,
  Sparkles,
  Send,
  Save,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  X,
  Bold,
  Italic,
  List,
  Smile,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useRouter } from 'next/navigation'

export default function ComposerPage() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleTime, setScheduleTime] = useState<string>('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [currentHashtag, setCurrentHashtag] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [postType, setPostType] = useState<'now' | 'schedule' | 'draft'>('now')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', charLimit: 63206 },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 to-pink-500', charLimit: 2200 },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-black', charLimit: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', charLimit: 3000 },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600', charLimit: 5000 },
  ]

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const addHashtag = () => {
    if (currentHashtag && !hashtags.includes(currentHashtag)) {
      setHashtags([...hashtags, currentHashtag])
      setCurrentHashtag('')
    }
  }

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const getCharacterCount = () => {
    const selectedPlatform = selectedPlatforms[0]
    if (!selectedPlatform) return null
    
    const platform = platforms.find(p => p.id === selectedPlatform)
    if (!platform) return null
    
    return {
      current: content.length,
      limit: platform.charLimit,
      percentage: (content.length / platform.charLimit) * 100
    }
  }

  const handlePublish = async () => {
    if (!content || selectedPlatforms.length === 0) {
      alert('Please add content and select at least one platform')
      return
    }

    setLoading(true)
    
    try {
      let scheduledFor = null
      let status = 'draft'
      
      if (postType === 'now') {
        status = 'published'
        scheduledFor = new Date().toISOString()
      } else if (postType === 'schedule' && scheduleDate && scheduleTime) {
        status = 'scheduled'
        const [hours, minutes] = scheduleTime.split(':')
        const scheduledDate = new Date(scheduleDate)
        scheduledDate.setHours(parseInt(hours), parseInt(minutes))
        scheduledFor = scheduledDate.toISOString()
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          scheduled_for: scheduledFor,
          status,
          hashtags,
          media_urls: [] // TODO: Upload media files first
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create post')
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    await handlePublish()
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
          <p className="text-gray-500 mt-1">Compose and schedule your social media content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Composer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Platforms</CardTitle>
                <CardDescription>Choose where to publish your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        'relative flex items-center justify-center p-4 rounded-lg border-2 transition-all',
                        selectedPlatforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <div className={cn('p-2 rounded-lg text-white mb-2', platform.color)}>
                          <platform.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Write your post content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formatting toolbar */}
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="text-purple-600">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Write
                    </Button>
                  </div>
                </div>

                {/* Text area */}
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                {/* Character count */}
                {getCharacterCount() && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {getCharacterCount()!.current} / {getCharacterCount()!.limit} characters
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          getCharacterCount()!.percentage > 90 ? 'bg-red-500' :
                          getCharacterCount()!.percentage > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        )}
                        style={{ width: `${Math.min(getCharacterCount()!.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                <div>
                  <Label>Hashtags</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Add hashtag"
                      value={currentHashtag}
                      onChange={(e) => setCurrentHashtag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                      className="flex-1"
                    />
                    <Button onClick={addHashtag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2">
                        #{tag}
                        <button
                          onClick={() => removeHashtag(tag)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Add images or videos to your post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Image className="h-8 w-8 text-gray-400" />
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, MP4 up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>When should this be published?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="schedule"
                      value="now"
                      checked={postType === 'now'}
                      onChange={() => setPostType('now')}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium">Publish now</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="schedule"
                      value="schedule"
                      checked={postType === 'schedule'}
                      onChange={() => setPostType('schedule')}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium">Schedule for later</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="schedule"
                      value="draft"
                      checked={postType === 'draft'}
                      onChange={() => setPostType('draft')}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium">Save as draft</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? format(scheduleDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label>Time</Label>
                  <Select value={scheduleTime} onValueChange={setScheduleTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    See best times to post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Add Location</Label>
                  <Switch id="location" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments">Allow Comments</Label>
                  <Switch id="comments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="crosspost">Cross-post</Label>
                  <Switch id="crosspost" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="firstcomment">First Comment</Label>
                  <Switch id="firstcomment" />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your post will look</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="facebook" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="facebook">
                      <Facebook className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="instagram">
                      <Instagram className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="twitter">
                      <Twitter className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="facebook" className="mt-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">Your Page</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{content || 'Your post content will appear here...'}</p>
                      {mediaFiles.length > 0 && (
                        <img
                          src={URL.createObjectURL(mediaFiles[0])}
                          alt="Preview"
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="instagram">
                    <p className="text-sm text-gray-500 text-center py-8">
                      Instagram preview
                    </p>
                  </TabsContent>
                  <TabsContent value="twitter">
                    <p className="text-sm text-gray-500 text-center py-8">
                      Twitter preview
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                onClick={handlePublish}
                disabled={loading || !content || selectedPlatforms.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Publishing...' : 'Publish'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}