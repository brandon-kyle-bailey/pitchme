import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Users, BarChart3, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Quick Pitch Creation",
    description:
      "Create stunning pitch decks in minutes with our intuitive editor and professional templates.",
  },
  {
    icon: Users,
    title: "Investor Network",
    description:
      "Connect with a curated network of investors actively looking for their next big opportunity.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track engagement with your pitch decks and understand what investors are most interested in.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. Control who sees your sensitive business information.",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description:
      "Leverage AI to improve your pitch content and get personalized recommendations.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Access investors from around the world. Expand your fundraising beyond local boundaries.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/50 py-20" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything You Need to Raise Capital
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A complete platform designed to help founders succeed in their
            fundraising journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-muted transition-colors hover:bg-muted/50"
            >
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
