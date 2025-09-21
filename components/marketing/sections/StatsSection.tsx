export function StatsSection() {
  const stats = [
    { value: '10,000+', label: 'Active teams' },
    { value: '500M+', label: 'Posts scheduled' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 2 min', label: 'Average response' },
  ]

  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid grid-cols-2 gap-x-8 gap-y-16 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="mt-3 text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}