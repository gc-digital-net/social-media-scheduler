import {
  Calendar,
  BarChart3,
  Users,
  Zap,
  Globe,
  Shield,
} from 'lucide-react'

const features = [
  {
    name: 'Smart Scheduling',
    description: 'AI-powered scheduling that learns your audience&apos;s behavior and automatically posts at optimal times.',
    icon: Calendar,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Real-time insights across all platforms with custom reports and competitor tracking.',
    icon: BarChart3,
  },
  {
    name: 'Team Collaboration',
    description: 'Seamless workflows with approval chains, role management, and internal notes.',
    icon: Users,
  },
  {
    name: 'AI Assistant',
    description: 'Generate content, hashtags, and captions with our advanced AI writing assistant.',
    icon: Zap,
  },
  {
    name: 'Multi-Platform',
    description: 'Manage Instagram, Facebook, Twitter, LinkedIn, TikTok, and Pinterest from one place.',
    icon: Globe,
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-level encryption, SSO support, and GDPR compliance for your peace of mind.',
    icon: Shield,
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-32 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 gradient-radial opacity-20" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Everything you need
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed to help you save time and grow your social presence.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.name}
                  className="group relative"
                >
                  <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1">
                    <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Hover gradient effect */}
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional capabilities - minimalist list */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 p-8 backdrop-blur-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Plus all the essentials
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-8">
              {[
                'Bulk scheduling',
                'Content calendar',
                'Hashtag research',
                'Link shortening',
                'Media library',
                'Post templates',
                'RSS automation',
                'First comment',
                'Story scheduling',
                'Reels & TikToks',
                'Location tags',
                'User mentions',
                'Competitor analysis',
                'Best time to post',
                'Approval workflows',
                'Mobile apps',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-1 w-1 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}