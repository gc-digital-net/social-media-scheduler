import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStartup Inc.',
    image: '👩‍💼',
    content: 'This platform has revolutionized our social media strategy. We&apos;ve seen a 300% increase in engagement since we started using it.',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    role: 'Social Media Manager',
    company: 'Digital Agency',
    image: '👨‍💻',
    content: 'The AI content suggestions are incredible. It&apos;s like having a creative assistant that never runs out of ideas. Saves us hours every week.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'E-commerce Brand',
    image: '👩‍🚀',
    content: 'Managing multiple platforms was a nightmare before. Now everything is streamlined and our posting consistency has improved dramatically.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Marketers Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <blockquote className="text-muted-foreground mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}