const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director at TechCo',
    content: 'This platform transformed how we handle social media. We&apos;ve seen a 3x increase in engagement since switching.',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Founder at StartupHub',
    content: 'The AI assistant alone saves us 10+ hours per week. It&apos;s like having an extra team member who never sleeps.',
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Social Media Manager',
    content: 'Finally, a tool that actually understands what modern social media teams need. The analytics are game-changing.',
    avatar: 'ER',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Loved by teams everywhere
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Join thousands of teams already transforming their social media game.
          </p>
        </div>

        <div className="mx-auto mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 p-8 backdrop-blur-sm"
            >
              <blockquote className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}