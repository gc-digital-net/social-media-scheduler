import { MarketingHeader } from '@/components/marketing/layout/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/layout/MarketingFooter'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Calendar,
  BarChart3,
  Users,
  Zap,
  Globe,
  Shield,
  MessageSquare,
  Image,
  Clock,
  FileText,
  Target,
  Sparkles,
  Link2,
  Hash,
  Video,
  Download,
  TrendingUp,
  Bell,
  Palette,
  Code,
  ArrowRight,
} from 'lucide-react'

const featureCategories = [
  {
    title: 'Publishing & Scheduling',
    description: 'Plan, create, and publish content across all your social channels',
    icon: Calendar,
    color: 'from-blue-600 to-cyan-600',
    features: [
      {
        name: 'Visual Content Calendar',
        description: 'Drag-and-drop calendar interface to visualize and manage your content pipeline.',
        icon: Calendar,
      },
      {
        name: 'Bulk Scheduling',
        description: 'Upload hundreds of posts at once via CSV or our bulk composer.',
        icon: Clock,
      },
      {
        name: 'Best Time to Post',
        description: 'AI analyzes your audience to find optimal posting times for maximum engagement.',
        icon: Target,
      },
      {
        name: 'Queue Management',
        description: 'Set posting schedules and let the queue automatically fill time slots.',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Content Creation',
    description: 'Create engaging content with AI assistance and professional tools',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
    features: [
      {
        name: 'AI Content Generator',
        description: 'Generate captions, hashtags, and content ideas with advanced AI.',
        icon: Zap,
      },
      {
        name: 'Media Library',
        description: 'Store and organize all your images, videos, and GIFs in one place.',
        icon: Image,
      },
      {
        name: 'Content Templates',
        description: 'Save and reuse your best-performing post templates.',
        icon: Palette,
      },
      {
        name: 'Hashtag Manager',
        description: 'Research trending hashtags and save hashtag groups for quick access.',
        icon: Hash,
      },
    ],
  },
  {
    title: 'Analytics & Insights',
    description: 'Track performance and make data-driven decisions',
    icon: BarChart3,
    color: 'from-green-600 to-emerald-600',
    features: [
      {
        name: 'Performance Dashboard',
        description: 'Real-time analytics across all platforms in one unified dashboard.',
        icon: BarChart3,
      },
      {
        name: 'Competitor Analysis',
        description: 'Track competitor performance and benchmark your growth.',
        icon: TrendingUp,
      },
      {
        name: 'Custom Reports',
        description: 'Create white-label PDF reports for clients or stakeholders.',
        icon: FileText,
      },
      {
        name: 'Engagement Tracking',
        description: 'Monitor likes, comments, shares, and follower growth trends.',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team and clients',
    icon: Users,
    color: 'from-orange-600 to-yellow-600',
    features: [
      {
        name: 'Approval Workflows',
        description: 'Set up multi-level approval processes for content publishing.',
        icon: Users,
      },
      {
        name: 'Role Management',
        description: 'Assign specific permissions and access levels to team members.',
        icon: Shield,
      },
      {
        name: 'Internal Notes',
        description: 'Leave comments and feedback on posts before publishing.',
        icon: MessageSquare,
      },
      {
        name: 'Activity Log',
        description: 'Track all team activities and changes with detailed audit logs.',
        icon: Bell,
      },
    ],
  },
  {
    title: 'Platform Features',
    description: 'Unique features for each social media platform',
    icon: Globe,
    color: 'from-indigo-600 to-blue-600',
    features: [
      {
        name: 'Instagram Stories & Reels',
        description: 'Schedule stories, reels, and carousel posts with first comment.',
        icon: Video,
      },
      {
        name: 'Twitter/X Threads',
        description: 'Create and schedule multi-tweet threads with media attachments.',
        icon: MessageSquare,
      },
      {
        name: 'LinkedIn Articles',
        description: 'Publish long-form content and company updates to LinkedIn.',
        icon: FileText,
      },
      {
        name: 'TikTok Videos',
        description: 'Schedule TikTok content and track viral performance metrics.',
        icon: Video,
      },
    ],
  },
  {
    title: 'Automation & Integrations',
    description: 'Connect your favorite tools and automate workflows',
    icon: Zap,
    color: 'from-red-600 to-pink-600',
    features: [
      {
        name: 'RSS Feed Auto-Post',
        description: 'Automatically share new blog posts and content from RSS feeds.',
        icon: Download,
      },
      {
        name: 'Link Shortening',
        description: 'Automatically shorten and track clicks on all your links.',
        icon: Link2,
      },
      {
        name: 'Zapier Integration',
        description: 'Connect with 5000+ apps to automate your workflow.',
        icon: Zap,
      },
      {
        name: 'API Access',
        description: 'Full REST API for custom integrations and automation.',
        icon: Code,
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <span className="mr-2">⚡</span>
                Everything You Need
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Powerful Features for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Social Media Success
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                From content creation to analytics, we&apos;ve got everything you need to manage, 
                grow, and optimize your social media presence.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <section
            key={category.title}
            className={categoryIndex % 2 === 0 ? 'py-20' : 'py-20 bg-muted/30'}
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.features.map((feature) => (
                  <Card key={feature.name} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{feature.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Social Media?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Join thousands of businesses already using our platform to save time and grow their audience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}