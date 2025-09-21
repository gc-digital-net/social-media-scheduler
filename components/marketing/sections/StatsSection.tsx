export function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Users', description: 'Growing every day' },
    { value: '500M+', label: 'Posts Scheduled', description: 'Across all platforms' },
    { value: '99.9%', label: 'Uptime', description: 'Enterprise reliability' },
    { value: '24/7', label: 'Support', description: 'Always here to help' },
  ]

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Thousands of Businesses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join the growing community of successful brands using our platform
          </p>
        </div>

        <div className="mx-auto grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary sm:text-5xl">{stat.value}</div>
              <div className="mt-2 text-lg font-semibold">{stat.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}