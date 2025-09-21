export default function SocialProofSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Leading Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company) => (
              <div key={company} className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-lg font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}