import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for individuals getting started',
    features: [
      'Up to 3 social accounts',
      '10 scheduled posts per month',
      'Basic analytics',
      'Mobile app access',
    ],
    cta: 'Get Started',
    href: '/register',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$15',
    description: 'For growing businesses and creators',
    features: [
      'Up to 10 social accounts',
      'Unlimited scheduled posts',
      'Advanced analytics',
      'AI content assistant',
      'Team collaboration',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/register',
    popular: true,
  },
  {
    name: 'Team',
    price: '$45',
    description: 'For teams and agencies',
    features: [
      'Up to 25 social accounts',
      'Everything in Professional',
      'Multiple team members',
      'White-label reports',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    href: '/register',
    popular: false,
  },
]

export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs. Always flexible to scale up or down.
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <span className="ml-2 text-muted-foreground">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/pricing" className="text-sm text-primary hover:underline">
            View full pricing details and compare all features →
          </Link>
        </div>
      </div>
    </section>
  )
}