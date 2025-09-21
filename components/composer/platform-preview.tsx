'use client'

import { PLATFORMS, Platform } from '@/lib/constants/platforms'
import { format } from 'date-fns'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'

interface PlatformPreviewProps {
  platform: Platform;
  content: string;
  media: File[];
  hashtags: string[];
}

export function PlatformPreview({ platform, content, media, hashtags }: PlatformPreviewProps) {
  const platformConfig = PLATFORMS[platform]
  const contentWithHashtags = hashtags.length > 0 
    ? `${content}\n\n${hashtags.join(' ')}`
    : content

  // Generate preview URLs for uploaded files
  const mediaUrls = media.map(file => URL.createObjectURL(file))

  const renderTwitterPreview = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-bold">Your Name</span>
            <span className="text-gray-500">@username</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">now</span>
          </div>
          <div className="whitespace-pre-wrap break-words">{contentWithHashtags}</div>
          
          {mediaUrls.length > 0 && (
            <div className={`grid gap-2 mt-3 ${mediaUrls.length > 1 ? 'grid-cols-2' : ''}`}>
              {mediaUrls.slice(0, 4).map((url, idx) => (
                <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 text-gray-500">
            <button className="flex items-center gap-1 hover:text-blue-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-1 hover:text-green-500">
              <Share className="h-4 w-4" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-1 hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-sm">0</span>
            </button>
            <button className="hover:text-blue-500">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFacebookPreview = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
          <div>
            <div className="font-semibold">Your Page</div>
            <div className="text-xs text-gray-500">{format(new Date(), 'MMM d')} · 🌎</div>
          </div>
          <button className="ml-auto">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <div className="whitespace-pre-wrap break-words">{contentWithHashtags}</div>
      </div>
      
      {mediaUrls.length > 0 && (
        <div className={`${mediaUrls.length > 1 ? 'grid grid-cols-2' : ''}`}>
          {mediaUrls.slice(0, 4).map((url, idx) => (
            <div key={idx} className="relative aspect-video bg-gray-100">
              <img src={url} alt="" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
      
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <span>👍 0</span>
          <span>0 comments</span>
        </div>
        <div className="flex items-center justify-around pt-2 border-t">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
            <span>👍</span> Like
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
            <span>💬</span> Comment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
            <span>↗️</span> Share
          </button>
        </div>
      </div>
    </div>
  )

  const renderInstagramPreview = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border">
      <div className="p-3 flex items-center gap-3 border-b">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full" />
        <span className="font-semibold text-sm">yourusername</span>
        <button className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      {mediaUrls.length > 0 ? (
        <div className="relative aspect-square bg-gray-100">
          <img src={mediaUrls[0]} alt="" className="object-cover w-full h-full" />
          {mediaUrls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
              1/{mediaUrls.length}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Media required</span>
        </div>
      )}
      
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4">
          <Heart className="h-6 w-6" />
          <MessageCircle className="h-6 w-6" />
          <Share className="h-6 w-6" />
          <Bookmark className="h-6 w-6 ml-auto" />
        </div>
        <div className="font-semibold text-sm">0 likes</div>
        <div className="text-sm">
          <span className="font-semibold">yourusername</span>{' '}
          <span className="whitespace-pre-wrap break-words">{contentWithHashtags}</span>
        </div>
        <div className="text-xs text-gray-500 uppercase">Just now</div>
      </div>
    </div>
  )

  const renderLinkedInPreview = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full" />
        <div className="flex-1">
          <div className="font-semibold">Your Name</div>
          <div className="text-sm text-gray-500">Your headline</div>
          <div className="text-xs text-gray-500">now · 🌐</div>
        </div>
      </div>
      
      <div className="whitespace-pre-wrap break-words">{contentWithHashtags}</div>
      
      {mediaUrls.length > 0 && (
        <div className={`grid gap-2 ${mediaUrls.length > 1 ? 'grid-cols-2' : ''}`}>
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
              <img src={url} alt="" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <span>👍</span>
        <span>0</span>
      </div>
      
      <div className="flex items-center justify-around pt-3 border-t text-sm">
        <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded">
          👍 Like
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded">
          💬 Comment
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded">
          ↗️ Share
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded">
          ➤ Send
        </button>
      </div>
    </div>
  )

  // Clean up blob URLs when component unmounts
  if (typeof window !== 'undefined') {
    mediaUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        // Schedule cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100)
      }
    })
  }

  switch (platform) {
    case 'twitter':
      return renderTwitterPreview()
    case 'facebook':
      return renderFacebookPreview()
    case 'instagram':
      return renderInstagramPreview()
    case 'linkedin':
      return renderLinkedInPreview()
    default:
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center text-gray-500">
          Preview for {platformConfig.name} coming soon
        </div>
      )
  }
}