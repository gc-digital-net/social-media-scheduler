import { MarketingHeader } from '@/components/marketing/layout/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/layout/MarketingFooter'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We&apos;re on a mission to democratize social media marketing for businesses of all sizes.',
  },
  {
    icon: Heart,
    title: 'Customer-First',
    description: 'Every feature we build starts with understanding our customers&apos; needs and challenges.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We constantly push boundaries to bring cutting-edge technology to social media management.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in building together with our community of marketers and creators.',
  },
]

const team = [
  { name: 'Alex Johnson', role: 'CEO & Co-founder', emoji: '👨‍💼' },
  { name: 'Sarah Chen', role: 'CTO & Co-founder', emoji: '👩‍💻' },
  { name: 'Michael Park', role: 'Head of Product', emoji: '👨‍🎨' },
  { name: 'Emily Rodriguez', role: 'Head of Marketing', emoji: '👩‍🚀' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Empowering Businesses to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Thrive on Social Media
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Founded in 2023, we&apos;re building the future of social media management. 
                Our platform helps businesses save time, increase engagement, and grow their online presence.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                It all started with a simple observation: managing social media was becoming increasingly 
                complex and time-consuming for businesses. Multiple platforms, different formats, varying 
                best practices - it was overwhelming.
              </p>
              <p className="mt-4">
                We knew there had to be a better way. So we set out to build a platform that would not 
                just schedule posts, but truly empower businesses to succeed on social media. A tool that 
                combines powerful features with simplicity, automation with control, and data with intuition.
              </p>
              <p className="mt-4">
                Today, we&apos;re proud to serve over 10,000 businesses worldwide, from solo entrepreneurs 
                to large agencies. But we&apos;re just getting started. Our vision is to make professional 
                social media management accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Meet the Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The passionate people behind the platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="p-6 text-center">
                  <div className="text-5xl mb-4">{member.emoji}</div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Want to join our team?</p>
              <Link href="/careers">
                <Button variant="outline">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Join Our Journey?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Start your free trial today and see why thousands of businesses trust us.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}