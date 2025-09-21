'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Image, Calendar, Hash } from 'lucide-react'
import { PLATFORMS, Platform } from '@/lib/constants/platforms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function QuickCompose() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const router = useRouter()

  const handleQuickPost = () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    // TODO: Save as draft and redirect to full composer
    router.push(`/compose?content=${encodeURIComponent(content)}&platforms=${selectedPlatforms.join(',')}`)
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind? Start typing for a quick post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {Object.entries(PLATFORMS).slice(0, 4).map(([key, platform]) => (
              <Button
                key={key}
                type="button"
                variant={selectedPlatforms.includes(key as Platform) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => togglePlatform(key as Platform)}
                className="h-8 w-8 p-0"
                title={platform.name}
              >
                <span className="text-base">{platform.icon}</span>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push('/compose')}
            >
              <Image className="h-4 w-4 mr-2" />
              Add Media
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push('/compose?schedule=true')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleQuickPost}
              disabled={!content.trim() || selectedPlatforms.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Post Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}