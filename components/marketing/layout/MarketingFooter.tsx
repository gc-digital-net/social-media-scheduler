import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Github } from 'lucide-react'

const navigation = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'AI Assistant', href: '/ai-assistant' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'API', href: '/api' },
  ],
  platforms: [
    { name: 'Instagram', href: '/platforms/instagram' },
    { name: 'Facebook', href: '/platforms/facebook' },
    { name: 'Twitter/X', href: '/platforms/twitter' },
    { name: 'LinkedIn', href: '/platforms/linkedin' },
    { name: 'TikTok', href: '/platforms/tiktok' },
    { name: 'Pinterest', href: '/platforms/pinterest' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Guides', href: '/resources/guides' },
    { name: 'Templates', href: '/resources/templates' },
    { name: 'Free Tools', href: '/resources/tools' },
    { name: 'API Docs', href: '/docs' },
    { name: 'Status', href: '/status' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Customers', href: '/customers' },
    { name: 'Careers', href: '/careers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Affiliate Program', href: '/affiliate' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
    { name: 'GitHub', href: '#', icon: Github },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main footer content */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <span className="font-bold text-xl">SocialScheduler</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The all-in-one social media management platform to schedule posts, analyze performance, and grow your audience.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-10 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Product</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Platforms</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.platforms.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Resources</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Company</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} SocialScheduler. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {navigation.legal.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>🇺🇸 English</span>
                <span>•</span>
                <span>USD $</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}