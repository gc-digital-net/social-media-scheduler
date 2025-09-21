export default function PlatformsSection() {
  const platforms = [
    { name: 'Twitter/X', icon: '𝕏' },
    { name: 'LinkedIn', icon: 'in' },
    { name: 'Instagram', icon: '📷' },
    { name: 'Facebook', icon: 'f' },
    { name: 'TikTok', icon: '♪' },
    { name: 'YouTube', icon: '▶️' },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">All Your Platforms in One Place</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect and manage all your social media accounts from a single dashboard
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border"
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}