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
} from 'lucide-react'

const features = [
  {
    name: 'Smart Scheduling',
    description: 'Queue posts across all platforms with our intelligent scheduling algorithm that finds the best times to post.',
    icon: Calendar,
    color: 'text-blue-600',
  },
  {
    name: 'Advanced Analytics',
    description: 'Track performance, engagement, and growth with detailed analytics and customizable reports.',
    icon: BarChart3,
    color: 'text-green-600',
  },
  {
    name: 'Team Collaboration',
    description: 'Work together seamlessly with role-based permissions, approvals, and team workflows.',
    icon: Users,
    color: 'text-purple-600',
  },
  {
    name: 'AI Content Assistant',
    description: 'Generate engaging content, captions, and hashtags with our AI-powered writing assistant.',
    icon: Zap,
    color: 'text-yellow-600',
  },
  {
    name: 'Multi-Platform Support',
    description: 'Manage Instagram, Facebook, Twitter/X, LinkedIn, TikTok, and Pinterest from one dashboard.',
    icon: Globe,
    color: 'text-indigo-600',
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-level encryption, SSO support, and GDPR compliance to keep your data safe.',
    icon: Shield,
    color: 'text-red-600',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for Social Media Success
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            All the tools you need to manage, grow, and analyze your social media presence in one place.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.name}
                  className="relative group bg-card rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-2 rounded-lg bg-background ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional features list */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="rounded-2xl bg-muted/50 p-8">
            <h3 className="text-lg font-semibold mb-4">Plus everything else you&apos;d expect:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Bulk upload',
                'Content calendar',
                'Hashtag suggestions',
                'Link shortening',
                'Media library',
                'Post templates',
                'RSS feed automation',
                'First comment',
                'Story scheduling',
                'Reels & TikToks',
                'Location tagging',
                'User tagging',
                'Competitor analysis',
                'Best time to post',
                'Content approval',
                'Mobile app',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}