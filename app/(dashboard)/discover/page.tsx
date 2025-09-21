'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  Hash, 
  Users, 
  Sparkles,
  Search,
  BookmarkPlus,
  ExternalLink,
  BarChart3,
  MessageSquare,
  Heart,
  Share2,
  Clock,
  Filter,
  PenSquare
} from 'lucide-react'

// Mock data for trending topics
const trendingTopics = [
  { id: 1, name: '#TechInnovation', posts: '125K', growth: '+45%', category: 'Technology' },
  { id: 2, name: '#SustainableLiving', posts: '89K', growth: '+32%', category: 'Environment' },
  { id: 3, name: '#DigitalMarketing', posts: '67K', growth: '+28%', category: 'Business' },
  { id: 4, name: '#AIRevolution', posts: '234K', growth: '+120%', category: 'Technology' },
  { id: 5, name: '#RemoteWork', posts: '45K', growth: '+15%', category: 'Business' },
  { id: 6, name: '#HealthyEating', posts: '78K', growth: '+22%', category: 'Health' },
]

// Mock data for top creators
const topCreators = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    handle: '@sarahmitchell',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    followers: '125K',
    engagement: '8.5%',
    category: 'Marketing',
    verified: true,
  },
  {
    id: 2,
    name: 'Tech Insights',
    handle: '@techinsights',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    followers: '450K',
    engagement: '12.3%',
    category: 'Technology',
    verified: true,
  },
  {
    id: 3,
    name: 'Green Living',
    handle: '@greenliving',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Green',
    followers: '89K',
    engagement: '6.7%',
    category: 'Environment',
    verified: false,
  },
  {
    id: 4,
    name: 'David Chen',
    handle: '@davidchen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    followers: '234K',
    engagement: '9.2%',
    category: 'Business',
    verified: true,
  },
]

// Mock data for content ideas
const contentIdeas = [
  {
    id: 1,
    title: 'How AI is Transforming Small Businesses',
    description: 'Share insights on AI adoption in SMBs with case studies',
    performance: { reach: '45K avg', engagement: '7.2% avg' },
    bestTime: 'Tue-Thu, 9-11 AM',
    platforms: ['LinkedIn', 'Twitter'],
  },
  {
    id: 2,
    title: '5 Sustainable Practices for Modern Offices',
    description: 'Tips for creating eco-friendly workspaces',
    performance: { reach: '32K avg', engagement: '5.8% avg' },
    bestTime: 'Mon-Wed, 2-4 PM',
    platforms: ['Instagram', 'Facebook'],
  },
  {
    id: 3,
    title: 'Remote Work Productivity Hacks',
    description: 'Share proven strategies for remote team efficiency',
    performance: { reach: '67K avg', engagement: '9.1% avg' },
    bestTime: 'Wed-Fri, 10 AM-12 PM',
    platforms: ['LinkedIn', 'Twitter'],
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Discovery</h2>
          <p className="text-muted-foreground">
            Discover trending topics, top creators, and content ideas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics, creators..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="creators">Top Creators</TabsTrigger>
          <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        {topic.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {topic.category}
                      </Badge>
                    </div>
                    <Button size="icon" variant="ghost">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posts</span>
                      <span className="font-medium">{topic.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Growth</span>
                      <span className="font-medium text-green-600">{topic.growth}</span>
                    </div>
                    <Button className="w-full mt-3" variant="outline" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending by Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Twitter/X</h4>
                  <div className="space-y-1">
                    <div className="text-sm">#AIRevolution</div>
                    <div className="text-sm">#TechNews</div>
                    <div className="text-sm">#StartupLife</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">LinkedIn</h4>
                  <div className="space-y-1">
                    <div className="text-sm">#RemoteWork</div>
                    <div className="text-sm">#CareerGrowth</div>
                    <div className="text-sm">#Leadership</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Instagram</h4>
                  <div className="space-y-1">
                    <div className="text-sm">#HealthyLiving</div>
                    <div className="text-sm">#Sustainability</div>
                    <div className="text-sm">#DesignInspiration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {topCreators.map((creator) => (
              <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-1">
                            {creator.name}
                            {creator.verified && (
                              <Badge variant="secondary" className="ml-1 h-4 px-1">✓</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">{creator.handle}</p>
                          <Badge variant="outline" className="mt-1">{creator.category}</Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          Follow
                        </Button>
                      </div>
                      <div className="flex gap-4 pt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Followers: </span>
                          <span className="font-medium">{creator.followers}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement: </span>
                          <span className="font-medium text-green-600">{creator.engagement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Creator Insights</CardTitle>
              <CardDescription>
                Performance metrics for top creators in your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Average Engagement Rate</p>
                    <p className="text-2xl font-bold">8.7%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Post Frequency</span>
                    <span className="font-medium">3-5 posts/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Best Posting Time</span>
                    <span className="font-medium">9-11 AM EST</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Content Mix</span>
                    <span className="font-medium">40% Educational, 30% News, 30% Engagement</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-4">
          <div className="grid gap-4">
            {contentIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                      <CardDescription>{idea.description}</CardDescription>
                    </div>
                    <Button size="sm">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Use Idea
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Expected Performance</p>
                      <p className="text-sm font-medium">Reach: {idea.performance.reach}</p>
                      <p className="text-sm font-medium">Engagement: {idea.performance.engagement}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Best Time to Post</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {idea.bestTime}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Recommended Platforms</p>
                      <div className="flex gap-1">
                        {idea.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary">{platform}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized content ideas based on your audience, industry trends, and past performance.
              </p>
              <Button>
                Generate Personalized Ideas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>
                Track and analyze your competitors' social media performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Competitor analysis features will be available in the next update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}