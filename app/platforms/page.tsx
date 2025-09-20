'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  AlertCircle,
  RefreshCw,
  Settings,
  Trash2,
  Search,
  Globe,
  Hash,
  MessageCircle,
  Users,
  Building,
  Camera,
  Video,
} from 'lucide-react'

interface Platform {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  category: string
  connected: boolean
  accounts?: {
    id: string
    name: string
    username: string
    avatar?: string
    type: string
    followers?: number
  }[]
}

export default function PlatformsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const platforms: Platform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Connect Facebook pages and profiles',
      category: 'major',
      connected: true,
      accounts: [
        {
          id: '1',
          name: 'My Business Page',
          username: '@mybusiness',
          type: 'Page',
          followers: 12500,
        },
        {
          id: '2',
          name: 'Personal Profile',
          username: 'john.doe',
          type: 'Profile',
        },
      ],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 to-pink-500',
      description: 'Share photos, stories, and reels',
      category: 'major',
      connected: true,
      accounts: [
        {
          id: '3',
          name: 'Business Account',
          username: '@mybiz',
          type: 'Business',
          followers: 8420,
        },
      ],
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      description: 'Tweet and engage with your audience',
      category: 'major',
      connected: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Professional networking and content',
      category: 'major',
      connected: true,
      accounts: [
        {
          id: '4',
          name: 'John Doe',
          username: 'john-doe',
          type: 'Personal',
          followers: 3200,
        },
      ],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      description: 'Share video content and community posts',
      category: 'major',
      connected: false,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      color: 'bg-black',
      description: 'Create and share short-form videos',
      category: 'emerging',
      connected: false,
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: MessageCircle,
      color: 'bg-black',
      description: 'Text-based conversations',
      category: 'emerging',
      connected: false,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: Camera,
      color: 'bg-red-600',
      description: 'Visual discovery and idea platform',
      category: 'business',
      connected: false,
    },
    {
      id: 'google_business',
      name: 'Google Business',
      icon: Building,
      color: 'bg-blue-500',
      description: 'Manage your business on Google',
      category: 'business',
      connected: false,
    },
  ]

  const categories = [
    { id: 'all', name: 'All Platforms', count: platforms.length },
    { id: 'major', name: 'Major Platforms', count: platforms.filter(p => p.category === 'major').length },
    { id: 'emerging', name: 'Emerging', count: platforms.filter(p => p.category === 'emerging').length },
    { id: 'business', name: 'Business', count: platforms.filter(p => p.category === 'business').length },
  ]

  const connectedPlatforms = platforms.filter(p => p.connected)
  const totalAccounts = connectedPlatforms.reduce((acc, p) => acc + (p.accounts?.length || 0), 0)

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Platforms</h1>
          <p className="text-gray-500 mt-1">Connect and manage your social media accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedPlatforms.length}</div>
              <p className="text-xs text-muted-foreground">
                Out of {platforms.length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Across all platforms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27.5K</div>
              <p className="text-xs text-muted-foreground">
                Combined followers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Connected Accounts */}
        {connectedPlatforms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {connectedPlatforms.map((platform) => (
                <Card key={platform.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                          <platform.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{platform.name}</CardTitle>
                          <CardDescription>{platform.accounts?.length} account(s) connected</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platform.accounts?.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {account.avatar ? (
                                <img src={account.avatar} alt={account.name} className="rounded-full" />
                              ) : (
                                <Users className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{account.name}</p>
                              <p className="text-xs text-gray-500">
                                {account.username} • {account.type}
                                {account.followers && ` • ${account.followers.toLocaleString()} followers`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlatforms.filter(p => !p.connected).map((platform) => (
              <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                        <platform.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{platform.name}</CardTitle>
                      </div>
                    </div>
                    {platform.category === 'emerging' && (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect {platform.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredPlatforms.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No platforms found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}