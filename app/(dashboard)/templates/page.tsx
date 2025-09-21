'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Star,
  StarOff,
  Download,
  Upload,
  Folder,
  Hash,
  Image,
  Video,
  Link2,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  category: string
  content: string
  platforms: string[]
  tags: string[]
  usageCount: number
  isFavorite: boolean
  lastUsed?: Date
  performance?: {
    avgEngagement: number
    avgReach: number
  }
  variables?: string[]
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Product Launch Announcement',
    category: 'Marketing',
    content: `🚀 Exciting news! We're thrilled to announce the launch of {product_name}!

✨ Key features:
• {feature_1}
• {feature_2}  
• {feature_3}

Learn more: {link}

#ProductLaunch #{product_hashtag} #Innovation`,
    platforms: ['LinkedIn', 'Twitter'],
    tags: ['launch', 'announcement', 'product'],
    usageCount: 45,
    isFavorite: true,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    performance: { avgEngagement: 8.5, avgReach: 12500 },
    variables: ['product_name', 'feature_1', 'feature_2', 'feature_3', 'link', 'product_hashtag']
  },
  {
    id: '2',
    name: 'Weekly Tips Thread',
    category: 'Educational',
    content: `🧵 {number} {topic} tips that will {benefit}:

1️⃣ {tip_1}
2️⃣ {tip_2}
3️⃣ {tip_3}
4️⃣ {tip_4}
5️⃣ {tip_5}

Which tip will you try first? Let us know below! 👇

#{topic_hashtag} #Tips #Learning`,
    platforms: ['Twitter', 'LinkedIn'],
    tags: ['tips', 'educational', 'engagement'],
    usageCount: 32,
    isFavorite: true,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    performance: { avgEngagement: 7.2, avgReach: 8900 },
    variables: ['number', 'topic', 'benefit', 'tip_1', 'tip_2', 'tip_3', 'tip_4', 'tip_5', 'topic_hashtag']
  },
  {
    id: '3',
    name: 'Customer Success Story',
    category: 'Social Proof',
    content: `📈 Success Story Alert!

{customer_name} achieved {achievement} using our {product/service}.

"{testimonial}"

Read the full case study: {link}

#CustomerSuccess #CaseStudy #{industry_hashtag}`,
    platforms: ['LinkedIn', 'Facebook'],
    tags: ['testimonial', 'case-study', 'social-proof'],
    usageCount: 28,
    isFavorite: false,
    performance: { avgEngagement: 9.1, avgReach: 15200 },
    variables: ['customer_name', 'achievement', 'product/service', 'testimonial', 'link', 'industry_hashtag']
  },
  {
    id: '4',
    name: 'Behind the Scenes',
    category: 'Culture',
    content: `Take a peek behind the scenes! 👀

Today we're {activity} and {team_member} is showing us how {process}.

What would you like to see next? Comment below!

#BehindTheScenes #TeamLife #CompanyCulture`,
    platforms: ['Instagram', 'Facebook'],
    tags: ['culture', 'team', 'behind-scenes'],
    usageCount: 19,
    isFavorite: false,
    performance: { avgEngagement: 6.8, avgReach: 7500 },
    variables: ['activity', 'team_member', 'process']
  },
  {
    id: '5',
    name: 'Industry News Commentary',
    category: 'Thought Leadership',
    content: `💭 Our take on {news_topic}:

{key_point_1}

{key_point_2}

{key_point_3}

What's your perspective? Join the discussion below.

Read more: {article_link}

#ThoughtLeadership #{industry} #Innovation`,
    platforms: ['LinkedIn', 'Twitter'],
    tags: ['news', 'commentary', 'thought-leadership'],
    usageCount: 24,
    isFavorite: true,
    performance: { avgEngagement: 5.9, avgReach: 9800 },
    variables: ['news_topic', 'key_point_1', 'key_point_2', 'key_point_3', 'article_link', 'industry']
  }
]

const categories = ['All', 'Marketing', 'Educational', 'Social Proof', 'Culture', 'Thought Leadership', 'Events', 'Seasonal']

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    content: '',
    platforms: [] as string[],
    tags: [] as string[]
  })

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  const extractVariables = (content: string) => {
    const regex = /\{([^}]+)\}/g
    const matches = content.match(regex)
    return matches ? matches.map(m => m.slice(1, -1)) : []
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Templates</h2>
          <p className="text-muted-foreground">
            Reusable templates to streamline your content creation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.category}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(template.id)}
                    >
                      {template.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {template.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.platforms.map(platform => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  {template.performance && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{template.performance.avgEngagement}% eng</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{(template.performance.avgReach / 1000).toFixed(1)}K reach</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-muted-foreground">
                      Used {template.usageCount} times
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowPreviewDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          // Navigate to compose with template
                          window.location.href = `/compose?template=${template.id}`
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(template.id)}
                      >
                        {template.isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            • Used {template.usageCount} times
                          </span>
                          {template.lastUsed && (
                            <span className="text-xs text-muted-foreground">
                              • Last used {new Date(template.lastUsed).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          window.location.href = `/compose?template=${template.id}`
                        }}
                      >
                        Use Template
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.filter(t => t.isFavorite).map((template) => (
              <Card key={template.id} className="overflow-hidden border-yellow-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.category}</CardDescription>
                    </div>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {template.content}
                  </p>
                  <Button className="w-full" size="sm">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Template Suggestions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Template Suggestions
          </CardTitle>
          <CardDescription>
            Based on your content performance and industry trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-3 bg-background rounded-lg border">
              <h4 className="font-medium text-sm mb-1">Trending Format</h4>
              <p className="text-xs text-muted-foreground">
                "Did you know?" posts are getting 45% more engagement this week
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Create Template
              </Button>
            </div>
            <div className="p-3 bg-background rounded-lg border">
              <h4 className="font-medium text-sm mb-1">Missing Category</h4>
              <p className="text-xs text-muted-foreground">
                You don't have any event announcement templates yet
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Generate Template
              </Button>
            </div>
            <div className="p-3 bg-background rounded-lg border">
              <h4 className="font-medium text-sm mb-1">Performance Tip</h4>
              <p className="text-xs text-muted-foreground">
                Templates with emojis get 23% more clicks
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Update Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for your social media posts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input 
                placeholder="e.g., Weekly Product Feature"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={newTemplate.category} 
                onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template Content</Label>
              <Textarea
                placeholder="Use {variable_name} for dynamic content..."
                className="min-h-[150px]"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use curly braces like {`{product_name}`} to create variables
              </p>
            </div>
            {newTemplate.content && extractVariables(newTemplate.content).length > 0 && (
              <div className="space-y-2">
                <Label>Detected Variables</Label>
                <div className="flex flex-wrap gap-1">
                  {extractVariables(newTemplate.content).map(variable => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Save template logic
              setShowCreateDialog(false)
            }}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview/Edit Template Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Content</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{selectedTemplate.content}</p>
                </div>
              </div>
              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="space-y-2">
                  <Label>Variables</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.variables.map(variable => (
                      <Badge key={variable} variant="secondary">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Performance</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Avg. Engagement</p>
                    <p className="text-lg font-semibold">
                      {selectedTemplate.performance?.avgEngagement}%
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Avg. Reach</p>
                    <p className="text-lg font-semibold">
                      {(selectedTemplate.performance?.avgReach || 0) / 1000}K
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              window.location.href = `/compose?template=${selectedTemplate?.id}`
            }}>
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}