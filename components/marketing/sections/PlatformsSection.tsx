import { Card } from '@/components/ui/card'
import Link from 'next/link'

const platforms = [
  {
    name: 'Instagram',
    icon: '📷',
    features: ['Feed Posts', 'Stories', 'Reels', 'IGTV'],
    color: 'from-purple-600 to-pink-600',
  },
  {
    name: 'Facebook',
    icon: '👥',
    features: ['Pages', 'Groups', 'Stories', 'Events'],
    color: 'from-blue-600 to-blue-700',
  },
  {
    name: 'Twitter/X',
    icon: '🐦',
    features: ['Tweets', 'Threads', 'Spaces', 'Analytics'],
    color: 'from-sky-500 to-sky-600',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    features: ['Posts', 'Articles', 'Company Pages', 'Analytics'],
    color: 'from-blue-700 to-blue-800',
  },
  {
    name: 'TikTok',
    icon: '🎵',
    features: ['Videos', 'Sounds', 'Effects', 'Analytics'],
    color: 'from-pink-600 to-purple-600',
  },
  {
    name: 'Pinterest',
    icon: '📌',
    features: ['Pins', 'Boards', 'Stories', 'Shopping'],
    color: 'from-red-600 to-red-700',
  },
]

export function PlatformsSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All Your Social Media in One Place
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Connect and manage all your favorite social media platforms from a single dashboard.
            Schedule, publish, and analyze across every channel.
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Link key={platform.name} href={`/platforms/${platform.name.toLowerCase().replace('/', '-')}`}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{platform.icon}</span>
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {platform.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}