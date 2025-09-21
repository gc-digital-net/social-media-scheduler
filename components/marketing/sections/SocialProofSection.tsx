export function SocialProofSection() {
  const companies = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'StartupHub', logo: '🚀' },
    { name: 'DigitalAgency', logo: '💼' },
    { name: 'MediaHouse', logo: '📺' },
    { name: 'BrandCo', logo: '🎨' },
    { name: 'GrowthLabs', logo: '📈' },
  ]

  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-8">
          TRUSTED BY OVER 10,000+ BUSINESSES WORLDWIDE
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
          {companies.map((company) => (
            <div key={company.name} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{company.logo}</span>
              <span className="text-xs font-medium text-muted-foreground">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}