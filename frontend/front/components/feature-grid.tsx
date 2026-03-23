import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, QrCode, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate short URLs instantly with our optimized infrastructure.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Every shortened URL comes with a downloadable QR code.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description: "Track clicks, locations, and devices for your shortened URLs.",
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto mt-24 max-w-5xl">
      <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
        Everything you need
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-border bg-card transition-colors hover:border-primary/50"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
