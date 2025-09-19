import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Users, BarChart3, Zap, Globe, Shield, Clock, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">OmniPost</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Schedule Once,
          <span className="text-primary"> Post Everywhere</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Manage all your social media accounts in one place. Support for 15+ platforms including Facebook, Instagram, Twitter, LinkedIn, TikTok, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <Globe className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">15+ Platforms</h3>
            <p className="text-sm text-muted-foreground">
              Post to all major social networks from one dashboard
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Generate captions, hashtags, and images with AI
            </p>
          </Card>
          <Card className="p-6">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Work together with approval workflows
            </p>
          </Card>
          <Card className="p-6">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track performance across all platforms
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/mo</span></p>
            <ul className="space-y-2 text-sm">
              <li>✓ 3 social accounts</li>
              <li>✓ 10 posts/month</li>
              <li>✓ Basic analytics</li>
            </ul>
          </Card>
          <Card className="p-6 border-primary">
            <h3 className="font-semibold text-xl mb-2">Professional</h3>
            <p className="text-3xl font-bold mb-4">$19<span className="text-sm font-normal">/mo</span></p>
            <ul className="space-y-2 text-sm">
              <li>✓ 25 social accounts</li>
              <li>✓ Unlimited posts</li>
              <li>✓ AI features</li>
              <li>✓ Advanced analytics</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-2">Business</h3>
            <p className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal">/mo</span></p>
            <ul className="space-y-2 text-sm">
              <li>✓ 100 social accounts</li>
              <li>✓ Unlimited everything</li>
              <li>✓ Team collaboration</li>
              <li>✓ API access</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Social Media?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of creators and businesses already using OmniPost
        </p>
        <Link href="/register">
          <Button size="lg" className="px-12">
            Start Your Free Trial
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 OmniPost. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
              <Link href="#" className="hover:text-foreground">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}