'use client'

import { useState } from 'react'
import { MarketingHeader } from '@/components/marketing/layout/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/layout/MarketingFooter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { CheckCircle, X, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for individuals just getting started with social media management.',
    features: {
      accounts: '3 social accounts',
      posts: '10 posts per month',
      users: '1 user',
      analytics: 'Basic',
      scheduling: true,
      calendar: true,
      mobileApp: true,
      support: 'Community',
      ai: false,
      bulkUpload: false,
      teamCollaboration: false,
      apiAccess: false,
      whiteLabel: false,
      customReports: false,
    },
  },
  {
    name: 'Professional',
    monthlyPrice: 15,
    yearlyPrice: 12,
    description: 'Ideal for professionals and small businesses looking to grow their presence.',
    features: {
      accounts: '10 social accounts',
      posts: 'Unlimited posts',
      users: '1 user',
      analytics: 'Advanced',
      scheduling: true,
      calendar: true,
      mobileApp: true,
      support: 'Priority email',
      ai: true,
      bulkUpload: true,
      teamCollaboration: false,
      apiAccess: false,
      whiteLabel: false,
      customReports: true,
    },
    popular: true,
  },
  {
    name: 'Team',
    monthlyPrice: 45,
    yearlyPrice: 36,
    description: 'Perfect for teams and growing businesses with collaboration needs.',
    features: {
      accounts: '25 social accounts',
      posts: 'Unlimited posts',
      users: '5 users',
      analytics: 'Advanced + Competitors',
      scheduling: true,
      calendar: true,
      mobileApp: true,
      support: 'Priority phone & email',
      ai: true,
      bulkUpload: true,
      teamCollaboration: true,
      apiAccess: true,
      whiteLabel: false,
      customReports: true,
    },
  },
  {
    name: 'Agency',
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: 'Everything you need to manage clients at scale.',
    features: {
      accounts: 'Unlimited accounts',
      posts: 'Unlimited posts',
      users: 'Unlimited users',
      analytics: 'Enterprise analytics',
      scheduling: true,
      calendar: true,
      mobileApp: true,
      support: 'Dedicated manager',
      ai: true,
      bulkUpload: true,
      teamCollaboration: true,
      apiAccess: true,
      whiteLabel: true,
      customReports: true,
    },
  },
]

const allFeatures = [
  { key: 'accounts', label: 'Social Accounts', tooltip: 'Number of social media accounts you can connect' },
  { key: 'posts', label: 'Monthly Posts', tooltip: 'Number of posts you can schedule per month' },
  { key: 'users', label: 'Team Members', tooltip: 'Number of users who can access your account' },
  { key: 'analytics', label: 'Analytics', tooltip: 'Level of analytics and insights available' },
  { key: 'scheduling', label: 'Post Scheduling', tooltip: 'Schedule posts in advance' },
  { key: 'calendar', label: 'Content Calendar', tooltip: 'Visual calendar to manage your content' },
  { key: 'mobileApp', label: 'Mobile App', tooltip: 'iOS and Android mobile applications' },
  { key: 'ai', label: 'AI Content Assistant', tooltip: 'AI-powered content generation and suggestions' },
  { key: 'bulkUpload', label: 'Bulk Upload', tooltip: 'Upload multiple posts at once via CSV' },
  { key: 'teamCollaboration', label: 'Team Collaboration', tooltip: 'Approval workflows and team features' },
  { key: 'apiAccess', label: 'API Access', tooltip: 'Programmatic access to your data' },
  { key: 'whiteLabel', label: 'White Label', tooltip: 'Remove our branding from reports' },
  { key: 'customReports', label: 'Custom Reports', tooltip: 'Create branded PDF reports for clients' },
  { key: 'support', label: 'Support', tooltip: 'Level of customer support' },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Choose Your Plan
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free and scale as you grow. No hidden fees, cancel anytime.
              </p>
              
              {/* Billing Toggle */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <span className={isYearly ? 'font-semibold' : 'text-muted-foreground'}>
                  Yearly
                </span>
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative p-6 ${
                    plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="ml-2 text-muted-foreground">/month</span>
                      )}
                    </div>
                    {isYearly && plan.yearlyPrice > 0 && (
                      <p className="mt-1 text-sm text-green-600">
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12} per year
                      </p>
                    )}
                  </div>

                  <Link href="/register" className="block mb-6">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.monthlyPrice === 0 ? 'Get Started' : 'Start Free Trial'}
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium">{plan.features.accounts}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{plan.features.posts}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{plan.features.users}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-12 border-t">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Compare All Features
            </h2>
            
            <TooltipProvider>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.name} className="text-center py-4 px-4 min-w-[150px]">
                          <div className="font-semibold">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}/mo
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allFeatures.map((feature) => (
                      <tr key={feature.key} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {feature.label}
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.name} className="text-center py-4 px-4">
                            {typeof plan.features[feature.key] === 'boolean' ? (
                              plan.features[feature.key] ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm">{plan.features[feature.key]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TooltipProvider>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  q: 'Can I change my plan anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you&apos;ll be prorated for the difference.',
                },
                {
                  q: 'What happens when I hit my limits?',
                  a: 'You&apos;ll receive notifications as you approach your limits. You can always upgrade to continue posting without interruption.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 14-day money-back guarantee for all paid plans. No questions asked.',
                },
                {
                  q: 'Can I cancel my subscription?',
                  a: 'Yes, you can cancel anytime from your account settings. You&apos;ll continue to have access until the end of your billing period.',
                },
                {
                  q: 'Do you offer custom enterprise plans?',
                  a: 'Yes! Contact our sales team for custom pricing and features tailored to your organization&apos;s needs.',
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}